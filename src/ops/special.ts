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
  AnyReadGeneralOp,
  AnyReadProc,
  AnyWriteGeneralOp,
  AnyWriteProc,
  emptyCloneOfPlainObject,
  Generalness,
  hasGeneralness,
  isFunction,
  isReadGeneralOp,
  isWriteGeneralOp,
  NotOp,
  NotProc,
  ownKeysOfObjectLike,
  PossibleMugLike,
  ReadProcMeta,
  ReadSpecialOpMeta,
  WriteProcMeta,
  WriteSpecialOpMeta,
} from '../mug';
import { AnyFunction, AnyObjectLike, Post0Params } from '../type-utils';

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
  ((
    state: TState,
    ...restArgs: Post0Params<TReadProc[typeof _readFn]>
  ) => ReturnType<TReadProc[typeof _readFn]>) &
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
  TState0,
> = (() => void) &
  (<TState extends TState0>(state: TState) => TState) &
  WriteSpecialOpMeta<TWriteProc, TState0>;

export type WriteSpecialOpOnSetIt<TState0> = ((patch: PossiblePatch<NoInfer<TState0>>) => void) &
  (<TState extends TState0>(state: TState, patch: PossiblePatch<NoInfer<TState>>) => TState) &
  WriteSpecialOpMeta<SetIt, TState0>;

export type WriteSpecialOpOnTypicalWriteProc<TWriteProc extends AnyWriteProc, TState0> = ((
  ...args: Post0Params<TWriteProc>
) => void) &
  (<TState extends TState0>(
    state: TState,
    ...restArgs: Post0Params<TWriteProc[typeof _writeFn]>
  ) => TState) &
  WriteSpecialOpMeta<TWriteProc, TState0>;

export type WriteSpecialOp<TWrite extends AnyFunction, TState> = TWrite extends AnyWriteProc
  ? TWrite[typeof _writeFn] extends () => any
    ? WriteSpecialOpOnEmptyParamWriteProc<TWrite, TState>
    : TWrite[typeof _writeFn] extends AssignPatch
      ? WriteSpecialOpOnSetIt<TState>
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

export type SpecialTraitItemOnExec<TItem extends AnyFunction> = (
  ...args: Post0Params<TItem>
) => ReturnType<TItem>;

export type SpecialTraitItem<TItem, TState> =
  TItem extends Generalness<any>
    ? TItem extends AnyReadGeneralOp
      ? ReadSpecialOp<TItem[typeof _readProc], TState>
      : TItem extends AnyWriteGeneralOp
        ? WriteSpecialOp<TItem[typeof _writeProc], TState>
        : TItem extends AnyFunction
          ? SpecialTraitItemOnExec<TItem>
          : TItem
    : TItem;

export type SpecialTrait<TGeneralModule extends AnyObjectLike, TState> = {
  [TK in keyof TGeneralModule]: SpecialTraitItem<TGeneralModule[TK], TState>;
};

export type GMItemConstraint<TItem, TState> =
  TItem extends Generalness<infer TGeneralState>
    ? TState extends TGeneralState
      ? TItem
      : never
    : TItem;

export type S<TState> = <TGM extends { [TK in keyof TGM]: GMItemConstraint<TGM[TK], TState> }>(
  GeneralModule: TGM,
) => SpecialTrait<TGM, TState>;

export type SpecialOpToolbeltFormat<TR, TW, TS> = [r: TR, w: TW, s: TS] & { r: TR; w: TW; s: TS };

export type SpecialOpToolbelt<TState> = SpecialOpToolbeltFormat<R<TState>, W<TState>, S<TState>>;

export function upon<TState>(mugLike: PossibleMugLike<NoInfer<TState>>): SpecialOpToolbelt<TState>;
export function upon(mugLike: any): any {
  function r(read: (mugLike: any, ...restArgs: any) => any = getIt) {
    const readProc = procR(read);
    const readFn = readProc[_readFn];
    const thresholdLen = Math.max(1, readFn.length);

    const readSpecialOp = (...args: [any, ...any]) => {
      if (args.length < thresholdLen) {
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
    const thresholdLen = Math.max(1, writeFn.length);

    const writeSpecialOp = (...args: [any, ...any]) => {
      if (args.length < thresholdLen) {
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

  function s(generalModule: any) {
    return ownKeysOfObjectLike(generalModule).reduce((specialTrait, k) => {
      const item = generalModule[k];

      if (hasGeneralness(item)) {
        if (isReadGeneralOp(item)) {
          specialTrait[k] = r(item[_readProc]);
          return specialTrait;
        }

        if (isWriteGeneralOp(item)) {
          specialTrait[k] = w(item[_writeProc]);
          return specialTrait;
        }

        if (isFunction(item)) {
          specialTrait[k] = (...args: any) => item(mugLike, ...args);
          return specialTrait;
        }
      }

      specialTrait[k] = item;
      return specialTrait;
    }, emptyCloneOfPlainObject(generalModule));
  }

  const toolbelt: any = [r, w, s];
  toolbelt.r = r;
  toolbelt.w = w;
  toolbelt.s = s;
  return toolbelt;
}
