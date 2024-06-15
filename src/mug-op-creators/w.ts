import { MugLikeOf } from '../mug';

export function w<TState>(
  stateWriter: (state: TState, ...restArgs: any) => TState,
): <TInOut = MugLikeOf<TState>>(
  state: MugLikeOf<TState>,
  ...restArgs: any
) => TInOut {
  return 0 as never;
}
