/**
 * A mug is a holder of states. Imagine mug cups containing states as liquid
 * inside.
 *
 * A mug is any object conforming to the shape `{ [construction]: ... }`. The
 * `[construction]` field denotes how the held states are initially constructed.
 *
 * ---
 *
 * A Mug can be a holder of other Mugs. Imagine mug cups stacked together.
 *
 * ---
 *
 * A state is a plain value without `[construction]` at any level.
 *
 * ---
 *
 * A mug-like is a mug, a state or something between a mug and a state. Imagine
 * mug-likes as mixtures of mug cups and liquid.
 *
 * A mug-like is a plain value with or without `[construction]`.
 *
 * The most mug-like is mugs and the least mug-like is states.
 *
 * Thus, mugs, mug-likes and states constitue a mug-state continuum.
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

export function isObjectLike(o: any): boolean {
  return typeof o === 'object' && o !== null;
}

export function isPlainObject(o: any): boolean {
  return isObjectLike(o) && [Object, undefined].includes(o.constructor);
}

export const isArray = Array.isArray;

export function isClassDefinedObject(o: any): boolean {
  return isObjectLike(o) && !isArray(o) && ![Object, undefined].includes(o.constructor);
}

export function isMug(o: any): o is Mug<any> {
  return isObjectLike(o) && Object.prototype.hasOwnProperty.call(o, construction);
}

export function isState(o: any): boolean {
  if (isMug(o)) {
    return false;
  }

  if (isPlainObject(o)) {
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

  if (isPlainObject(a) && isPlainObject(b)) {
    return ownKeysOfObjectLike({ ...a, ...b }).reduce((result, key) => {
      const keyInA = a.hasOwnProperty(key);
      const keyInB = b.hasOwnProperty(key);

      if (!keyInA || !keyInB) {
        return false;
      }

      return result && areEqualMugLikes(a[key], b[key]);
    }, true);
  }

  if (isArray(a) && isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }

    let result = true;
    for (let i = 0, n = a.length; i < n; i++) {
      const indexInA = a.hasOwnProperty(i);
      const indexInB = b.hasOwnProperty(i);

      if (!indexInA && !indexInB) {
        continue;
      }

      if (!indexInA || !indexInB) {
        result = false;
        break;
      }

      result = result && areEqualMugLikes(a[i], b[i]);
    }
    return result;
  }

  return false;
}

export function emptyCloneOfPlainObject(o: any): any {
  return Object.create(o.constructor?.prototype ?? null);
}

export function shallowCloneOfPlainObject(o: any): any {
  return ownKeysOfObjectLike(o).reduce((r, key) => {
    r[key] = o[key];
    return r;
  }, emptyCloneOfPlainObject(o));
}

export type NumAsStr<T> = T extends number ? `${T}` : T;

export function ownKeysOfObjectLike<T extends ObjectLike>(o: T): NumAsStr<keyof T>[] {
  if (isObjectLike(o)) {
    const ownKeys = [...Object.getOwnPropertyNames(o), ...Object.getOwnPropertySymbols(o)];
    return ownKeys as NumAsStr<keyof T>[];
  }
  return [];
}
