import {
  _assign,
  _captureStackTrace,
  _constructor,
  _create,
  _Error,
  _false,
  _forEach,
  _function,
  _getOwnPropertyNames,
  _getOwnPropertySymbols,
  _hasOwnProperty,
  _includes,
  _is,
  _isArray,
  _length,
  _null,
  _object,
  _Object,
  _reduce,
  _setPrototypeOf,
  _true,
  _undefined,
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
// export const construction = 'Symbol("construction")';

export type AnyMug = { [construction]: any };

export type PossibleMugLikeOnObjectLike<TMugLike extends AnyObjectLike> =
  | { [construction]: { [TK in keyof TMugLike]: PossibleMugLike<TMugLike[TK]> } }
  | { [TK in keyof TMugLike]: PossibleMugLike<TMugLike[TK]> };

export type PossibleMugLikeOnPrimitive<TMugLike> = { [construction]: TMugLike } | TMugLike;

/**
 * The union type of every possible concise mug-like type for a given mug-like type.
 */
export type PossibleMugLike<TMugLike> = TMugLike extends AnyFunction
  ? TMugLike
  : TMugLike extends { [construction]: infer TConstruction }
    ? PossibleMugLike<TConstruction>
    : TMugLike extends AnyObjectLike
      ? PossibleMugLikeOnObjectLike<TMugLike>
      : PossibleMugLikeOnPrimitive<TMugLike>;

export type PossibleMugOnObjectLike<TMugLike extends AnyObjectLike> = {
  [construction]: { [TK in keyof TMugLike]: PossibleMugLike<TMugLike[TK]> };
};

export type PossibleMugOnPrimitive<TMugLike> = { [construction]: TMugLike };

/**
 * The union type of every possible concise mug type for a given mug-like type.
 */
export type PossibleMug<TMugLike> = TMugLike extends AnyFunction
  ? TMugLike
  : TMugLike extends { [construction]: infer TConstruction }
    ? PossibleMugLike<TConstruction>
    : TMugLike extends AnyObjectLike
      ? PossibleMugOnObjectLike<TMugLike>
      : PossibleMugOnPrimitive<TMugLike>;

export type NonEmptyPossibleMuggyOverrideOnObjectLike<TMugLike extends AnyObjectLike> =
  | { [construction]: { [TK in keyof TMugLike]: PossibleMugLike<TMugLike[TK]> } }
  | { [TK in keyof TMugLike]?: NonEmptyPossibleMuggyOverride<TMugLike[TK]> };

export type NonEmptyPossibleMuggyOverrideOnPrimitive<TMugLike> = { [construction]: TMugLike };

export type NonEmptyPossibleMuggyOverride<TMugLike> = TMugLike extends AnyFunction
  ? never
  : TMugLike extends AnyMug
    ? never
    : TMugLike extends AnyObjectLike
      ? NonEmptyPossibleMuggyOverrideOnObjectLike<TMugLike>
      : NonEmptyPossibleMuggyOverrideOnPrimitive<TMugLike>;

export type PossibleMuggyOverride<TMugLike> = EmptyItem | NonEmptyPossibleMuggyOverride<TMugLike>;

export type MugLikeOnObjectLikeByObjectLike<
  TMugLike extends AnyObjectLike,
  TMuggyOverride extends AnyObjectLike,
> = {
  [TK in keyof TMugLike]: MugLike<TMugLike[TK], TMuggyOverride[TK]>;
};

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
            ? MugLikeOnObjectLikeByObjectLike<TMugLike, TMuggyOverride>
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

export type StateOnObjectLike<TMugLike extends AnyObjectLike> = Conserve<
  TMugLike,
  { [TK in keyof TMugLike]: Conserve<TMugLike[TK], State<TMugLike[TK]>> }
>;

/**
 * The state type-evaluating helper.
 */
export type State<TMugLike> = TMugLike extends AnyFunction
  ? TMugLike
  : TMugLike extends { [construction]: infer TConstruction }
    ? Conserve<TConstruction, State<TConstruction>>
    : TMugLike extends AnyObjectLike
      ? StateOnObjectLike<TMugLike>
      : TMugLike;

export class MugError extends _Error {
  public name: string = 'MugError';

  constructor(message: string) {
    super(message);
    if (_captureStackTrace) {
      _captureStackTrace(this, MugError);
    }
    _setPrototypeOf(this, MugError.prototype);
  }
}

export const isObjectLike = (o: any): boolean => typeof o === _object && o !== null;

export const isPlainObject = (o: any): boolean =>
  isObjectLike(o) && [_Object, _undefined][_includes](o[_constructor]);

export const isClassDefinedObject = (o: any): boolean =>
  isObjectLike(o) && !_isArray(o) && ![_Object, _undefined][_includes](o[_constructor]);

export const isMug = (o: any): o is AnyMug => isObjectLike(o) && o[_hasOwnProperty](construction);

export function isState(o: any): boolean {
  if (isMug(o)) {
    return _false;
  }

  if (isPlainObject(o)) {
    return ownKeysOfObjectLike(o)[_reduce]((result, key) => result && isState(o[key]), _true);
  }

  if (_isArray(o)) {
    return o[_reduce]((result, value) => result && isState(value), _true);
  }

  return _true;
}

export function areEqualMugLikes(a: any, b: any): boolean {
  if (_is(a, b)) {
    return _true;
  }

  if (isMug(a) && isMug(b)) {
    return _is(a, b);
  }

  if (isPlainObject(a) && isPlainObject(b)) {
    return ownKeysOfObjectLike(_assign({}, a, b))[_reduce]((result, key) => {
      const keyInA = a[_hasOwnProperty](key);
      const keyInB = b[_hasOwnProperty](key);

      if (!keyInA || !keyInB) {
        return _false;
      }

      return result && areEqualMugLikes(a[key], b[key]);
    }, _true);
  }

  if (_isArray(a) && _isArray(b)) {
    if (a[_length] !== b[_length]) {
      return _false;
    }

    let result = _true;
    for (let i = 0, n = a[_length]; i < n; i++) {
      const indexInA = a[_hasOwnProperty](i);
      const indexInB = b[_hasOwnProperty](i);

      if (!indexInA && !indexInB) {
        continue;
      }

      if (!indexInA || !indexInB) {
        result = _false;
        break;
      }

      result = result && areEqualMugLikes(a[i], b[i]);
    }
    return result;
  }

  return _false;
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
    let allFieldsFromMugLike = _true;
    let allFieldsFromInput = _true;
    ownKeysOfObjectLike(_assign({}, mugLike, input))[_forEach]((key) => {
      const keyInMugLike = mugLike[_hasOwnProperty](key);
      const keyInInput = input[_hasOwnProperty](key);

      if (keyInMugLike && !keyInInput) {
        allFieldsFromMugLike = _false;
        return;
      }

      if (!keyInMugLike && keyInInput) {
        if (isMug(input[key])) {
          allFieldsFromInput = _false;
          return;
        }
        allFieldsFromMugLike = _false;
        result[key] = input[key];
        return;
      }

      result[key] = assignConservatively(mugLike[key], input[key]);

      if (!_is(mugLike[key], result[key])) {
        allFieldsFromMugLike = _false;
      }

      if (!_is(input[key], result[key])) {
        allFieldsFromInput = _false;
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
    let allItemsFromInput = _true;
    for (let i = 0, n = result[_length]; i < n; i++) {
      const indexInMugLike = mugLike[_hasOwnProperty](i);
      const indexInInput = input[_hasOwnProperty](i);

      if (!indexInMugLike && !indexInInput) {
        continue;
      }

      if (indexInMugLike && !indexInInput) {
        allItemsFromMugLike = _false;
        continue;
      }

      if (!indexInMugLike && indexInInput) {
        if (isMug(input[i])) {
          allItemsFromInput = _false;
          continue;
        }
        allItemsFromMugLike = _false;
        result[i] = input[i];
        continue;
      }

      result[i] = assignConservatively(mugLike[i], input[i]);

      if (!_is(mugLike[i], result[i])) {
        allItemsFromMugLike = _false;
      }

      if (!_is(input[i], result[i])) {
        allItemsFromInput = _false;
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
  _create(o[_constructor]?.prototype ?? _null);

export const shallowCloneOfPlainObject = (o: any): any =>
  ownKeysOfObjectLike(o)[_reduce]((r, key) => {
    r[key] = o[key];
    return r;
  }, emptyCloneOfPlainObject(o));

export const ownKeysOfObjectLike = <T extends AnyObjectLike>(o: T): NumAsStr<keyof T>[] =>
  isObjectLike(o)
    ? ([..._getOwnPropertyNames(o), ..._getOwnPropertySymbols(o)] as NumAsStr<keyof T>[])
    : [];

/**
 * A function with `[_readOp]`/`[_writeOp]` and `[_mugLike]` as fields is an
 * action. The value of `[_mugLike]` is the action's mug-like bound inside.
 */
export const _mugLike = Symbol();

/**
 * A function with `[_readOp]` and `[_mugLike]` as fields is a read action. The
 * value of `[_readOp]` is the action's operator bound inside.
 */
export const _readOp = Symbol();

/**
 * A function with `[_writeOp]` and `[_mugLike]` as fields is a write action.
 * The value of `[_writeOp]` is the action's operator bound inside.
 */
export const _writeOp = Symbol();

/**
 * A function with `[_readFn]` as a field is a read operator. The value of
 * `[_readFn]` is the operator's pure function bound inside.
 */
export const _readFn = Symbol();

/**
 * A function with `[_writeFn]` as a field is a write operator. The value of
 * `[_writeFn]` is the operator's pure function bound inside.
 */
export const _writeFn = Symbol();

export type ReadOpMeta<TReadFn extends AnyFunction> = {
  [_readFn]: TReadFn;
};

export type AnyReadOp = AnyFunction & ReadOpMeta<AnyFunction>;

export type NotReadOp = { [_readFn]?: never };

export type WriteOpMeta<TWriteFn extends AnyFunction> = {
  [_writeFn]: TWriteFn;
};

export type AnyWriteOp = AnyFunction & WriteOpMeta<AnyFunction>;

export type NotWriteOp = { [_writeFn]?: never };

export type AnyOp = AnyReadOp | AnyWriteOp;

export type NotOp = NotReadOp & NotWriteOp;

export const isFunction = (f: any): boolean => typeof f === _function;

export const isReadOp = (f: any): f is AnyReadOp =>
  isFunction(f) && f[_hasOwnProperty](_readFn) && isFunction(f[_readFn]);

export const isWriteOp = (f: any): f is AnyWriteOp =>
  isFunction(f) && f[_hasOwnProperty](_writeFn) && isFunction(f[_writeFn]);

export const isOp = (f: any): f is AnyOp => isReadOp(f) || isWriteOp(f);

export type ReadActionMeta<TMugLike, TReadOp extends AnyReadOp> = {
  [_mugLike]: TMugLike;
  [_readOp]: TReadOp;
};

export type AnyReadAction = AnyFunction & ReadActionMeta<any, AnyReadOp>;

export type NotReadAction = {
  [_mugLike]?: never;
  [_readOp]?: never;
};

export type WriteActionMeta<TMugLike, TWriteOp extends AnyWriteOp> = {
  [_mugLike]: TMugLike;
  [_writeOp]: TWriteOp;
};

export type AnyWriteAction = AnyFunction & WriteActionMeta<any, AnyWriteOp>;

export type NotWriteAction = {
  [_mugLike]?: never;
  [_writeOp]?: never;
};

export type AnyAction = AnyReadAction | AnyWriteAction;

export type NotAction = {
  [_mugLike]?: never;
  [_readOp]?: never;
  [_writeOp]?: never;
};

export const isReadAction = (f: any): f is AnyReadAction =>
  isFunction(f) &&
  f[_hasOwnProperty](_mugLike) &&
  f[_hasOwnProperty](_readOp) &&
  isReadOp(f[_readOp]);

export const isWriteAction = (f: any): f is AnyWriteAction =>
  isFunction(f) &&
  f[_hasOwnProperty](_mugLike) &&
  f[_hasOwnProperty](_writeOp) &&
  isWriteOp(f[_writeOp]);

export const isAction = (f: any): f is AnyAction => isReadAction(f) || isWriteAction(f);

export function flat<TReadAction extends AnyReadAction>(
  readAction: TReadAction,
): TReadAction[typeof _readOp];
export function flat<TWriteAction extends AnyWriteAction>(
  writeAction: TWriteAction,
): TWriteAction[typeof _writeOp];
export function flat<TFn extends AnyFunction>(fn: TFn): TFn;
export function flat(f: any): any {
  if (isReadAction(f)) {
    return f[_readOp];
  }

  if (isWriteAction(f)) {
    return f[_writeOp];
  }

  return f;
}

export function pure<TReadAction extends AnyReadAction>(
  readAction: TReadAction,
): TReadAction[typeof _readOp][typeof _readFn];
export function pure<TWriteAction extends AnyWriteAction>(
  writeAction: TWriteAction,
): TWriteAction[typeof _writeOp][typeof _writeFn];
export function pure<TReadOp extends AnyReadOp>(readOp: TReadOp): TReadOp[typeof _readFn];
export function pure<TWriteOp extends AnyWriteOp>(writeOp: TWriteOp): TWriteOp[typeof _writeFn];
export function pure<TFn extends AnyFunction>(fn: TFn): TFn;
export function pure(fn: any): any {
  if (isReadAction(fn)) {
    if (isReadOp(fn[_readOp])) {
      return fn[_readOp][_readFn];
    }
  }

  if (isWriteAction(fn)) {
    if (isWriteOp(fn[_writeOp])) {
      return fn[_writeOp][_writeFn];
    }
  }

  if (isReadOp(fn)) {
    return fn[_readFn];
  }

  if (isWriteOp(fn)) {
    return fn[_writeFn];
  }

  return fn;
}

export const _builtinId = Symbol();

export type BuiltinMeta = { [_builtinId]: string };

export const isBuiltin = (o: any): o is BuiltinMeta => !!o?.[_hasOwnProperty]?.(_builtinId);
