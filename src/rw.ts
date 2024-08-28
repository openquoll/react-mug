import {
  areEqualMugLikes,
  assignConservatively,
  construction,
  emptyCloneOfPlainObject,
  isArray,
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
import { Param0, RestParams } from './type-util';

class ValueStabilizer {
  private _staleValueByMugLike = new WeakMap();

  public apply(mugLike: any, value: any): any {
    if (!isObjectLike(mugLike)) {
      return value;
    }

    if (!this._staleValueByMugLike.has(mugLike)) {
      if (areEqualMugLikes(mugLike, value)) {
        this._staleValueByMugLike.set(mugLike, mugLike);
        return mugLike;
      }

      this._staleValueByMugLike.set(mugLike, value);
      return value;
    }

    const staleValue = this._staleValueByMugLike.get(mugLike);
    if (areEqualMugLikes(value, staleValue)) {
      return staleValue;
    }

    this._staleValueByMugLike.set(mugLike, value);
    return value;
  }

  public static readonly ForMugLikeRead = new ValueStabilizer();
}

class MugLikeReadAction {
  private _readingMugLikes = new Set();

  public apply(mugLike: any): any {
    if (this._readingMugLikes.has(mugLike)) {
      throw new MugError('Circular-referenced mug found.');
    }

    if (isMug(mugLike)) {
      this._readingMugLikes.add(mugLike);
      const state = this.apply(rawStateStore.getRawState(mugLike));
      this._readingMugLikes.delete(mugLike);

      return ValueStabilizer.ForMugLikeRead.apply(mugLike, state);
    }

    if (isState(mugLike)) {
      return mugLike;
    }

    if (isPlainObject(mugLike)) {
      this._readingMugLikes.add(mugLike);
      const state = ownKeysOfObjectLike(mugLike).reduce((result, key) => {
        result[key] = this.apply(mugLike[key]);
        return result;
      }, emptyCloneOfPlainObject(mugLike));
      this._readingMugLikes.delete(mugLike);

      return ValueStabilizer.ForMugLikeRead.apply(mugLike, state);
    }

    if (isArray(mugLike)) {
      this._readingMugLikes.add(mugLike);
      const state = mugLike.map((mugLikeItem) => this.apply(mugLikeItem));
      this._readingMugLikes.delete(mugLike);

      return ValueStabilizer.ForMugLikeRead.apply(mugLike, state);
    }

    return mugLike;
  }

  public clear() {
    this._readingMugLikes.clear();
  }
}

class MugLikeWriteAction {
  private _writtenMugs = new Set();
  private _writingMugLikes = new Set();

  public apply(mugLike: any, input: any): void {
    if (this._writingMugLikes.has(mugLike)) {
      throw new MugError('Circular-referenced mug found.');
    }

    if (isMug(input)) {
      return;
    }

    if (isMug(mugLike)) {
      this._writingMugLikes.add(mugLike);
      this.apply(mugLike[construction], input);
      this._writingMugLikes.delete(mugLike);

      if (this._writtenMugs.has(mugLike)) {
        return;
      }

      const oldRawState = rawStateStore.getRawState(mugLike);
      const newRawState = assignConservatively(oldRawState, input);

      if (Object.is(newRawState, oldRawState)) {
        return;
      }

      rawStateStore.setRawState(mugLike, newRawState);
      this._writtenMugs.add(mugLike);
      return;
    }

    if (isState(mugLike)) {
      return;
    }

    if (isPlainObject(mugLike) && isPlainObject(input)) {
      this._writingMugLikes.add(mugLike);
      ownKeysOfObjectLike(mugLike).forEach((mugLikeKey) => {
        const mugLikeKeyInInput = input.hasOwnProperty(mugLikeKey);
        if (!mugLikeKeyInInput) {
          return;
        }
        this.apply(mugLike[mugLikeKey], input[mugLikeKey]);
      });
      this._writingMugLikes.delete(mugLike);
      return;
    }

    if (isArray(mugLike) && isArray(input)) {
      this._writingMugLikes.add(mugLike);
      mugLike.forEach((mugLikeItem, i) => {
        const indexInInput = input.hasOwnProperty(i);
        if (!indexInInput) {
          return;
        }
        this.apply(mugLikeItem, input[i]);
      });
      this._writingMugLikes.delete(mugLike);
      return;
    }
  }

  public clear() {
    this._writtenMugs.clear();
    this._writingMugLikes.clear();
  }
}

export function r<TReadFn extends (state: any, ...restArgs: any) => any>(
  readFn: TReadFn,
): TReadFn extends <TState>(state: TState, ...restArgs: any) => TState
  ? <TMugLike>(mugLike: TMugLike, ...restArgs: RestParams<TReadFn>) => State<TMugLike>
  : (
      mugLike: PossibleMugLike<Param0<TReadFn>>,
      ...restArgs: RestParams<TReadFn>
    ) => ReturnType<TReadFn>;
export function r(readFn: (state: any, ...restArgs: any) => any) {
  return (mugLike: any, ...restArgs: any): any => {
    // When the mugLike is a state, use the readFn as it is.
    if (isState(mugLike)) {
      return readFn(mugLike, ...restArgs);
    }

    const rAction = new MugLikeReadAction();
    const state = rAction.apply(mugLike);
    rAction.clear();

    return readFn(state, ...restArgs);
  };
}

export function w<TWriteFn extends (state: any, ...restArgs: any) => Param0<TWriteFn>>(
  writeFn: TWriteFn,
): <TMugLike extends PossibleMugLike<Param0<TWriteFn>>>(
  mugLike: TMugLike,
  ...restArgs: RestParams<TWriteFn>
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
    const oldState = rAction.apply(mugLike);
    rAction.clear();

    const newState = writeFn(oldState, ...restArgs);

    const wAction = new MugLikeWriteAction();
    wAction.apply(mugLike, newState);
    wAction.clear();

    return assignConservatively(mugLike, newState);
  };
}
