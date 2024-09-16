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
import { _current, _false, _forEach, _isArray, _slice, _true } from '../shortcuts';
import { internalMugLike, internalOp } from '../sugar';
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

export function useIt<TRead extends () => any>(read: TRead): ReturnType<TRead>;
export function useIt<
  TRead extends <TMugLike>(mugLike: TMugLike, ...restArgs: any) => State<TMugLike>,
  TMugLike,
>(read: TRead, mugLike: TMugLike, ...restArgs: Post0Params<TRead>): State<TMugLike>;
export function useIt<TRead extends AnyFunction>(
  read: TRead,
  ...readArgs: Parameters<TRead>
): ReturnType<TRead>;
export function useIt(
  read: {
    (...args: any): any;
    [internalOp]?: any;
    [internalMugLike]?: any;
  },
  ...readArgs: any
): any {
  const [mugLike, restArgs] = read[internalMugLike]
    ? [read[internalMugLike], readArgs]
    : [readArgs[0], readArgs[_slice](1)];

  const readOpRef = useRef(read[internalOp] ?? read);
  const mugLikeRef = useRef(mugLike);
  const restArgsRef = useRef(restArgs);

  const resultMadeRef = useRef(_false);
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
      resultMadeRef[_current] = _true;
      return;
    }

    let anyPropChanged = _false;

    if (!areEqualMugLikes(mugLikeRef[_current], mugLike)) {
      mugLikeRef[_current] = mugLike;
      anyPropChanged = _true;
    }

    if (!areEqualMugLikes(restArgsRef[_current], restArgs)) {
      restArgsRef[_current] = restArgs;
      anyPropChanged = _true;
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
