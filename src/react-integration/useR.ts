import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  _mugLike,
  _readOp,
  AnyReadAction,
  AnyReadOp,
  areEqualMugLikes,
  construction,
  isMug,
  isPlainObject,
  ownKeysOfObjectLike,
  ReadActionMeta,
  ReadOpMeta,
  State,
} from '../mug';
import { rawStateStore } from '../raw-state';
import { _current, _false, _forEach, _isArray, _slice, _true } from '../shortcuts';
import { AnyFunction, Param0, Post0Params } from '../type-utils';

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

export function useR<
  TReadAction extends AnyFunction & ReadActionMeta<AnyFunction & ReadOpMeta<() => any>>,
>(readAction: TReadAction): ReturnType<TReadAction>;
export function useR<
  TReadAction extends AnyFunction &
    ReadActionMeta<
      AnyFunction & ReadOpMeta<<TState extends never>(state: TState, ...restArgs: any) => TState>
    >,
>(
  readAction: TReadAction,
  ...readActions: Parameters<TReadAction>
): State<TReadAction[typeof _mugLike]>;
export function useR<TReadAction extends AnyReadAction>(
  readAction: TReadAction,
  ...readArgs: Parameters<TReadAction>
): ReturnType<TReadAction>;
export function useR<TReadOp extends AnyFunction & ReadOpMeta<() => any>>(
  readOp: TReadOp,
  mugLike?: unknown,
): ReturnType<TReadOp>;
export function useR<
  TReadOp extends AnyFunction &
    ReadOpMeta<<TState extends never>(state: TState, ...restArgs: any) => TState>,
  TMugLike extends Param0<TReadOp>,
>(readOp: TReadOp, mugLike: TMugLike, ...restArgs: Post0Params<TReadOp>): State<TMugLike>;
export function useR<TReadOp extends AnyReadOp>(
  readOp: TReadOp,
  ...readArgs: Parameters<TReadOp>
): ReturnType<TReadOp>;
export function useR(
  read: {
    (...args: any): any;
    [_readOp]?: any;
    [_mugLike]?: any;
  },
  ...readArgs: any
): any {
  const readOp = read[_readOp] ?? read;
  const [mugLike, restArgs] = read[_mugLike]
    ? [read[_mugLike], readArgs]
    : [readArgs[0], readArgs[_slice](1)];

  const readOpRef = useRef(readOp);
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
