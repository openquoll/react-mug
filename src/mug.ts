import {
  _assignObject,
  _captureErrorStackTrace,
  _constructor,
  _createObject,
  _Error,
  _forEach,
  _getOwnPropertyNames,
  _getOwnPropertySymbols,
  _hasOwnProperty,
  _includes,
  _is,
  _isArray,
  _length,
  _Object,
  _reduce,
  _setPrototypeOf,
} from './shortcuts';
import { AnyFunction, AnyObjectLike, Conserve, EmptyItem, NumAsStr } from './type-utils';

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

export type AnyMug = { [construction]: any };

/**
 * The union type of every possible concise mug-like type for a given mug-like type.
 */
export type PossibleMugLike<TMugLike> = TMugLike extends AnyFunction
  ? TMugLike
  : TMugLike extends { [construction]: infer TConstruction }
    ? PossibleMugLike<TConstruction>
    : TMugLike extends AnyObjectLike
      ?
          | { [construction]: { [TK in keyof TMugLike]: PossibleMugLike<TMugLike[TK]> } }
          | { [TK in keyof TMugLike]: PossibleMugLike<TMugLike[TK]> }
      : { [construction]: TMugLike } | TMugLike;

/**
 * The union type of every possible concise mug type for a given mug-like type.
 */
export type PossibleMug<TMugLike> = TMugLike extends AnyFunction
  ? TMugLike
  : TMugLike extends { [construction]: infer TConstruction }
    ? PossibleMugLike<TConstruction>
    : TMugLike extends AnyObjectLike
      ? { [construction]: { [TK in keyof TMugLike]: PossibleMugLike<TMugLike[TK]> } }
      : { [construction]: TMugLike };

type NonEmptyPossibleMuggyOverride<TMugLike> = TMugLike extends AnyFunction
  ? never
  : TMugLike extends AnyMug
    ? never
    : TMugLike extends AnyObjectLike
      ?
          | { [construction]: { [TK in keyof TMugLike]: PossibleMugLike<TMugLike[TK]> } }
          | { [TK in keyof TMugLike]?: NonEmptyPossibleMuggyOverride<TMugLike[TK]> }
      : { [construction]: TMugLike };

export type PossibleMuggyOverride<TMugLike> = EmptyItem | NonEmptyPossibleMuggyOverride<TMugLike>;

/**
 * The mug-like type-extending helper.
 */
export type MugLike<
  TMugLike,
  TMuggyOverride extends PossibleMuggyOverride<TMugLike> = EmptyItem,
> = TMugLike extends AnyFunction
  ? TMugLike
  : TMuggyOverride extends AnyFunction
    ? TMugLike
    : TMugLike extends AnyMug
      ? TMugLike
      : TMuggyOverride extends AnyMug
        ? TMuggyOverride
        : TMugLike extends AnyObjectLike
          ? TMuggyOverride extends AnyObjectLike
            ? { [TK in keyof TMugLike]: MugLike<TMugLike[TK], TMuggyOverride[TK]> }
            : TMugLike
          : TMugLike;

/**
 * The mug type-defining helper.
 */
export type Mug<
  TConstruction,
  TMuggyOverride extends PossibleMuggyOverride<TConstruction> = EmptyItem,
> = {
  [construction]: MugLike<TConstruction, TMuggyOverride>;
};

/**
 * The state type-evaluating helper.
 */
export type State<TMugLike> = TMugLike extends AnyFunction
  ? TMugLike
  : TMugLike extends { [construction]: infer TConstruction }
    ? Conserve<TConstruction, State<TConstruction>>
    : TMugLike extends AnyObjectLike
      ? Conserve<TMugLike, { [TK in keyof TMugLike]: State<TMugLike[TK]> }>
      : TMugLike;

export class MugError extends _Error {
  public name: string = 'MugError';

  constructor(message: string) {
    super(message);
    if (_captureErrorStackTrace) {
      _captureErrorStackTrace(this, MugError);
    }
    _setPrototypeOf(this, MugError.prototype);
  }
}

export const isObjectLike = (o: any): boolean => typeof o === 'object' && o !== null;

export const isPlainObject = (o: any): boolean =>
  isObjectLike(o) && [_Object, undefined][_includes](o[_constructor]);

export const isClassDefinedObject = (o: any): boolean =>
  isObjectLike(o) && !_isArray(o) && ![_Object, undefined][_includes](o[_constructor]);

export const isMug = (o: any): o is AnyMug => isObjectLike(o) && o[_hasOwnProperty](construction);

export function isState(o: any): boolean {
  if (isMug(o)) {
    return false;
  }

  if (isPlainObject(o)) {
    return ownKeysOfObjectLike(o)[_reduce]((result, key) => result && isState(o[key]), true);
  }

  if (_isArray(o)) {
    return o[_reduce]((result, value) => result && isState(value), true);
  }

  return true;
}

export function areEqualMugLikes(a: any, b: any): boolean {
  if (_is(a, b)) {
    return true;
  }

  if (isMug(a) && isMug(b)) {
    return _is(a, b);
  }

  if (isPlainObject(a) && isPlainObject(b)) {
    return ownKeysOfObjectLike(_assignObject({}, a, b))[_reduce]((result, key) => {
      const keyInA = a[_hasOwnProperty](key);
      const keyInB = b[_hasOwnProperty](key);

      if (!keyInA || !keyInB) {
        return false;
      }

      return result && areEqualMugLikes(a[key], b[key]);
    }, true);
  }

  if (_isArray(a) && _isArray(b)) {
    if (a[_length] !== b[_length]) {
      return false;
    }

    let result = true;
    for (let i = 0, n = a[_length]; i < n; i++) {
      const indexInA = a[_hasOwnProperty](i);
      const indexInB = b[_hasOwnProperty](i);

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

export function assignConservatively(mugLike: any, input: any): any {
  if (isMug(mugLike) || isMug(input)) {
    return mugLike;
  }

  if (_is(mugLike, input)) {
    return mugLike;
  }

  if (isPlainObject(mugLike) && isPlainObject(input)) {
    const result = emptyCloneOfPlainObject(mugLike);
    let allFieldsFromMugLike = true;
    let allFieldsFromInput = true;
    ownKeysOfObjectLike(_assignObject({}, mugLike, input))[_forEach]((key) => {
      const keyInMugLike = mugLike[_hasOwnProperty](key);
      const keyInInput = input[_hasOwnProperty](key);

      if (keyInMugLike && !keyInInput) {
        allFieldsFromMugLike = false;
        return;
      }

      if (!keyInMugLike && keyInInput) {
        if (isMug(input[key])) {
          allFieldsFromInput = false;
          return;
        }
        allFieldsFromMugLike = false;
        result[key] = input[key];
        return;
      }

      result[key] = assignConservatively(mugLike[key], input[key]);

      if (!_is(mugLike[key], result[key])) {
        allFieldsFromMugLike = false;
      }

      if (!_is(input[key], result[key])) {
        allFieldsFromInput = false;
      }
    });

    if (allFieldsFromMugLike) {
      return mugLike;
    }

    if (allFieldsFromInput) {
      return input;
    }

    return result;
  }

  if (_isArray(mugLike) && _isArray(input)) {
    const result: any[] = [];
    result[_length] = input[_length];
    let allItemsFromMugLike = mugLike[_length] === result[_length];
    let allItemsFromInput = true;
    for (let i = 0, n = result[_length]; i < n; i++) {
      const indexInMugLike = mugLike[_hasOwnProperty](i);
      const indexInInput = input[_hasOwnProperty](i);

      if (!indexInMugLike && !indexInInput) {
        continue;
      }

      if (indexInMugLike && !indexInInput) {
        allItemsFromMugLike = false;
        continue;
      }

      if (!indexInMugLike && indexInInput) {
        if (isMug(input[i])) {
          allItemsFromInput = false;
          continue;
        }
        allItemsFromMugLike = false;
        result[i] = input[i];
        continue;
      }

      result[i] = assignConservatively(mugLike[i], input[i]);

      if (!_is(mugLike[i], result[i])) {
        allItemsFromMugLike = false;
      }

      if (!_is(input[i], result[i])) {
        allItemsFromInput = false;
      }
    }

    if (allItemsFromMugLike) {
      return mugLike;
    }

    if (allItemsFromInput) {
      return input;
    }

    return result;
  }

  return input;
}

export const emptyCloneOfPlainObject = (o: any): any =>
  _createObject(o[_constructor]?.prototype ?? null);

export const shallowCloneOfPlainObject = (o: any): any =>
  ownKeysOfObjectLike(o)[_reduce]((r, key) => {
    r[key] = o[key];
    return r;
  }, emptyCloneOfPlainObject(o));

export const ownKeysOfObjectLike = <T extends AnyObjectLike>(o: T): NumAsStr<keyof T>[] =>
  isObjectLike(o)
    ? ([..._getOwnPropertyNames(o), ..._getOwnPropertySymbols(o)] as NumAsStr<keyof T>[])
    : [];
