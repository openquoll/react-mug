import { expectAssignable, expectType } from 'tsd';

import { fake } from '../tests/type-utils';
import {
  AnyMug,
  Mug,
  Muggify,
  MugLike,
  PossibleMug,
  PossibleMuggyOverride,
  PossibleMugLike,
  State,
  WithAttachments,
} from './mug';
import { EmptyItem } from './type-utils';

interface ObjectState {
  s: string;
  o: {
    s: string;
  };
}

type Func = (...args: boolean[]) => boolean;

test('PossibleMuggyOverride', () => {
  interface AMugLike extends ObjectState {
    f: Func;
    muggyObject: Mug<ObjectState>;
    dirtyMuggyObject: WithAttachments<Mug<ObjectState>, { b: boolean }>;
  }

  expectType<
    | EmptyItem
    | PossibleMug<AMugLike>
    | {
        s?: PossibleMug<string>;
        o?: PossibleMug<{ s: string }> | { s?: PossibleMug<string> };
        f?: EmptyItem;
        muggyObject?: EmptyItem;
        dirtyMuggyObject?: EmptyItem;
      }
  >(fake<PossibleMuggyOverride<AMugLike>>());

  // =-=-=

  expectType<EmptyItem | PossibleMug<number>>(fake<PossibleMuggyOverride<number>>());

  expectType<EmptyItem | PossibleMug<number[]> | (PossibleMug<number> | EmptyItem)[]>(
    fake<PossibleMuggyOverride<number[]>>(),
  );

  expectType<
    EmptyItem | PossibleMug<[number, number]> | [PossibleMug<number>?, PossibleMug<number>?]
  >(fake<PossibleMuggyOverride<[number, number]>>());

  expectType<EmptyItem>(fake<PossibleMuggyOverride<AnyMug>>());
});

test('Muggify', () => {
  type ObjectMug = Mug<ObjectState>;

  type DirtyObjectMug = WithAttachments<Mug<ObjectState>, { b: boolean }>;

  interface AMugLike extends ObjectState {
    f: Func;
    muggyObject: ObjectMug;
    dirtyMuggyObject: DirtyObjectMug;
    potentialMuggyObject: ObjectState;
  }

  expectType<AMugLike>(fake<Muggify<AMugLike, EmptyItem>>());

  expectType<{
    s: string;
    o: {
      s: string;
    };
    f: Func;
    muggyObject: ObjectMug;
    dirtyMuggyObject: DirtyObjectMug;
    potentialMuggyObject: ObjectMug;
  }>(fake<Muggify<AMugLike, { potentialMuggyObject: ObjectMug }>>());

  expectType<{
    s: string;
    o: {
      s: string;
    };
    f: Func;
    muggyObject: ObjectMug;
    dirtyMuggyObject: DirtyObjectMug;
    potentialMuggyObject: DirtyObjectMug;
  }>(fake<Muggify<AMugLike, { potentialMuggyObject: DirtyObjectMug }>>());

  expectType<{
    s: string;
    o: {
      s: string;
    };
    f: Func;
    muggyObject: ObjectMug;
    dirtyMuggyObject: DirtyObjectMug;
    potentialMuggyObject: Mug<ObjectState, { o: { s: Mug<string> } }>;
  }>(
    fake<
      Muggify<
        AMugLike,
        {
          potentialMuggyObject: Mug<ObjectState, { o: { s: Mug<string> } }>;
        }
      >
    >(),
  );

  // =-=-=

  expectType<number>(fake<Muggify<number, EmptyItem>>());

  expectType<Mug<number>>(fake<Muggify<number, Mug<number>>>());

  // =-=-=

  expectType<Mug<number>[]>(fake<Muggify<number[], Mug<number>[]>>());

  expectType<(Mug<number> | number)[]>(fake<Muggify<number[], (Mug<number> | EmptyItem)[]>>());

  // =-=-=

  expectType<[number, number]>(fake<Muggify<[number, number], EmptyItem>>());

  expectType<[number, number]>(fake<Muggify<[number, number], []>>());

  expectType<[number, number]>(fake<Muggify<[number, number], [EmptyItem]>>());

  expectType<[number, number]>(fake<Muggify<[number, number], [EmptyItem, EmptyItem]>>());

  expectType<[Mug<number>, number]>(fake<Muggify<[number, number], [Mug<number>]>>());

  expectType<[Mug<number>, number]>(fake<Muggify<[number, number], [Mug<number>, EmptyItem]>>());

  expectType<[number, Mug<number>]>(fake<Muggify<[number, number], [EmptyItem, Mug<number>]>>());
});

test('State', () => {
  interface AState extends ObjectState {
    f: Func;
    potentialMuggyObject: ObjectState;
  }

  type AMug = Mug<AState>;

  type CompositeAMug = Mug<AState, { potentialMuggyObject: Mug<ObjectState> }>;

  type AMugLike = MugLike<AState, { potentialMuggyObject: Mug<ObjectState> }>;

  type PossibleAMug = PossibleMug<AState>;

  type PossibleAMugLike = PossibleMugLike<AState>;

  type DirtyAMug = WithAttachments<
    Mug<{
      s: string;
      o: {
        s: string;
      };
      f: Func;
      potentialMuggyObject: WithAttachments<Mug<ObjectState>, { b: boolean }>;
    }>,
    { b: boolean }
  >;

  expectType<AState>(fake<State<AMug>>());

  expectType<AState>(fake<State<CompositeAMug>>());

  expectType<AState>(fake<State<AMugLike>>());

  type R6f9 = State<PossibleAMug>;
  expectAssignable<R6f9>(fake<AState>());
  expectAssignable<AState>(fake<R6f9>());

  type Rd2d = State<PossibleAMugLike>;
  expectAssignable<Rd2d>(fake<AState>());
  expectAssignable<AState>(fake<Rd2d>());

  expectType<AState>(fake<State<DirtyAMug>>());
});
