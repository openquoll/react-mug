import { expectType } from 'tsd';

import { fake, from } from '../tests/type-utils';
import { none, PossiblePatch, setIt } from './builtin-ops';
import { construction, Mug, MugLike, PossibleMug, PossibleMugLike, pure } from './mug';
import { EmptyItem } from './type-utils';

interface ObjectState {
  s: string;
  o: {
    s: string;
  };
}

test('PossiblePatch', () => {
  type Func = (...args: boolean[]) => boolean;

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

test('setIt, pure', () => {
  interface AState extends ObjectState {
    potentialMuggyObject: ObjectState;
  }

  interface SuperState extends AState {
    n: number;
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

  expectType<AState>(setIt(fake<AState>(), patch));
  expectType<AMug>(setIt(fake<AMug>(), patch));
  expectType<NestedAMug>(setIt(fake<NestedAMug>(), patch));
  expectType<AMugLike>(setIt(fake<AMugLike>(), patch));
  expectType<PossibleAMug>(setIt(fake<PossibleAMug>(), patch));
  expectType<PossibleAMugLike>(setIt(fake<PossibleAMugLike>(), patch));
  expectType<DirtyAMug>(setIt(fake<DirtyAMug>(), patch));
  expectType<ObjectState>(setIt(fake<ObjectState>(), { o: { s: fake<string>() } }));
  expectType<SuperState>(setIt(fake<SuperState>(), patch));

  // @ts-expect-error
  setIt(fake<AState>(), { n: fake<number>() });

  // @ts-expect-error
  setIt(fake<AState>(), { s: fake<string>(), n: fake<number>() });

  // @ts-expect-error
  setIt(fake<AState>());

  // @ts-expect-error
  setIt();

  // @ts-expect-error
  setIt(fake<AState>(), patch, fake<any>());

  expectType<<TState>(state: TState, patch: PossiblePatch<NoInfer<TState>>) => TState>(setIt.pure);
  expectType<typeof setIt.pure>(pure(setIt));
});
