import { PossiblePatch } from './builtin/fns';
import {
  _mugLike,
  _readFn,
  _readOp,
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
import {
  GetIt,
  getIt,
  r,
  ReadOpOnEmptyParamReadFn,
  ReadOpOnSimpleGenericReadFn,
  ReadOpOnTypicalReadFn,
  SetIt,
  setIt,
  w,
  WriteOpOnEmptyParamWriteFn,
  WriteOpOnTypicalWriteFn,
} from './op-mech';
import { AnyFunction, Post0Params } from './type-utils';

export type ReadActionOnGetIt<TMugLike> = (() => State<TMugLike>) & ReadActionMeta<TMugLike, GetIt>;

export type ReadActionOnSimpleGenericReadOp<TMugLike, TReadOp extends AnyReadOp> = ((
  ...args: Post0Params<TReadOp>
) => State<TMugLike>) &
  ReadActionMeta<TMugLike, TReadOp>;

export type ReadActionOnTypicalReadOp<TMugLike, TReadOp extends AnyReadOp> = ((
  ...args: Post0Params<TReadOp>
) => ReturnType<TReadOp>) &
  ReadActionMeta<TMugLike, TReadOp>;

export type ReadActionOnReadOp<TMugLike, TReadOp extends AnyReadOp> =
  TReadOp[typeof _readFn] extends <TState extends never>(state: TState, ...restArgs: any) => TState
    ? ReadActionOnSimpleGenericReadOp<TMugLike, TReadOp>
    : ReadActionOnTypicalReadOp<TMugLike, TReadOp>;

export type ReadActionOnEmptyParamReadFn<
  TMugLike,
  TReadFn extends AnyFunction,
> = (() => ReturnType<TReadFn>) & ReadActionMeta<TMugLike, ReadOpOnEmptyParamReadFn<TReadFn>>;

export type ReadActionOnSimpleGenericReadFn<TMugLike, TReadFn extends AnyFunction> = ((
  ...args: Post0Params<TReadFn>
) => State<TMugLike>) &
  ReadActionMeta<TMugLike, ReadOpOnSimpleGenericReadFn<TReadFn>>;

export type ReadActionOnTypicalReadFn<TMugLike, TReadFn extends AnyFunction> = ((
  ...args: Post0Params<TReadFn>
) => ReturnType<TReadFn>) &
  ReadActionMeta<TMugLike, ReadOpOnTypicalReadFn<TReadFn>>;

export type ReadActionOnReadFn<TMugLike, TReadFn extends AnyFunction> = TReadFn extends () => any
  ? ReadActionOnEmptyParamReadFn<TMugLike, TReadFn>
  : TReadFn extends <TState extends never>(state: TState, ...restArgs: any) => TState
    ? ReadActionOnSimpleGenericReadFn<TMugLike, TReadFn>
    : ReadActionOnTypicalReadFn<TMugLike, TReadFn>;

export type R<TMugLike> = {
  (getIt?: GetIt): ReadActionOnGetIt<TMugLike>;

  <TReadOp extends AnyFunction & ReadOpMeta<(state: State<TMugLike>, ...restArgs: any) => any>>(
    readOp: TReadOp,
  ): ReadActionOnReadOp<TMugLike, TReadOp>;

  <TReadFn extends ((state: State<TMugLike>, ...restArgs: any) => any) & NotOp & NotAction>(
    readFn: TReadFn,
  ): ReadActionOnReadFn<TMugLike, TReadFn>;
};

export type WriteActionOnSetIt<TMugLike> = ((patch: PossiblePatch<TMugLike>) => void) &
  WriteActionMeta<TMugLike, SetIt>;

export type WriteActionOnWriteOp<TMugLike, TWriteOp extends AnyWriteOp> = ((
  ...args: Post0Params<TWriteOp>
) => void) &
  WriteActionMeta<TMugLike, TWriteOp>;

export type WriteActionOnEmptyParamWriteFn<TMugLike, TWriteFn extends () => any> = (() => void) &
  WriteActionMeta<TMugLike, WriteOpOnEmptyParamWriteFn<TWriteFn>>;

export type WriteActionOnTypicalWriteFn<TMugLike, TWriteFn extends AnyFunction> = ((
  ...args: Post0Params<TWriteFn>
) => void) &
  WriteActionMeta<TMugLike, WriteOpOnTypicalWriteFn<TWriteFn>>;

export type WriteActionOnWriteFn<
  TMugLike,
  TWriteFn extends AnyFunction,
> = TWriteFn extends () => any
  ? WriteActionOnEmptyParamWriteFn<TMugLike, TWriteFn>
  : WriteActionOnTypicalWriteFn<TMugLike, TWriteFn>;

export type W<TMugLike> = {
  (setIt?: SetIt): WriteActionOnSetIt<TMugLike>;

  <
    TWriteOp extends AnyFunction &
      WriteOpMeta<(state: State<TMugLike>, ...restArgs: any) => State<TMugLike>>,
  >(
    writeOp: TWriteOp,
  ): WriteActionOnWriteOp<TMugLike, TWriteOp>;

  <
    TWriteFn extends ((state: State<TMugLike>, ...restArgs: any) => State<TMugLike>) &
      NotOp &
      NotAction,
  >(
    writeFn: TWriteFn,
  ): WriteActionOnWriteFn<TMugLike, TWriteFn>;
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
