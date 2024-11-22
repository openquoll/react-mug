import { expectAssignable, expectType } from 'tsd';

import { fake } from '../tests/type-utils';
import {
  Mug,
  Muggify,
  PossibleMug,
  PossibleMugLike,
  pure,
  ReadOpMeta,
  State,
  WriteOpMeta,
} from './mug';
import { initial, r, w } from './op-mech';

interface ObjectState {
  s: string;
  o: {
    s: string;
  };
}

interface AState extends ObjectState {
  potentialMuggyObject: ObjectState;
}

interface SuperState extends AState {
  n: number;
}

type AMug = Mug<AState>;

type NestedAMug = Mug<Muggify<AState, { potentialMuggyObject: Mug<ObjectState> }>>;

type AMugLike = Muggify<AState, { potentialMuggyObject: Mug<ObjectState> }>;

type PossibleAMug = PossibleMug<AState>;

type PossibleAMugLike = PossibleMugLike<AState>;

type DirtyAMug = Mug<
  {
    s: string;
    o: {
      s: string;
    };
    potentialMuggyObject: Mug<ObjectState, { b: boolean }>;
  },
  { b: boolean }
>;

test('r', () => {
  // @ts-expect-error
  r(w((state: any) => state));

  // =-=-=

  const readbf7 = r(<TState>(state: TState): TState => state);

  expectType<AState>(readbf7(fake<AState>()));
  expectType<AState>(readbf7(fake<AMug>()));
  expectType<AState>(readbf7(fake<NestedAMug>()));
  expectType<AState>(readbf7(fake<AMugLike>()));

  const r99b = readbf7(fake<PossibleAMug>());
  expectAssignable<AState>(r99b);
  expectAssignable<typeof r99b>(fake<AState>());

  const rc79 = readbf7(fake<PossibleAMugLike>());
  expectAssignable<AState>(rc79);
  expectAssignable<typeof rc79>(fake<AState>());

  expectType<AState>(readbf7(fake<DirtyAMug>()));
  expectType<SuperState>(readbf7(fake<SuperState>()));
  expectType<ObjectState>(readbf7(fake<ObjectState>()));

  // @ts-expect-error
  readbf7();

  expectType<typeof readbf7>(r(readbf7));

  expectType<
    (<TMugLike>(mugLike: TMugLike) => State<TMugLike>) &
      ReadOpMeta<<TState>(state: TState) => TState>
  >(readbf7);

  // @ts-expect-error
  pure(readbf7);

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

  const read194 = r(<TState extends AState>(state: TState): TState => state);

  expectType<AState>(read194(fake<AState>()));

  expectType<SuperState>(read194(fake<SuperState>()));

  // @ts-expect-error
  read194(fake<ObjectState>());

  // =-=-=

  const readc82 = r((state: AState) => fake<ObjectState>());

  expectType<ObjectState>(readc82(fake<AState>()));
  expectType<ObjectState>(readc82(fake<AMug>()));
  expectType<ObjectState>(readc82(fake<NestedAMug>()));
  expectType<ObjectState>(readc82(fake<AMugLike>()));
  expectType<ObjectState>(readc82(fake<PossibleAMug>()));
  expectType<ObjectState>(readc82(fake<PossibleAMugLike>()));
  expectType<ObjectState>(readc82(fake<DirtyAMug>()));
  expectType<ObjectState>(readc82(fake<SuperState>()));

  // @ts-expect-error
  readc82(fake<ObjectState>());

  expectType<
    ((mugLike: PossibleMugLike<AState>) => ObjectState) & ReadOpMeta<(state: AState) => ObjectState>
  >(readc82);

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

  const readc5d = r(() => fake<ObjectState>());

  expectType<ObjectState>(readc5d());
  expectType<ObjectState>(readc5d(fake<unknown>()));

  expectType<((mugLike?: unknown) => ObjectState) & ReadOpMeta<() => ObjectState>>(readc5d);
});

test('w', () => {
  // @ts-expect-error
  w(r((state: any) => state));

  // =-=-=

  const write73d = w(<TState>(state: TState): TState => state);

  expectType<AState>(write73d(fake<AState>()));
  expectType<AMug>(write73d(fake<AMug>()));
  expectType<NestedAMug>(write73d(fake<NestedAMug>()));
  expectType<AMugLike>(write73d(fake<AMugLike>()));
  expectType<PossibleAMug>(write73d(fake<PossibleAMug>()));
  expectType<PossibleAMugLike>(write73d(fake<PossibleAMugLike>()));
  expectType<DirtyAMug>(write73d(fake<DirtyAMug>()));
  expectType<SuperState>(write73d(fake<SuperState>()));
  expectType<ObjectState>(write73d(fake<ObjectState>()));

  // @ts-expect-error
  write73d();

  expectType<typeof write73d>(w(write73d));

  expectType<
    (<TMugLike>(mugLike: TMugLike) => TMugLike) & WriteOpMeta<<TState>(state: TState) => TState>
  >(write73d);

  // @ts-expect-error
  pure(write73d);

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

  const writed09 = w(<TState extends AState>(state: TState): TState => state);

  expectType<AState>(writed09(fake<AState>()));
  expectType<SuperState>(writed09(fake<SuperState>()));

  // @ts-expect-error
  writed09(fake<ObjectState>());

  // =-=-=

  const writecdd = w((state: AState) => state);

  expectType<AState>(writecdd(fake<AState>()));
  expectType<AMug>(writecdd(fake<AMug>()));
  expectType<NestedAMug>(writecdd(fake<NestedAMug>()));
  expectType<AMugLike>(writecdd(fake<AMugLike>()));
  expectType<PossibleAMug>(writecdd(fake<PossibleAMug>()));
  expectType<PossibleAMugLike>(writecdd(fake<PossibleAMugLike>()));
  expectType<DirtyAMug>(writecdd(fake<DirtyAMug>()));
  expectType<SuperState>(writecdd(fake<SuperState>()));

  // @ts-expect-error
  writecdd(fake<ObjectState>());

  expectType<
    (<TMugLike extends PossibleMugLike<AState>>(mugLike: TMugLike) => TMugLike) &
      WriteOpMeta<(state: AState) => AState>
  >(writecdd);

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

  const write490 = w((state: AState) => fake<SuperState>());

  expectType<AState>(write490(fake<AState>()));
  expectType<AMug>(write490(fake<AMug>()));
  expectType<NestedAMug>(write490(fake<NestedAMug>()));
  expectType<AMugLike>(write490(fake<AMugLike>()));
  expectType<PossibleAMug>(write490(fake<PossibleAMug>()));
  expectType<PossibleAMugLike>(write490(fake<PossibleAMugLike>()));
  expectType<DirtyAMug>(write490(fake<DirtyAMug>()));
  expectType<SuperState>(write490(fake<SuperState>()));

  // @ts-expect-error
  write490(fake<ObjectState>());

  // =-=-=

  // @ts-expect-error
  w((state: AState) => fake<ObjectState>());

  // =-=-=

  const write181 = w(() => fake<AState>());

  expectType<AState>(write181());
  expectType<AState>(write181(fake<AState>()));
  expectType<AMug>(write181(fake<AMug>()));
  expectType<NestedAMug>(write181(fake<NestedAMug>()));
  expectType<AMugLike>(write181(fake<AMugLike>()));
  expectType<PossibleAMug>(write181(fake<PossibleAMug>()));
  expectType<PossibleAMugLike>(write181(fake<PossibleAMugLike>()));
  expectType<DirtyAMug>(write181(fake<DirtyAMug>()));
  expectType<SuperState>(write181(fake<SuperState>()));

  // @ts-expect-error
  write181(fake<ObjectState>());

  expectType<
    (<TMugLike extends PossibleMugLike<AState>>(mugLike?: TMugLike) => TMugLike) &
      WriteOpMeta<() => AState>
  >(write181);
});

test('initial', () => {
  expectType<AState>(initial(fake<AState>()));
  expectType<AState>(initial(fake<AMug>()));
  expectType<AState>(initial(fake<NestedAMug>()));
  expectType<AState>(initial(fake<AMugLike>()));

  const r99b = initial(fake<PossibleAMug>());
  expectAssignable<AState>(r99b);
  expectAssignable<typeof r99b>(fake<AState>());

  const rc79 = initial(fake<PossibleAMugLike>());
  expectAssignable<AState>(rc79);
  expectAssignable<typeof rc79>(fake<AState>());

  expectType<AState>(initial(fake<DirtyAMug>()));
  expectType<SuperState>(initial(fake<SuperState>()));
  expectType<ObjectState>(initial(fake<ObjectState>()));
});
