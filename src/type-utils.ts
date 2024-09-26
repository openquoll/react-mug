export type EmptyItem = undefined;

export type AnyObjectLike = { [k: keyof any]: any };

export type NotArray = { length?: never };

export type AnyPlainObject = AnyObjectLike & NotArray;

export type AnyArray = any[];

export type AnyReadonlyArray = readonly any[];

export const readonlyArray = <T extends AnyArray>(...args: T): Readonly<T> => args;

export type AnyTuple = [any, ...any[]];

export const tuple = <T extends AnyTuple>(...args: T): T => args;

export type AnyReadonlyTuple = readonly [any, ...any[]];

export const readonlyTuple = <T extends AnyTuple>(...args: T): Readonly<T> => args;

export type AnyFunction = (...args: any) => any;

export type Param0<TFn extends AnyFunction> = TFn extends (
  arg0: infer TParam0,
  ...restArgs: any
) => any
  ? TParam0
  : never;

export type Post0Params<TFn extends AnyFunction> = TFn extends (
  arg0: any,
  ...restArgs: infer TRestParams
) => any
  ? TRestParams
  : never;

export type Conserve<TA, TB> = TA extends TB ? (TB extends TA ? TA : TB) : TB;

export type NumAsStrOnNumber<T extends number> = `${T}`;

export type NumAsStr<T> = T extends number ? NumAsStrOnNumber<T> : T;

export type MessyRange<
  TEnd extends number,
  TCounter extends AnyReadonlyArray = [],
> = TCounter['length'] extends TEnd
  ? never
  : TCounter['length'] | MessyRange<TEnd, [...TCounter, any]>;

export type Range<TEnd extends number> = MessyRange<TEnd>;
