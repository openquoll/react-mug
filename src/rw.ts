import {
  areEqualMugLikes,
  construction,
  emptyCloneOfPlainObject,
  isArray,
  isMug,
  isObjectLike,
  isPlainObject,
  isState,
  mixMugLikes,
  MugError,
  ownKeysOfObjectLike,
} from './mug';
import { rawStateStore } from './raw-state';

class ValueConserver {
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

  public static readonly ForState = new ValueConserver();
}

class MugLikeReadAction {
  private _readingMugs = new Set();

  public apply(mugLike: any): any {
    if (isMug(mugLike)) {
      if (this._readingMugs.has(mugLike)) {
        throw new MugError('Circular-referenced mug found.');
      }

      this._readingMugs.add(mugLike);
      const state = this.apply(rawStateStore.getRawState(mugLike));
      this._readingMugs.delete(mugLike);

      return ValueConserver.ForState.apply(mugLike, state);
    }

    if (isState(mugLike)) {
      return mugLike;
    }

    if (isPlainObject(mugLike)) {
      const state = ownKeysOfObjectLike(mugLike).reduce((result, key) => {
        result[key] = this.apply(mugLike[key]);
        return result;
      }, emptyCloneOfPlainObject(mugLike));
      return ValueConserver.ForState.apply(mugLike, state);
    }

    if (isArray(mugLike)) {
      const state = mugLike.map((mugLikeItem) => this.apply(mugLikeItem));
      return ValueConserver.ForState.apply(mugLike, state);
    }

    return mugLike;
  }

  public clear() {
    this._readingMugs.clear();
  }
}

class MugLikeWriteAction {
  private _writtenMugs = new Set();
  private _writingMugs = new Set();

  public apply(mugLike: any, input: any): void {
    if (isMug(input)) {
      return;
    }

    if (isMug(mugLike)) {
      if (this._writingMugs.has(mugLike)) {
        throw new MugError('Circular-referenced mug found.');
      }

      this._writingMugs.add(mugLike);
      this.apply(mugLike[construction], input);
      this._writingMugs.delete(mugLike);

      if (this._writtenMugs.has(mugLike)) {
        return;
      }

      const oldRawState = rawStateStore.getRawState(mugLike);
      const newRawState = mixMugLikes(oldRawState, input);

      if (Object.is(newRawState, oldRawState)) {
        return;
      }

      rawStateStore.setRawState(mugLike, newRawState);

      this._writtenMugs.add(mugLike);

      return;
    }

    if (isPlainObject(mugLike) && isPlainObject(input)) {
      ownKeysOfObjectLike(mugLike).forEach((mugLikeKey) => {
        const mugLikeKeyInInput = input.hasOwnProperty(mugLikeKey);
        if (!mugLikeKeyInInput) {
          return;
        }
        this.apply(mugLike[mugLikeKey], input[mugLikeKey]);
      });
      return;
    }

    if (isArray(mugLike) && isArray(input)) {
      mugLike.forEach((mugLikeItem, i) => {
        const indexInInput = input.hasOwnProperty(i);
        if (!indexInInput) {
          return;
        }
        this.apply(mugLikeItem, input[i]);
      });
      return;
    }
  }

  public clear() {
    this._writtenMugs.clear();
    this._writingMugs.clear();
  }
}

export function r(readFn: (state: any) => any) {
  return (mugLike: any): any => {
    const rAction = new MugLikeReadAction();
    return readFn(rAction.apply(mugLike));
  };
}

export function w(writeFn: (...args: any) => any) {
  return (mugLike: any, ...restArgs: any): any => {
    const rAction = new MugLikeReadAction();
    const oldState = rAction.apply(mugLike);
    rAction.clear();

    const newState = writeFn(oldState, ...restArgs);

    const wAction = new MugLikeWriteAction();
    wAction.apply(mugLike, newState);
    wAction.clear();

    return mixMugLikes(mugLike, newState);
  };
}
