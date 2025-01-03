import { expectAssignable, expectType } from 'tsd';

import { fake } from '../tests/type-utils';
import {
  _bidFnAssignPatch,
  _builtinId,
  AssignPatch,
  assignPatch,
  passThrough,
  PassThrough,
  PossiblePatch,
} from './builtin';
import { getIt, GetIt, initial, r, ReadProc, SetIt, setIt, w, WriteProc } from './mechanism';
import {
  Mug,
  MugLike,
  PossibleMug,
  PossibleMugLike,
  pure,
  ReadProcMeta,
  State,
  WithAttachments,
  WriteProcMeta,
} from './mug';

interface ObjectState {
  s: string;
  o: {
    s: string;
  };
}

interface AState extends ObjectState {
  potentialMuggyObject: ObjectState;
}

interface BiggerState extends AState {
  n: number;
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
    potentialMuggyObject: WithAttachments<Mug<ObjectState>, { b: boolean }>;
  }>,
  { b: boolean }
>;

test('ReadProc, GetIt, PassThrough', () => {
  type Readbfd = ReadProc<<TState>(state: TState) => TState>;

  expectType<
    (<TMugLike>(mugLike: TMugLike) => State<TMugLike>) &
      ReadProcMeta<<TState>(state: TState) => TState>
  >(fake<Readbfd>());

  expectType<Readbfd>(fake<ReadProc<Readbfd>>());

  // =-=-=

  expectType<
    (<TMugLike>(mugLike: TMugLike, s: string) => State<TMugLike>) &
      ReadProcMeta<<TState>(state: TState, s: string) => TState>
  >(fake<ReadProc<<TState>(state: TState, s: string) => TState>>());

  // =-=-=

  expectType<
    (<TMugLike extends PossibleMugLike<AState>>(mugLike: TMugLike) => State<TMugLike>) &
      ReadProcMeta<<TState extends AState>(state: TState) => TState>
  >(fake<ReadProc<<TState extends AState>(state: TState) => TState>>());

  // =-=-=

  type Readdd9 = ReadProc<(state: AState) => ObjectState>;

  expectType<
    ((mugLike: PossibleMugLike<AState>) => ObjectState) &
      ReadProcMeta<(state: AState) => ObjectState>
  >(fake<Readdd9>());

  expectType<Readdd9>(fake<ReadProc<Readdd9>>());

  // =-=-=

  expectType<
    ((mugLike: PossibleMugLike<AState>, s: string) => ObjectState) &
      ReadProcMeta<(state: AState, s: string) => ObjectState>
  >(fake<ReadProc<(state: AState, s: string) => ObjectState>>());

  // =-=-=

  type Readdf3 = ReadProc<() => ObjectState>;

  expectType<((mugLike?: unknown) => ObjectState) & ReadProcMeta<() => ObjectState>>(
    fake<Readdf3>(),
  );

  expectType<Readdf3>(fake<ReadProc<Readdf3>>());

  // =-=-=

  expectType<(<TMugLike>(mugLike: TMugLike) => State<TMugLike>) & ReadProcMeta<PassThrough>>(
    fake<GetIt>(),
  );

  expectType<GetIt>(fake<ReadProc<GetIt>>());
});

test('r, pure, getIt, passThrough', () => {
  // @ts-expect-error
  r(w((state: any) => state));

  // =-=-=

  const readbf7 = r(<TState>(state: TState): TState => state);

  expectType<ReadProc<<TState>(state: TState) => TState>>(readbf7);

  expectType<typeof readbf7>(r(readbf7));

  expectType<AState>(readbf7(fake<AState>()));
  expectType<AState>(readbf7(fake<AMug>()));
  expectType<AState>(readbf7(fake<CompositeAMug>()));
  expectType<AState>(readbf7(fake<AMugLike>()));

  const r99b = readbf7(fake<PossibleAMug>());
  expectAssignable<AState>(r99b);
  expectAssignable<typeof r99b>(fake<AState>());

  const rc79 = readbf7(fake<PossibleAMugLike>());
  expectAssignable<AState>(rc79);
  expectAssignable<typeof rc79>(fake<AState>());

  expectType<AState>(readbf7(fake<DirtyAMug>()));
  expectType<BiggerState>(readbf7(fake<BiggerState>()));
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

  expectType<BiggerState>(read194(fake<BiggerState>()));

  // @ts-expect-error
  read194(fake<ObjectState>());

  // =-=-=

  const readc82 = r((state: AState) => fake<ObjectState>());

  expectType<ReadProc<(state: AState) => ObjectState>>(readc82);

  expectType<typeof readc82>(r(readc82));

  expectType<ObjectState>(readc82(fake<AState>()));
  expectType<ObjectState>(readc82(fake<AMug>()));
  expectType<ObjectState>(readc82(fake<CompositeAMug>()));
  expectType<ObjectState>(readc82(fake<AMugLike>()));
  expectType<ObjectState>(readc82(fake<PossibleAMug>()));
  expectType<ObjectState>(readc82(fake<PossibleAMugLike>()));
  expectType<ObjectState>(readc82(fake<DirtyAMug>()));
  expectType<ObjectState>(readc82(fake<BiggerState>()));

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

  expectType<ReadProc<() => ObjectState>>(readc5d);

  expectType<typeof readc5d>(r(readc5d));

  expectType<ObjectState>(readc5d());
  expectType<ObjectState>(readc5d(fake<unknown>()));

  // @ts-expect-error
  readc5d(fake<unknown>(), fake<any>());

  // =-=-=

  const read0ea = r();

  expectType<GetIt>(read0ea);

  expectType<typeof read0ea>(r(read0ea));

  expectType<typeof read0ea>(r(passThrough));

  expectType<typeof read0ea>(getIt);

  expectType<AState>(read0ea(fake<AState>()));
  expectType<AState>(read0ea(fake<AMug>()));
  expectType<AState>(read0ea(fake<CompositeAMug>()));
  expectType<AState>(read0ea(fake<AMugLike>()));

  const re70 = read0ea(fake<PossibleAMug>());
  expectAssignable<AState>(re70);
  expectAssignable<typeof re70>(fake<AState>());

  const rcfc = read0ea(fake<PossibleAMugLike>());
  expectAssignable<AState>(rcfc);
  expectAssignable<typeof rcfc>(fake<AState>());

  expectType<AState>(read0ea(fake<DirtyAMug>()));
  expectType<BiggerState>(read0ea(fake<BiggerState>()));
  expectType<ObjectState>(read0ea(fake<ObjectState>()));

  // @ts-expect-error
  read0ea();

  // @ts-expect-error
  read0ea(fake<AState>(), fake<any>());
});

test('WriteProc, SetIt, AssignPatch', () => {
  type Write353 = WriteProc<<TState>(state: TState) => TState>;

  expectType<
    (<TMugLike>(mugLike: TMugLike) => TMugLike) & WriteProcMeta<<TState>(state: TState) => TState>
  >(fake<Write353>());

  expectType<Write353>(fake<WriteProc<Write353>>());

  // =-=-=

  expectType<
    (<TMugLike>(mugLike: TMugLike, s: string) => TMugLike) &
      WriteProcMeta<<TState>(state: TState, s: string) => TState>
  >(fake<WriteProc<<TState>(state: TState, s: string) => TState>>());

  // =-=-=

  expectType<
    (<TMugLike extends PossibleMugLike<AState>>(mugLike: TMugLike) => TMugLike) &
      WriteProcMeta<<TState extends AState>(state: TState) => TState>
  >(fake<WriteProc<<TState extends AState>(state: TState) => TState>>());

  // =-=-=

  type Writecbd = WriteProc<(state: AState) => AState>;

  expectType<
    (<TMugLike extends PossibleMugLike<AState>>(mugLike: TMugLike) => TMugLike) &
      WriteProcMeta<(state: AState) => AState>
  >(fake<Writecbd>());

  expectType<Writecbd>(fake<WriteProc<Writecbd>>());

  // =-=-=

  expectType<
    (<TMugLike extends PossibleMugLike<AState>>(mugLike: TMugLike, s: string) => TMugLike) &
      WriteProcMeta<(state: AState, s: string) => AState>
  >(fake<WriteProc<(state: AState, s: string) => AState>>());

  // =-=-=

  expectType<
    (<TMugLike extends PossibleMugLike<AState>>(mugLike: TMugLike, s: string) => TMugLike) &
      WriteProcMeta<(state: AState, s: string) => BiggerState>
  >(fake<WriteProc<(state: AState, s: string) => BiggerState>>());

  // =-=-=

  fake<WriteProc<(state: AState, s: string) => ObjectState>>();

  // =-=-=

  type Writec03 = WriteProc<() => AState>;

  expectType<
    (<TMugLike extends PossibleMugLike<AState>>(mugLike?: TMugLike) => TMugLike) &
      WriteProcMeta<() => AState>
  >(fake<Writec03>());

  expectType<Writec03>(fake<WriteProc<Writec03>>());

  // =-=-=

  expectType<
    (<TMugLike>(mugLike: TMugLike, patch: PossiblePatch<NoInfer<TMugLike>>) => TMugLike) &
      WriteProcMeta<AssignPatch>
  >(fake<SetIt>());

  expectType<SetIt>(fake<WriteProc<SetIt>>());
});

test('w, pure, setIt, assignPatch', () => {
  // @ts-expect-error
  w(r((state: any) => state));

  // =-=-=

  const write73d = w(<TState>(state: TState): TState => state);

  expectType<typeof write73d>(w(write73d));

  expectType<WriteProc<<TState>(state: TState) => TState>>(write73d);

  expectType<AState>(write73d(fake<AState>()));
  expectType<AMug>(write73d(fake<AMug>()));
  expectType<CompositeAMug>(write73d(fake<CompositeAMug>()));
  expectType<AMugLike>(write73d(fake<AMugLike>()));
  expectType<PossibleAMug>(write73d(fake<PossibleAMug>()));
  expectType<PossibleAMugLike>(write73d(fake<PossibleAMugLike>()));
  expectType<DirtyAMug>(write73d(fake<DirtyAMug>()));
  expectType<BiggerState>(write73d(fake<BiggerState>()));
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
  expectType<BiggerState>(writed09(fake<BiggerState>()));

  // @ts-expect-error
  writed09(fake<ObjectState>());

  // =-=-=

  const writecdd = w((state: AState) => state);

  expectType<WriteProc<(state: AState) => AState>>(writecdd);

  expectType<typeof writecdd>(w(writecdd));

  expectType<AState>(writecdd(fake<AState>()));
  expectType<AMug>(writecdd(fake<AMug>()));
  expectType<CompositeAMug>(writecdd(fake<CompositeAMug>()));
  expectType<AMugLike>(writecdd(fake<AMugLike>()));
  expectType<PossibleAMug>(writecdd(fake<PossibleAMug>()));
  expectType<PossibleAMugLike>(writecdd(fake<PossibleAMugLike>()));
  expectType<DirtyAMug>(writecdd(fake<DirtyAMug>()));
  expectType<BiggerState>(writecdd(fake<BiggerState>()));

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

  const write490 = w((state: AState) => fake<BiggerState>());

  expectType<WriteProc<(state: AState) => BiggerState>>(write490);

  expectType<AState>(write490(fake<AState>()));
  expectType<BiggerState>(write490(fake<BiggerState>()));

  // @ts-expect-error
  write490(fake<ObjectState>());

  // =-=-=

  // @ts-expect-error
  w((state: AState) => fake<ObjectState>());

  // =-=-=

  const write181 = w(() => fake<AState>());

  expectType<WriteProc<() => AState>>(write181);

  expectType<AState>(write181());
  expectType<AState>(write181(fake<AState>()));
  expectType<AMug>(write181(fake<AMug>()));
  expectType<CompositeAMug>(write181(fake<CompositeAMug>()));
  expectType<AMugLike>(write181(fake<AMugLike>()));
  expectType<PossibleAMug>(write181(fake<PossibleAMug>()));
  expectType<PossibleAMugLike>(write181(fake<PossibleAMugLike>()));
  expectType<DirtyAMug>(write181(fake<DirtyAMug>()));
  expectType<BiggerState>(write181(fake<BiggerState>()));

  // @ts-expect-error
  write181(fake<ObjectState>());

  // @ts-expect-error
  write181(fake<AState>(), fake<any>());

  // =-=-=

  const write09e = w();

  expectType<SetIt>(write09e);

  expectType<typeof write09e>(w(write09e));

  expectType<typeof write09e>(w(assignPatch));

  expectType<typeof write09e>(setIt);

  const patchcd2 = { potentialMuggyObject: { o: { s: fake<string>() } } };

  expectType<AState>(write09e(fake<AState>(), patchcd2));
  expectType<AMug>(write09e(fake<AMug>(), patchcd2));
  expectType<CompositeAMug>(write09e(fake<CompositeAMug>(), patchcd2));
  expectType<AMugLike>(write09e(fake<AMugLike>(), patchcd2));
  expectType<PossibleAMug>(write09e(fake<PossibleAMug>(), patchcd2));
  expectType<PossibleAMugLike>(write09e(fake<PossibleAMugLike>(), patchcd2));
  expectType<DirtyAMug>(write09e(fake<DirtyAMug>(), patchcd2));
  expectType<ObjectState>(write09e(fake<ObjectState>(), { o: { s: fake<string>() } }));
  expectType<BiggerState>(write09e(fake<BiggerState>(), patchcd2));

  // @ts-expect-error
  write09e(fake<AState>(), { n: fake<number>() });

  // @ts-expect-error
  write09e(fake<AState>(), { s: fake<string>(), n: fake<number>() });

  // @ts-expect-error
  write09e(fake<AState>());

  // @ts-expect-error
  write09e(fake<AState>(), patchcd2, fake<any>());
});

test('initial', () => {
  expectType<AState>(initial(fake<AState>()));
  expectType<AState>(initial(fake<AMug>()));
  expectType<AState>(initial(fake<CompositeAMug>()));
  expectType<AState>(initial(fake<AMugLike>()));

  const r99b = initial(fake<PossibleAMug>());
  expectAssignable<AState>(r99b);
  expectAssignable<typeof r99b>(fake<AState>());

  const rc79 = initial(fake<PossibleAMugLike>());
  expectAssignable<AState>(rc79);
  expectAssignable<typeof rc79>(fake<AState>());

  expectType<AState>(initial(fake<DirtyAMug>()));
});
