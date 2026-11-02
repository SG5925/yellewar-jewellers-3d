/**
 * Shared scroll state read inside the R3F render loop.
 * Plain mutable object on purpose: updating it never triggers React re-renders.
 */
export const heroScroll = {
  /** 0 → 1 across the pinned Hero → Collections transition */
  progress: 0,
};
