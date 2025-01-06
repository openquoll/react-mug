import { AssignPatch, PossiblePatch } from '../builtin/fns';
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
  _mugLike,
  _readFn,
  _readProc,
  _special,
  _writeFn,
  _writeProc,
  AnyReadProc,
  AnyWriteProc,
  NotOp,
  NotProc,
  PossibleMugLike,
  ReadProcMeta,
  ReadSpecialOpMeta,
  WriteProcMeta,
  WriteSpecialOpMeta,
} from '../mug';
import { AnyFunction, Post0Params } from '../type-utils';

export type ReadSpecialOpOnEmptyParamReadProc<
  TReadProc extends AnyReadProc,
  TState,
> = (() => ReturnType<TReadProc>) &
  ((state: TState) => ReturnType<TReadProc[typeof _readFn]>) &
  ReadSpecialOpMeta<TReadProc, TState>;

export type ReadSpecialOpOnSimpleGenericReadProc<TReadProc extends AnyReadProc, TState0> = ((
  ...args: Post0Params<TReadProc>
) => TState0) &
  (<TState extends TState0>(
    state: TState,
    ...restArgs: Post0Params<TReadProc[typeof _readFn]>
  ) => TState) &
  ReadSpecialOpMeta<TReadProc, TState0>;

export type ReadSpecialOpOnTypicalReadProc<TReadProc extends AnyReadProc, TState> = ((
  ...args: Post0Params<TReadProc>
) => ReturnType<TReadProc>) &
  TReadProc[typeof _readFn] &
  ReadSpecialOpMeta<TReadProc, TState>;

export type ReadSpecialOp<TRead extends AnyFunction, TState> = TRead extends AnyReadProc
  ? TRead[typeof _readFn] extends () => any
    ? ReadSpecialOpOnEmptyParamReadProc<TRead, TState>
    : TRead[typeof _readFn] extends <TState extends never>(
          state: TState,
          ...restArgs: any
        ) => TState
      ? ReadSpecialOpOnSimpleGenericReadProc<TRead, TState>
      : ReadSpecialOpOnTypicalReadProc<TRead, TState>
  : ReadSpecialOp<ReadProc<TRead>, TState>;

export type R<TState> = {
  (): ReadSpecialOp<GetIt, TState>;

  <TReadProc extends AnyFunction & ReadProcMeta<(state: TState, ...restArgs: any) => any>>(
    readProc: TReadProc,
  ): ReadSpecialOp<TReadProc, TState>;

  <TReadFn extends ((state: TState, ...restArgs: any) => any) & NotProc & NotOp>(
    readFn: TReadFn,
  ): ReadSpecialOp<TReadFn, TState>;
};

export type WriteSpecialOpOnEmptyParamWriteProc<
  TWriteProc extends AnyWriteProc,
  TState,
> = (() => void) &
  ((state: TState) => ReturnType<TWriteProc[typeof _writeFn]>) &
  WriteSpecialOpMeta<TWriteProc, TState>;

export type WriteSpecialOpOnSetIt<TState0> = ((patch: PossiblePatch<NoInfer<TState0>>) => void) &
  (<TState extends TState0>(state: TState, patch: PossiblePatch<NoInfer<TState>>) => TState) &
  WriteSpecialOpMeta<SetIt, TState0>;

export type WriteSpecialOpOnSimpleGenericWriteProc<TWriteProc extends AnyWriteProc, TState0> = ((
  ...args: Post0Params<TWriteProc>
) => void) &
  (<TState extends TState0>(
    state: TState,
    ...restArgs: Post0Params<TWriteProc[typeof _writeFn]>
  ) => TState) &
  WriteSpecialOpMeta<TWriteProc, TState0>;

export type WriteSpecialOpOnTypicalWriteProc<TWriteProc extends AnyWriteProc, TState0> = ((
  ...args: Post0Params<TWriteProc>
) => void) &
  TWriteProc[typeof _writeFn] &
  WriteSpecialOpMeta<TWriteProc, TState0>;

export type WriteSpecialOp<TWrite extends AnyFunction, TState> = TWrite extends AnyWriteProc
  ? TWrite[typeof _writeFn] extends () => any
    ? WriteSpecialOpOnEmptyParamWriteProc<TWrite, TState>
    : TWrite[typeof _writeFn] extends AssignPatch
      ? WriteSpecialOpOnSetIt<TState>
      : TWrite[typeof _writeFn] extends <TState extends never>(
            state: TState,
            ...restArgs: any
          ) => TState
        ? WriteSpecialOpOnSimpleGenericWriteProc<TWrite, TState>
        : WriteSpecialOpOnTypicalWriteProc<TWrite, TState>
  : WriteSpecialOp<WriteProc<TWrite>, TState>;

export type W<TState> = {
  (): WriteSpecialOp<SetIt, TState>;

  <TWriteProc extends AnyFunction & WriteProcMeta<(state: TState, ...restArgs: any) => TState>>(
    writeProc: TWriteProc,
  ): WriteSpecialOp<TWriteProc, TState>;

  <TWriteFn extends ((state: TState, ...restArgs: any) => TState) & NotProc & NotOp>(
    writeFn: TWriteFn,
  ): WriteSpecialOp<TWriteFn, TState>;
};

export type SpecialOpToolbeltFormat<TR, TW> = [r: TR, w: TW] & { r: TR; w: TW };

export type SpecialOpToolbelt<TState> = SpecialOpToolbeltFormat<R<TState>, W<TState>>;

export function upon<TState>(mugLike: PossibleMugLike<NoInfer<TState>>): SpecialOpToolbelt<TState>;
export function upon(mugLike: any): any {
  function r(read: (mugLike: any, ...restArgs: any) => any = getIt) {
    const readProc = procR(read);
    const readFn = readProc[_readFn];
    const readSpecialOp = (...args: [any, ...any]) => {
      if (args.length < readFn.length) {
        return readProc(mugLike, ...args);
      } else {
        return readFn(...args);
      }
    };
    readSpecialOp[_readProc] = readProc;
    readSpecialOp[_special] = _special;
    readSpecialOp[_mugLike] = mugLike;
    return readSpecialOp;
  }

  function w(write: (mugLike: any, ...restArgs: any) => any = setIt) {
    const writeProc = procW(write);
    const writeFn = writeProc[_writeFn];
    const writeSpecialOp = (...args: [any, ...any]) => {
      if (args.length < writeFn.length) {
        writeProc(mugLike, ...args);
      } else {
        return writeFn(...args);
      }
    };
    writeSpecialOp[_writeProc] = writeProc;
    writeSpecialOp[_special] = _special;
    writeSpecialOp[_mugLike] = mugLike;
    return writeSpecialOp;
  }

  const toolbelt: any = [r, w];
  toolbelt.r = r;
  toolbelt.w = w;
  return toolbelt;
}
