/**
 * A mug is a holder of states. Imagine states as liquid in mug cups.
 *
 * A mug is any object conforming to the shape `{ [construction]: ... }`. The
 * `[construction]` field denotes how the held states are initially constructed.
 *
 * ---
 *
 * A Mug can also hold other Mugs. Imagine mug cups stacked together.
 *
 * ---
 *
 * A state is a plain value but with no `[construction]` at any level.
 *
 * ---
 *
 * A mug-like is a mug, a state or something between a mug and a state. Imagine
 * a mixture of mug cups and liquid.
 *
 * A mug-like is a plain value with or without `[construction]`.
 *
 * The most mug-like is mugs and the least mug-like is states.
 *
 * Overall speaking, mugs, mug-likes and states constitue a mug-state continuum.
 *
 * ---
 *
 * A mug is concise if and only if it doesn't have any continuous nesting of
 * `[construction]`.
 *
 * Likewise, a mug-like can be concise or not.
 *
 * A state is always concise as it doesn't have a `[construction]` at all,
 */
export const construction = Symbol();

export type Mug<TConstruction> = {
  [construction]: TConstruction;
};

export type RawState<TMugLike> =
  TMugLike extends Mug<infer TConstruction> ? TConstruction : TMugLike;

/**
 * The state type for a given mug-like type.
 */
export type State<TMugLike> =
  TMugLike extends Mug<infer TConstruction>
    ? State<TConstruction>
    : TMugLike extends { [k: keyof any]: any }
      ? { [K in keyof TMugLike]: State<TMugLike[K]> }
      : TMugLike extends (infer TMugLikeItem)[]
        ? State<TMugLikeItem>[]
        : TMugLike;

/**
 * The union type of every possible concise mug-like type for a given mug-like type.
 */
export type PossibleMugLike<TMugLike> =
  TMugLike extends Mug<infer TConstruction>
    ? PossibleMugLike<TConstruction>
    : TMugLike extends { [k: keyof any]: any }
      ?
          | Mug<{ [K in keyof TMugLike]: PossibleMugLike<TMugLike[K]> }>
          | { [K in keyof TMugLike]: PossibleMugLike<TMugLike[K]> }
      : TMugLike extends (infer TMugLikeItem)[]
        ? Mug<PossibleMugLike<TMugLikeItem>[]> | PossibleMugLike<TMugLikeItem>[]
        : Mug<TMugLike> | TMugLike;

/**
 * The union type of every possible concise mug type for a given mug-like type.
 */
export type PossibleMug<TMugLike> =
  TMugLike extends Mug<infer TConstruction>
    ? PossibleMug<TConstruction>
    : TMugLike extends { [k: keyof any]: any }
      ? Mug<{ [K in keyof TMugLike]: PossibleMugLike<TMugLike[K]> }>
      : TMugLike extends (infer TMugLikeItem)[]
        ? Mug<PossibleMugLike<TMugLikeItem[]>>
        : Mug<TMugLike>;

export function isObjectLike(o: any): boolean {
  return typeof o === 'object' && o !== null;
}

export const isArray = Array.isArray;

export function isNonArrayObjectLike(o: any): boolean {
  return isObjectLike(o) && !isArray(o);
}

export function isMug(o: any): boolean {
  if (!isNonArrayObjectLike(o)) {
    return false;
  }
  return Object.prototype.hasOwnProperty.call(o, construction);
}
