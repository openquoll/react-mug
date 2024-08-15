import {
  areEqualMugLikes,
  construction,
  emptyCloneOfPlainObject,
  isArray,
  isClassDefinedObject,
  isMug,
  isPlainObject,
  isState,
  ownKeysOfObjectLike,
  shallowCloneOfPlainObject,
} from './mug';
import { rawStateStore } from './raw-state';

const staleStatesByMug = new WeakMap();

function readMugLike(mugLike: any): any {
  if (isMug(mugLike)) {
    const freshState = readMugLike(rawStateStore.getRawState(mugLike));
    if (!staleStatesByMug.has(mugLike)) {
      staleStatesByMug.set(mugLike, freshState);
      return freshState;
    }

    const staleState = staleStatesByMug.get(mugLike);
    if (areEqualMugLikes(freshState, staleState)) {
      return staleState;
    } else {
      staleStatesByMug.set(mugLike, freshState);
      return freshState;
    }
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
    return mugLike;
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
    return rawState;
  }

  if (isClassDefinedObject(mugLike) && isPlainObject(input)) {
    if (input.constructor !== mugLike.constructor) {
      return mugLike;
    }
    return input;
  }

  return input;
}

function writeMugLike(mugLike: any, input: any, writtenMugs: Set<any>): void {
  if (isMug(input)) {
    return;
  }

  if (isMug(mugLike)) {
    writeMugLike(mugLike[construction], input, writtenMugs);

    if (writtenMugs.has(mugLike)) {
      return;
    }

    const oldRawState = rawStateStore.getRawState(mugLike);
    const newRawState = calcRawState(mugLike, input);
    if (Object.is(newRawState, oldRawState)) {
      return;
    }
    rawStateStore.setRawState(mugLike, newRawState);

    writtenMugs.add(mugLike);
    return;
  }

  if (isPlainObject(mugLike) && isPlainObject(input)) {
    ownKeysOfObjectLike(mugLike).forEach((mugLikeKey) => {
      const mugLikeKeyInInput = input.hasOwnProperty(mugLikeKey);
      if (!mugLikeKeyInInput) {
        return;
      }
      writeMugLike(mugLike[mugLikeKey], input[mugLikeKey], writtenMugs);
    });
    return;
  }

  if (isArray(mugLike) && isArray(input)) {
    mugLike.forEach((mugLikeItem, i) => {
      const indexInInput = input.hasOwnProperty(i);
      if (!indexInInput) {
        return;
      }
      writeMugLike(mugLikeItem, input[i], writtenMugs);
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
    const writtenMugs = new Set();
    writeMugLike(mugLike, writeFn(readMugLike(mugLike), ...restArgs), writtenMugs);
    writtenMugs.clear();
    return mugLike;
  };
}
