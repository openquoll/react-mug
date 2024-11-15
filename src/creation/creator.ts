import { _assign, _attach } from '../shortcuts';
import { AnyFunction, AnyObjectLike } from '../type-utils';
import {
  create,
  CreatedMug,
  CreationToolbelt,
  HalfCreatedMug,
  MugWithAttributesValue,
} from './create';

export type MugCreator<
  TAttributesFunction extends AnyFunction,
  TActionsValue extends AnyObjectLike,
> = (
  ...attributesArgs: Parameters<TAttributesFunction>
) => CreatedMug<ReturnType<TAttributesFunction>, TActionsValue>;

export type HalfMugCreator<TAttributesFunction extends AnyFunction> = {
  (
    ...attributesArgs: Parameters<TAttributesFunction>
  ): HalfCreatedMug<ReturnType<TAttributesFunction>>;
  attach: <TActionsValue extends AnyObjectLike>(
    actionsFunction: (
      creationToolbelt: CreationToolbelt<MugWithAttributesValue<ReturnType<TAttributesFunction>>>,
    ) => TActionsValue,
  ) => MugCreator<TAttributesFunction, TActionsValue>;
};

export function creator<TAttributesFunction extends AnyFunction>(
  attributes: TAttributesFunction,
): HalfMugCreator<TAttributesFunction>;
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
