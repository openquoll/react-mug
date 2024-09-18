import { expectAssignable, expectType } from 'tsd';

import { fake, from } from '../tests/type-utils';
import { construction, Mug, MugLike, PossibleMug, PossibleMugLike } from './mug';
import { r, w } from './rw';

interface ObjectState {
  s: string;
  o: {
    s: string;
  };
}

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

test('r', () => {
  const readbf7 = r(<TState>(state: TState): TState => state);

  const r992 = readbf7(fake<AState>());
  expectType<AState>(r992);

  const ra9b = readbf7(fake<AMug>());
  expectType<AState>(ra9b);

  const rf2c = readbf7(fake<NestedAMug>());
  expectType<AState>(rf2c);

  const r2a1 = readbf7(fake<AMugLike>());
  expectType<AState>(r2a1);

  const r99b = readbf7(fake<PossibleAMug>());
  expectAssignable<AState>(r99b);
  expectAssignable<typeof r99b>(from<AState>());

  const rc79 = readbf7(fake<PossibleAMugLike>());
  expectAssignable<AState>(rc79);
  expectAssignable<typeof rc79>(from<AState>());

  const rb29 = readbf7(fake<DirtyAMug>());
  expectType<AState>(rb29);

  const r251 = readbf7(fake<ObjectState>());
  expectType<ObjectState>(r251);

  // @ts-expect-error
  readbf7();

  // =-=-=

  const readebe = r(<TState>(state: TState, s: string): TState => state);

  readebe(fake<AState>(), fake<string>());

  // @ts-expect-error
  readebe(fake<AState>());

  // @ts-expect-error
  readebe(fake<AState>(), fake<number>());

  // @ts-expect-error
  readebe(fake<AState>(), fake<string>(), fake<any>());

  // =-=-=

  const readc82 = r((state: AState) => fake<ObjectState>());

  const rd57 = readc82(fake<AState>());
  expectType<ObjectState>(rd57);

  const r1b7 = readc82(fake<AMug>());
  expectType<ObjectState>(r1b7);

  const rdee = readc82(fake<NestedAMug>());
  expectType<ObjectState>(rdee);

  const rcc4 = readc82(fake<AMugLike>());
  expectType<ObjectState>(rcc4);

  const rb11 = readc82(fake<PossibleAMug>());
  expectType<ObjectState>(rb11);

  const r65c = readc82(fake<PossibleAMugLike>());
  expectType<ObjectState>(r65c);

  const r97f = readc82(fake<DirtyAMug>());
  expectType<ObjectState>(r97f);

  // @ts-expect-error
  readc82(fake<ObjectState>());

  // @ts-expect-error
  readc82();

  // =-=-=

  const read51c = r(<TState extends ObjectState>(state: TState) => fake<ObjectState>());

  const r026 = read51c(fake<AState>());
  expectType<ObjectState>(r026);

  // @ts-expect-error
  writed09(fake<{ s: string }>());

  // =-=-=

  const read23e = r((state: AState, s: string) => fake<ObjectState>());

  read23e(fake<AState>(), fake<string>());

  // @ts-expect-error
  read23e(fake<AState>());

  // @ts-expect-error
  read23e(fake<AState>(), fake<number>());

  // @ts-expect-error
  read23e(fake<AState>(), fake<string>(), fake<any>());

  // =-=-=

  const readc5d = r(() => fake<number>());
  expectType<number>(readc5d());

  // @ts-expect-error
  readc5d(fake<any>());
});

test('w', () => {
  const write73d = w(<TState>(state: TState): TState => state);

  const r022 = write73d(fake<AState>());
  expectType<AState>(r022);

  const r1aa = write73d(fake<AMug>());
  expectType<AMug>(r1aa);

  const rb36 = write73d(fake<NestedAMug>());
  expectType<NestedAMug>(rb36);

  const ra96 = write73d(fake<AMugLike>());
  expectType<AMugLike>(ra96);

  const rdb0 = write73d(fake<PossibleAMug>());
  expectType<PossibleAMug>(rdb0);

  const re28 = write73d(fake<PossibleAMugLike>());
  expectType<PossibleAMugLike>(re28);

  const rbcc = write73d(fake<DirtyAMug>());
  expectType<DirtyAMug>(rbcc);

  const rba4 = write73d(fake<ObjectState>());
  expectType<ObjectState>(rba4);

  // @ts-expect-error
  write73d();

  // =-=-=

  const write8e6 = w(<TState>(state: TState, s: string): TState => state);

  write8e6(fake<AState>(), fake<string>());

  // @ts-expect-error
  write8e6(fake<AState>());

  // @ts-expect-error
  write8e6(fake<AState>(), fake<number>());

  // @ts-expect-error
  write8e6(fake<AState>(), fake<string>(), fake<any>());

  // =-=-=

  const writed09 = w(<TState extends ObjectState>(state: TState): TState => state);

  const rb1e = writed09(fake<AState>());
  expectType<AState>(rb1e);

  // @ts-expect-error
  writed09(fake<{ s: string }>());

  // =-=-=

  const writecdd = w((state: AState) => state);

  const r2cb = writecdd(fake<AState>());
  expectType<AState>(r2cb);

  const r7a2 = writecdd(fake<AMug>());
  expectType<AMug>(r7a2);

  const r62d = writecdd(fake<NestedAMug>());
  expectType<NestedAMug>(r62d);

  const r779 = writecdd(fake<AMugLike>());
  expectType<AMugLike>(r779);

  const rd5d = writecdd(fake<PossibleAMug>());
  expectType<PossibleAMug>(rd5d);

  const r619 = writecdd(fake<PossibleAMugLike>());
  expectType<PossibleAMugLike>(r619);

  const rca7 = writecdd(fake<DirtyAMug>());
  expectType<DirtyAMug>(rca7);

  // @ts-expect-error
  writecdd(fake<ObjectState>());

  // @ts-expect-error
  writecdd();

  // =-=-=

  const write692 = w((state: AState, s: string): AState => state);

  write692(fake<AState>(), fake<string>());

  // @ts-expect-error
  write692(fake<AState>());

  // @ts-expect-error
  write692(fake<AState>(), fake<number>());

  // @ts-expect-error
  write692(fake<AState>(), fake<string>(), fake<any>());

  // =-=-=

  const write181 = w(() => fake<number>());
  expectType<number>(write181());
  expectType<number>(write181(fake<number>()));
  expectType<Mug<number>>(write181(fake<Mug<number>>()));

  // @ts-expect-error
  expectType<number>(write181(fake<string>()));

  // =-=-=

  // @ts-expect-error
  w((state: AState) => fake<ObjectState>());
});
