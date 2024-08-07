import {
  areEqualMugLikes,
  construction,
  isArray,
  isMug,
  isNonArrayObjectLike,
  isState,
  ownKeysOfObjectLike,
} from './mug';
import { rawStateStore } from './raw-state';

function readMugLike(mugLike: any): any {
  if (isMug(mugLike)) {
    return readMugLike(rawStateStore.getRawState(mugLike));
  }

  if (isState(mugLike)) {
    return mugLike;
  }

  if (isNonArrayObjectLike(mugLike)) {
    const state: any = {};
    ownKeysOfObjectLike(mugLike).forEach((key) => {
      state[key] = readMugLike(mugLike[key]);
    });
    return state;
  }

  if (isArray(mugLike)) {
    return mugLike.map((childMugLikg) => readMugLike(childMugLikg));
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

  if (isNonArrayObjectLike(mugLike) && isNonArrayObjectLike(input)) {
    const rawState: any = {};
    ownKeysOfObjectLike(mugLike).forEach((mugLikeKey) => {
      const noKeyInInput = !input.hasOwnProperty(mugLikeKey);
      if (noKeyInInput) {
        rawState[mugLikeKey] = mugLike[mugLikeKey];
      }

      if (isMug(input[mugLikeKey])) {
        rawState[mugLikeKey] = input[mugLikeKey];
        return;
      }

      if (isMug(mugLike[mugLikeKey])) {
        rawState[mugLikeKey] = mugLike[mugLikeKey];
        return;
      }

      rawState[mugLikeKey] = calcRawState(mugLike[mugLikeKey], input[mugLikeKey]);
    });
    return rawState;
  }

  if (isArray(mugLike) && isArray(input)) {
    const rawState: any[] = [];
    input.forEach((inputItem, i) => {
      const noIndexInMugLike = i >= mugLike.length - 1;
      if (noIndexInMugLike) {
        rawState.push(inputItem);
        return;
      }

      if (isMug(inputItem)) {
        rawState.push(inputItem);
        return;
      }

      if (isMug(mugLike[i])) {
        rawState.push(mugLike[i]);
        return;
      }

      rawState[i] = calcRawState(mugLike[i], inputItem);
    });
    return rawState;
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

  if (isNonArrayObjectLike(mugLike) && isNonArrayObjectLike(input)) {
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
