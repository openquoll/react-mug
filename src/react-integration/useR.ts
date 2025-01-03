import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  _mugLike,
  _readProc,
  _state,
  AnyReadProc,
  AnyReadSpecialOp,
  areEqualMugLikes,
  construction,
  isMug,
  isPlainObject,
  ownKeysOfObjectLike,
  ReadProcMeta,
  ReadSpecialOpMeta,
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
  TReadSpecialOp extends AnyFunction &
    ReadSpecialOpMeta<AnyFunction & ReadProcMeta<() => any>, any>,
>(readSpecialOp: TReadSpecialOp): ReturnType<TReadSpecialOp>;
export function useR<
  TReadSpecialOp extends AnyFunction &
    ReadSpecialOpMeta<
      AnyFunction & ReadProcMeta<<TState extends never>(state: TState, ...restArgs: any) => TState>,
      any
    >,
>(
  readSpecialOp: TReadSpecialOp,
  ...args: Post0Params<TReadSpecialOp[typeof _readProc]>
): TReadSpecialOp[typeof _state];
export function useR<TReadSpecialOp extends AnyReadSpecialOp>(
  readSpecialOp: TReadSpecialOp,
  ...args: Post0Params<TReadSpecialOp[typeof _readProc]>
): ReturnType<TReadSpecialOp>;
export function useR<TReadProc extends AnyFunction & ReadProcMeta<() => any>>(
  readProc: TReadProc,
  mugLike?: unknown,
): ReturnType<TReadProc>;
export function useR<
  TReadProc extends AnyFunction &
    ReadProcMeta<<TState extends never>(state: TState, ...restArgs: any) => TState>,
  TMugLike extends Param0<TReadProc>,
>(readProc: TReadProc, mugLike: TMugLike, ...restArgs: Post0Params<TReadProc>): State<TMugLike>;
export function useR<TReadProc extends AnyReadProc>(
  readProc: TReadProc,
  ...args: Parameters<TReadProc>
): ReturnType<TReadProc>;
export function useR(
  read: {
    (...args: any): any;
    [_readProc]?: any;
    [_state]?: any;
    [_mugLike]?: any;
  },
  ...args: any
): any {
  const readProc = read[_readProc] ?? read;
  const [mugLike, restArgs] = read[_mugLike] ? [read[_mugLike], args] : [args[0], args[_slice](1)];

  const readProcRef = useRef(readProc);
  const mugLikeRef = useRef(mugLike);
  const restArgsRef = useRef(restArgs);

  const resultMadeRef = useRef(_false);
  const resultRef = useRef<any>();

  const [, setNuance] = useState(0);

  const makeResult = () => readProcRef[_current](mugLikeRef[_current], ...restArgsRef[_current]);

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
