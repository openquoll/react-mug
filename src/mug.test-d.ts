import { expectAssignable, expectType } from 'tsd';

import { from } from '../tests/type-utils';
import {
  AnyMug,
  construction,
  Mug,
  MugLike,
  PossibleMug,
  PossibleMuggyOverride,
  PossibleMugLike,
  State,
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
    muggyObject: { [construction]: ObjectState };
    dirtyMuggyObject: { [construction]: ObjectState; b: boolean };
  }

  expectType<
    | EmptyItem
    | PossibleMug<AMugLike>
    | {
        s?: { [construction]: string };
        o?:
          | { [construction]: { s: PossibleMugLike<AMugLike['o']['s']> } }
          | { s?: { [construction]: string } };
        f?: EmptyItem;
        muggyObject?: EmptyItem;
        dirtyMuggyObject?: EmptyItem;
      }
  >(from<PossibleMuggyOverride<AMugLike>>());

  // =-=-=

  expectType<EmptyItem | PossibleMug<number>>(from<PossibleMuggyOverride<number>>());

  expectType<EmptyItem | PossibleMug<number[]> | ({ [construction]: number } | EmptyItem)[]>(
    from<PossibleMuggyOverride<number[]>>(),
  );

  expectType<
    | EmptyItem
    | PossibleMug<[number, number]>
    | [{ [construction]: number }?, { [construction]: number }?]
  >(from<PossibleMuggyOverride<[number, number]>>());

  expectType<EmptyItem>(from<PossibleMuggyOverride<AnyMug>>());
});

test('MugLike', () => {
  interface ObjectMug {
    [construction]: ObjectState;
  }

  interface DirtyObjectMug {
    [construction]: ObjectState;
    b: boolean;
  }

  interface AMugLike extends ObjectState {
    f: Func;
    muggyObject: ObjectMug;
    dirtyMuggyObject: DirtyObjectMug;
    potentialMuggyObject: ObjectState;
  }

  expectType<AMugLike>(from<MugLike<AMugLike>>());

  expectType<{
    s: string;
    o: {
      s: string;
    };
    f: Func;
    muggyObject: ObjectMug;
    dirtyMuggyObject: DirtyObjectMug;
    potentialMuggyObject: ObjectMug;
  }>(from<MugLike<AMugLike, { potentialMuggyObject: ObjectMug }>>());

  expectType<{
    s: string;
    o: {
      s: string;
    };
    f: Func;
    muggyObject: ObjectMug;
    dirtyMuggyObject: DirtyObjectMug;
    potentialMuggyObject: DirtyObjectMug;
  }>(from<MugLike<AMugLike, { potentialMuggyObject: DirtyObjectMug }>>());

  expectType<{
    s: string;
    o: {
      s: string;
    };
    f: Func;
    muggyObject: ObjectMug;
    dirtyMuggyObject: DirtyObjectMug;
    potentialMuggyObject: {
      [construction]: {
        s: string;
        o: {
          s: { [construction]: string };
        };
      };
    };
  }>(
    from<
      MugLike<
        AMugLike,
        {
          potentialMuggyObject: {
            [construction]: {
              s: string;
              o: {
                s: { [construction]: string };
              };
            };
          };
        }
      >
    >(),
  );

  // =-=-=

  expectType<number>(from<MugLike<number>>());

  expectType<{ [construction]: number }>(from<MugLike<number, { [construction]: number }>>());

  // =-=-=

  expectType<{ [construction]: number }[]>(from<MugLike<number[], { [construction]: number }[]>>());

  expectType<({ [construction]: number } | number)[]>(
    from<MugLike<number[], ({ [construction]: number } | EmptyItem)[]>>(),
  );

  // =-=-=

  expectType<[number, number]>(from<MugLike<[number, number]>>());

  expectType<[number, number]>(from<MugLike<[number, number], []>>());

  expectType<[number, number]>(from<MugLike<[number, number], [EmptyItem]>>());

  expectType<[number, number]>(from<MugLike<[number, number], [EmptyItem, EmptyItem]>>());

  expectType<[{ [construction]: number }, number]>(
    from<MugLike<[number, number], [{ [construction]: number }]>>(),
  );

  expectType<[{ [construction]: number }, number]>(
    from<MugLike<[number, number], [{ [construction]: number }, EmptyItem]>>(),
  );

  expectType<[number, { [construction]: number }]>(
    from<MugLike<[number, number], [EmptyItem, { [construction]: number }]>>(),
  );
});

test('Mug', () => {
  interface ObjectMug {
    [construction]: ObjectState;
  }

  interface DirtyObjectMug {
    [construction]: ObjectState;
    b: boolean;
  }

  interface AMugLike extends ObjectState {
    f: Func;
    muggyObject: ObjectMug;
    dirtyMuggyObject: DirtyObjectMug;
    potentialMuggyObject: ObjectState;
  }

  expectType<{ [construction]: AMugLike }>(from<Mug<AMugLike>>());

  expectType<{
    [construction]: {
      s: string;
      o: {
        s: string;
      };
      f: Func;
      muggyObject: ObjectMug;
      dirtyMuggyObject: DirtyObjectMug;
      potentialMuggyObject: ObjectMug;
    };
  }>(from<Mug<AMugLike, { potentialMuggyObject: ObjectMug }>>());

  expectType<{
    [construction]: {
      s: string;
      o: {
        s: string;
      };
      f: Func;
      muggyObject: ObjectMug;
      dirtyMuggyObject: DirtyObjectMug;
      potentialMuggyObject: DirtyObjectMug;
    };
  }>(from<Mug<AMugLike, { potentialMuggyObject: DirtyObjectMug }>>());

  expectType<{
    [construction]: {
      s: string;
      o: {
        s: string;
      };
      f: Func;
      muggyObject: ObjectMug;
      dirtyMuggyObject: DirtyObjectMug;
      potentialMuggyObject: {
        [construction]: {
          s: string;
          o: {
            s: { [construction]: string };
          };
        };
      };
    };
  }>(
    from<
      Mug<
        AMugLike,
        {
          potentialMuggyObject: {
            [construction]: {
              s: string;
              o: {
                s: { [construction]: string };
              };
            };
          };
        }
      >
    >(),
  );

  // =-=-=

  expectType<{ [construction]: number }>(from<Mug<number>>());

  expectType<{ [construction]: { [construction]: number } }>(
    from<Mug<number, { [construction]: number }>>(),
  );

  // =-=-=

  expectType<{ [construction]: { [construction]: number }[] }>(
    from<Mug<number[], { [construction]: number }[]>>(),
  );
  expectType<{ [construction]: ({ [construction]: number } | number)[] }>(
    from<Mug<number[], ({ [construction]: number } | EmptyItem)[]>>(),
  );

  // =-=-=

  expectType<{ [construction]: [number, number] }>(from<Mug<[number, number]>>());

  expectType<{ [construction]: [number, number] }>(from<Mug<[number, number], []>>());

  expectType<{ [construction]: [number, number] }>(from<Mug<[number, number], [EmptyItem]>>());

  expectType<{ [construction]: [number, number] }>(
    from<Mug<[number, number], [EmptyItem, EmptyItem]>>(),
  );

  expectType<{ [construction]: [{ [construction]: number }, number] }>(
    from<Mug<[number, number], [{ [construction]: number }]>>(),
  );

  expectType<{ [construction]: [{ [construction]: number }, number] }>(
    from<Mug<[number, number], [{ [construction]: number }, EmptyItem]>>(),
  );

  expectType<{ [construction]: [number, { [construction]: number }] }>(
    from<Mug<[number, number], [EmptyItem, { [construction]: number }]>>(),
  );
});

test('State', () => {
  interface AState extends ObjectState {
    f: Func;
    potentialMuggyObject: ObjectState;
  }

  type AMug = Mug<AState>;

  type NestedAMug = Mug<AState, { potentialMuggyObject: { [construction]: ObjectState } }>;

  type AMugLike = MugLike<AState, { potentialMuggyObject: { [construction]: ObjectState } }>;

  type PossibleAMug = PossibleMug<AState>;

  type PossibleAMugLike = PossibleMugLike<AState>;

  interface DirtyAMug {
    [construction]: {
      s: string;
      o: {
        s: string;
      };
      f: Func;
      potentialMuggyObject: {
        [construction]: ObjectState;
        b: boolean;
      };
    };
    b: boolean;
  }

  expectType<AState>(from<State<AMug>>());

  expectType<AState>(from<State<NestedAMug>>());

  expectType<AState>(from<State<AMugLike>>());

  type R6f9 = State<PossibleAMug>;
  expectAssignable<R6f9>(from<AState>());
  expectAssignable<AState>(from<R6f9>());

  type Rd2d = State<PossibleAMugLike>;
  expectAssignable<Rd2d>(from<AState>());
  expectAssignable<AState>(from<Rd2d>());

  expectType<AState>(from<State<DirtyAMug>>());
});
