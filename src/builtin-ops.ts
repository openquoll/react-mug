import { isArray, isNonArrayObjectLike, ownKeysOfObjectLike } from './mug';
import { r, w } from './rw';

export const check = r(<TState>(state: TState): TState => {
  return state;
});

function mergeDeeply(a: any, b: any): any {
  if (Object.is(a, b)) {
    return a;
  }

  if (isNonArrayObjectLike(a) && isNonArrayObjectLike(b)) {
    const c = { ...a };
    ownKeysOfObjectLike(b).forEach((key) => {
      c[key] = mergeDeeply(c[key], b[key]);
    });
    return c;
  }

  return b;
}

export const swirl = w(<TState>(state: TState, patch: any): TState => {
  return mergeDeeply(state, patch);
});
