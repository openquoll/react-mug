import { AssignPatch, PossiblePatch } from '../builtin/fns';
import { GetIt, getIt, r, ReadProc, SetIt, setIt, w, WriteProc } from '../mechanism';
import {
  _mugLike,
  _readFn,
  _readProc,
  _writeFn,
  _writeProc,
  AnyReadProc,
  AnyWriteProc,
  NotProc,
  NotSpecialOp,
  ReadProcMeta,
  ReadSpecialOpMeta,
  State,
  WriteProcMeta,
  WriteSpecialOpMeta,
} from '../mug';
import { AnyFunction, Post0Params } from '../type-utils';

export type ReadSpecialOpOnEmptyParamReadProc<
  TReadProc extends AnyReadProc,
  TMugLike,
> = (() => ReturnType<TReadProc>) & ReadSpecialOpMeta<TReadProc, TMugLike>;

export type ReadSpecialOpOnSimpleGenericReadProc<TReadProc extends AnyReadProc, TMugLike> = ((
  ...args: Post0Params<TReadProc>
) => State<TMugLike>) &
  ReadSpecialOpMeta<TReadProc, TMugLike>;

export type ReadSpecialOpOnTypicalReadProc<TReadProc extends AnyReadProc, TMugLike> = ((
  ...args: Post0Params<TReadProc>
) => ReturnType<TReadProc>) &
  ReadSpecialOpMeta<TReadProc, TMugLike>;

export type ReadSpecialOp<
  TRead extends AnyFunction = GetIt,
  TMugLike = any,
> = TRead extends AnyReadProc
  ? TRead[typeof _readFn] extends () => any
    ? ReadSpecialOpOnEmptyParamReadProc<TRead, TMugLike>
    : TRead[typeof _readFn] extends <TState extends never>(
          state: TState,
          ...restArgs: any
        ) => TState
      ? ReadSpecialOpOnSimpleGenericReadProc<TRead, TMugLike>
      : ReadSpecialOpOnTypicalReadProc<TRead, TMugLike>
  : ReadSpecialOp<ReadProc<TRead>, TMugLike>;

export type R<TMugLike> = {
  (): ReadSpecialOp<GetIt, TMugLike>;

  <TReadProc extends AnyFunction & ReadProcMeta<(state: State<TMugLike>, ...restArgs: any) => any>>(
    readProc: TReadProc,
  ): ReadSpecialOp<TReadProc, TMugLike>;

  <TReadFn extends ((state: State<TMugLike>, ...restArgs: any) => any) & NotProc & NotSpecialOp>(
    readFn: TReadFn,
  ): ReadSpecialOp<TReadFn, TMugLike>;
};

export type WriteSpecialOpOnEmptyParamWriteProc<
  TWriteProc extends AnyWriteProc,
  TMugLike,
> = (() => void) & WriteSpecialOpMeta<TWriteProc, TMugLike>;

export type WriteSpecialOpOnSetIt<TMugLike> = ((patch: PossiblePatch<TMugLike>) => void) &
  WriteSpecialOpMeta<SetIt, TMugLike>;

export type WriteSpecialOpOnTypicalWriteProc<TWriteProc extends AnyWriteProc, TMugLike> = ((
  ...args: Post0Params<TWriteProc>
) => void) &
  WriteSpecialOpMeta<TWriteProc, TMugLike>;

export type WriteSpecialOp<
  TWrite extends AnyFunction = SetIt,
  TMugLike = any,
> = TWrite extends AnyWriteProc
  ? TWrite[typeof _writeFn] extends () => any
    ? WriteSpecialOpOnEmptyParamWriteProc<TWrite, TMugLike>
    : TWrite[typeof _writeFn] extends AssignPatch
      ? WriteSpecialOpOnSetIt<TMugLike>
      : WriteSpecialOpOnTypicalWriteProc<TWrite, TMugLike>
  : WriteSpecialOp<WriteProc<TWrite>, TMugLike>;

export type W<TMugLike> = {
  (): WriteSpecialOp<SetIt, TMugLike>;

  <
    TWriteProc extends AnyFunction &
      WriteProcMeta<(state: State<TMugLike>, ...restArgs: any) => State<TMugLike>>,
  >(
    writeProc: TWriteProc,
  ): WriteSpecialOp<TWriteProc, TMugLike>;

  <
    TWriteFn extends ((state: State<TMugLike>, ...restArgs: any) => State<TMugLike>) &
      NotProc &
      NotSpecialOp,
  >(
    writeFn: TWriteFn,
  ): WriteSpecialOp<TWriteFn, TMugLike>;
};

export type SpecialOpToolbeltFormat<TR, TW> = [r: TR, w: TW] & { r: TR; w: TW };

export type SpecialOpToolbelt<TMugLike> = SpecialOpToolbeltFormat<R<TMugLike>, W<TMugLike>>;

export function upon<TMugLike>(mugLike: TMugLike): SpecialOpToolbelt<TMugLike>;
export function upon(mugLike: any): any {
  function _r(read: (mugLike: any, ...restArgs: any) => any = getIt) {
    const readProc = r(read);
    const readSpecialOp = (...args: any) => readProc(mugLike, ...args);
    readSpecialOp[_readProc] = readProc;
    readSpecialOp[_mugLike] = mugLike;
    return readSpecialOp;
  }

  function _w(write: (mugLike: any, ...restArgs: any) => any = setIt) {
    const writeProc = w(write);
    const writeSpecialOp = (...args: any) => {
      writeProc(mugLike, ...args);
    };
    writeSpecialOp[_writeProc] = writeProc;
    writeSpecialOp[_mugLike] = mugLike;
    return writeSpecialOp;
  }

  const toolbelt: any = [_r, _w];
  toolbelt.r = _r;
  toolbelt.w = _w;
  return toolbelt;
}
