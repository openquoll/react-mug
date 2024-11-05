import { R, upon, W } from './actions';
import { construction, Mug, WithAttachments } from './mug';
import { _assign } from './shortcuts';
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
  const mug = { [construction]: attributes };

  _assign(mug, attributes);

  const creationToolbelt: any = upon(mug);
  creationToolbelt[3] = mug;
  creationToolbelt.mug = mug;

  function attach(methods: any) {
    _assign(mug, methods(creationToolbelt));

    return mug;
  }

  _assign(mug, { attach });

  return mug;
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
  const createMugPhase1 = (...args: any) => create(attributes(...args));

  function attach(methods: any) {
    const createMugPhase2 = (...args: any) => createMugPhase1(...args).attach(methods);
    return createMugPhase2;
  }

  _assign(createMugPhase1, { attach });

  return createMugPhase1;
}
