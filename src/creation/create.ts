import { R, upon, W } from '../actions';
import { construction, Mug, WithAttachments } from '../mug';
import { _assign, _mug } from '../shortcuts';
import { AnyObjectLike } from '../type-utils';

export type CreationToolbeltFormat<TR, TW, TMug> = [r: TR, w: TW, mug: TMug] & {
  r: TR;
  w: TW;
  mug: TMug;
};

export type CreationToolbelt<TMug> = CreationToolbeltFormat<R<TMug>, W<TMug>, TMug>;

export type MugWithAttributesValue<TAttributesValue> = TAttributesValue extends AnyObjectLike
  ? WithAttachments<Mug<TAttributesValue>, TAttributesValue>
  : Mug<TAttributesValue>;

export type ActionsFunctionConstraint<TMug> = (
  creationToolbelt: CreationToolbelt<TMug>,
) => AnyObjectLike;

export type CreatedMug<TAttributesValue, TActionsValue extends AnyObjectLike> = WithAttachments<
  MugWithAttributesValue<TAttributesValue>,
  TActionsValue
>;

export type HalfDoneCreatedMug<TAttributesValue> = WithAttachments<
  MugWithAttributesValue<TAttributesValue>,
  {
    attach: <TActionsValue extends AnyObjectLike>(
      actionsFunction: (
        creationToolbelt: CreationToolbelt<MugWithAttributesValue<TAttributesValue>>,
      ) => TActionsValue,
    ) => CreatedMug<TAttributesValue, TActionsValue>;
  }
>;

export function create<TAttributesValue>(
  attributesValue: TAttributesValue,
): HalfDoneCreatedMug<TAttributesValue>;
export function create(attributesValue: any): any {
  const mug = { [construction]: attributesValue };

  _assign(mug, attributesValue);

  const creationToolbelt: any = upon(mug);
  creationToolbelt[2] = mug;
  creationToolbelt[_mug] = mug;

  function attach(actionsFunction: any) {
    _assign(mug, actionsFunction(creationToolbelt));

    return mug;
  }

  _assign(mug, { attach });

  return mug;
}
