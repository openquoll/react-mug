import {
  areEqualMugLikes,
  construction,
  emptyCloneOfPlainObject,
  isArray,
  isMug,
  isObjectLike,
  isPlainObject,
  isState,
  ownKeysOfObjectLike,
  shallowCloneOfPlainObject,
} from './mug';
import { rawStateStore } from './raw-state';

function readMugLike(mugLike: any): any {
  if (isMug(mugLike)) {
    return readMugLike(rawStateStore.getRawState(mugLike));
  }

  if (isState(mugLike)) {
    return mugLike;
  }

  if (isPlainObject(mugLike)) {
    return ownKeysOfObjectLike(mugLike).reduce((result, key) => {
      result[key] = readMugLike(mugLike[key]);
      return result;
    }, emptyCloneOfPlainObject(mugLike));
  }

  if (isArray(mugLike)) {
    return mugLike.map((mugLikeItem) => readMugLike(mugLikeItem));
  }

  return mugLike;
}

function calcRawState(mugLike: any, input: any): any {
  if (isMug(input)) {
    return input;
  }

  if (isMug(mugLike)) {
    const rawState = rawStateStore.getRawState(mugLike);
    return calcRawState(rawState, input);
  }

  if (areEqualMugLikes(mugLike, input)) {
    return mugLike;
  }

  if (isPlainObject(mugLike) && isPlainObject(input)) {
    return ownKeysOfObjectLike(input).reduce((rawState, inputKey) => {
      const inputKeyInMugLike = mugLike.hasOwnProperty(inputKey);

      if (!inputKeyInMugLike) {
        rawState[inputKey] = input[inputKey];
        return rawState;
      }

      if (isMug(input[inputKey])) {
        rawState[inputKey] = input[inputKey];
        return rawState;
      }

      if (isMug(mugLike[inputKey])) {
        return rawState;
      }

      rawState[inputKey] = calcRawState(mugLike[inputKey], input[inputKey]);
      return rawState;
    }, shallowCloneOfPlainObject(mugLike));
  }

  if (isArray(mugLike) && isArray(input)) {
    const rawState: any[] = [];
    rawState.length = input.length;

    for (let i = 0, n = rawState.length; i < n; i++) {
      const indexInMugLike = i in mugLike;
      const indexInInput = i in input;

      if (!indexInMugLike && !indexInInput) {
        continue;
      }

      if (indexInMugLike && !indexInInput) {
        rawState[i] = mugLike[i];
        continue;
      }

      if (!indexInMugLike && indexInInput) {
        rawState[i] = input[i];
        continue;
      }

      if (isMug(input[i])) {
        rawState[i] = input[i];
        continue;
      }

      if (isMug(mugLike[i])) {
        rawState[i] = mugLike[i];
        continue;
      }

      rawState[i] = calcRawState(mugLike[i], input[i]);
    }
    return rawState;
  }

  if (isObjectLike(mugLike) && isObjectLike(input)) {
    if (mugLike.constructor !== input.constructor) {
      return mugLike;
    }
  }

  return input;
}

function writeMugLike(mugLike: any, input: any): void {
  if (isMug(mugLike)) {
    writeMugLike(mugLike[construction], input);
    const rawState = calcRawState(mugLike, input);
    rawStateStore.setRawState(mugLike, rawState);
    return;
  }

  if (isPlainObject(mugLike) && isPlainObject(input)) {
    ownKeysOfObjectLike(mugLike).forEach((mugLikeKey) => {
      writeMugLike(mugLike[mugLikeKey], input[mugLikeKey]);
    });
    return;
  }

  if (isArray(mugLike) && isArray(input)) {
    mugLike.forEach((mugLikeItem, i) => {
      writeMugLike(mugLikeItem, input[i]);
    });
    return;
  }
}

export function r(readFn: (state: any) => any) {
  return (mugLike: any): any => {
    return readFn(readMugLike(mugLike));
  };
}

export function w(writeFn: (...args: any) => any) {
  return (mugLike: any, ...restArgs: any): any => {
    writeMugLike(mugLike, writeFn(readMugLike(mugLike), ...restArgs));
    return mugLike;
  };
}
