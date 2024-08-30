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

type AFn = (...args: boolean[]) => boolean;

test('PossibleMuggyOverride', () => {
  interface AMugLike extends ObjectState {
    f: AFn;
    muggyObject: { [construction]: ObjectState };
  }

  expectType<
    | EmptyItem
    | {
        [construction]: {
          s: PossibleMugLike<AMugLike['s']>;
          o: PossibleMugLike<AMugLike['o']>;
          f: AFn;
          muggyObject: PossibleMugLike<AMugLike['muggyObject']>;
        };
      }
    | {
        s?: { [construction]: string };
        o?:
          | { [construction]: { s: PossibleMugLike<AMugLike['o']['s']> } }
          | { s?: { [construction]: string } };
        f?: EmptyItem;
        muggyObject?: EmptyItem;
      }
  >(from<PossibleMuggyOverride<AMugLike>>());

  // =-=-=

  expectType<EmptyItem | { [construction]: number }>(from<PossibleMuggyOverride<number>>());

  expectType<
    | EmptyItem
    | { [construction]: PossibleMugLike<number>[] }
    | ({ [construction]: number } | EmptyItem)[]
  >(from<PossibleMuggyOverride<number[]>>());

  expectType<
    | EmptyItem
    | { [construction]: [PossibleMugLike<number>, PossibleMugLike<number>] }
    | [{ [construction]: number }?, { [construction]: number }?]
  >(from<PossibleMuggyOverride<[number, number]>>());

  expectType<EmptyItem>(from<PossibleMuggyOverride<AnyMug>>());
});

test('MugLike', () => {
  interface AMugLike extends ObjectState {
    f: AFn;
    muggyObject: { [construction]: ObjectState };
    potentialMuggyObject: ObjectState;
  }

  expectType<AMugLike>(from<MugLike<AMugLike>>());

  expectType<{
    s: string;
    o: {
      s: string;
    };
    f: AFn;
    muggyObject: { [construction]: ObjectState };
    potentialMuggyObject: { [construction]: ObjectState };
  }>(from<MugLike<AMugLike, { potentialMuggyObject: { [construction]: ObjectState } }>>());

  expectType<{
    s: string;
    o: {
      s: string;
    };
    f: AFn;
    muggyObject: { [construction]: ObjectState };
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
  interface AMugLike extends ObjectState {
    f: AFn;
    muggyObject: { [construction]: ObjectState };
    potentialMuggyObject: ObjectState;
  }

  expectType<{ [construction]: AMugLike }>(from<Mug<AMugLike>>());

  expectType<{
    [construction]: {
      s: string;
      o: {
        s: string;
      };
      f: AFn;
      muggyObject: { [construction]: ObjectState };
      potentialMuggyObject: { [construction]: ObjectState };
    };
  }>(from<Mug<AMugLike, { potentialMuggyObject: { [construction]: ObjectState } }>>());

  expectType<{
    [construction]: {
      s: string;
      o: {
        s: string;
      };
      f: AFn;
      muggyObject: { [construction]: ObjectState };
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
    f: AFn;
    potentialMuggyObject: ObjectState;
  }

  type Rf06 = State<Mug<AState>>;
  expectType<AState>(from<Rf06>());

  type R1ee = State<Mug<AState, { potentialMuggyObject: { [construction]: ObjectState } }>>;
  expectType<AState>(from<R1ee>());

  type R6f9 = State<PossibleMug<AState>>;
  expectAssignable<R6f9>(from<AState>());
  expectAssignable<AState>(from<R6f9>());

  type Rd2d = State<PossibleMugLike<AState>>;
  expectAssignable<Rd2d>(from<AState>());
  expectAssignable<AState>(from<Rd2d>());
});
