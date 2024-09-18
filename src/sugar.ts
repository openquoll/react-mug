import { check, PossiblePatch, swirl } from './builtin-ops';
import { PossibleMugLike, State } from './mug';
import { r, w } from './rw';
import { AnyFunction, Post0Params } from './type-utils';

export const internalOp = Symbol();

export const internalMugLike = Symbol();

export type WriteAction<TMugLike, TWriteFn extends AnyFunction> = {
  (...args: Post0Params<TWriteFn>): TMugLike;
  readonly [internalOp]: <TFlatMugLike extends PossibleMugLike<TMugLike>>(
    mugLike: TFlatMugLike,
    ...restArgs: Post0Params<TWriteFn>
  ) => TFlatMugLike;
  readonly [internalMugLike]: TMugLike;
};

export type ReadAction<TMugLike, TReadFn extends AnyFunction> = {
  (...args: Post0Params<TReadFn>): ReturnType<TReadFn>;
  readonly [internalOp]: (
    mugLike: PossibleMugLike<TMugLike>,
    ...restArgs: Post0Params<TReadFn>
  ) => ReturnType<TReadFn>;
  readonly [internalMugLike]: TMugLike;
};

export type SwirlAction<TMugLike> = {
  (patch: PossiblePatch<NoInfer<TMugLike>>): TMugLike;
  readonly [internalOp]: <TOpMugLike extends PossibleMugLike<TMugLike>>(
    mugLike: TOpMugLike,
    patch: PossiblePatch<NoInfer<TOpMugLike>>,
  ) => TOpMugLike;
  readonly [internalMugLike]: TMugLike;
};

export type CheckAction<TMugLike> = {
  (): State<TMugLike>;
  readonly [internalOp]: <TOpMugLike extends PossibleMugLike<TMugLike>>(
    mugLike: TOpMugLike,
  ) => State<TOpMugLike>;
  readonly [internalMugLike]: TMugLike;
};

type ImperativeToolbeltFormat<TW, TR, TSwirl, TCheck> = readonly [
  w: TW,
  r: TR,
  swirl: TSwirl,
  check: TCheck,
] &
  Readonly<{ w: TW; r: TR; swirl: TSwirl; check: TCheck }>;

export type ImperativeToolbelt<TMugLike> = ImperativeToolbeltFormat<
  <TWriteFn extends (state: State<TMugLike>, ...restArgs: any) => State<TMugLike>>(
    writeFn: TWriteFn,
  ) => WriteAction<TMugLike, TWriteFn>,
  <TReadFn extends (state: State<TMugLike>, ...restArgs: any) => any>(
    readFn: TReadFn,
  ) => ReadAction<TMugLike, TReadFn>,
  SwirlAction<TMugLike>,
  CheckAction<TMugLike>
>;

export function upon<TMugLike>(mugLike: TMugLike): ImperativeToolbelt<TMugLike>;
export function upon(mugLike: any): any {
  function _w(writeFn: (state: any, ...restArgs: any) => any) {
    const writeOp = w(writeFn);
    const writeAction = (...args: any): any => writeOp(mugLike, ...args);
    writeAction[internalOp] = writeOp;
    writeAction[internalMugLike] = mugLike;
    return writeAction;
  }

  function _r(readFn: (state: any, ...restArgs: any) => any) {
    const readOp = r(readFn);
    const readAction = (...args: any): any => readOp(mugLike, ...args);
    readAction[internalOp] = readOp;
    readAction[internalMugLike] = mugLike;
    return readAction;
  }

  let _swirl = (patch: any) => swirl(mugLike, patch);
  _swirl[internalOp] = swirl;
  _swirl[internalMugLike] = mugLike;

  let _check = () => check(mugLike);
  _check[internalOp] = check;
  _check[internalMugLike] = mugLike;

  const output: any = [_w, _r, _swirl, _check];
  output.w = _w;
  output.r = _r;
  output.swirl = _swirl;
  output.check = _check;
  return output;
}

export function flat<TOp>(action: { [internalOp]: TOp }): TOp {
  return action[internalOp];
}
