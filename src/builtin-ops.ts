import { isArray, isPlainObject, ownKeysOfObjectLike, shallowCloneOfPlainObject } from './mug';
import { r, w } from './rw';

export const check = r(<TState>(state: TState): TState => {
  return state;
});

function applyPatch(state: any, patch: any): any {
  if (Object.is(state, patch)) {
    return state;
  }

  if (isPlainObject(state) && isPlainObject(patch)) {
    return ownKeysOfObjectLike(patch).reduce((result, patchKey) => {
      const patchKeyInState = state.hasOwnProperty(patchKey);

      if (!patchKeyInState) {
        result[patchKey] = patch[patchKey];
        return result;
      }

      result[patchKey] = applyPatch(state[patchKey], patch[patchKey]);
      return result;
    }, shallowCloneOfPlainObject(state));
  }

  if (isArray(state) && isArray(patch)) {
    const result: any[] = [];
    result.length = patch.length;

    for (let i = 0, n = result.length; i < n; i++) {
      const indexInState = i in state;
      const indexInPatch = i in patch;

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

      result[i] = applyPatch(state[i], patch[i]);
    }
    return result;
  }

  return patch;
}

export const swirl = w((state: any, patch: any): any => {
  return applyPatch(state, patch);
});
