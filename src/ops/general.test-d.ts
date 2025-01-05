import { expectAssignable, expectType } from 'tsd';

import { fake } from '../../tests/type-utils';
import {
  AssignPatch,
  assignPatch,
  DoNothing,
  PassThrough,
  passThrough,
  PossiblePatch,
} from '../builtin';
import {
  GetIt,
  getIt,
  r as procR,
  w as procW,
  ReadProc,
  SetIt,
  setIt,
  WriteProc,
} from '../mechanism';
import {
  Mug,
  MugLike,
  PossibleMug,
  PossibleMugLike,
  ReadGeneralOpMeta,
  State,
  WithAttachments,
  WriteGeneralOpMeta,
} from '../mug';
import { onto, ReadGeneralOp, WriteGeneralOp } from './general';

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

const toolbelt = onto<AState>();

const [r, w, x] = toolbelt;

test('ReadGeneralOp, GetIt, PassThrough', () => {
  type Read968 = ReadGeneralOp<(state: AState) => ObjectState, AState>;

  expectType<
    ((mugLike: PossibleMugLike<AState>) => ObjectState) &
      ReadGeneralOpMeta<(state: AState) => ObjectState, AState>
  >(fake<Read968>());

  expectType<Read968>(fake<ReadGeneralOp<ReadProc<(state: AState) => ObjectState>, AState>>());

  // =-=-=

  expectType<
    ((mugLike: PossibleMugLike<AState>, s: string) => ObjectState) &
      ReadGeneralOpMeta<(state: AState, s: string) => ObjectState, AState>
  >(fake<ReadGeneralOp<(state: AState, s: string) => ObjectState, AState>>());

  // =-=-=

  expectType<
    ((mugLike: PossibleMugLike<AState>) => ObjectState) &
      ReadGeneralOpMeta<(state: ObjectState) => ObjectState, AState>
  >(fake<ReadGeneralOp<(state: ObjectState) => ObjectState, AState>>());

  // =-=-=

  type Read0e0 = ReadGeneralOp<<TState>(state: TState) => TState, AState>;

  expectType<
    (<TMugLike extends PossibleMugLike<AState>>(mugLike: TMugLike) => State<TMugLike>) &
      ReadGeneralOpMeta<<TState>(state: TState) => TState, AState>
  >(fake<Read0e0>());

  expectType<Read0e0>(fake<ReadGeneralOp<ReadProc<<TState>(state: TState) => TState>, AState>>());

  // =-=-=

  expectType<
    (<TMugLike extends PossibleMugLike<AState>>(mugLike: TMugLike) => State<TMugLike>) &
      ReadGeneralOpMeta<<TState extends AState>(state: TState) => TState, AState>
  >(fake<ReadGeneralOp<<TState extends AState>(state: TState) => TState, AState>>());

  // =-=-=

  expectType<
    (<TMugLike extends PossibleMugLike<AState>>(mugLike: TMugLike) => State<TMugLike>) &
      ReadGeneralOpMeta<<TState extends ObjectState>(state: TState) => TState, AState>
  >(fake<ReadGeneralOp<<TState extends ObjectState>(state: TState) => TState, AState>>());

  // =-=-=

  type Readfda = ReadGeneralOp<() => ObjectState, AState>;

  expectType<((state?: unknown) => ObjectState) & ReadGeneralOpMeta<() => ObjectState, AState>>(
    fake<Readfda>(),
  );

  expectType<Readfda>(fake<ReadGeneralOp<ReadProc<() => ObjectState>, AState>>());

  // =-=-=

  type Read838 = ReadGeneralOp<GetIt, AState>;

  expectType<
    (<TMugLike extends PossibleMugLike<AState>>(mugLike: TMugLike) => State<TMugLike>) &
      ReadGeneralOpMeta<GetIt, AState>
  >(fake<Read838>());

  expectType<Read838>(fake<ReadGeneralOp<PassThrough, AState>>());
});

test('upon#r, getIt, passThrough', () => {
  expectType<typeof toolbelt.r>(r);

  // @ts-expect-error
  r(r());

  // @ts-expect-error
  r(w());

  // =-=-=

  const reada38 = r((state) => {
    expectType<AState>(state);
    return fake<ObjectState>();
  });

  expectType<ReadGeneralOp<(state: AState) => ObjectState, AState>>(reada38);

  expectType<typeof reada38>(r(procR((state: AState) => fake<ObjectState>())));

  expectType<ObjectState>(reada38(fake<AState>()));
  expectType<ObjectState>(reada38(fake<AMug>()));
  expectType<ObjectState>(reada38(fake<CompositeAMug>()));
  expectType<ObjectState>(reada38(fake<AMugLike>()));
  expectType<ObjectState>(reada38(fake<PossibleAMug>()));
  expectType<ObjectState>(reada38(fake<PossibleAMugLike>()));
  expectType<ObjectState>(reada38(fake<DirtyAMug>()));
  expectType<ObjectState>(reada38(fake<BiggerState>()));

  // @ts-expect-error
  reada38(fake<ObjectState>());

  // @ts-expect-error
  reada38();

  // @ts-expect-error
  reada38(fake<AState>(), fake<any>());

  // =-=-=

  const readb06 = r((state, s: string) => fake<ObjectState>());

  readb06(fake<AState>(), fake<string>());

  // @ts-expect-error
  readb06(fake<AState>());

  // @ts-expect-error
  readb06(fake<AState>(), fake<number>());

  // @ts-expect-error
  readb06(fake<AState>(), fake<string>(), fake<any>());

  // =-=-=

  const readd16 = r((state: ObjectState) => fake<ObjectState>());

  expectType<ObjectState>(readd16(fake<AState>()));

  // =-=-=

  // @ts-expect-error
  r((state: BiggerState) => fake<ObjectState>());

  // =-=-=

  // @ts-expect-error
  r((state: { n: number }) => fake<ObjectState>());

  // =-=-=

  const read4f8 = r(<TState>(state: TState): TState => state);

  expectType<ReadGeneralOp<<TState>(state: TState) => TState, AState>>(read4f8);

  expectType<typeof read4f8>(r(procR(<TState>(state: TState): TState => state)));

  expectType<AState>(read4f8(fake<AState>()));
  expectType<AState>(read4f8(fake<AMug>()));
  expectType<AState>(read4f8(fake<CompositeAMug>()));
  expectType<AState>(read4f8(fake<AMugLike>()));

  const re57 = read4f8(fake<PossibleAMug>());
  expectAssignable<AState>(re57);
  expectAssignable<typeof re57>(fake<AState>());

  const r876 = read4f8(fake<PossibleAMugLike>());
  expectAssignable<AState>(r876);
  expectAssignable<typeof r876>(fake<AState>());

  expectType<AState>(read4f8(fake<DirtyAMug>()));
  expectType<BiggerState>(read4f8(fake<BiggerState>()));

  // @ts-expect-error
  read4f8(fake<ObjectState>());

  // @ts-expect-error
  read4f8();

  // @ts-expect-error
  read4f8(fake<AState>(), fake<any>());

  // =-=-=

  const read00b = r(<TState extends AState>(state: TState): TState => state);

  expectType<AState>(read00b(fake<AState>()));

  // =-=-=

  const read656 = r(<TState extends ObjectState>(state: TState): TState => state);

  expectType<AState>(read656(fake<AState>()));

  // =-=-=

  // @ts-expect-error
  r(<TState extends BiggerState>(state: TState): TState => state);

  // =-=-=

  const read8fc = r(() => fake<ObjectState>());

  expectType<ReadGeneralOp<() => ObjectState, AState>>(read8fc);

  expectType<typeof read8fc>(r(procR(() => fake<ObjectState>())));

  expectType<ObjectState>(read8fc(fake<unknown>()));

  // @ts-expect-error
  read8fc(fake<unknown>(), fake<any>());

  // =-=-=

  const read499 = r();

  expectType<ReadGeneralOp<GetIt, AState>>(read499);

  expectType<typeof read499>(r(getIt));

  expectType<typeof read499>(r(passThrough));

  expectType<AState>(read499(fake<AState>()));
  expectType<AState>(read499(fake<AMug>()));
  expectType<AState>(read499(fake<CompositeAMug>()));
  expectType<AState>(read499(fake<AMugLike>()));

  const r88f = read499(fake<PossibleAMug>());
  expectAssignable<AState>(r88f);
  expectAssignable<typeof r88f>(fake<AState>());

  const r598 = read499(fake<PossibleAMugLike>());
  expectAssignable<AState>(r598);
  expectAssignable<typeof r598>(fake<AState>());

  expectType<AState>(read499(fake<DirtyAMug>()));
  expectType<BiggerState>(read499(fake<BiggerState>()));

  // @ts-expect-error
  read499(fake<ObjectState>());

  // @ts-expect-error
  read499();

  // @ts-expect-error
  read499(fake<AState>(), fake<any>());
});

test('WriteGeneralOp, SetIt, AssignPatch', () => {
  type Write504 = WriteGeneralOp<(state: AState) => AState, AState>;

  expectType<
    (<TMugLike extends PossibleMugLike<AState>>(mugLike: TMugLike) => TMugLike) &
      WriteGeneralOpMeta<(state: AState) => AState, AState>
  >(fake<Write504>());

  expectType<Write504>(fake<WriteGeneralOp<WriteProc<(state: AState) => AState>, AState>>());

  // =-=-=

  expectType<
    (<TMugLike extends PossibleMugLike<AState>>(mugLike: TMugLike, s: string) => TMugLike) &
      WriteGeneralOpMeta<(state: AState, s: string) => AState, AState>
  >(fake<WriteGeneralOp<(state: AState, s: string) => AState, AState>>());

  // =-=-=

  expectType<
    (<TMugLike extends PossibleMugLike<AState>>(mugLike: TMugLike) => TMugLike) &
      WriteGeneralOpMeta<(state: AState) => BiggerState, AState>
  >(fake<WriteGeneralOp<(state: AState) => BiggerState, AState>>());

  // =-=-=

  expectType<
    (<TMugLike extends PossibleMugLike<AState>>(mugLike: TMugLike) => TMugLike) &
      WriteGeneralOpMeta<(state: ObjectState) => AState, AState>
  >(fake<WriteGeneralOp<(state: ObjectState) => AState, AState>>());

  // =-=-=

  type Write11f = WriteGeneralOp<<TState>(state: TState) => TState, AState>;

  expectType<
    (<TMugLike extends PossibleMugLike<AState>>(mugLike: TMugLike) => TMugLike) &
      WriteGeneralOpMeta<<TState>(state: TState) => TState, AState>
  >(fake<Write11f>());

  expectType<Write11f>(
    fake<WriteGeneralOp<WriteProc<<TState>(state: TState) => TState>, AState>>(),
  );

  // =-=-=

  expectType<
    (<TMugLike extends PossibleMugLike<AState>>(mugLike: TMugLike) => TMugLike) &
      WriteGeneralOpMeta<<TState extends AState>(state: TState) => TState, AState>
  >(fake<WriteGeneralOp<<TState extends AState>(state: TState) => TState, AState>>());

  // =-=-=

  expectType<
    (<TMugLike extends PossibleMugLike<AState>>(mugLike: TMugLike) => TMugLike) &
      WriteGeneralOpMeta<<TState extends ObjectState>(state: TState) => TState, AState>
  >(fake<WriteGeneralOp<<TState extends ObjectState>(state: TState) => TState, AState>>());

  // =-=-=

  type Write465 = WriteGeneralOp<() => AState, AState>;

  expectType<
    (<TMugLike extends PossibleMugLike<AState>>(mugLike?: TMugLike) => TMugLike) &
      WriteGeneralOpMeta<() => AState, AState>
  >(fake<Write465>());

  expectType<Write465>(fake<WriteGeneralOp<WriteProc<() => AState>, AState>>());

  // =-=-=

  expectType<
    (<TMugLike extends PossibleMugLike<AState>>(mugLike?: TMugLike) => TMugLike) &
      WriteGeneralOpMeta<() => BiggerState, AState>
  >(fake<WriteGeneralOp<() => BiggerState, AState>>());

  // =-=-=

  type Write4f8 = WriteGeneralOp<SetIt, AState>;

  expectType<
    (<TMugLike extends PossibleMugLike<AState>>(
      mugLike: TMugLike,
      patch: PossiblePatch<NoInfer<TMugLike>>,
    ) => TMugLike) &
      WriteGeneralOpMeta<SetIt, AState>
  >(fake<Write4f8>());

  expectType<Write4f8>(fake<WriteGeneralOp<AssignPatch, AState>>());
});

test('upon#w, setIt, assignPatch', () => {
  expectType<typeof toolbelt.w>(w);

  // @ts-expect-error
  w(w());

  // @ts-expect-error
  w(r());

  // =-=-=

  const writeb46 = w((state) => {
    expectType<AState>(state);
    return state;
  });

  expectType<WriteGeneralOp<(state: AState) => AState, AState>>(writeb46);

  expectType<typeof writeb46>(w(procW((state: AState) => state)));

  expectType<AState>(writeb46(fake<AState>()));
  expectType<AMug>(writeb46(fake<AMug>()));
  expectType<CompositeAMug>(writeb46(fake<CompositeAMug>()));
  expectType<AMugLike>(writeb46(fake<AMugLike>()));
  expectType<PossibleAMug>(writeb46(fake<PossibleAMug>()));
  expectType<PossibleAMugLike>(writeb46(fake<PossibleAMugLike>()));
  expectType<DirtyAMug>(writeb46(fake<DirtyAMug>()));
  expectType<BiggerState>(writeb46(fake<BiggerState>()));

  // @ts-expect-error
  writeb46(fake<ObjectState>());

  // @ts-expect-error
  writeb46();

  // @ts-expect-error
  writeb46(fake<AState>(), fake<any>());

  // =-=-=

  const writed7e = w((state, s: string) => state);

  writed7e(fake<AState>(), fake<string>());

  // @ts-expect-error
  writed7e(fake<AState>());

  // @ts-expect-error
  writed7e(fake<AState>(), fake<number>());

  // @ts-expect-error
  writed7e(fake<AState>(), fake<string>(), fake<any>());

  // =-=-=

  const writefc2 = w((state) => fake<BiggerState>());

  expectType<AState>(writefc2(fake<AState>()));

  // =-=-=

  // @ts-expect-error
  w((state) => fake<ObjectState>());

  // =-=-=

  const write826 = w((state: ObjectState) => fake<AState>());

  expectType<AState>(write826(fake<AState>()));

  // =-=-=

  // @ts-expect-error
  w((state: BiggerState) => fake<AState>());

  // =-=-=

  // @ts-expect-error
  w((state: { n: number }) => fake<AState>());

  // =-=-=

  // @ts-expect-error
  w((state) => fake<{ n: number }>());

  // =-=-=

  const write207 = w(<TState>(state: TState): TState => state);

  expectType<WriteGeneralOp<<TState>(state: TState) => TState, AState>>(write207);

  expectType<typeof write207>(w(procW(<TState>(state: TState): TState => state)));

  expectType<AState>(write207(fake<AState>()));
  expectType<AMug>(write207(fake<AMug>()));
  expectType<CompositeAMug>(write207(fake<CompositeAMug>()));
  expectType<AMugLike>(write207(fake<AMugLike>()));
  expectType<PossibleAMug>(write207(fake<PossibleAMug>()));
  expectType<PossibleAMugLike>(write207(fake<PossibleAMugLike>()));
  expectType<DirtyAMug>(write207(fake<DirtyAMug>()));
  expectType<BiggerState>(write207(fake<BiggerState>()));

  // @ts-expect-error
  write207(fake<ObjectState>());

  // @ts-expect-error
  write207();

  // @ts-expect-error
  write207(fake<AState>(), fake<any>());

  // =-=-=

  const writefeb = w(<TState extends AState>(state: TState): TState => state);

  expectType<AState>(writefeb(fake<AState>()));

  // =-=-=

  const write4fd = w(<TState extends ObjectState>(state: TState): TState => state);

  expectType<AState>(write4fd(fake<AState>()));

  // =-=-=

  // @ts-expect-error
  w(<TState extends BiggerState>(state: TState): TState => state);

  // =-=-=

  const write921 = w(() => fake<AState>());

  expectType<WriteGeneralOp<() => AState, AState>>(write921);

  expectType<typeof write921>(w(procW(() => fake<AState>())));

  expectType<AState>(write921());
  expectType<AState>(write921(fake<AState>()));
  expectType<AMug>(write921(fake<AMug>()));
  expectType<CompositeAMug>(write921(fake<CompositeAMug>()));
  expectType<AMugLike>(write921(fake<AMugLike>()));
  expectType<PossibleAMug>(write921(fake<PossibleAMug>()));
  expectType<PossibleAMugLike>(write921(fake<PossibleAMugLike>()));
  expectType<DirtyAMug>(write921(fake<DirtyAMug>()));
  expectType<BiggerState>(write921(fake<BiggerState>()));

  // @ts-expect-error
  write921(fake<ObjectState>());

  // @ts-expect-error
  write921(fake<AState>(), fake<any>());

  // =-=-=

  const write485 = w(() => fake<BiggerState>());

  expectType<AState>(write485(fake<AState>()));

  // =-=-=

  // @ts-expect-error
  w(() => fake<ObjectState>());

  // =-=-=

  const writebf4 = w();

  expectType<WriteGeneralOp<SetIt, AState>>(writebf4);

  expectType<typeof writebf4>(w(setIt));

  expectType<typeof writebf4>(w(assignPatch));

  const patchb14 = { potentialMuggyObject: { o: { s: fake<string>() } } };

  expectType<AState>(writebf4(fake<AState>(), patchb14));
  expectType<AMug>(writebf4(fake<AMug>(), patchb14));
  expectType<CompositeAMug>(writebf4(fake<CompositeAMug>(), patchb14));
  expectType<AMugLike>(writebf4(fake<AMugLike>(), patchb14));
  expectType<PossibleAMug>(writebf4(fake<PossibleAMug>(), patchb14));
  expectType<PossibleAMugLike>(writebf4(fake<PossibleAMugLike>(), patchb14));
  expectType<DirtyAMug>(writebf4(fake<DirtyAMug>(), patchb14));
  expectType<BiggerState>(writebf4(fake<BiggerState>(), patchb14));

  // @ts-expect-error
  writebf4(fake<ObjectState>(), { o: { s: fake<string>() } });

  // @ts-expect-error
  writebf4(fake<AState>(), { n: fake<number>() });

  // @ts-expect-error
  writebf4(fake<AState>(), { s: fake<string>(), n: fake<number>() });

  // @ts-expect-error
  writebf4(fake<AState>());

  // @ts-expect-error
  writebf4(fake<AState>(), patchb14, fake<any>());
});

test('upon#x', async () => {
  expectType<typeof toolbelt.x>(x);

  // =-=-=

  const exec73b = x(async (mugLike) => {
    expectType<PossibleMugLike<AState>>(mugLike);
    return fake<ObjectState>();
  });

  expectType<(mugLike: PossibleMugLike<AState>) => Promise<ObjectState>>(exec73b);

  // =-=-=

  expectType<(mugLike: PossibleMugLike<AState>, s: string) => Promise<ObjectState>>(
    x(async (mugLike, s: string) => fake<ObjectState>()),
  );

  // =-=-=

  expectType<(mugLike: PossibleMugLike<AState>) => ObjectState>(
    x((mugLike) => fake<ObjectState>()),
  );

  // =-=-=

  expectType<(mugLike: PossibleMugLike<AState>, s: string) => ObjectState>(
    x((mugLike, s: string) => fake<ObjectState>()),
  );

  // =-=-=

  expectType<DoNothing>(x());

  // =-=-=

  const readd36 = r();

  expectType<typeof readd36>(x(readd36));

  // =-=-=

  const write6a8 = w();

  expectType<typeof write6a8>(x(write6a8));

  // =-=-=

  const readbe9 = procR();

  expectType<typeof readbe9>(x(readbe9));

  // =-=-=

  const write74f = procW();

  expectType<typeof write74f>(x(write74f));
});
