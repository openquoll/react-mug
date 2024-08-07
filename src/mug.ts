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

export type ObjectLike = { [k: keyof any]: any };

/**
 * The state type for a given mug-like type.
 */
export type State<TMugLike> =
  TMugLike extends Mug<infer TConstruction>
    ? State<TConstruction>
    : TMugLike extends ObjectLike
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
    : TMugLike extends ObjectLike
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
    : TMugLike extends ObjectLike
      ? Mug<{ [K in keyof TMugLike]: PossibleMugLike<TMugLike[K]> }>
      : TMugLike extends (infer TMugLikeItem)[]
        ? Mug<PossibleMugLike<TMugLikeItem[]>>
        : Mug<TMugLike>;

export function isObjectLike(o: any): o is ObjectLike {
  return typeof o === 'object' && o !== null;
}

export const isArray = Array.isArray;

export function isNonArrayObjectLike(o: any): o is ObjectLike {
  return isObjectLike(o) && !isArray(o);
}

export function isMug(o: any): o is Mug<any> {
  if (!isNonArrayObjectLike(o)) {
    return false;
  }
  return Object.prototype.hasOwnProperty.call(o, construction);
}

export function isState(o: any): boolean {
  if (isMug(o)) {
    return false;
  }

  if (isNonArrayObjectLike(o)) {
    return ownKeysOfObjectLike(o).reduce((result, key) => {
      return result && isState(o[key]);
    }, true);
  }

  if (isArray(o)) {
    return o.reduce((result, value) => {
      return result && isState(value);
    }, true);
  }

  return true;
}

export function areEqualMugLikes(a: any, b: any): boolean {
  if (Object.is(a, b)) {
    return true;
  }

  if (isMug(a) && isMug(b)) {
    return Object.is(a, b);
  }

  if (isNonArrayObjectLike(a) && isNonArrayObjectLike(b)) {
    return ownKeysOfObjectLike({ ...a, ...b }).reduce((result, key) => {
      return result && areEqualMugLikes(a[key], b[key]);
    }, true);
  }

  if (isArray(a) && isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }

    return a.reduce((result, aItem, i) => {
      return result && areEqualMugLikes(aItem, b[i]);
    }, true);
  }

  return false;
}

export type NumAsStr<T> = T extends number ? `${T}` : T;

export function ownKeysOfObjectLike<T extends ObjectLike>(o: T): NumAsStr<keyof T>[] {
  if (isObjectLike(o)) {
    const ownKeys = [...Object.getOwnPropertyNames(o), ...Object.getOwnPropertySymbols(o)];
    return ownKeys as NumAsStr<keyof T>[];
  }
  return [];
}
