import { R, W } from './actions';
import { Mug, WithAttachments } from './mug';
import { AnyFunction, AnyObjectLike } from './type-utils';

export type CreationToolbeltFormat<TR, TW, TMug> = [r: TR, w: TW, mug: TMug] & {
  r: TR;
  w: TW;
  mug: TMug;
};

export type CreationToolbelt<TMug> = CreationToolbeltFormat<R<TMug>, W<TMug>, TMug>;

export type MugWithAttributesValue<TAttributesValue> = TAttributesValue extends AnyObjectLike
  ? WithAttachments<Mug<TAttributesValue>, TAttributesValue>
  : Mug<TAttributesValue>;

export type MethodsFunctionConstraint<TMug> = (
  creationToolbelt: CreationToolbelt<TMug>,
) => AnyObjectLike;

export type FurtherCreatedMug<
  TAttributesValue,
  TMethodsValue extends AnyObjectLike,
> = WithAttachments<MugWithAttributesValue<TAttributesValue>, TMethodsValue>;

export type CreatedMug<TAttributesValue> = WithAttachments<
  MugWithAttributesValue<TAttributesValue>,
  {
    attach: <
      TMethodsFunction extends MethodsFunctionConstraint<MugWithAttributesValue<TAttributesValue>>,
    >(
      methods: TMethodsFunction,
    ) => FurtherCreatedMug<TAttributesValue, ReturnType<TMethodsFunction>>;
  }
>;

export function create<TAttributesValue>(
  attributes: TAttributesValue,
): CreatedMug<TAttributesValue>;
export function create(attributes: any): any {
  // TBD...
}

export type FurtherMugCreator<
  TAttributesFunction extends AnyFunction,
  TMethodsValue extends AnyObjectLike,
> = (
  ...args: Parameters<TAttributesFunction>
) => FurtherCreatedMug<ReturnType<TAttributesFunction>, TMethodsValue>;

export type MugCreator<TAttributesFunction extends AnyFunction> = {
  (...args: Parameters<TAttributesFunction>): CreatedMug<ReturnType<TAttributesFunction>>;
  attach: <
    TMethodsFunction extends MethodsFunctionConstraint<
      MugWithAttributesValue<ReturnType<TAttributesFunction>>
    >,
  >(
    methods: TMethodsFunction,
  ) => FurtherMugCreator<TAttributesFunction, ReturnType<TMethodsFunction>>;
};

export function creator<TAttributesFunction extends AnyFunction>(
  attributes: TAttributesFunction,
): MugCreator<TAttributesFunction>;
export function creator(attributes: any): any {
  // TBD...
}
