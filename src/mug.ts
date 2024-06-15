/**
 * A Mug is a holder of states. Imagine a mug cup with states as coffee in it.
 *
 * A Mug is any object conforming to the shape `{ [construction]: ... }`. The
 * `[construction]` field denotes how the held states are initially constructed.
 *
 * ---
 *
 * A Mug can also hold other Mugs. Imagine mug cups stacked on one another.
 *
 * ---
 *
 * A state is just a plain value but without `[construction]` at any level.
 *
 * ---
 *
 * Between a Mug and a state, comes a MugLike. Imagine a mug-like cup spilling
 * coffee and optionally stacked below other cups.
 *
 * A MugLike is a plain value with or without `[construction]`.
 *
 * The most mug-like are Mugs and the least mug-like are states.
 *
 * More generally, Mugs, MugLikes and states constitue the Mug-state continuum.
 */
export const construction = Symbol();

/**
 * This is just a local mug type for building the following helper types.
 */
interface MugType<TConstruction> {
  [construction]: TConstruction;
}

export type MugOf<TMugLike> =
  TMugLike extends MugType<infer TConstruction>
    ? MugOf<TConstruction>
    : TMugLike extends { [k: keyof any]: any }
      ? MugType<{ [K in keyof TMugLike]: MugLikeOf<TMugLike[K]> }>
      : TMugLike extends (infer TMugLikeItem)[]
        ? MugType<MugLikeOf<TMugLikeItem[]>>
        : MugType<TMugLike>;

export type StateOf<TMugLike> =
  TMugLike extends MugType<infer TConstruction>
    ? StateOf<TConstruction>
    : TMugLike extends { [k: keyof any]: any }
      ? { [K in keyof TMugLike]: StateOf<TMugLike[K]> }
      : TMugLike extends (infer TMugLikeItem)[]
        ? StateOf<TMugLikeItem>[]
        : TMugLike;

export type MugLikeOf<TMugLike> =
  TMugLike extends MugType<infer TConstruction>
    ? MugLikeOf<TConstruction>
    : TMugLike extends { [k: keyof any]: any }
      ?
          | MugType<{ [K in keyof TMugLike]: MugLikeOf<TMugLike[K]> }>
          | { [K in keyof TMugLike]: MugLikeOf<TMugLike[K]> }
      : TMugLike extends (infer TMugLikeItem)[]
        ? MugType<MugLikeOf<TMugLikeItem>[]> | MugLikeOf<TMugLikeItem>[]
        : MugType<TMugLike> | TMugLike;
