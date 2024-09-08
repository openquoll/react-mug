import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  areEqualMugLikes,
  construction,
  isMug,
  isPlainObject,
  ownKeysOfObjectLike,
  State,
} from '../mug';
import { rawStateStore } from '../raw-state';
import { _current, _forEach, _isArray } from '../shortcuts';
import { AnyFunction, Post0Params } from '../type-utils';

function subscribeTo(mugLike: any, changeListener: () => void): void {
  if (isMug(mugLike)) {
    rawStateStore._addChangeListener(mugLike, changeListener);
    subscribeTo(mugLike[construction], changeListener);
    return;
  }

  if (isPlainObject(mugLike)) {
    ownKeysOfObjectLike(mugLike)[_forEach]((mugLikeKey) => {
      subscribeTo(mugLike[mugLikeKey], changeListener);
    });
    return;
  }

  if (_isArray(mugLike)) {
    mugLike[_forEach]((mugLikeItem) => {
      subscribeTo(mugLikeItem, changeListener);
    });
    return;
  }
}

function unsubscribeFrom(mugLike: any, changeListener: () => void): void {
  if (isMug(mugLike)) {
    rawStateStore._removeChangeListener(mugLike, changeListener);
    unsubscribeFrom(mugLike[construction], changeListener);
    return;
  }

  if (isPlainObject(mugLike)) {
    ownKeysOfObjectLike(mugLike)[_forEach]((mugLikeKey) => {
      unsubscribeFrom(mugLike[mugLikeKey], changeListener);
    });
    return;
  }

  if (_isArray(mugLike)) {
    mugLike[_forEach]((mugLikeItem) => {
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

  const makeResult = () => readOpRef[_current](mugLikeRef[_current], ...restArgsRef[_current]);

  const triggerRerender = () => setNuance((n) => (n + 1) % 1e8);

  const changeListener = useCallback(() => {
    const newResult = makeResult();

    if (areEqualMugLikes(resultRef[_current], newResult)) {
      return;
    }

    resultRef[_current] = newResult;
    triggerRerender();
  }, []);

  useMemo(() => {
    if (!resultMadeRef[_current]) {
      resultRef[_current] = makeResult();
      resultMadeRef[_current] = true;
      return;
    }

    let anyPropChanged = false;

    if (!areEqualMugLikes(mugLikeRef[_current], mugLike)) {
      mugLikeRef[_current] = mugLike;
      anyPropChanged = true;
    }

    if (!areEqualMugLikes(restArgsRef[_current], restArgs)) {
      restArgsRef[_current] = restArgs;
      anyPropChanged = true;
    }

    if (!anyPropChanged) {
      return;
    }

    const newResult = makeResult();
    if (!areEqualMugLikes(resultRef[_current], newResult)) {
      resultRef[_current] = newResult;
    }
  }, [mugLike, ...restArgs]);

  useEffect(() => {
    subscribeTo(mugLike, changeListener);
    return () => {
      unsubscribeFrom(mugLike, changeListener);
    };
  }, [mugLike]);

  return resultRef[_current];
}
