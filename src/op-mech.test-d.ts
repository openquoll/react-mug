import { expectAssignable, expectType } from 'tsd';

import { fake } from '../tests/type-utils';
import {
  _bidFnMergePatch,
  _builtinId,
  MergePatch,
  mergePatch,
  passThrough,
  PassThrough,
  PossiblePatch,
} from './builtin';
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
import { getIt, GetIt, initial, r, ReadOp, SetIt, setIt, w, WriteOp } from './op-mech';

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

test('ReadOp, GetIt, PassThrough', () => {
  type Readbfd = ReadOp<<TState>(state: TState) => TState>;

  expectType<
    (<TMugLike>(mugLike: TMugLike) => State<TMugLike>) &
      ReadOpMeta<<TState>(state: TState) => TState>
  >(fake<Readbfd>());

  expectType<Readbfd>(fake<ReadOp<Readbfd>>());

  // =-=-=

  expectType<
    (<TMugLike>(mugLike: TMugLike, s: string) => State<TMugLike>) &
      ReadOpMeta<<TState>(state: TState, s: string) => TState>
  >(fake<ReadOp<<TState>(state: TState, s: string) => TState>>());

  // =-=-=

  expectType<
    (<TMugLike extends PossibleMugLike<AState>>(mugLike: TMugLike) => State<TMugLike>) &
      ReadOpMeta<<TState extends AState>(state: TState) => TState>
  >(fake<ReadOp<<TState extends AState>(state: TState) => TState>>());

  // =-=-=

  type Readdd9 = ReadOp<(state: AState) => ObjectState>;

  expectType<
    ((mugLike: PossibleMugLike<AState>) => ObjectState) & ReadOpMeta<(state: AState) => ObjectState>
  >(fake<Readdd9>());

  expectType<Readdd9>(fake<ReadOp<Readdd9>>());

  // =-=-=

  expectType<
    ((mugLike: PossibleMugLike<AState>, s: string) => ObjectState) &
      ReadOpMeta<(state: AState, s: string) => ObjectState>
  >(fake<ReadOp<(state: AState, s: string) => ObjectState>>());

  // =-=-=

  type Readdf3 = ReadOp<() => ObjectState>;

  expectType<((mugLike?: unknown) => ObjectState) & ReadOpMeta<() => ObjectState>>(fake<Readdf3>());

  expectType<Readdf3>(fake<ReadOp<Readdf3>>());

  // =-=-=

  expectType<
    (<TMugLike>(mugLike: TMugLike) => State<TMugLike>) &
      ReadOpMeta<<TState>(state: TState) => TState>
  >(fake<ReadOp>());

  expectType<ReadOp>(fake<ReadOp<ReadOp>>());

  expectType<ReadOp>(fake<ReadOp<PassThrough>>());

  expectType<ReadOp>(fake<GetIt>());
});

test('r, getIt, passThrough', () => {
  // @ts-expect-error
  r(w((state: any) => state));

  // =-=-=

  const readbf7 = r(<TState>(state: TState): TState => state);

  expectType<ReadOp<<TState>(state: TState) => TState>>(readbf7);

  expectType<typeof readbf7>(r(readbf7));

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

  // @ts-expect-error
  readbf7(fake<AState>(), fake<any>());

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

  expectType<ReadOp<(state: AState) => ObjectState>>(readc82);

  expectType<typeof readc82>(r(readc82));

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

  // @ts-expect-error
  readc82();

  // @ts-expect-error
  readc82(fake<AState>(), fake<any>());

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

  expectType<ReadOp<() => ObjectState>>(readc5d);

  expectType<typeof readc5d>(r(readc5d));

  expectType<ObjectState>(readc5d());
  expectType<ObjectState>(readc5d(fake<unknown>()));

  // @ts-expect-error
  readc5d(fake<unknown>(), fake<any>());

  // =-=-=

  const read0ea = r();

  expectType<ReadOp>(read0ea);

  expectType<typeof read0ea>(r(read0ea));

  expectType<typeof read0ea>(r(passThrough));

  expectType<typeof read0ea>(getIt);
});

test('WriteOp, SetIt, MergePatch', () => {
  type Write353 = WriteOp<<TState>(state: TState) => TState>;

  expectType<
    (<TMugLike>(mugLike: TMugLike) => TMugLike) & WriteOpMeta<<TState>(state: TState) => TState>
  >(fake<Write353>());

  expectType<Write353>(fake<WriteOp<Write353>>());

  // =-=-=

  expectType<
    (<TMugLike>(mugLike: TMugLike, s: string) => TMugLike) &
      WriteOpMeta<<TState>(state: TState, s: string) => TState>
  >(fake<WriteOp<<TState>(state: TState, s: string) => TState>>());

  // =-=-=

  expectType<
    (<TMugLike extends PossibleMugLike<AState>>(mugLike: TMugLike) => TMugLike) &
      WriteOpMeta<<TState extends AState>(state: TState) => TState>
  >(fake<WriteOp<<TState extends AState>(state: TState) => TState>>());

  // =-=-=

  type Writecbd = WriteOp<(state: AState) => AState>;

  expectType<
    (<TMugLike extends PossibleMugLike<AState>>(mugLike: TMugLike) => TMugLike) &
      WriteOpMeta<(state: AState) => AState>
  >(fake<Writecbd>());

  expectType<Writecbd>(fake<WriteOp<Writecbd>>());

  // =-=-=

  expectType<
    (<TMugLike extends PossibleMugLike<AState>>(mugLike: TMugLike, s: string) => TMugLike) &
      WriteOpMeta<(state: AState, s: string) => AState>
  >(fake<WriteOp<(state: AState, s: string) => AState>>());

  // =-=-=

  expectType<
    (<TMugLike extends PossibleMugLike<AState>>(mugLike: TMugLike, s: string) => TMugLike) &
      WriteOpMeta<(state: AState, s: string) => SuperState>
  >(fake<WriteOp<(state: AState, s: string) => SuperState>>());

  // =-=-=

  fake<WriteOp<(state: AState, s: string) => ObjectState>>();

  // =-=-=

  type Writec03 = WriteOp<() => AState>;

  expectType<
    (<TMugLike extends PossibleMugLike<AState>>(mugLike?: TMugLike) => TMugLike) &
      WriteOpMeta<() => AState>
  >(fake<Writec03>());

  expectType<Writec03>(fake<WriteOp<Writec03>>());

  // =-=-=

  expectType<
    (<TMugLike>(mugLike: TMugLike, patch: PossiblePatch<NoInfer<TMugLike>>) => TMugLike) &
      WriteOpMeta<{
        <TState>(state: TState, patch: PossiblePatch<NoInfer<TState>>): TState;
        [_builtinId]: typeof _bidFnMergePatch;
      }>
  >(fake<WriteOp>());

  expectType<WriteOp>(fake<WriteOp<WriteOp>>());

  expectType<WriteOp>(fake<WriteOp<MergePatch>>());

  expectType<WriteOp>(fake<SetIt>());
});

test('w, setIt, mergePatch', () => {
  // @ts-expect-error
  w(r((state: any) => state));

  // =-=-=

  const write73d = w(<TState>(state: TState): TState => state);

  expectType<typeof write73d>(w(write73d));

  expectType<WriteOp<<TState>(state: TState) => TState>>(write73d);

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

  // @ts-expect-error
  write73d(fake<AState>(), fake<any>());

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

  expectType<WriteOp<(state: AState) => AState>>(writecdd);

  expectType<typeof writecdd>(w(writecdd));

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

  // @ts-expect-error
  writecdd();

  // @ts-expect-error
  writecdd(fake<AState>(), fake<any>());

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

  expectType<WriteOp<(state: AState) => SuperState>>(write490);

  expectType<AState>(write490(fake<AState>()));
  expectType<SuperState>(write490(fake<SuperState>()));

  // @ts-expect-error
  write490(fake<ObjectState>());

  // =-=-=

  // @ts-expect-error
  w((state: AState) => fake<ObjectState>());

  // =-=-=

  const write181 = w(() => fake<AState>());

  expectType<WriteOp<() => AState>>(write181);

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

  // @ts-expect-error
  write181(fake<AState>(), fake<any>());

  // =-=-=

  const write09e = w();

  expectType<WriteOp>(write09e);

  expectType<typeof write09e>(w(write09e));

  expectType<typeof write09e>(w(mergePatch));

  expectType<typeof write09e>(setIt);

  const patchcd2 = { potentialMuggyObject: { o: { s: fake<string>() } } };

  expectType<AState>(write09e(fake<AState>(), patchcd2));
  expectType<AMug>(write09e(fake<AMug>(), patchcd2));
  expectType<NestedAMug>(write09e(fake<NestedAMug>(), patchcd2));
  expectType<AMugLike>(write09e(fake<AMugLike>(), patchcd2));
  expectType<PossibleAMug>(write09e(fake<PossibleAMug>(), patchcd2));
  expectType<PossibleAMugLike>(write09e(fake<PossibleAMugLike>(), patchcd2));
  expectType<DirtyAMug>(write09e(fake<DirtyAMug>(), patchcd2));
  expectType<ObjectState>(write09e(fake<ObjectState>(), { o: { s: fake<string>() } }));
  expectType<SuperState>(write09e(fake<SuperState>(), patchcd2));

  // @ts-expect-error
  write09e(fake<AState>(), { n: fake<number>() });

  // @ts-expect-error
  write09e(fake<AState>(), { s: fake<string>(), n: fake<number>() });
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
});
