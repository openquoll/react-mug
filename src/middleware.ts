import { AssignPatch, isBuiltinFn } from './builtin-fns';
import {
  _readFn,
  _readProc,
  _writeFn,
  _writeProc,
  emptyCloneOfPlainObject,
  isPlainObject,
  ownKeysOfObjectLike,
} from './mug';
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
} from './shortcuts';
import type { AnyFunction, LatterIfChild, Param0, SimplePatch } from './type-utils';

export namespace simpleMerge {
  export type ProcWriteFnConstraint<TWriteFn extends AnyFunction> = {
    (state: any, ...restArgs: any): SimplePatch<Param0<TWriteFn>>;

    // NotProc
    [_readFn]?: never;
    [_writeFn]?: never;

    // NotOp
    [_readProc]?: never;
    [_writeProc]?: never;
  };

  export type OpWriteFnConstraint<TState> = {
    (state: TState, ...restArgs: any): SimplePatch<TState>;

    // NotProc
    [_readFn]?: never;
    [_writeFn]?: never;

    // NotOp
    [_readProc]?: never;
    [_writeProc]?: never;
  };

  export type MiddleWOnTypicalWriteFn<TWriteFn extends AnyFunction> = (
    ...args: Parameters<TWriteFn>
  ) => LatterIfChild<Param0<TWriteFn>, ReturnType<TWriteFn>>;

  export type MiddleW<TWriteFn extends AnyFunction> = TWriteFn extends () => any
    ? TWriteFn
    : TWriteFn extends AssignPatch
      ? TWriteFn
      : TWriteFn extends <TState extends never>(state: TState, ...restArgs: any) => TState
        ? TWriteFn
        : MiddleWOnTypicalWriteFn<TWriteFn>;

  export const middleW = (writeFn: AnyFunction): AnyFunction => {
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
