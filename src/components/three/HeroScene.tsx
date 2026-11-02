"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, Lightformer, PerformanceMonitor, Sparkles, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { heroScroll } from "@/lib/scrollStore";

const CAMERA_Z = 8.6;
const { smoothstep, lerp } = THREE.MathUtils;

/** Soft round sprite used for particles and glows. */
function useGlowTexture() {
  return useMemo(() => {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.25, "rgba(255,240,200,0.8)");
    g.addColorStop(1, "rgba(255,220,150,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
}

const RING_URL = "/models/ring.glb";
/** Outer diameter of the band in scene units; sized to sit inside the gold halo */
const BAND_DIAMETER = 2.5;

/** Warm polished gold that keeps the model's own gold texture for engraving detail. */
function makeGold(map: THREE.Texture | null) {
  return new THREE.MeshPhysicalMaterial({
    map,
    color: "#ffe0a3",
    metalness: 1,
    roughness: 0.12,
    clearcoat: 0.5,
    clearcoatRoughness: 0.08,
    envMapIntensity: 1.8,
  });
}

/** Clear, faceted diamond; flat shading turns the stone's few facets into sharp flashes. */
function makeDiamond() {
  return new THREE.MeshPhysicalMaterial({
    color: "#ffffff",
    metalness: 0,
    roughness: 0,
    // partial transmission so the purple backdrop doesn't tint the stone
    transmission: 0.75,
    thickness: 0.3,
    ior: 2.42,
    dispersion: 5,
    iridescence: 0.35,
    clearcoat: 1,
    emissive: "#ffffff",
    emissiveIntensity: 0.06,
    envMapIntensity: 4,
    flatShading: true,
  });
}

/**
 * Solitaire ring model (meshopt-compressed GLB, ~350 KB).
 * The source model ships with a black stone, so the stone is re-dressed as a white diamond.
 */
function Ring({ onReady }: { onReady?: () => void }) {
  const group = useRef<THREE.Group>(null);
  const idle = useRef(0);
  const scale = useRef(1);
  const { scene } = useGLTF(RING_URL);

  // this runs only after the model has loaded (useGLTF suspends until then)
  useEffect(() => {
    onReady?.();
  }, [onReady]);

  const { model, stoneTop } = useMemo(() => {
    const root = scene.clone(true);
    root.updateMatrixWorld(true);

    const metal = new THREE.Box3();
    root.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      const source = mesh.material as THREE.MeshStandardMaterial;
      // the textured material is the metal; the untextured one is the stone
      if (source.map) {
        metal.expandByObject(mesh);
        mesh.material = makeGold(source.map);
      } else {
        mesh.material = makeDiamond();
      }
    });

    // scale the band to BAND_DIAMETER and put the centre of the band (not the stone) on the origin
    const size = metal.getSize(new THREE.Vector3());
    const s = BAND_DIAMETER / size.x;
    const centreX = (metal.min.x + metal.max.x) / 2;
    const centreY = metal.min.y + size.x / 2;
    const centreZ = (metal.min.z + metal.max.z) / 2;
    root.scale.setScalar(s);
    root.position.set(-centreX * s, -centreY * s, -centreZ * s);

    return { model: root, stoneTop: (metal.max.y - centreY) * s };
  }, [scene]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const p = heroScroll.progress;

    // idle spin plus extra turns driven by scroll
    idle.current += delta * 0.35;
    g.rotation.y = idle.current + p * Math.PI * 3;
    // gentle tilt toward the pointer
    g.rotation.x = lerp(g.rotation.x, state.pointer.y * 0.25 + 0.15, 0.05);
    g.rotation.z = lerp(g.rotation.z, -state.pointer.x * 0.15, 0.05);

    // swell as the particles burst, settle slightly at the end
    const target = 1 + 0.16 * smoothstep(p, 0.2, 0.65) - 0.08 * smoothstep(p, 0.85, 1);
    scale.current = lerp(scale.current, target, 0.12);
    g.scale.setScalar(scale.current);
  });

  return (
    <group ref={group}>
      <primitive object={model} />
      {/* white glints that travel with the stone */}
      <pointLight position={[0.4, stoneTop + 0.4, 0.9]} intensity={4} distance={2.5} color="#ffffff" />
      <Sparkles position={[0, stoneTop - 0.1, 0]} count={14} scale={[0.7, 0.45, 0.7]} size={3.5} speed={0.5} color="#ffffff" opacity={0.9} />
    </group>
  );
}

useGLTF.preload(RING_URL);

const PARTICLES = 520;

/** Gold dust that bursts outward from the ring as the user scrolls. */
function GoldBurst({ texture }: { texture: THREE.Texture }) {
  const points = useRef<THREE.Points>(null);
  const material = useRef<THREE.PointsMaterial>(null);

  const { dirs, speeds, positions } = useMemo(() => {
    const dirs = new Float32Array(PARTICLES * 3);
    const speeds = new Float32Array(PARTICLES);
    for (let i = 0; i < PARTICLES; i++) {
      // random direction on a sphere, flattened a little so the burst reads as a halo
      const u = Math.random() * 2 - 1;
      const t = Math.random() * Math.PI * 2;
      const s = Math.sqrt(1 - u * u);
      dirs.set([s * Math.cos(t), u * 0.75, s * Math.sin(t)], i * 3);
      speeds[i] = 0.5 + Math.random() * 2.6;
    }
    return { dirs, speeds, positions: new Float32Array(PARTICLES * 3) };
  }, []);

  useFrame((_, delta) => {
    const pts = points.current;
    const mat = material.current;
    if (!pts || !mat) return;
    const p = heroScroll.progress;
    const burst = smoothstep(p, 0.25, 0.85);

    const arr = pts.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < PARTICLES; i++) {
      const r = 1.0 + burst * speeds[i] * 1.5;
      arr[i * 3] = dirs[i * 3] * r;
      arr[i * 3 + 1] = dirs[i * 3 + 1] * r;
      arr[i * 3 + 2] = dirs[i * 3 + 2] * r;
    }
    pts.geometry.attributes.position.needsUpdate = true;
    pts.rotation.y += delta * 0.06;

    mat.opacity = Math.min(1, burst * 2) * (1 - 0.5 * smoothstep(p, 0.9, 1));
    pts.visible = mat.opacity > 0.001;
  });

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={material}
        map={texture}
        size={0.08}
        color="#f6d48a"
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

/** Warm bloom behind the ring plus an expanding ring of light. */
function LightEffects({ texture }: { texture: THREE.Texture }) {
  const glow = useRef<THREE.Mesh>(null);
  const wave = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const p = heroScroll.progress;
    if (glow.current) {
      const m = glow.current.material as THREE.MeshBasicMaterial;
      // kept small enough to fade out well inside the canvas edges
      m.opacity = 0.1 + 0.32 * smoothstep(p, 0.15, 0.6);
      glow.current.scale.setScalar(3.6 + 0.8 * smoothstep(p, 0.15, 0.7));
    }
    if (wave.current) {
      const w = smoothstep(p, 0.3, 0.75);
      const m = wave.current.material as THREE.MeshBasicMaterial;
      wave.current.scale.setScalar(1 + w * 2.6);
      m.opacity = w > 0 && w < 1 ? Math.sin(w * Math.PI) * 0.8 : 0;
    }
  });

  return (
    <>
      <mesh ref={glow} position={[0, 0.2, -1.2]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={texture} color="#e8b45c" transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </mesh>
      <mesh ref={wave} position={[0, 0.2, -0.4]}>
        <torusGeometry args={[1.2, 0.012, 16, 200]} />
        <meshBasicMaterial color="#ffe3a3" transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </mesh>
    </>
  );
}

/** Studio lighting from lightformers so nothing is fetched at runtime. */
function Studio() {
  return (
    <Environment resolution={512}>
      <color attach="background" args={["#2a2030"]} />
      <group rotation={[-Math.PI / 3, 0, 1]}>
        <Lightformer form="circle" intensity={6} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={4} />
        <Lightformer form="circle" intensity={4} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={3} />
        <Lightformer form="ring" color="#f4e7c3" intensity={5} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={4} />
        <Lightformer form="rect" color="#c79bff" intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[10, 4, 1]} />
        <Lightformer form="rect" color="#ffe2b0" intensity={8} position={[0, 0, 8]} scale={[12, 3, 1]} />
        <Lightformer form="rect" intensity={6} rotation-x={-Math.PI / 2} position={[0, -6, 0]} scale={[12, 12, 1]} />
      </group>
    </Environment>
  );
}

/** FOV is vertical, so pull the camera back on portrait screens to keep the ring's width in proportion. */
function ResponsiveCamera() {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  useEffect(() => {
    const aspect = size.width / size.height;
    camera.position.z = CAMERA_Z * THREE.MathUtils.clamp(0.9 / aspect, 1, 2.2);
    camera.updateProjectionMatrix();
  }, [camera, size]);
  return null;
}

function Scene({ onReady }: { onReady?: () => void }) {
  const glowTexture = useGlowTexture();
  return (
    <>
      <ResponsiveCamera />
      <Studio />
      <spotLight position={[3, 6, 5]} angle={0.4} penumbra={1} intensity={60} color="#fff2d6" />
      <LightEffects texture={glowTexture} />
      <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.6}>
        <group position={[0, -0.25, 0]}>
          {/* the model streams in; the halo, glow and dust render meanwhile */}
          <Suspense fallback={null}>
            <Ring onReady={onReady} />
          </Suspense>
        </group>
      </Float>
      <group position={[0, -0.05, 0]}>
        <GoldBurst texture={glowTexture} />
      </group>
      <Sparkles count={60} scale={[6, 5, 3]} size={2.2} speed={0.25} color="#f4e7c3" opacity={0.7} />
    </>
  );
}

type HeroSceneProps = {
  /** Skip rendering entirely while the hero is off screen */
  paused?: boolean;
  /** Called once the ring model has loaded and is on screen */
  onReady?: () => void;
};

export default function HeroScene({ paused = false, onReady }: HeroSceneProps) {
  // start at a moderate resolution, sharpen on capable devices, drop on struggling ones
  const [dpr, setDpr] = useState(1.5);
  return (
    <Canvas
      dpr={dpr}
      frameloop={paused ? "never" : "always"}
      camera={{ position: [0, 0.3, CAMERA_Z], fov: 35 }}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, powerPreference: "high-performance" }}
    >
      <PerformanceMonitor onIncline={() => setDpr(Math.min(2, window.devicePixelRatio))} onDecline={() => setDpr(1)} />
      <Scene onReady={onReady} />
    </Canvas>
  );
}
