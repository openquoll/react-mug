import { expectType } from 'tsd';

import { fake, from } from '../tests/type-utils';
import { PossibleStatePatch, swirl } from './builtin-ops';
import { Mug, MugLike, PossibleMugLike } from './mug';
import { EmptyItem } from './type-utils';

interface ObjectState {
  s: string;
  o: {
    s: string;
  };
}

type AFn = (...args: boolean[]) => boolean;

test('PossibleStatePatch', () => {
  interface AMugLike extends ObjectState {
    f: AFn;
    oa: ObjectState[];
    roa: readonly ObjectState[];
    ot: [ObjectState];
    rot: readonly [ObjectState];
    muggyObject: Mug<ObjectState>;
  }

  type R314 = PossibleStatePatch<AMugLike>;
  expectType<{
    s?: string;
    o?: { s?: string };
    f?: EmptyItem;
    oa?: (ObjectState | EmptyItem)[];
    roa?: readonly (ObjectState | EmptyItem)[];
    ot?: [{ s?: string; o?: { s?: string } } | EmptyItem];
    rot?: readonly [{ s?: string; o?: { s?: string } } | EmptyItem];
    muggyObject?: EmptyItem;
  }>(from<R314>());
});

test('swirl', () => {
  interface AState extends ObjectState {
    potentialMuggyObject: ObjectState;
  }

  const patch = { potentialMuggyObject: { o: { s: 'sdf' } } };

  const r73a = swirl(fake<AState>(), patch);
  expectType<AState>(r73a);

  const r586 = swirl(fake<Mug<AState>>(), patch);
  expectType<Mug<AState>>(r586);

  const r014 = swirl(fake<Mug<AState, { potentialMuggyObject: Mug<ObjectState> }>>(), patch);
  expectType<Mug<AState, { potentialMuggyObject: Mug<ObjectState> }>>(r014);

  const r8e9 = swirl(fake<MugLike<AState, { potentialMuggyObject: Mug<ObjectState> }>>(), patch);
  expectType<MugLike<AState, { potentialMuggyObject: Mug<ObjectState> }>>(r8e9);

  const rb02 = swirl(fake<PossibleMugLike<AState>>(), patch);
  expectType<PossibleMugLike<AState>>(rb02);

  const r9fa = swirl(fake<ObjectState>(), { o: { s: 'sdf' } });
  expectType<ObjectState>(r9fa);

  // @ts-expect-error
  swirl(fake<AState>(), { n: 237 });

  // @ts-expect-error
  swirl(fake<AState>());

  // @ts-expect-error
  swirl();

  // @ts-expect-error
  swirl(fake<AState>(), patch, fake<any>());
});
