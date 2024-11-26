import { MergePatch, PossiblePatch } from './builtin/fns';
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
  TMugLike,
  TReadOp extends AnyReadOp,
> = (() => ReturnType<TReadOp>) & ReadActionMeta<TMugLike, TReadOp>;

export type ReadActionOnSimpleGenericReadOp<TMugLike, TReadOp extends AnyReadOp> = ((
  ...args: Post0Params<TReadOp>
) => State<TMugLike>) &
  ReadActionMeta<TMugLike, TReadOp>;

export type ReadActionOnTypicalReadOp<TMugLike, TReadOp extends AnyReadOp> = ((
  ...args: Post0Params<TReadOp>
) => ReturnType<TReadOp>) &
  ReadActionMeta<TMugLike, TReadOp>;

export type ReadActionOnEmptyParamReadFn<
  TMugLike,
  TReadFn extends AnyFunction,
> = (() => ReturnType<TReadFn>) & ReadActionMeta<TMugLike, ReadOp<TReadFn>>;

export type ReadActionOnSimpleGenericReadFn<TMugLike, TReadFn extends AnyFunction> = ((
  ...args: Post0Params<TReadFn>
) => State<TMugLike>) &
  ReadActionMeta<TMugLike, ReadOp<TReadFn>>;

export type ReadActionOnTypicalReadFn<TMugLike, TReadFn extends AnyFunction> = ((
  ...args: Post0Params<TReadFn>
) => ReturnType<TReadFn>) &
  ReadActionMeta<TMugLike, ReadOp<TReadFn>>;

export type ReadAction<TMugLike, TRead extends AnyFunction = GetIt> = TRead extends AnyReadOp
  ? TRead[typeof _readFn] extends () => any
    ? ReadActionOnEmptyParamReadOp<TMugLike, TRead>
    : TRead[typeof _readFn] extends <TState extends never>(
          state: TState,
          ...restArgs: any
        ) => TState
      ? ReadActionOnSimpleGenericReadOp<TMugLike, TRead>
      : ReadActionOnTypicalReadOp<TMugLike, TRead>
  : TRead extends () => any
    ? ReadActionOnEmptyParamReadFn<TMugLike, TRead>
    : TRead extends <TState extends never>(state: TState, ...restArgs: any) => TState
      ? ReadActionOnSimpleGenericReadFn<TMugLike, TRead>
      : ReadActionOnTypicalReadFn<TMugLike, TRead>;

export type R<TMugLike> = {
  (): ReadAction<TMugLike>;

  <TReadOp extends AnyFunction & ReadOpMeta<(state: State<TMugLike>, ...restArgs: any) => any>>(
    readOp: TReadOp,
  ): ReadAction<TMugLike, TReadOp>;

  <TReadFn extends ((state: State<TMugLike>, ...restArgs: any) => any) & NotOp & NotAction>(
    readFn: TReadFn,
  ): ReadAction<TMugLike, TReadFn>;
};

export type WriteActionOnEmptyParamWriteOp<TMugLike, TWriteOp extends AnyWriteOp> = (() => void) &
  WriteActionMeta<TMugLike, TWriteOp>;

export type WriteActionOnSetIt<TMugLike> = ((patch: PossiblePatch<TMugLike>) => void) &
  WriteActionMeta<TMugLike, SetIt>;

export type WriteActionOnTypicalWriteOp<TMugLike, TWriteOp extends AnyWriteOp> = ((
  ...args: Post0Params<TWriteOp>
) => void) &
  WriteActionMeta<TMugLike, TWriteOp>;

export type WriteActionOnEmptyParamWriteFn<TMugLike, TWriteFn extends AnyFunction> = (() => void) &
  WriteActionMeta<TMugLike, WriteOp<TWriteFn>>;

export type WriteActionOnMergePatch<TMugLike> = ((patch: PossiblePatch<TMugLike>) => void) &
  WriteActionMeta<TMugLike, WriteOp<MergePatch>>;

export type WriteActionOnTypicalWriteFn<TMugLike, TWriteFn extends AnyFunction> = ((
  ...args: Post0Params<TWriteFn>
) => void) &
  WriteActionMeta<TMugLike, WriteOp<TWriteFn>>;

export type WriteAction<TMugLike, TWrite extends AnyFunction = SetIt> = TWrite extends AnyWriteOp
  ? TWrite[typeof _writeFn] extends () => any
    ? WriteActionOnEmptyParamWriteOp<TMugLike, TWrite>
    : TWrite[typeof _writeFn] extends MergePatch
      ? WriteActionOnSetIt<TMugLike>
      : WriteActionOnTypicalWriteOp<TMugLike, TWrite>
  : TWrite extends () => any
    ? WriteActionOnEmptyParamWriteFn<TMugLike, TWrite>
    : TWrite extends MergePatch
      ? WriteActionOnMergePatch<TMugLike>
      : WriteActionOnTypicalWriteFn<TMugLike, TWrite>;

export type W<TMugLike> = {
  (): WriteAction<TMugLike>;

  <
    TWriteOp extends AnyFunction &
      WriteOpMeta<(state: State<TMugLike>, ...restArgs: any) => State<TMugLike>>,
  >(
    writeOp: TWriteOp,
  ): WriteAction<TMugLike, TWriteOp>;

  <
    TWriteFn extends ((state: State<TMugLike>, ...restArgs: any) => State<TMugLike>) &
      NotOp &
      NotAction,
  >(
    writeFn: TWriteFn,
  ): WriteAction<TMugLike, TWriteFn>;
};

export type ActionToolbeltFormat<TR, TW> = [r: TR, w: TW] & { r: TR; w: TW };

export type ActionToolbelt<TMugLike> = ActionToolbeltFormat<R<TMugLike>, W<TMugLike>>;

export function upon<TMugLike>(mugLike: TMugLike): ActionToolbelt<TMugLike>;
export function upon(mugLike: any): any {
  function _r(read: (mugLike: any, ...restArgs: any) => any = getIt) {
    const readOp = r(read);
    const readAction = (...args: any) => readOp(mugLike, ...args);
    readAction[_mugLike] = mugLike;
    readAction[_readOp] = readOp;
    return readAction;
  }

  function _w(write: (mugLike: any, ...restArgs: any) => any = setIt) {
    const writeOp = w(write);
    const writeAction = (...args: any) => {
      writeOp(mugLike, ...args);
    };
    writeAction[_mugLike] = mugLike;
    writeAction[_writeOp] = writeOp;
    return writeAction;
  }

  const toolbelt: any = [_r, _w];
  toolbelt.r = _r;
  toolbelt.w = _w;
  return toolbelt;
}
