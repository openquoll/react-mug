import { MugLikeOf } from '../mug';

export function r<TState, TValue>(
  stateReader: (state: TState) => TValue,
): (mugLike: MugLikeOf<TState>) => TValue {
  return 0 as never;
}
