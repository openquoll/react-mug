import { useCallback, useEffect, useState } from 'react';

import { construction, isArray, isMug, isPlainObject, ownKeysOfObjectLike } from '../mug';
import { rawStateStore } from '../raw-state';

function subscribeTo(mugLike: any, changeListener: () => void): void {
  if (isMug(mugLike)) {
    rawStateStore.addChangeListener(mugLike, changeListener);
    subscribeTo(mugLike[construction], changeListener);
    return;
  }

  if (isPlainObject(mugLike)) {
    ownKeysOfObjectLike(mugLike).forEach((key) => {
      subscribeTo(mugLike[key], changeListener);
    });
    return;
  }

  if (isArray(mugLike)) {
    mugLike.forEach((mugLikeItem) => {
      subscribeTo(mugLikeItem, changeListener);
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

  if (isPlainObject(mugLike)) {
    ownKeysOfObjectLike(mugLike).forEach((key) => {
      unsubscribeFrom(mugLike[key], changeListener);
    });
    return;
  }

  if (isArray(mugLike)) {
    mugLike.forEach((mugLikeItem) => {
      unsubscribeFrom(mugLikeItem, changeListener);
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
