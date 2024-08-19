import {
  areEqualMugLikes,
  construction,
  emptyCloneOfPlainObject,
  isArray,
  isClassDefinedObject,
  isMug,
  isPlainObject,
  isState,
  MugError,
  ownKeysOfObjectLike,
  shallowCloneOfPlainObject,
} from './mug';
import { rawStateStore } from './raw-state';

class ValueConserver {
  private _staleValueByMugLike = new WeakMap();

  public apply(mugLike: any, value: any): any {
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

  public static forState = new ValueConserver();
  public static forRawState = new ValueConserver();
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
      const conservedState = ValueConserver.forState.apply(mugLike, state);

      this._readingMugs.delete(mugLike);
      return conservedState;
    }

    if (isState(mugLike)) {
      return mugLike;
    }

    if (isPlainObject(mugLike)) {
      const state = ownKeysOfObjectLike(mugLike).reduce((result, key) => {
        result[key] = this.apply(mugLike[key]);
        return result;
      }, emptyCloneOfPlainObject(mugLike));
      return ValueConserver.forState.apply(mugLike, state);
    }

    if (isArray(mugLike)) {
      const state = mugLike.map((mugLikeItem) => this.apply(mugLikeItem));
      return ValueConserver.forState.apply(mugLike, state);
    }

    return mugLike;
  }

  public clear() {
    this._readingMugs.clear();
  }
}

function calcRawState(mugLike: any, input: any): any {
  if (isMug(input)) {
    return mugLike;
  }

  if (isMug(mugLike)) {
    const rawState = calcRawState(rawStateStore.getRawState(mugLike), input);
    return ValueConserver.forRawState.apply(mugLike, rawState);
  }

  if (areEqualMugLikes(mugLike, input)) {
    return mugLike;
  }

  if (isPlainObject(mugLike) && isPlainObject(input)) {
    const rawState = ownKeysOfObjectLike(input).reduce((rawState, inputKey) => {
      const inputKeyInMugLike = mugLike.hasOwnProperty(inputKey);

      if (!inputKeyInMugLike) {
        if (isMug(input[inputKey])) {
          return rawState;
        }
        rawState[inputKey] = input[inputKey];
        return rawState;
      }

      if (isMug(input[inputKey])) {
        return rawState;
      }

      if (isMug(mugLike[inputKey])) {
        return rawState;
      }

      rawState[inputKey] = calcRawState(mugLike[inputKey], input[inputKey]);
      return rawState;
    }, shallowCloneOfPlainObject(mugLike));

    return ValueConserver.forRawState.apply(mugLike, rawState);
  }

  if (isArray(mugLike) && isArray(input)) {
    const rawState: any[] = [];
    rawState.length = input.length;

    for (let i = 0, n = rawState.length; i < n; i++) {
      const indexInMugLike = mugLike.hasOwnProperty(i);
      const indexInInput = input.hasOwnProperty(i);

      if (!indexInMugLike && !indexInInput) {
        continue;
      }

      if (indexInMugLike && !indexInInput) {
        rawState[i] = mugLike[i];
        continue;
      }

      if (!indexInMugLike && indexInInput) {
        if (isMug(input[i])) {
          continue;
        }
        rawState[i] = input[i];
        continue;
      }

      if (isMug(input[i])) {
        rawState[i] = mugLike[i];
        continue;
      }

      if (isMug(mugLike[i])) {
        rawState[i] = mugLike[i];
        continue;
      }

      rawState[i] = calcRawState(mugLike[i], input[i]);
    }

    return ValueConserver.forRawState.apply(mugLike, rawState);
  }

  if (isClassDefinedObject(mugLike) && isPlainObject(input)) {
    if (input.constructor !== mugLike.constructor) {
      return mugLike;
    }
    return input;
  }

  return input;
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

      if (this._writtenMugs.has(mugLike)) {
        this._writingMugs.delete(mugLike);
        return;
      }

      const oldRawState = rawStateStore.getRawState(mugLike);
      const newRawState = calcRawState(mugLike, input);
      if (Object.is(newRawState, oldRawState)) {
        this._writingMugs.delete(mugLike);
        return;
      }
      rawStateStore.setRawState(mugLike, newRawState);

      this._writtenMugs.add(mugLike);

      this._writingMugs.delete(mugLike);
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
    const wAction = new MugLikeWriteAction();
    const rAction = new MugLikeReadAction();
    wAction.apply(mugLike, writeFn(rAction.apply(mugLike), ...restArgs));
    wAction.clear();
    return mugLike;
  };
}
