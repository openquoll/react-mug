import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  areEqualMugLikes,
  construction,
  isArray,
  isMug,
  isPlainObject,
  ownKeysOfObjectLike,
  State,
} from '../mug';
import { rawStateStore } from '../raw-state';
import { AnyFunction, Post0Params } from '../type-utils';

function subscribeTo(mugLike: any, changeListener: () => void): void {
  if (isMug(mugLike)) {
    rawStateStore.addChangeListener(mugLike, changeListener);
    subscribeTo(mugLike[construction], changeListener);
    return;
  }

  if (isPlainObject(mugLike)) {
    ownKeysOfObjectLike(mugLike).forEach((mugLikeKey) => {
      subscribeTo(mugLike[mugLikeKey], changeListener);
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
    ownKeysOfObjectLike(mugLike).forEach((mugLikeKey) => {
      unsubscribeFrom(mugLike[mugLikeKey], changeListener);
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

export function useOperator<TReadOp extends () => any>(readOp: TReadOp): ReturnType<TReadOp>;
export function useOperator<
  TReadOp extends <TMugLike>(mugLike: TMugLike, ...restArgs: any) => State<TMugLike>,
  TMugLike,
>(readOp: TReadOp, mugLike: TMugLike, ...restArgs: Post0Params<TReadOp>): State<TMugLike>;
export function useOperator<TReadOp extends AnyFunction>(
  readOp: TReadOp,
  ...readOpParams: Parameters<TReadOp>
): ReturnType<TReadOp>;
export function useOperator(
  readOp: (mugLike: any, ...restArgs: any) => any,
  mugLike?: any,
  ...restArgs: any
): any {
  const readOpRef = useRef(readOp);
  const mugLikeRef = useRef(mugLike);
  const restArgsRef = useRef(restArgs);

  const resultMadeRef = useRef(false);
  const resultRef = useRef<any>();

  const [, setNuance] = useState(0);

  function makeResult() {
    return readOpRef.current(mugLikeRef.current, ...restArgsRef.current);
  }

  function triggerRerender() {
    setNuance((n) => (n + 1) % 1e8);
  }

  const changeListener = useCallback(() => {
    const newResult = makeResult();

    if (areEqualMugLikes(resultRef.current, newResult)) {
      return;
    }

    resultRef.current = newResult;
    triggerRerender();
  }, []);

  useMemo(() => {
    if (!resultMadeRef.current) {
      resultRef.current = makeResult();
      resultMadeRef.current = true;
      return;
    }

    let anyPropChanged = false;

    if (!areEqualMugLikes(mugLikeRef.current, mugLike)) {
      mugLikeRef.current = mugLike;
      anyPropChanged = true;
    }

    if (!areEqualMugLikes(restArgsRef.current, restArgs)) {
      restArgsRef.current = restArgs;
      anyPropChanged = true;
    }

    if (!anyPropChanged) {
      return;
    }

    const newResult = makeResult();
    if (!areEqualMugLikes(resultRef.current, newResult)) {
      resultRef.current = newResult;
    }
  }, [mugLike, ...restArgs]);

  useEffect(() => {
    subscribeTo(mugLike, changeListener);
    return () => {
      unsubscribeFrom(mugLike, changeListener);
    };
  }, [mugLike]);

  return resultRef.current;
}
