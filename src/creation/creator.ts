import { _assign } from '../shortcuts';
import { AnyFunction, AnyObjectLike } from '../type-utils';
import {
  create,
  CreatedMug,
  FurtherCreatedMug,
  MethodsFunctionConstraint,
  MugWithAttributesValue,
} from './create';

export type FurtherMugCreator<
  TAttributesFunction extends AnyFunction,
  TMethodsValue extends AnyObjectLike,
> = (
  ...attributesArgs: Parameters<TAttributesFunction>
) => FurtherCreatedMug<ReturnType<TAttributesFunction>, TMethodsValue>;

export type MugCreator<TAttributesFunction extends AnyFunction> = {
  (...attributesArgs: Parameters<TAttributesFunction>): CreatedMug<ReturnType<TAttributesFunction>>;
  attach: <
    TMethodsFunction extends MethodsFunctionConstraint<
      MugWithAttributesValue<ReturnType<TAttributesFunction>>
    >,
  >(
    methodsFunction: TMethodsFunction,
  ) => FurtherMugCreator<TAttributesFunction, ReturnType<TMethodsFunction>>;
};

export function creator<TAttributesFunction extends AnyFunction>(
  attributes: TAttributesFunction,
): MugCreator<TAttributesFunction>;
export function creator(attributesFunction: any): any {
  const createMugPhase1 = (...attributesArgs: any) => create(attributesFunction(...attributesArgs));

  function attach(methodsFunction: any) {
    const createMugPhase2 = (...attributesArgs: any) =>
      createMugPhase1(...attributesArgs).attach(methodsFunction);
    return createMugPhase2;
  }

  _assign(createMugPhase1, { attach });

  return createMugPhase1;
}
