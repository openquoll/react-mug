import { AssignPatch, DoNothing, doNothing, PossiblePatch } from '../builtin';
import {
  GetIt,
  getIt,
  r as procR,
  w as procW,
  ReadProc,
  SetIt,
  setIt,
  WriteProc,
} from '../mechanism';
import {
  _general,
  _readFn,
  _readProc,
  _writeFn,
  _writeProc,
  AnyReadProc,
  AnyWriteProc,
  NotOp,
  NotProc,
  PossibleMugLike,
  ReadGeneralOpMeta,
  ReadProcMeta,
  State,
  WriteGeneralOpMeta,
  WriteProcMeta,
} from '../mug';
import { AnyFunction, Post0Params } from '../type-utils';

export type ReadGeneralOpOnEmptyParamReadProc<TReadProc extends AnyReadProc, TState> = ((
  mugLike?: PossibleMugLike<TState>,
) => ReturnType<TReadProc>) &
  ReadGeneralOpMeta<TReadProc, TState>;

export type ReadGeneralOpOnSimpleGenericReadProc<TReadProc extends AnyReadProc, TState> = (<
  TMugLike extends PossibleMugLike<TState>,
>(
  mugLike: TMugLike,
  ...restArgs: Post0Params<TReadProc>
) => State<TMugLike>) &
  ReadGeneralOpMeta<TReadProc, TState>;

export type ReadGeneralOpOnTypicalReadProc<TReadProc extends AnyReadProc, TState> = ((
  mugLike: PossibleMugLike<TState>,
  ...restArgs: Post0Params<TReadProc>
) => ReturnType<TReadProc>) &
  ReadGeneralOpMeta<TReadProc, TState>;

export type ReadGeneralOp<TRead extends AnyFunction, TState> = TRead extends AnyReadProc
  ? TRead[typeof _readFn] extends () => any
    ? ReadGeneralOpOnEmptyParamReadProc<TRead, TState>
    : TRead[typeof _readFn] extends <TState extends never>(
          state: TState,
          ...restArgs: any
        ) => TState
      ? ReadGeneralOpOnSimpleGenericReadProc<TRead, TState>
      : ReadGeneralOpOnTypicalReadProc<TRead, TState>
  : ReadGeneralOp<ReadProc<TRead>, TState>;

export type R<TState> = {
  (): ReadGeneralOp<GetIt, TState>;

  <TReadProc extends AnyFunction & ReadProcMeta<(state: TState, ...restArgs: any) => any>>(
    readProc: TReadProc,
  ): ReadGeneralOp<TReadProc, TState>;

  <TReadFn extends ((state: TState, ...restArgs: any) => any) & NotProc & NotOp>(
    readFn: TReadFn,
  ): ReadGeneralOp<TReadFn, TState>;
};

export type WriteGeneralOpOnEmptyParamWriteProc<TWriteProc extends AnyWriteProc, TState> = (<
  TMugLike extends PossibleMugLike<TState>,
>(
  mugLike?: TMugLike,
) => TMugLike) &
  WriteGeneralOpMeta<TWriteProc, TState>;

export type WriteGeneralOpOnSetIt<TState> = (<TMugLike extends PossibleMugLike<TState>>(
  mugLike: TMugLike,
  patch: PossiblePatch<NoInfer<TMugLike>>,
) => TMugLike) &
  WriteGeneralOpMeta<SetIt, TState>;

export type WriteGeneralOpOnTypicalWriteProc<TWriteProc extends AnyWriteProc, TState> = (<
  TMugLike extends PossibleMugLike<TState>,
>(
  mugLike: TMugLike,
  ...restArgs: Post0Params<TWriteProc>
) => TMugLike) &
  WriteGeneralOpMeta<TWriteProc, TState>;

export type WriteGeneralOp<TWrite extends AnyFunction, TState> = TWrite extends AnyWriteProc
  ? TWrite[typeof _writeFn] extends () => any
    ? WriteGeneralOpOnEmptyParamWriteProc<TWrite, TState>
    : TWrite[typeof _writeFn] extends AssignPatch
      ? WriteGeneralOpOnSetIt<TState>
      : WriteGeneralOpOnTypicalWriteProc<TWrite, TState>
  : WriteGeneralOp<WriteProc<TWrite>, TState>;

export type W<TState> = {
  (): WriteGeneralOp<SetIt, TState>;

  <TWriteProc extends AnyFunction & WriteProcMeta<(state: TState, ...restArgs: any) => TState>>(
    writeProc: TWriteProc,
  ): WriteGeneralOp<TWriteProc, TState>;

  <TWriteFn extends ((state: TState, ...restArgs: any) => TState) & NotProc & NotOp>(
    writeFn: TWriteFn,
  ): WriteGeneralOp<TWriteFn, TState>;
};

export type X<TState> = {
  (): DoNothing;

  <TExecOp extends (mugLike: PossibleMugLike<TState>, ...restArgs: any) => any>(
    execOp: TExecOp,
  ): TExecOp;
};

export type GeneralOpToolbeltFormat<TR, TW, TX> = [r: TR, w: TW, x: TX] & { r: TR; w: TW; x: TX };

export type GeneralOpToolbelt<TState> = GeneralOpToolbeltFormat<R<TState>, W<TState>, X<TState>>;

export function onto<TState>(): GeneralOpToolbelt<TState>;
export function onto(): any {
  function r(read: AnyFunction = getIt) {
    const readProc = procR(read);
    const readGeneralOp = (...args: any) => readProc(...args);
    readGeneralOp[_readProc] = readProc;
    readGeneralOp[_general] = _general;
    return readGeneralOp;
  }

  function w(write: AnyFunction = setIt) {
    const writeProc = procW(write);
    const writeGeneralOp = (...args: any) => writeProc(...args);
    writeGeneralOp[_writeProc] = writeProc;
    writeGeneralOp[_general] = _general;
    return writeGeneralOp;
  }

  function x(execOp: AnyFunction = doNothing) {
    return execOp;
  }

  const toolbelt: any = [r, w, x];
  toolbelt.r = r;
  toolbelt.w = w;
  toolbelt.x = x;
  return toolbelt;
}
