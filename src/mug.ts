import type { ReadProc, WriteProc } from './mechanism';
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
  _ObjectPrototype,
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
 * The fields adjacent to `[construction]`, if any, are the mug's attachments
 * for the extension purpose.
 *
 * ---
 *
 * A Mug can also be a holder of other Mugs. Imagine mug cups stacked together.
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
 * Additionally, mugs, mug-likes and states constitue a mug-state continuum.
 *
 * ---
 *
 * A mug is concise if and only if it doesn't have any continuous nesting of
 * `[construction]`.
 *
 * Likewise, a mug-like can be concise or not.
 *
 * A state is always concise as it doesn't have a `[construction]` at all.
 */
export const construction = Symbol();

export type CleanMug<TConstruction> = { [construction]: TConstruction };

export type AnyMug = CleanMug<any>;

export type WithAttachments<TMug extends AnyMug, TAttachments extends AnyObjectLike> = TMug &
  TAttachments;

export type PossibleMugLikeOnObjectLike<TMugLike extends AnyObjectLike> =
  | CleanMug<{ [TK in keyof TMugLike]: PossibleMugLike<TMugLike[TK]> }>
  | { [TK in keyof TMugLike]: PossibleMugLike<TMugLike[TK]> };

export type PossibleMugLikeOnPrimitive<TMugLike> = CleanMug<TMugLike> | TMugLike;

/**
 * The union type of every possible concise mug-like type for a given mug-like
 * type.
 */
export type PossibleMugLike<TMugLike> = TMugLike extends AnyFunction
  ? TMugLike
  : TMugLike extends CleanMug<infer TConstruction>
    ? AnyMug extends TMugLike
      ? PossibleMugLike<TConstruction>
      : TMugLike | PossibleMugLike<TConstruction>
    : TMugLike extends AnyObjectLike
      ? PossibleMugLikeOnObjectLike<TMugLike>
      : PossibleMugLikeOnPrimitive<TMugLike>;

export type PossibleMugOnObjectLike<TMugLike extends AnyObjectLike> = CleanMug<{
  [TK in keyof TMugLike]: PossibleMugLike<TMugLike[TK]>;
}>;

export type PossibleMugOnPrimitive<TMugLike> = CleanMug<TMugLike>;

/**
 * The union type of every possible concise mug type for a given mug-like type.
 */
export type PossibleMug<TMugLike> = TMugLike extends AnyFunction
  ? TMugLike
  : TMugLike extends CleanMug<infer TConstruction>
    ? AnyMug extends TMugLike
      ? PossibleMug<TConstruction>
      : TMugLike | PossibleMug<TConstruction>
    : TMugLike extends AnyObjectLike
      ? PossibleMugOnObjectLike<TMugLike>
      : PossibleMugOnPrimitive<TMugLike>;

export type NonEmptyPossibleMuggyOverrideOnObjectLike<TMugLike extends AnyObjectLike> =
  | CleanMug<{ [TK in keyof TMugLike]: PossibleMugLike<TMugLike[TK]> }>
  | { [TK in keyof TMugLike]?: NonEmptyPossibleMuggyOverride<TMugLike[TK]> };

export type NonEmptyPossibleMuggyOverrideOnPrimitive<TMugLike> = CleanMug<TMugLike>;

export type NonEmptyPossibleMuggyOverride<TMugLike> = TMugLike extends AnyFunction
  ? never
  : TMugLike extends AnyMug
    ? never
    : TMugLike extends AnyObjectLike
      ? NonEmptyPossibleMuggyOverrideOnObjectLike<TMugLike>
      : NonEmptyPossibleMuggyOverrideOnPrimitive<TMugLike>;

export type PossibleMuggyOverride<TMugLike> = EmptyItem | NonEmptyPossibleMuggyOverride<TMugLike>;

export type MuggifyOnObjectLikeByObjectLike<
  TMugLike extends AnyObjectLike,
  TMuggyOverride extends AnyObjectLike,
> = {
  [TK in keyof TMugLike]: Muggify<TMugLike[TK], TMuggyOverride[TK]>;
};

export type Muggify<
  TMugLike,
  TMuggyOverride extends PossibleMuggyOverride<TMugLike>,
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
            ? MuggifyOnObjectLikeByObjectLike<TMugLike, TMuggyOverride>
            : TMugLike
          : TMugLike;

/**
 * The mug type-defining helper.
 */
export type Mug<
  TMugLike,
  TMuggyOverride extends PossibleMuggyOverride<TMugLike> = EmptyItem,
> = CleanMug<Muggify<TMugLike, TMuggyOverride>>;

/**
 * The mug-like type-extending helper.
 */
export type MugLike<
  TMugLike,
  TMuggyOverride extends PossibleMuggyOverride<TMugLike> = EmptyItem,
> = Muggify<TMugLike, TMuggyOverride>;

export type StateOnObjectLike<TMugLike extends AnyObjectLike> = Conserve<
  TMugLike,
  { [TK in keyof TMugLike]: Conserve<TMugLike[TK], State<TMugLike[TK]>> }
>;

/**
 * The state type-evaluating helper.
 */
export type State<TMugLike> = TMugLike extends AnyFunction
  ? TMugLike
  : TMugLike extends CleanMug<infer TConstruction>
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

export const attach = <TMug extends AnyMug, TAttachments extends AnyObjectLike>(
  mug: TMug,
  attachments: TAttachments,
): WithAttachments<TMug, TAttachments> => _assign(mug, attachments);

export const isObjectLike = (o: any): boolean =>
  isFunction(o) || (typeof o === _object && o !== null);

export const isPlainObject = (o: any): boolean =>
  isObjectLike(o) && [_Object, _undefined][_includes](o[_constructor]);

export const isClassDefinedObject = (o: any): boolean =>
  isObjectLike(o) && !_isArray(o) && ![_Object, _undefined][_includes](o[_constructor]);

export const isMug = (o: any): o is AnyMug =>
  isObjectLike(o) && _ObjectPrototype[_hasOwnProperty].call(o, construction);

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
      const keyInA = _ObjectPrototype[_hasOwnProperty].call(a, key);
      const keyInB = _ObjectPrototype[_hasOwnProperty].call(b, key);

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
      const indexInA = _ObjectPrototype[_hasOwnProperty].call(a, i);
      const indexInB = _ObjectPrototype[_hasOwnProperty].call(b, i);

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
      const keyInMugLike = _ObjectPrototype[_hasOwnProperty].call(mugLike, key);
      const keyInInput = _ObjectPrototype[_hasOwnProperty].call(input, key);

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
      const indexInMugLike = _ObjectPrototype[_hasOwnProperty].call(mugLike, i);
      const indexInInput = _ObjectPrototype[_hasOwnProperty].call(input, i);

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

export const _readFn = Symbol();

export const _writeFn = Symbol();

export type ReadProcMeta<TReadFn extends AnyFunction> = {
  [_readFn]: TReadFn;
};

export type AnyReadProc = AnyFunction & ReadProcMeta<AnyFunction>;

export type NotReadProc = {
  [_readFn]?: never;
};

export type WriteProcMeta<TWriteFn extends AnyFunction> = {
  [_writeFn]: TWriteFn;
};

export type AnyWriteProc = AnyFunction & WriteProcMeta<AnyFunction>;

export type NotWriteProc = {
  [_writeFn]?: never;
};

export type AnyProc = AnyReadProc | AnyWriteProc;

export type NotProc = {
  [_readFn]?: never;
  [_writeFn]?: never;
};

export const isFunction = (f: any): boolean => typeof f === _function;

export const isReadProc = (f: any): f is AnyReadProc =>
  isFunction(f) && f[_hasOwnProperty](_readFn) && isFunction(f[_readFn]);

export const isWriteProc = (f: any): f is AnyWriteProc =>
  isFunction(f) && f[_hasOwnProperty](_writeFn) && isFunction(f[_writeFn]);

export const isProc = (f: any): f is AnyProc => isReadProc(f) || isWriteProc(f);

export const _readProc = Symbol();

export const _writeProc = Symbol();

export const _state = Symbol();

export const _special = Symbol();

export const _mugLike = Symbol();

export const _general = Symbol();

export type Specialness<TState> = {
  [_state]: TState;
  [_special]: typeof _special;
};

export type Generalness<TState> = {
  [_state]: TState;
  [_general]: typeof _general;
};

export type ReadSpecialOpMetaOnReadProc<TReadProc extends AnyReadProc, TState> = {
  [_readProc]: TReadProc;
  [_state]: TState;
  [_special]: typeof _special;
  [_mugLike]: PossibleMugLike<TState>;
};

export type ReadSpecialOpMeta<TRead extends AnyFunction, TState> = TRead extends AnyReadProc
  ? ReadSpecialOpMetaOnReadProc<TRead, TState>
  : ReadSpecialOpMeta<ReadProc<TRead>, TState>;

export type AnyReadSpecialOp = AnyFunction & ReadSpecialOpMeta<AnyReadProc, any>;

export type NotReadSpecialOp = {
  [_readProc]?: never;
  [_special]?: never;
  [_mugLike]?: never;
};

export type ReadGeneralOpMetaOnReadProc<TReadProc extends AnyReadProc, TState> = {
  [_readProc]: TReadProc;
  [_state]: TState;
  [_general]: typeof _general;
};

export type ReadGeneralOpMeta<TRead extends AnyFunction, TState> = TRead extends AnyReadProc
  ? ReadGeneralOpMetaOnReadProc<TRead, TState>
  : ReadGeneralOpMeta<ReadProc<TRead>, TState>;

export type AnyReadGeneralOp = AnyFunction & ReadGeneralOpMeta<AnyReadProc, any>;

export type WriteSpecialOpMetaWriteProc<TWriteProc extends AnyWriteProc, TState> = {
  [_writeProc]: TWriteProc;
  [_state]: TState;
  [_special]: typeof _special;
  [_mugLike]: PossibleMugLike<TState>;
};

export type WriteSpecialOpMeta<TWrite extends AnyFunction, TState> = TWrite extends AnyWriteProc
  ? WriteSpecialOpMetaWriteProc<TWrite, TState>
  : WriteSpecialOpMeta<WriteProc<TWrite>, TState>;

export type AnyWriteSpecialOp = AnyFunction & WriteSpecialOpMeta<AnyWriteProc, any>;

export type NotWriteSpecialOp = {
  [_writeProc]?: never;
  [_special]?: never;
  [_mugLike]?: never;
};

export type WriteGeneralOpMetaWriteProc<TWriteProc extends AnyWriteProc, TState> = {
  [_writeProc]: TWriteProc;
  [_state]: TState;
  [_general]: typeof _general;
};

export type WriteGeneralOpMeta<TWrite extends AnyFunction, TState> = TWrite extends AnyWriteProc
  ? WriteGeneralOpMetaWriteProc<TWrite, TState>
  : WriteGeneralOpMeta<WriteProc<TWrite>, TState>;

export type AnyWriteGeneralOp = AnyFunction & WriteGeneralOpMeta<AnyWriteProc, any>;

export type AnySpecialOp = AnyReadSpecialOp | AnyWriteSpecialOp;

export type AnyGeneralOp = AnyReadGeneralOp | AnyWriteGeneralOp;

export type AnyOp = AnySpecialOp | AnyGeneralOp;

export type NotOp = {
  [_readProc]?: never;
  [_writeProc]?: never;
};

export const hasSpecialness = (o: any): boolean =>
  isObjectLike(o) && _ObjectPrototype[_hasOwnProperty].call(o, _special);

export const hasGeneralness = (o: any): boolean =>
  isObjectLike(o) && _ObjectPrototype[_hasOwnProperty].call(o, _general);

export const isReadSpecialOp = (f: any): f is AnyReadSpecialOp =>
  isFunction(f) &&
  f[_hasOwnProperty](_readProc) &&
  f[_hasOwnProperty](_special) &&
  f[_hasOwnProperty](_mugLike) &&
  isReadProc(f[_readProc]);

export const isWriteSpecialOp = (f: any): f is AnyWriteSpecialOp =>
  isFunction(f) &&
  f[_hasOwnProperty](_writeProc) &&
  f[_hasOwnProperty](_special) &&
  f[_hasOwnProperty](_mugLike) &&
  isWriteProc(f[_writeProc]);

export const isSpecialOp = (f: any): f is AnySpecialOp => isReadSpecialOp(f) || isWriteSpecialOp(f);

export const isReadGeneralOp = (f: any): f is AnyReadGeneralOp =>
  isFunction(f) &&
  f[_hasOwnProperty](_readProc) &&
  f[_hasOwnProperty](_general) &&
  isReadProc(f[_readProc]);

export const isWriteGeneralOp = (f: any): f is AnyWriteGeneralOp =>
  isFunction(f) &&
  f[_hasOwnProperty](_writeProc) &&
  f[_hasOwnProperty](_general) &&
  isWriteProc(f[_writeProc]);

export const isGeneralOp = (f: any): f is AnyGeneralOp => isReadGeneralOp(f) || isWriteGeneralOp(f);

export const isOp = (f: any): f is AnyOp => isSpecialOp(f) || isGeneralOp(f);
