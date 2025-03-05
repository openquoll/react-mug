import { AssignPatch, isBuiltinFn } from '../builtin-fns';
import {
  _readFn,
  _readProc,
  _writeFn,
  _writeProc,
  emptyCloneOfPlainObject,
  isPlainObject,
  ownKeysOfObjectLike,
} from '../mug';
import {
  _assign,
  _defineProperty,
  _false,
  _forEach,
  _getOwnPropertyDescriptor,
  _hasOwnProperty,
  _is,
  _length,
  _name,
  _ObjectPrototype,
  _true,
} from '../shortcuts';
import type { AnyFunction, Post0Params, SimplePatch } from '../type-utils';
import type { WriteGeneralOp } from './general';
import type { WriteSpecialOp } from './special';

export namespace SimpleMerge {
  export type WrapWOnEmptyParamWriteFn<TState> = () => TState;

  export type WrapWOnTypicalWriteFn<TWriteFn extends AnyFunction, TState> = (
    state: TState,
    ...restArgs: Post0Params<TWriteFn>
  ) => TState;

  export type WrapW<TWriteFn extends AnyFunction, TState> = TWriteFn extends () => any
    ? WrapWOnEmptyParamWriteFn<TState>
    : TWriteFn extends AssignPatch
      ? TWriteFn
      : TWriteFn extends <TState extends never>(state: TState, ...restArgs: any) => TState
        ? TWriteFn
        : WrapWOnTypicalWriteFn<TWriteFn, TState>;

  export type SpecialW<TState> = {
    <
      TWriteFn extends {
        (state: TState, ...restArgs: any): SimplePatch<TState>;

        // NotProc
        [_readFn]?: never;
        [_writeFn]?: never;

        // NotOp
        [_readProc]?: never;
        [_writeProc]?: never;
      },
    >(
      writeFn: TWriteFn,
    ): WriteSpecialOp<WrapW<TWriteFn, TState>, TState>;
  };

  export type GeneralW<TState> = {
    <
      TWriteFn extends {
        (state: TState, ...restArgs: any): SimplePatch<TState>;

        // NotProc
        [_readFn]?: never;
        [_writeFn]?: never;

        // NotOp
        [_readProc]?: never;
        [_writeProc]?: never;
      },
    >(
      writeFn: TWriteFn,
    ): WriteGeneralOp<WrapW<TWriteFn, TState>, TState>;
  };

  export const wrapW = (writeFn: AnyFunction): AnyFunction => {
    if (isBuiltinFn(writeFn)) {
      return writeFn;
    }

    const resultWriteFn = (state: any, ...restArgs: any): any => {
      const patch = writeFn(state, ...restArgs);

      if (_is(state, patch)) {
        return state;
      }

      if (isPlainObject(state) && isPlainObject(patch)) {
        const result = emptyCloneOfPlainObject(patch);
        let allFieldsFromState = _true;
        let allFieldsFromPatch = _true;
        ownKeysOfObjectLike(_assign({}, state, patch))[_forEach]((key) => {
          const keyInState = _ObjectPrototype[_hasOwnProperty].call(state, key);
          const keyInPatch = _ObjectPrototype[_hasOwnProperty].call(patch, key);

          if (keyInState && !keyInPatch) {
            allFieldsFromPatch = _false;
            result[key] = state[key];
            return;
          }

          if (!keyInState && keyInPatch) {
            allFieldsFromState = _false;
            result[key] = patch[key];
            return;
          }

          if (!_is(state[key], patch[key])) {
            allFieldsFromState = _false;
          }
          result[key] = patch[key];
        });

        if (allFieldsFromState) {
          return state;
        }

        if (allFieldsFromPatch) {
          return patch;
        }

        return result;
      }

      return patch;
    };

    [_name, _length].forEach((k) =>
      _defineProperty(resultWriteFn, k, _getOwnPropertyDescriptor(writeFn, k) ?? {}),
    );

    return resultWriteFn;
  };
}
