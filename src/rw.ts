import { construction, isArray, isMug, isNonArrayObjectLike, PossibleMugLike } from './mug';
import { rawStateStore } from './raw-state';

function readState(mugLike: any): any {
  if (isMug(mugLike)) {
    return readState(rawStateStore.getRawState(mugLike));
  }

  if (isNonArrayObjectLike(mugLike)) {
    return [
      ...Object.getOwnPropertyNames(mugLike),
      ...Object.getOwnPropertySymbols(mugLike),
    ].reduce((state, key) => {
      state[key] = readState(mugLike[key]);
    }, {} as any);
  }

  if (isArray(mugLike)) {
    return mugLike.map((childMugLikg) => readState(childMugLikg));
  }

  return mugLike;
}

function calcRawState(mugLike: any, state: any): any {
  if (isMug(mugLike)) {
    const rawState = { ...state, ...mugLike[construction] };
    [...Object.getOwnPropertyNames(rawState), ...Object.getOwnPropertySymbols(rawState)].forEach(
      (key) => {
        if (isMug(rawState[key])) {
          return;
        }
        rawState[key] = calcRawState(rawState[key], state[key]);
      },
    );
    return rawState;
  }

  if (isNonArrayObjectLike(mugLike)) {
    const rawState = { ...state, ...mugLike };
    [...Object.getOwnPropertyNames(rawState), ...Object.getOwnPropertySymbols(rawState)].forEach(
      (key) => {
        if (isMug(rawState[key])) {
          return;
        }
        rawState[key] = calcRawState(rawState[key], state[key]);
      },
    );
    return rawState;
  }

  if (isArray(mugLike)) {
    const rawState = [...mugLike, ...state.slice(mugLike.length)];
    rawState.forEach((childMugLike, i) => {
      if (isMug(childMugLike)) {
        return;
      }
      rawState[i] = calcRawState(childMugLike, state[i]);
    });
    return rawState;
  }

  return state;
}

function writeState(mugLike: any, state: any): void {
  if (isMug(mugLike)) {
    rawStateStore.setRawState(mugLike, calcRawState(mugLike, state));
    writeState(mugLike[construction], state);
    return;
  }

  if (isNonArrayObjectLike(mugLike)) {
    [...Object.getOwnPropertyNames(mugLike), ...Object.getOwnPropertySymbols(mugLike)].forEach(
      (key) => {
        writeState(mugLike[key], state[key]);
      },
    );
    return;
  }

  if (isArray(mugLike)) {
    [...mugLike, ...state.slice(mugLike.length)].forEach((childMugLike, i) => {
      writeState(childMugLike, state[i]);
    });
    return;
  }
}

export function r<TState, TValue>(readFn: (state: TState) => TValue) {
  return (mugLike: PossibleMugLike<TState>): TValue => {
    return readFn(readState(mugLike));
  };
}

export function w<TState>(writeFn: (state: TState, ...restArgs: any) => TState) {
  return <TInOut = PossibleMugLike<TState>>(mugLike: TInOut, ...restArgs: any): TInOut => {
    writeState(mugLike, writeFn(readState(mugLike), ...restArgs));
    return mugLike;
  };
}
