import {
  CleanMug,
  isClassDefinedObject,
  isMug,
  isObjectLike,
  isPlainObject,
  ownKeysOfObjectLike,
  shallowCloneOfPlainObject,
  State,
} from '../mug';
import {
  _constructor,
  _hasOwnProperty,
  _is,
  _isArray,
  _length,
  _reduce,
  _undefined,
} from '../shortcuts';
import {
  AnyFunction,
  AnyObjectLike,
  AnyReadonlyArray,
  AnyReadonlyTuple,
  EmptyItem,
} from '../type-utils';
import { _bidFnAssignPatch, _builtinId } from './ids';

export function passThrough<TState>(state: TState): TState {
  return state;
}

export type PassThrough = typeof passThrough;

export const none = Symbol();

/**
 * Undefinedive means the type can be undefined.
 * In comparison, Nullable means the type can be undefined or null.
 **/
export type PossiblePatchOnUndefinedive<TMugLike> =
  | State<NonNullable<TMugLike>>
  | undefined
  | typeof none;

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

export type PossiblePatchOnNonNullableOnObjectLike<TMugLike extends AnyObjectLike> = {
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
        : TMugLike extends AnyObjectLike
          ? PossiblePatchOnNonNullableOnObjectLike<TMugLike>
          : TMugLike;

export type PossiblePatch<TMugLike> = undefined extends TMugLike
  ? PossiblePatchOnUndefinedive<TMugLike>
  : null extends TMugLike
    ? PossiblePatchOnNullive<TMugLike>
    : PossiblePatchOnNonNullable<TMugLike>;

export function assignPatch<TState>(state: TState, patch: PossiblePatch<NoInfer<TState>>): TState;
export function assignPatch(state: any, patch: any): any {
  if (isMug(patch)) {
    return state;
  }

  if (patch === _undefined) {
    return state;
  }

  if (patch === none) {
    return _undefined;
  }

  if (_is(state, patch)) {
    return state;
  }

  if (isPlainObject(state) && isPlainObject(patch)) {
    return ownKeysOfObjectLike(patch)[_reduce]((result, patchKey) => {
      const patchKeyInState = state[_hasOwnProperty](patchKey);

      if (!patchKeyInState) {
        if (isMug(patch[patchKey])) {
          return result;
        }

        if (patch[patchKey] === _undefined) {
          return result;
        }

        if (patch[patchKey] === none) {
          result[patchKey] = _undefined;
          return result;
        }

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
        if (isMug(patch[i])) {
          continue;
        }

        if (patch[i] === _undefined) {
          continue;
        }

        if (patch[i] === none) {
          result[i] = _undefined;
          continue;
        }

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

assignPatch[_builtinId] = _bidFnAssignPatch;

export type AssignPatch = typeof assignPatch;
