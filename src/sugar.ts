import { check, PossiblePatch, swirl } from './builtin-ops';
import { PossibleMugLike, State } from './mug';
import { r, w } from './rw';
import { Post0Params } from './type-utils';

export const flatOp = Symbol();

type UponOutput<TW, TR, TSwirl, TCheck> = [w: TW, r: TR, swirl: TSwirl, check: TCheck] & {
  w: TW;
  r: TR;
  swirl: TSwirl;
  check: TCheck;
};

export function upon<TMugLike>(mugLike: TMugLike): UponOutput<
  <TWriteFn extends (state: State<TMugLike>, ...restArgs: any) => State<TMugLike>>(
    writeFn: TWriteFn,
  ) => {
    (...args: Post0Params<TWriteFn>): TMugLike;
    [flatOp]<TFlatMugLike extends PossibleMugLike<TMugLike>>(
      mugLike: TFlatMugLike,
      ...restArgs: Post0Params<TWriteFn>
    ): TFlatMugLike;
  },
  <TReadFn extends (state: State<TMugLike>, ...restArgs: any) => any>(
    readFn: TReadFn,
  ) => {
    (...args: Post0Params<TReadFn>): ReturnType<TReadFn>;
    [flatOp](
      mugLike: PossibleMugLike<TMugLike>,
      ...restArgs: Post0Params<TReadFn>
    ): ReturnType<TReadFn>;
  },
  {
    (patch: PossiblePatch<NoInfer<TMugLike>>): TMugLike;
    [flatOp]<TFlatMugLike extends PossibleMugLike<TMugLike>>(
      mugLike: TFlatMugLike,
      patch: PossiblePatch<NoInfer<TMugLike>>,
    ): TFlatMugLike;
  },
  {
    (): State<TMugLike>;
    [flatOp](mugLike: PossibleMugLike<TMugLike>): State<TMugLike>;
  }
>;
export function upon(mugLike: any): any {
  function _w(writeFn: (state: any, ...restArgs: any) => any) {
    const writeOp = w(writeFn);
    const writeAction = (...args: any): any => writeOp(mugLike, ...args);
    writeAction[flatOp] = writeOp;
    return writeAction;
  }

  function _r(readFn: (state: any, ...restArgs: any) => any) {
    const readOp = r(readFn);
    const readAction = (...args: any): any => readOp(mugLike, ...args);
    readAction[flatOp] = readOp;
    return readAction;
  }

  function _swirl(patch: any) {
    return swirl(mugLike, patch);
  }
  _swirl[flatOp] = swirl;

  const _check = () => check(mugLike);

  const output: any = [_w, _r, _swirl, _check];
  output.w = _w;
  output.r = _r;
  output.swirl = _swirl;
  output.check = _check;
  return output;
}

export function flat<TFlatOp>(action: { [flatOp]: TFlatOp }): TFlatOp {
  return action[flatOp];
}
