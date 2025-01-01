import { AssignPatch, PossiblePatch } from './builtin/fns';
import {
  _mugLike,
  _readFn,
  _readOp,
  _writeFn,
  _writeOp,
  AnyReadOp,
  AnyWriteOp,
  NotAction,
  NotOp,
  ReadActionMeta,
  ReadOpMeta,
  State,
  WriteActionMeta,
  WriteOpMeta,
} from './mug';
import { GetIt, getIt, r, ReadOp, SetIt, setIt, w, WriteOp } from './op-mech';
import { AnyFunction, Post0Params } from './type-utils';

export type ReadActionOnEmptyParamReadOp<
  TReadOp extends AnyReadOp,
  TMugLike,
> = (() => ReturnType<TReadOp>) & ReadActionMeta<TReadOp, TMugLike>;

export type ReadActionOnSimpleGenericReadOp<TReadOp extends AnyReadOp, TMugLike> = ((
  ...args: Post0Params<TReadOp>
) => State<TMugLike>) &
  ReadActionMeta<TReadOp, TMugLike>;

export type ReadActionOnTypicalReadOp<TReadOp extends AnyReadOp, TMugLike> = ((
  ...args: Post0Params<TReadOp>
) => ReturnType<TReadOp>) &
  ReadActionMeta<TReadOp, TMugLike>;

export type ReadAction<TRead extends AnyFunction = GetIt, TMugLike = any> = TRead extends AnyReadOp
  ? TRead[typeof _readFn] extends () => any
    ? ReadActionOnEmptyParamReadOp<TRead, TMugLike>
    : TRead[typeof _readFn] extends <TState extends never>(
          state: TState,
          ...restArgs: any
        ) => TState
      ? ReadActionOnSimpleGenericReadOp<TRead, TMugLike>
      : ReadActionOnTypicalReadOp<TRead, TMugLike>
  : ReadAction<ReadOp<TRead>, TMugLike>;

export type R<TMugLike> = {
  (): ReadAction<GetIt, TMugLike>;

  <TReadOp extends AnyFunction & ReadOpMeta<(state: State<TMugLike>, ...restArgs: any) => any>>(
    readOp: TReadOp,
  ): ReadAction<TReadOp, TMugLike>;

  <TReadFn extends ((state: State<TMugLike>, ...restArgs: any) => any) & NotOp & NotAction>(
    readFn: TReadFn,
  ): ReadAction<TReadFn, TMugLike>;
};

export type WriteActionOnEmptyParamWriteOp<TWriteOp extends AnyWriteOp, TMugLike> = (() => void) &
  WriteActionMeta<TWriteOp, TMugLike>;

export type WriteActionOnSetIt<TMugLike> = ((patch: PossiblePatch<TMugLike>) => void) &
  WriteActionMeta<SetIt, TMugLike>;

export type WriteActionOnTypicalWriteOp<TWriteOp extends AnyWriteOp, TMugLike> = ((
  ...args: Post0Params<TWriteOp>
) => void) &
  WriteActionMeta<TWriteOp, TMugLike>;

export type WriteAction<
  TWrite extends AnyFunction = SetIt,
  TMugLike = any,
> = TWrite extends AnyWriteOp
  ? TWrite[typeof _writeFn] extends () => any
    ? WriteActionOnEmptyParamWriteOp<TWrite, TMugLike>
    : TWrite[typeof _writeFn] extends AssignPatch
      ? WriteActionOnSetIt<TMugLike>
      : WriteActionOnTypicalWriteOp<TWrite, TMugLike>
  : WriteAction<WriteOp<TWrite>, TMugLike>;

export type W<TMugLike> = {
  (): WriteAction<SetIt, TMugLike>;

  <
    TWriteOp extends AnyFunction &
      WriteOpMeta<(state: State<TMugLike>, ...restArgs: any) => State<TMugLike>>,
  >(
    writeOp: TWriteOp,
  ): WriteAction<TWriteOp, TMugLike>;

  <
    TWriteFn extends ((state: State<TMugLike>, ...restArgs: any) => State<TMugLike>) &
      NotOp &
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
    const readOp = r(read);
    const readAction = (...args: any) => readOp(mugLike, ...args);
    readAction[_readOp] = readOp;
    readAction[_mugLike] = mugLike;
    return readAction;
  }

  function _w(write: (mugLike: any, ...restArgs: any) => any = setIt) {
    const writeOp = w(write);
    const writeAction = (...args: any) => {
      writeOp(mugLike, ...args);
    };
    writeAction[_writeOp] = writeOp;
    writeAction[_mugLike] = mugLike;
    return writeAction;
  }

  const toolbelt: any = [_r, _w];
  toolbelt.r = _r;
  toolbelt.w = _w;
  return toolbelt;
}
