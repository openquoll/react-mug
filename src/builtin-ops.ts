import {
  construction,
  isClassDefinedObject,
  isMug,
  isObjectLike,
  isPlainObject,
  ownKeysOfObjectLike,
  shallowCloneOfPlainObject,
  State,
} from './mug';
import { r, w } from './rw';
import {
  _constructor,
  _hasOwnProperty,
  _is,
  _isArray,
  _length,
  _reduce,
  _undefined,
} from './shortcuts';
import {
  AnyFunction,
  AnyObjectLike,
  AnyReadonlyArray,
  AnyReadonlyTuple,
  EmptyItem,
} from './type-utils';

export const check = r(<TState>(state: TState): TState => state);

export const none = Symbol();

function mergePatch(state: any, patch: any): any {
  if (isMug(patch)) {
    return state;
  }

  if (patch === none) {
    return _undefined;
  }

  if (patch === _undefined) {
    return state;
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

        if (patch[patchKey] === none) {
          result[patchKey] = _undefined;
          return result;
        }

        result[patchKey] = patch[patchKey];
        return result;
      }

      result[patchKey] = mergePatch(state[patchKey], patch[patchKey]);
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

        if (patch[i] === none) {
          result[i] = _undefined;
          continue;
        }

        result[i] = patch[i];
        continue;
      }

      result[i] = mergePatch(state[i], patch[i]);
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

type PossiblePatchOfNonNullable<TMugLike> = TMugLike extends AnyFunction
  ? TMugLike
  : TMugLike extends { [construction]: infer TConstruction }
    ? PossiblePatch<TConstruction>
    : TMugLike extends AnyReadonlyTuple
      ? { [TK in keyof TMugLike]: PossiblePatch<TMugLike[TK]> | EmptyItem }
      : TMugLike extends AnyReadonlyArray
        ? { [TK in keyof TMugLike]?: State<TMugLike[TK]> }
        : TMugLike extends AnyObjectLike
          ? { [TK in keyof TMugLike]?: PossiblePatch<TMugLike[TK]> }
          : TMugLike;

export type PossiblePatch<TMugLike> = undefined extends TMugLike
  ? State<NonNullable<TMugLike>> | undefined | typeof none
  : null extends TMugLike
    ? State<NonNullable<TMugLike>> | null
    : PossiblePatchOfNonNullable<TMugLike>;

type Swirl = <TMugLike>(mugLike: TMugLike, patch: PossiblePatch<NoInfer<TMugLike>>) => TMugLike;

export const swirl = w((state: any, patch: any) => mergePatch(state, patch)) as Swirl;
