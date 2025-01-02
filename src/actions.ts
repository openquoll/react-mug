import { AssignPatch, PossiblePatch } from './builtin/fns';
import { GetIt, getIt, r, ReadProc, SetIt, setIt, w, WriteProc } from './mechanism';
import {
  _mugLike,
  _readFn,
  _readProc,
  _writeFn,
  _writeProc,
  AnyReadProc,
  AnyWriteProc,
  NotAction,
  NotProc,
  ReadActionMeta,
  ReadProcMeta,
  State,
  WriteActionMeta,
  WriteProcMeta,
} from './mug';
import { AnyFunction, Post0Params } from './type-utils';

export type ReadActionOnEmptyParamReadProc<
  TReadProc extends AnyReadProc,
  TMugLike,
> = (() => ReturnType<TReadProc>) & ReadActionMeta<TReadProc, TMugLike>;

export type ReadActionOnSimpleGenericReadProc<TReadProc extends AnyReadProc, TMugLike> = ((
  ...args: Post0Params<TReadProc>
) => State<TMugLike>) &
  ReadActionMeta<TReadProc, TMugLike>;

export type ReadActionOnTypicalReadProc<TReadProc extends AnyReadProc, TMugLike> = ((
  ...args: Post0Params<TReadProc>
) => ReturnType<TReadProc>) &
  ReadActionMeta<TReadProc, TMugLike>;

export type ReadAction<
  TRead extends AnyFunction = GetIt,
  TMugLike = any,
> = TRead extends AnyReadProc
  ? TRead[typeof _readFn] extends () => any
    ? ReadActionOnEmptyParamReadProc<TRead, TMugLike>
    : TRead[typeof _readFn] extends <TState extends never>(
          state: TState,
          ...restArgs: any
        ) => TState
      ? ReadActionOnSimpleGenericReadProc<TRead, TMugLike>
      : ReadActionOnTypicalReadProc<TRead, TMugLike>
  : ReadAction<ReadProc<TRead>, TMugLike>;

export type R<TMugLike> = {
  (): ReadAction<GetIt, TMugLike>;

  <TReadProc extends AnyFunction & ReadProcMeta<(state: State<TMugLike>, ...restArgs: any) => any>>(
    readProc: TReadProc,
  ): ReadAction<TReadProc, TMugLike>;

  <TReadFn extends ((state: State<TMugLike>, ...restArgs: any) => any) & NotProc & NotAction>(
    readFn: TReadFn,
  ): ReadAction<TReadFn, TMugLike>;
};

export type WriteActionOnEmptyParamWriteProc<
  TWriteProc extends AnyWriteProc,
  TMugLike,
> = (() => void) & WriteActionMeta<TWriteProc, TMugLike>;

export type WriteActionOnSetIt<TMugLike> = ((patch: PossiblePatch<TMugLike>) => void) &
  WriteActionMeta<SetIt, TMugLike>;

export type WriteActionOnTypicalWriteProc<TWriteProc extends AnyWriteProc, TMugLike> = ((
  ...args: Post0Params<TWriteProc>
) => void) &
  WriteActionMeta<TWriteProc, TMugLike>;

export type WriteAction<
  TWrite extends AnyFunction = SetIt,
  TMugLike = any,
> = TWrite extends AnyWriteProc
  ? TWrite[typeof _writeFn] extends () => any
    ? WriteActionOnEmptyParamWriteProc<TWrite, TMugLike>
    : TWrite[typeof _writeFn] extends AssignPatch
      ? WriteActionOnSetIt<TMugLike>
      : WriteActionOnTypicalWriteProc<TWrite, TMugLike>
  : WriteAction<WriteProc<TWrite>, TMugLike>;

export type W<TMugLike> = {
  (): WriteAction<SetIt, TMugLike>;

  <
    TWriteProc extends AnyFunction &
      WriteProcMeta<(state: State<TMugLike>, ...restArgs: any) => State<TMugLike>>,
  >(
    writeProc: TWriteProc,
  ): WriteAction<TWriteProc, TMugLike>;

  <
    TWriteFn extends ((state: State<TMugLike>, ...restArgs: any) => State<TMugLike>) &
      NotProc &
      NotAction,
  >(
    writeFn: TWriteFn,
  ): WriteAction<TWriteFn, TMugLike>;
};

export type ActionToolbeltFormat<TR, TW> = [r: TR, w: TW] & { r: TR; w: TW };

export type ActionToolbelt<TMugLike> = ActionToolbeltFormat<R<TMugLike>, W<TMugLike>>;

export function upon<TMugLike>(mugLike: TMugLike): ActionToolbelt<TMugLike>;
export function upon(mugLike: any): any {
  function _r(read: (mugLike: any, ...restArgs: any) => any = getIt) {
    const readProc = r(read);
    const readAction = (...args: any) => readProc(mugLike, ...args);
    readAction[_readProc] = readProc;
    readAction[_mugLike] = mugLike;
    return readAction;
  }

  function _w(write: (mugLike: any, ...restArgs: any) => any = setIt) {
    const writeProc = w(write);
    const writeAction = (...args: any) => {
      writeProc(mugLike, ...args);
    };
    writeAction[_writeProc] = writeProc;
    writeAction[_mugLike] = mugLike;
    return writeAction;
  }

  const toolbelt: any = [_r, _w];
  toolbelt.r = _r;
  toolbelt.w = _w;
  return toolbelt;
}
