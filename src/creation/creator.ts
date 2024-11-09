import { _assign, _attach } from '../shortcuts';
import { AnyFunction, AnyObjectLike } from '../type-utils';
import {
  ActionsFunctionConstraint,
  create,
  CreatedMug,
  FurtherCreatedMug,
  MugWithAttributesValue,
} from './create';

export type FurtherMugCreator<
  TAttributesFunction extends AnyFunction,
  TActionsValue extends AnyObjectLike,
> = (
  ...attributesArgs: Parameters<TAttributesFunction>
) => FurtherCreatedMug<ReturnType<TAttributesFunction>, TActionsValue>;

export type MugCreator<TAttributesFunction extends AnyFunction> = {
  (...attributesArgs: Parameters<TAttributesFunction>): CreatedMug<ReturnType<TAttributesFunction>>;
  attach: <
    TActionsFunction extends ActionsFunctionConstraint<
      MugWithAttributesValue<ReturnType<TAttributesFunction>>
    >,
  >(
    actionsFunction: TActionsFunction,
  ) => FurtherMugCreator<TAttributesFunction, ReturnType<TActionsFunction>>;
};

export function creator<TAttributesFunction extends AnyFunction>(
  attributes: TAttributesFunction,
): MugCreator<TAttributesFunction>;
export function creator(attributesFunction: any): any {
  const createMugPhase1 = (...attributesArgs: any) => create(attributesFunction(...attributesArgs));

  function attach(actionsFunction: any) {
    const createMugPhase2 = (...attributesArgs: any) =>
      createMugPhase1(...attributesArgs)[_attach](actionsFunction);
    return createMugPhase2;
  }

  _assign(createMugPhase1, { attach });

  return createMugPhase1;
}
