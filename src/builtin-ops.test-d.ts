import { expectType } from 'tsd';

import { fake, from } from '../tests/type-utils';
import { none, PossiblePatch, swirl } from './builtin-ops';
import { construction, Mug, MugLike, PossibleMug, PossibleMugLike } from './mug';
import { EmptyItem } from './type-utils';

interface ObjectState {
  s: string;
  o: {
    s: string;
  };
}

type Func = (...args: boolean[]) => boolean;

test('PossiblePatch', () => {
  interface AMugLike extends ObjectState {
    f: Func;
    no?: ObjectState;
    oa: ObjectState[];
    roa: readonly ObjectState[];
    ot: [ObjectState];
    rot: readonly [ObjectState];
    muggyObject: { [construction]: ObjectState };
    dirtyMuggyObject: { [construction]: ObjectState; b: boolean };
  }

  type R314 = PossiblePatch<AMugLike>;
  expectType<{
    s?: string;
    o?: { s?: string };
    f?: Func;
    no?: ObjectState | typeof none;
    oa?: (ObjectState | EmptyItem)[];
    roa?: readonly (ObjectState | EmptyItem)[];
    ot?: [{ s?: string; o?: { s?: string } } | EmptyItem];
    rot?: readonly [{ s?: string; o?: { s?: string } } | EmptyItem];
    muggyObject?: { s?: string; o?: { s?: string } };
    dirtyMuggyObject?: { s?: string; o?: { s?: string } };
  }>(from<R314>());
});

test('swirl', () => {
  interface AState extends ObjectState {
    potentialMuggyObject: ObjectState;
  }

  type AMug = Mug<AState>;

  type NestedAMug = Mug<AState, { potentialMuggyObject: Mug<ObjectState> }>;

  type AMugLike = MugLike<AState, { potentialMuggyObject: Mug<ObjectState> }>;

  type PossibleAMug = PossibleMug<AState>;

  type PossibleAMugLike = PossibleMugLike<AState>;

  interface DirtyAMug {
    [construction]: {
      s: string;
      o: {
        s: string;
      };
      potentialMuggyObject: {
        [construction]: ObjectState;
        b: boolean;
      };
    };
    b: boolean;
  }

  const patch = { potentialMuggyObject: { o: { s: fake<string>() } } };

  const r73a = swirl(fake<AState>(), patch);
  expectType<AState>(r73a);

  const r586 = swirl(fake<AMug>(), patch);
  expectType<AMug>(r586);

  const r014 = swirl(fake<NestedAMug>(), patch);
  expectType<NestedAMug>(r014);

  const r8e9 = swirl(fake<AMugLike>(), patch);
  expectType<AMugLike>(r8e9);

  const r7f7 = swirl(fake<PossibleAMug>(), patch);
  expectType<PossibleAMug>(r7f7);

  const rb02 = swirl(fake<PossibleAMugLike>(), patch);
  expectType<PossibleAMugLike>(rb02);

  const r9b0 = swirl(fake<DirtyAMug>(), patch);
  expectType<DirtyAMug>(r9b0);

  const r9fa = swirl(fake<ObjectState>(), { o: { s: fake<string>() } });
  expectType<ObjectState>(r9fa);

  // @ts-expect-error
  swirl(fake<AState>(), { n: fake<number>() });

  // @ts-expect-error
  swirl(fake<AState>(), { s: fake<string>(), n: fake<number>() });

  // @ts-expect-error
  swirl(fake<AState>());

  // @ts-expect-error
  swirl();

  // @ts-expect-error
  swirl(fake<AState>(), patch, fake<any>());
});
