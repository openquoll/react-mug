import { isArray, isNonArrayObjectLike } from './mug';
import { r, w } from './rw';

export const check = r(<TState>(state: TState): TState => {
  return state;
});

function mergeDeep(a: any, b: any): any {
  if (isNonArrayObjectLike(a) && isNonArrayObjectLike(b)) {
    const c = { ...a };
    [...Object.getOwnPropertyNames(b), ...Object.getOwnPropertySymbols(b)].forEach((key) => {
      c[key] = mergeDeep(c[key], b[key]);
    });
    return c;
  }

  if (isArray(a) && isArray(b)) {
    const c = [...a];
    b.forEach((value, i) => {
      c[i] = mergeDeep(c[i], value);
    });
  }

  return b;
}

export const swirl = w(<TState>(state: TState, patch: any): TState => {
  return mergeDeep(state, patch);
});
