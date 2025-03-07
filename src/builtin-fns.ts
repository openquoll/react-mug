import {
  CleanMug,
  isClassDefinedObject,
  isObjectLike,
  isPlainObject,
  ownKeysOfObjectLike,
  shallowCloneOfPlainObject,
  State,
} from './mug';
import {
  _constructor,
  _hasOwnProperty,
  _is,
  _isArray,
  _length,
  _ObjectPrototype,
  _reduce,
} from './shortcuts';
import {
  AnyFunction,
  AnyObject,
  AnyReadonlyArray,
  AnyReadonlyTuple,
  EmptyItem,
} from './type-utils';

export const _builtinFnId = Symbol();

export const _bidFnPassThrough = '0a4' as const;

export const _bidFnAssignPatch = 'ed8' as const;

export const isBuiltinFn = (fn: AnyFunction): boolean => fn[_hasOwnProperty](_builtinFnId);

export function passThrough<TState>(state: TState): TState {
  return state;
}

passThrough[_builtinFnId] = _bidFnPassThrough;

export type PassThrough = typeof passThrough;

/**
 * Undefinedive means the type can be undefined.
 * In comparison, Nullable means the type can be undefined or null.
 **/
export type PossiblePatchOnUndefinedive<TMugLike> = State<NonNullable<TMugLike>> | undefined;

/**
 * Nullive means the type can be null.
 * In comparison, Nullable means the type can be undefined or null.
 */
export type PossiblePatchOnNullive<TMugLike> = State<NonNullable<TMugLike>> | null;

export type PossiblePatchOnNonNullableOnReadonlyTuple<TMugLike extends AnyReadonlyTuple> = {
  [TK in keyof TMugLike]: PossiblePatch<TMugLike[TK]> | EmptyItem;
};

export type PossiblePatchOnNonNullableOnReadonlyArray<TMugLike extends AnyReadonlyArray> = {
  [TK in keyof TMugLike]: State<TMugLike[TK]>;
};

export type PossiblePatchOnNonNullableOnObjectLike<TMugLike extends AnyObject> = {
  [TK in keyof TMugLike]?: PossiblePatch<TMugLike[TK]>;
};

export type PossiblePatchOnNonNullable<TMugLike> = TMugLike extends AnyFunction
  ? TMugLike
  : TMugLike extends CleanMug<infer TConstruction>
    ? PossiblePatch<TConstruction>
    : TMugLike extends AnyReadonlyTuple
      ? PossiblePatchOnNonNullableOnReadonlyTuple<TMugLike>
      : TMugLike extends AnyReadonlyArray
        ? PossiblePatchOnNonNullableOnReadonlyArray<TMugLike>
        : TMugLike extends AnyObject
          ? PossiblePatchOnNonNullableOnObjectLike<TMugLike>
          : TMugLike;

export type PossiblePatch<TMugLike> = undefined extends TMugLike
  ? PossiblePatchOnUndefinedive<TMugLike>
  : null extends TMugLike
    ? PossiblePatchOnNullive<TMugLike>
    : PossiblePatchOnNonNullable<TMugLike>;

export function assignPatch<TState>(state: TState, patch: PossiblePatch<NoInfer<TState>>): TState;
export function assignPatch(state: any, patch: any): any {
  if (_is(state, patch)) {
    return state;
  }

  if (isPlainObject(state) && isPlainObject(patch)) {
    return ownKeysOfObjectLike(patch)[_reduce]((result, patchKey) => {
      const patchKeyInState = _ObjectPrototype[_hasOwnProperty].call(state, patchKey);

      if (!patchKeyInState) {
        result[patchKey] = patch[patchKey];
        return result;
      }

      result[patchKey] = assignPatch(state[patchKey], patch[patchKey]);
      return result;
    }, shallowCloneOfPlainObject(state));
  }

  if (_isArray(state) && _isArray(patch)) {
    const result: any[] = [];
    result[_length] = patch[_length];

    for (let i = 0, n = result[_length]; i < n; i++) {
      const indexInState = state[_hasOwnProperty](i);
      const indexInPatch = patch[_hasOwnProperty](i);

      if (!indexInState && !indexInPatch) {
        continue;
      }

      if (indexInState && !indexInPatch) {
        result[i] = state[i];
        continue;
      }

      if (!indexInState && indexInPatch) {
        result[i] = patch[i];
        continue;
      }

      result[i] = assignPatch(state[i], patch[i]);
    }
    return result;
  }

  if (isClassDefinedObject(state) && isObjectLike(patch)) {
    if (patch[_constructor] !== state[_constructor]) {
      return state;
    }

    return patch;
  }

  return patch;
}

assignPatch[_builtinFnId] = _bidFnAssignPatch;

export type AssignPatch = typeof assignPatch;
