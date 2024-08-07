import { useCallback, useEffect, useState } from 'react';

import { construction, isArray, isMug, isNonArrayObjectLike, ownKeysOfObjectLike } from '../mug';
import { rawStateStore } from '../raw-state';

function subscribeTo(mugLike: any, changeListener: () => void): void {
  if (isMug(mugLike)) {
    rawStateStore.addChangeListener(mugLike, changeListener);
    subscribeTo(mugLike[construction], changeListener);
    return;
  }

  if (isNonArrayObjectLike(mugLike)) {
    ownKeysOfObjectLike(mugLike).forEach((key) => {
      subscribeTo(mugLike[key], changeListener);
    });
    return;
  }

  if (isArray(mugLike)) {
    mugLike.forEach((childMugLike) => {
      subscribeTo(childMugLike, changeListener);
    });
    return;
  }
}

function unsubscribeFrom(mugLike: any, changeListener: () => void): void {
  if (isMug(mugLike)) {
    rawStateStore.removeChangeListener(mugLike, changeListener);
    unsubscribeFrom(mugLike[construction], changeListener);
    return;
  }

  if (isNonArrayObjectLike(mugLike)) {
    ownKeysOfObjectLike(mugLike).forEach((key) => {
      unsubscribeFrom(mugLike[key], changeListener);
    });
    return;
  }

  if (isArray(mugLike)) {
    mugLike.forEach((childMugLike) => {
      unsubscribeFrom(childMugLike, changeListener);
    });
    return;
  }
}

export function useIt(
  readOp: (mugLike: any, ...restArgs: any) => any,
  mugLike: any,
  ...restArgs: any
): any {
  const [result, setResult] = useState(() => readOp(mugLike, ...restArgs));

  const changeListener = useCallback(() => {
    setResult(readOp(mugLike, ...restArgs));
  }, []);

  useEffect(() => {
    subscribeTo(mugLike, changeListener);
    return () => {
      unsubscribeFrom(mugLike, changeListener);
    };
  }, []);

  return result;
}
