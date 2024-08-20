import {
  isArray,
  isClassDefinedObject,
  isMug,
  isObjectLike,
  isPlainObject,
  ownKeysOfObjectLike,
  shallowCloneOfPlainObject,
} from './mug';
import { r, w } from './rw';

export const check = r(<TState>(state: TState): TState => {
  return state;
});

function mergePatch(state: any, patch: any): any {
  if (isMug(patch)) {
    return state;
  }

  if (Object.is(state, patch)) {
    return state;
  }

  if (isPlainObject(state) && isPlainObject(patch)) {
    return ownKeysOfObjectLike(patch).reduce((result, patchKey) => {
      const patchKeyInState = state.hasOwnProperty(patchKey);

      if (!patchKeyInState) {
        if (isMug(patch[patchKey])) {
          return result;
        }
        result[patchKey] = patch[patchKey];
        return result;
      }

      result[patchKey] = mergePatch(state[patchKey], patch[patchKey]);
      return result;
    }, shallowCloneOfPlainObject(state));
  }

  if (isArray(state) && isArray(patch)) {
    const result: any[] = [];
    result.length = patch.length;

    for (let i = 0, n = result.length; i < n; i++) {
      const indexInState = state.hasOwnProperty(i);
      const indexInPatch = patch.hasOwnProperty(i);

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
        result[i] = patch[i];
        continue;
      }

      result[i] = mergePatch(state[i], patch[i]);
    }
    return result;
  }

  if (isClassDefinedObject(state) && isObjectLike(patch)) {
    if (patch.constructor !== state.constructor) {
      return state;
    }

    return patch;
  }

  return patch;
}

export const swirl = w((state: any, patch: any): any => {
  return mergePatch(state, patch);
});
