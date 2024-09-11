import {
  areEqualMugLikes,
  assignConservatively,
  construction,
  emptyCloneOfPlainObject,
  isMug,
  isObjectLike,
  isPlainObject,
  isState,
  MugError,
  ownKeysOfObjectLike,
  PossibleMugLike,
  State,
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

const errMsgCircularReferencedMugFound = 'Circular-referenced mug found.';

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

  public static readonly _ForMugLikeRead = new ValueStabilizer();
}

class MugLikeReadAction {
  private _readingMugLikes = new _Set();

  public _apply(mugLike: any): any {
    if (this._readingMugLikes[_has](mugLike)) {
      throw new MugError(errMsgCircularReferencedMugFound);
    }

    if (isMug(mugLike)) {
      this._readingMugLikes[_add](mugLike);
      const state = this._apply(rawStateStore._getRawState(mugLike));
      this._readingMugLikes[_delete](mugLike);

      return ValueStabilizer._ForMugLikeRead._apply(mugLike, state);
    }

    if (isState(mugLike)) {
      return mugLike;
    }

    if (isPlainObject(mugLike)) {
      this._readingMugLikes[_add](mugLike);
      const state = ownKeysOfObjectLike(mugLike)[_reduce]((result, key) => {
        result[key] = this._apply(mugLike[key]);
        return result;
      }, emptyCloneOfPlainObject(mugLike));
      this._readingMugLikes[_delete](mugLike);

      return ValueStabilizer._ForMugLikeRead._apply(mugLike, state);
    }

    if (_isArray(mugLike)) {
      this._readingMugLikes[_add](mugLike);
      const state = mugLike[_map]((mugLikeItem) => this._apply(mugLikeItem));
      this._readingMugLikes[_delete](mugLike);

      return ValueStabilizer._ForMugLikeRead._apply(mugLike, state);
    }

    return mugLike;
  }

  public _clear() {
    this._readingMugLikes[_clear]();
  }
}

class MugLikeWriteAction {
  private _writtenMugs = new _Set();
  private _writingMugLikes = new _Set();

  public _apply(mugLike: any, input: any): void {
    if (this._writingMugLikes[_has](mugLike)) {
      throw new MugError(errMsgCircularReferencedMugFound);
    }

    if (isMug(input)) {
      return;
    }

    if (isMug(mugLike)) {
      this._writingMugLikes[_add](mugLike);
      this._apply(mugLike[construction], input);
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
        this._apply(mugLike[mugLikeKey], input[mugLikeKey]);
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
        this._apply(mugLikeItem, input[i]);
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

export function r<TReadFn extends AnyFunction>(
  readFn: TReadFn,
): TReadFn extends () => any
  ? () => ReturnType<TReadFn>
  : TReadFn extends <TState>(state: TState, ...restArgs: any) => TState
    ? <TMugLike>(mugLike: TMugLike, ...restArgs: Post0Params<TReadFn>) => State<TMugLike>
    : (
        mugLike: PossibleMugLike<Param0<TReadFn>>,
        ...restArgs: Post0Params<TReadFn>
      ) => ReturnType<TReadFn>;
export function r(readFn: (state: any, ...restArgs: any) => any) {
  return (mugLike: any, ...restArgs: any): any => {
    // When the mugLike is a state, use the readFn as it is.
    if (isState(mugLike)) {
      return readFn(mugLike, ...restArgs);
    }

    const rAction = new MugLikeReadAction();
    const state = rAction._apply(mugLike);
    rAction._clear();

    return readFn(state, ...restArgs);
  };
}

export function w<TWriteFn extends (...args: any) => Param0<TWriteFn>>(
  writeFn: TWriteFn,
): TWriteFn extends () => any
  ? <TMugLike extends PossibleMugLike<ReturnType<TWriteFn>>>(mugLike?: TMugLike) => TMugLike
  : TWriteFn extends <TState>(state: TState, ...restArgs: any) => TState
    ? <TMugLike>(mugLike: TMugLike, ...restArgs: Post0Params<TWriteFn>) => TMugLike
    : <TMugLike extends PossibleMugLike<Param0<TWriteFn>>>(
        mugLike: TMugLike,
        ...restArgs: Post0Params<TWriteFn>
      ) => TMugLike;
export function w(writeFn: (state: any, ...restArgs: any) => any) {
  return (mugLike: any, ...restArgs: any): any => {
    // When the mugLike is a state, use the writeFn as it is.
    if (isState(mugLike)) {
      const newState = writeFn(mugLike, ...restArgs);

      // When the new state is a state, use it as it is.
      if (isState(newState)) {
        return newState;
      }

      return assignConservatively(mugLike, newState);
    }

    const rAction = new MugLikeReadAction();
    const oldState = rAction._apply(mugLike);
    rAction._clear();

    const newState = writeFn(oldState, ...restArgs);

    const wAction = new MugLikeWriteAction();
    wAction._apply(mugLike, newState);
    wAction._clear();

    return assignConservatively(mugLike, newState);
  };
}
