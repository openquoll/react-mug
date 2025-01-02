import { AssignPatch, assignPatch, PassThrough, passThrough, PossiblePatch } from './builtin/fns';
import { _builtinId } from './builtin/ids';
import {
  _readFn,
  _writeFn,
  AnyReadProc,
  AnyWriteProc,
  areEqualMugLikes,
  assignConservatively,
  construction,
  emptyCloneOfPlainObject,
  isMug,
  isObjectLike,
  isPlainObject,
  isReadProc,
  isState,
  isWriteProc,
  MugError,
  NotAction,
  NotProc,
  ownKeysOfObjectLike,
  PossibleMugLike,
  ReadProcMeta,
  State,
  WriteProcMeta,
} from './mug';
import { rawStateStore } from './raw-state';
import {
  _add,
  _clear,
  _delete,
  _forEach,
  _get,
  _has,
  _hasOwnProperty,
  _is,
  _isArray,
  _map,
  _reduce,
  _set,
  _Set,
  _WeakMap,
} from './shortcuts';
import { AnyFunction, Param0, Post0Params } from './type-utils';

const errMsgOf_circular_referenced_mug_found = 'Circular-referenced mug found.';

class ValueStabilizer {
  private _staleValueByMugLike = new _WeakMap();

  public _apply(mugLike: any, value: any): any {
    if (!isObjectLike(mugLike)) {
      return value;
    }

    if (!this._staleValueByMugLike[_has](mugLike)) {
      if (areEqualMugLikes(mugLike, value)) {
        this._staleValueByMugLike[_set](mugLike, mugLike);
        return mugLike;
      }

      this._staleValueByMugLike[_set](mugLike, value);
      return value;
    }

    const staleValue = this._staleValueByMugLike[_get](mugLike);
    if (areEqualMugLikes(value, staleValue)) {
      return staleValue;
    }

    this._staleValueByMugLike[_set](mugLike, value);
    return value;
  }

  public static readonly _ForMugLikeCurrentStateRead = new ValueStabilizer();
}

class MugLikeCurrentStateReadTask {
  private _readingMugLikes = new _Set();

  public _run(mugLike: any): any {
    if (this._readingMugLikes[_has](mugLike)) {
      throw new MugError(errMsgOf_circular_referenced_mug_found);
    }

    if (isMug(mugLike)) {
      this._readingMugLikes[_add](mugLike);
      const state = this._run(rawStateStore._getRawState(mugLike));
      this._readingMugLikes[_delete](mugLike);
      return ValueStabilizer._ForMugLikeCurrentStateRead._apply(mugLike, state);
    }

    if (isState(mugLike)) {
      return mugLike;
    }

    if (isPlainObject(mugLike)) {
      this._readingMugLikes[_add](mugLike);
      const state = ownKeysOfObjectLike(mugLike)[_reduce]((result, key) => {
        result[key] = this._run(mugLike[key]);
        return result;
      }, emptyCloneOfPlainObject(mugLike));
      this._readingMugLikes[_delete](mugLike);
      return ValueStabilizer._ForMugLikeCurrentStateRead._apply(mugLike, state);
    }

    if (_isArray(mugLike)) {
      this._readingMugLikes[_add](mugLike);
      const state = mugLike[_map]((mugLikeItem) => this._run(mugLikeItem));
      this._readingMugLikes[_delete](mugLike);
      return ValueStabilizer._ForMugLikeCurrentStateRead._apply(mugLike, state);
    }

    return mugLike;
  }

  public _clear() {
    this._readingMugLikes[_clear]();
  }
}

class ValueCache {
  private _staleValueByMugLike = new _WeakMap();

  public _apply(mugLike: any, evaluateValue: any): any {
    if (!isObjectLike(mugLike)) {
      return evaluateValue();
    }

    if (this._staleValueByMugLike[_has](mugLike)) {
      return this._staleValueByMugLike[_get](mugLike);
    }

    const value = evaluateValue();
    this._staleValueByMugLike[_set](mugLike, value);
    return value;
  }

  public static readonly _ForMugLikeInitialStateRead = new ValueCache();
}

class MugLikeInitialStateReadTask {
  private _readingMugLikes = new _Set();

  public _run(mugLike: any): any {
    if (this._readingMugLikes[_has](mugLike)) {
      throw new MugError(errMsgOf_circular_referenced_mug_found);
    }

    return ValueCache._ForMugLikeInitialStateRead._apply(mugLike, () => {
      if (isMug(mugLike)) {
        this._readingMugLikes[_add](mugLike);
        const state = this._run(mugLike[construction]);
        this._readingMugLikes[_delete](mugLike);
        return state;
      }

      if (isState(mugLike)) {
        return mugLike;
      }

      if (isPlainObject(mugLike)) {
        this._readingMugLikes[_add](mugLike);
        const state = ownKeysOfObjectLike(mugLike)[_reduce]((result, key) => {
          result[key] = this._run(mugLike[key]);
          return result;
        }, emptyCloneOfPlainObject(mugLike));
        this._readingMugLikes[_delete](mugLike);
        return state;
      }

      if (_isArray(mugLike)) {
        this._readingMugLikes[_add](mugLike);
        const state = mugLike[_map]((mugLikeItem) => this._run(mugLikeItem));
        this._readingMugLikes[_delete](mugLike);
        return state;
      }

      return mugLike;
    });
  }

  public _clear() {
    this._readingMugLikes[_clear]();
  }
}

class MugLikeWriteTask {
  private _writtenMugs = new _Set();
  private _writingMugLikes = new _Set();

  public _run(mugLike: any, input: any): void {
    if (this._writingMugLikes[_has](mugLike)) {
      throw new MugError(errMsgOf_circular_referenced_mug_found);
    }

    if (isMug(input)) {
      return;
    }

    if (isMug(mugLike)) {
      this._writingMugLikes[_add](mugLike);
      this._run(mugLike[construction], input);
      this._writingMugLikes[_delete](mugLike);

      if (this._writtenMugs[_has](mugLike)) {
        return;
      }

      const oldRawState = rawStateStore._getRawState(mugLike);
      const newRawState = assignConservatively(oldRawState, input);

      if (_is(newRawState, oldRawState)) {
        return;
      }

      rawStateStore._setRawState(mugLike, newRawState);
      this._writtenMugs[_add](mugLike);
      return;
    }

    if (isState(mugLike)) {
      return;
    }

    if (isPlainObject(mugLike) && isPlainObject(input)) {
      this._writingMugLikes[_add](mugLike);
      ownKeysOfObjectLike(mugLike)[_forEach]((mugLikeKey) => {
        const mugLikeKeyInInput = input[_hasOwnProperty](mugLikeKey);
        if (!mugLikeKeyInInput) {
          return;
        }
        this._run(mugLike[mugLikeKey], input[mugLikeKey]);
      });
      this._writingMugLikes[_delete](mugLike);
      return;
    }

    if (_isArray(mugLike) && _isArray(input)) {
      this._writingMugLikes[_add](mugLike);
      mugLike[_forEach]((mugLikeItem, i) => {
        const indexInInput = input[_hasOwnProperty](i);
        if (!indexInInput) {
          return;
        }
        this._run(mugLikeItem, input[i]);
      });
      this._writingMugLikes[_delete](mugLike);
      return;
    }
  }

  public _clear() {
    this._writtenMugs[_clear]();
    this._writingMugLikes[_clear]();
  }
}

export type ReadProcOnEmptyParamReadFn<TReadFn extends AnyFunction> = ((
  mugLike?: unknown,
) => ReturnType<TReadFn>) &
  ReadProcMeta<TReadFn>;

export type ReadProcOnSimpleGenericReadFn<TReadFn extends AnyFunction> = (<
  TMugLike extends PossibleMugLike<Param0<TReadFn>>,
>(
  mugLike: TMugLike,
  ...restArgs: Post0Params<TReadFn>
) => State<TMugLike>) &
  ReadProcMeta<TReadFn>;

export type ReadProcOnTypicalReadFn<TReadFn extends AnyFunction> = ((
  mugLike: PossibleMugLike<Param0<TReadFn>>,
  ...restArgs: Post0Params<TReadFn>
) => ReturnType<TReadFn>) &
  ReadProcMeta<TReadFn>;

export type ReadProc<TRead extends AnyFunction = PassThrough> = TRead extends AnyReadProc
  ? TRead
  : TRead extends () => any
    ? ReadProcOnEmptyParamReadFn<TRead>
    : TRead extends <TState extends never>(state: TState, ...restArgs: any) => TState
      ? ReadProcOnSimpleGenericReadFn<TRead>
      : ReadProcOnTypicalReadFn<TRead>;

export type GetIt = ReadProc;

export function r(): GetIt;
export function r<TReadProc extends AnyReadProc>(readProc: TReadProc): ReadProc<TReadProc>;
export function r<TReadFn extends AnyFunction & NotProc & NotAction>(
  readFn: TReadFn,
): ReadProc<TReadFn>;
export function r(read: AnyFunction = passThrough): AnyFunction {
  if (isReadProc(read)) {
    return read;
  }

  const readProc = (mugLike: any, ...restArgs: any): any => {
    // When the mugLike is a state, use the read as it is.
    if (isState(mugLike)) {
      return read(mugLike, ...restArgs);
    }

    const rTask = new MugLikeCurrentStateReadTask();
    const state = rTask._run(mugLike);
    rTask._clear();

    return read(state, ...restArgs);
  };

  readProc[_readFn] = read;

  return readProc;
}

export const getIt = r();

export type WriteProcOnEmptyParamWriteFn<TWriteFn extends AnyFunction> = (<
  TMugLike extends PossibleMugLike<ReturnType<TWriteFn>>,
>(
  mugLike?: TMugLike,
) => TMugLike) &
  WriteProcMeta<TWriteFn>;

export type WriteProcOnAssignPatch = (<TMugLike>(
  mugLike: TMugLike,
  patch: PossiblePatch<NoInfer<TMugLike>>,
) => TMugLike) &
  WriteProcMeta<AssignPatch>;

export type WriteProcOnTypicalWriteFn<TWriteFn extends AnyFunction> = (<
  TMugLike extends PossibleMugLike<Param0<TWriteFn>>,
>(
  mugLike: TMugLike,
  ...restArgs: Post0Params<TWriteFn>
) => TMugLike) &
  WriteProcMeta<TWriteFn>;

export type WriteProc<TWrite extends AnyFunction = AssignPatch> = TWrite extends AnyWriteProc
  ? TWrite
  : TWrite extends () => any
    ? WriteProcOnEmptyParamWriteFn<TWrite>
    : TWrite extends AssignPatch
      ? WriteProcOnAssignPatch
      : WriteProcOnTypicalWriteFn<TWrite>;

export type SetIt = WriteProc;

export function w(): SetIt;
export function w<TWriteProc extends AnyWriteProc>(writeProc: TWriteProc): WriteProc<TWriteProc>;
export function w<
  TWriteFn extends ((state: any, ...restArgs: any) => Param0<TWriteFn>) & NotProc & NotAction,
>(writeFn: TWriteFn): WriteProc<TWriteFn>;
export function w(write: AnyFunction = assignPatch): AnyFunction {
  if (isWriteProc(write)) {
    return write;
  }

  const writeProc = (mugLike: any, ...restArgs: any): any => {
    // When the mugLike is a state, use the writeFn as it is.
    if (isState(mugLike)) {
      const newState = write(mugLike, ...restArgs);

      // When the new state is a state, use it as it is.
      if (isState(newState)) {
        return newState;
      }

      return assignConservatively(mugLike, newState);
    }

    const rTask = new MugLikeCurrentStateReadTask();
    const oldState = rTask._run(mugLike);
    rTask._clear();

    const newState = write(oldState, ...restArgs);

    const wTask = new MugLikeWriteTask();
    wTask._run(mugLike, newState);
    wTask._clear();

    return assignConservatively(mugLike, newState);
  };

  writeProc[_writeFn] = write;

  return writeProc;
}

export const setIt = w();

export function initial<TMugLike>(mugLike: TMugLike): State<TMugLike>;
export function initial(mugLike: any): any {
  // When the mugLike is a state, return it as it is.
  if (isState(mugLike)) {
    return mugLike;
  }

  const rTask = new MugLikeInitialStateReadTask();
  const state = rTask._run(mugLike);
  rTask._clear();

  return state;
}

export function resetIt<TMugLike>(mugLike: TMugLike): TMugLike;
export function resetIt(mugLike: any): any {
  // When the mugLike is a state, return it as it is.
  if (isState(mugLike)) {
    return mugLike;
  }

  const newState = initial(mugLike);

  const wTask = new MugLikeWriteTask();
  wTask._run(mugLike, newState);
  wTask._clear();

  return assignConservatively(mugLike, newState);
}
