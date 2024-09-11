import {
  AnyMug,
  isClassDefinedObject,
  isMug,
  isObjectLike,
  isPlainObject,
  ownKeysOfObjectLike,
  shallowCloneOfPlainObject,
  State,
} from './mug';
import { r, w } from './rw';
import { _constructor, _hasOwnProperty, _is, _isArray, _length, _reduce } from './shortcuts';
import {
  AnyFunction,
  AnyObjectLike,
  AnyReadonlyArray,
  AnyReadonlyTuple,
  EmptyItem,
} from './type-utils';

export const check = r(<TState>(state: TState): TState => state);

export const nil = Symbol();

function mergePatch(state: any, patch: any): any {
  if (isMug(patch)) {
    return state;
  }

  if (patch === nil) {
    return undefined;
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

        if (patch[patchKey] === nil) {
          return result;
        }

        result[patchKey] = patch[patchKey];
        return result;
      }

      if (patch[patchKey] === nil) {
        delete result[patchKey];
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

        if (patch[i] === nil) {
          continue;
        }

        result[i] = patch[i];
        continue;
      }

      if (patch[i] === nil) {
        delete result[i];
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

export type PossibleStatePatch<TState> = undefined extends TState
  ? TState | typeof nil
  : null extends TState
    ? TState
    : TState extends AnyFunction
      ? TState
      : TState extends AnyMug
        ? never
        : TState extends AnyReadonlyTuple
          ? { [TK in keyof TState]: PossibleStatePatch<TState[TK]> | EmptyItem }
          : TState extends AnyReadonlyArray
            ? { [TK in keyof TState]: TState[TK] | EmptyItem }
            : TState extends AnyObjectLike
              ? { [TK in keyof TState]?: PossibleStatePatch<TState[TK]> }
              : TState;

export const swirl = w(
  <TState>(state: TState, statePatch: PossibleStatePatch<TState>): TState =>
    mergePatch(state, statePatch),
) as <TMugLike, TPatch extends PossibleStatePatch<State<TMugLike>>>(
  mugLike: TMugLike,
  patch: TPatch,
) => TMugLike;
