import {
  _builtinId,
  BuiltinMeta,
  construction,
  isClassDefinedObject,
  isMug,
  isObjectLike,
  isPlainObject,
  ownKeysOfObjectLike,
  shallowCloneOfPlainObject,
  State,
  WriteOpMeta,
} from './mug';
import { r, ReadOpOnSimpleGenericReadFn, w } from './op-mech';
import {
  _assign,
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

const getItFn = <TState>(state: TState): TState => state;

export type GetIt = ReadOpOnSimpleGenericReadFn<typeof getItFn> & BuiltinMeta;

export const getIt = _assign(r(getItFn), { [_builtinId]: 'e0c' }) as GetIt;

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

export type PossiblePatchOnUndefinedible<TMugLike> =
  | State<NonNullable<TMugLike>>
  | undefined
  | typeof none;

export type PossiblePatchOnNullible<TMugLike> = State<NonNullable<TMugLike>> | null;

export type PossiblePatchOnNonNullableOnReadonTuple<TMugLike extends AnyReadonlyTuple> = {
  [TK in keyof TMugLike]: PossiblePatch<TMugLike[TK]> | EmptyItem;
};

export type PossiblePatchOnNonNullableOnReadonlyArray<TMugLike extends AnyReadonlyArray> = {
  [TK in keyof TMugLike]?: State<TMugLike[TK]>;
};

export type PossiblePatchOnNonNullableOnObjectLike<TMugLike extends AnyObjectLike> = {
  [TK in keyof TMugLike]?: PossiblePatch<TMugLike[TK]>;
};

export type PossiblePatchOnNonNullable<TMugLike> = TMugLike extends AnyFunction
  ? TMugLike
  : TMugLike extends { [construction]: infer TConstruction }
    ? PossiblePatch<TConstruction>
    : TMugLike extends AnyReadonlyTuple
      ? PossiblePatchOnNonNullableOnReadonTuple<TMugLike>
      : TMugLike extends AnyReadonlyArray
        ? PossiblePatchOnNonNullableOnReadonlyArray<TMugLike>
        : TMugLike extends AnyObjectLike
          ? PossiblePatchOnNonNullableOnObjectLike<TMugLike>
          : TMugLike;

export type PossiblePatch<TMugLike> = undefined extends TMugLike
  ? PossiblePatchOnUndefinedible<TMugLike>
  : null extends TMugLike
    ? PossiblePatchOnNullible<TMugLike>
    : PossiblePatchOnNonNullable<TMugLike>;

const setItFn = <TState>(state: TState, patch: PossiblePatch<NoInfer<TState>>): TState =>
  mergePatch(state, patch);

export type SetIt = (<TMugLike>(
  mugLike: TMugLike,
  patch: PossiblePatch<NoInfer<TMugLike>>,
) => TMugLike) &
  WriteOpMeta<typeof setItFn> &
  BuiltinMeta;

export const setIt = _assign(w(setItFn), { [_builtinId]: '3fa' }) as SetIt;
