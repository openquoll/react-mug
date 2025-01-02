import { expectAssignable, expectType } from 'tsd';

import { fake } from '../../tests/type-utils';
import {
  _bidFnAssignPatch,
  _builtinId,
  AssignPatch,
  assignPatch,
  PassThrough,
  passThrough,
  PossiblePatch,
} from '../builtin';
import {
  r as flatR,
  w as flatW,
  GetIt,
  getIt,
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
  pure,
  ReadSpecialOpMeta,
  WithAttachments,
  WriteSpecialOpMeta,
} from '../mug';
import { ReadSpecialOp, upon, WriteSpecialOp } from './special';

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

const uponCompositeAMug = upon(fake<CompositeAMug>());

const [r, w] = uponCompositeAMug;

const [aMugR, aMugW] = upon(fake<AMug>());
const [aMugLikeR, aMugLikeW] = upon(fake<AMugLike>());
const [possibleAMugR, possibleAMugW] = upon(fake<PossibleAMug>());
const [possibleAMugLikeR, possibleAMugLikeW] = upon(fake<PossibleAMugLike>());
const [dirtyAMugR, dirtyAMugW] = upon(fake<DirtyAMug>());

test('ReadSpecialOp, GetIt, PassThrough', () => {
  type Read3dd = ReadSpecialOp<(state: AState) => ObjectState, CompositeAMug>;

  expectType<
    (() => ObjectState) & ReadSpecialOpMeta<(state: AState) => ObjectState, CompositeAMug>
  >(fake<Read3dd>());

  expectType<Read3dd>(
    fake<ReadSpecialOp<ReadProc<(state: AState) => ObjectState>, CompositeAMug>>(),
  );

  // =-=-=

  expectType<(() => ObjectState) & ReadSpecialOpMeta<(state: AState) => ObjectState, AMug>>(
    fake<ReadSpecialOp<(state: AState) => ObjectState, AMug>>(),
  );

  // =-=-=

  expectType<(() => ObjectState) & ReadSpecialOpMeta<(state: AState) => ObjectState, AMugLike>>(
    fake<ReadSpecialOp<(state: AState) => ObjectState, AMugLike>>(),
  );

  // =-=-=

  expectType<(() => ObjectState) & ReadSpecialOpMeta<(state: AState) => ObjectState, PossibleAMug>>(
    fake<ReadSpecialOp<(state: AState) => ObjectState, PossibleAMug>>(),
  );

  // =-=-=

  expectType<
    (() => ObjectState) & ReadSpecialOpMeta<(state: AState) => ObjectState, PossibleAMugLike>
  >(fake<ReadSpecialOp<(state: AState) => ObjectState, PossibleAMugLike>>());

  // =-=-=

  expectType<(() => ObjectState) & ReadSpecialOpMeta<(state: AState) => ObjectState, DirtyAMug>>(
    fake<ReadSpecialOp<(state: AState) => ObjectState, DirtyAMug>>(),
  );

  // =-=-=

  expectType<
    ((s: string) => ObjectState) &
      ReadSpecialOpMeta<(state: AState, s: string) => ObjectState, CompositeAMug>
  >(fake<ReadSpecialOp<(state: AState, s: string) => ObjectState, CompositeAMug>>());

  // =-=-=

  expectType<
    (() => ObjectState) & ReadSpecialOpMeta<(state: ObjectState) => ObjectState, CompositeAMug>
  >(fake<ReadSpecialOp<(state: ObjectState) => ObjectState, CompositeAMug>>());

  // =-=-=

  fake<ReadSpecialOp<(state: SuperState) => ObjectState, CompositeAMug>>();

  // =-=-=

  fake<ReadSpecialOp<(state: { n: number }) => ObjectState, CompositeAMug>>();

  // =-=-=

  type Read68a = ReadSpecialOp<<TState>(state: TState) => TState, CompositeAMug>;

  expectType<(() => AState) & ReadSpecialOpMeta<<TState>(state: TState) => TState, CompositeAMug>>(
    fake<Read68a>(),
  );

  expectType<Read68a>(
    fake<ReadSpecialOp<ReadProc<<TState>(state: TState) => TState>, CompositeAMug>>(),
  );

  // =-=-=

  expectType<
    (() => AState) &
      ReadSpecialOpMeta<<TState extends AState>(state: TState) => TState, CompositeAMug>
  >(fake<ReadSpecialOp<<TState extends AState>(state: TState) => TState, CompositeAMug>>());

  // =-=-=

  expectType<
    (() => AState) &
      ReadSpecialOpMeta<<TState extends ObjectState>(state: TState) => TState, CompositeAMug>
  >(fake<ReadSpecialOp<<TState extends ObjectState>(state: TState) => TState, CompositeAMug>>());

  // =-=-=

  fake<ReadSpecialOp<<TState extends SuperState>(state: TState) => TState, CompositeAMug>>();

  // =-=-=

  type Readc14 = ReadSpecialOp<() => ObjectState, CompositeAMug>;

  expectType<(() => ObjectState) & ReadSpecialOpMeta<() => ObjectState, CompositeAMug>>(
    fake<Readc14>(),
  );

  expectType<Readc14>(fake<ReadSpecialOp<ReadProc<() => ObjectState>, CompositeAMug>>());

  // =-=-=

  type Read43e = ReadSpecialOp<GetIt, CompositeAMug>;

  expectType<(() => AState) & ReadSpecialOpMeta<ReadProc, CompositeAMug>>(fake<Read43e>());

  expectType<Read43e>(fake<ReadSpecialOp<ReadProc, CompositeAMug>>());

  expectType<Read43e>(fake<ReadSpecialOp<PassThrough, CompositeAMug>>());
});

test('upon#r, pure, getIt, passThrough', () => {
  expectType<typeof uponCompositeAMug.r>(r);

  // @ts-expect-error
  r(w());

  // =-=-=

  const readc7e = r((state) => {
    expectType<AState>(state);
    return fake<ObjectState>();
  });

  expectType<ReadSpecialOp<(state: AState) => ObjectState, CompositeAMug>>(readc7e);

  expectType<typeof readc7e>(r(flatR((state: AState) => fake<ObjectState>())));

  pure(readc7e);
  expectType<(state: AState) => ObjectState>(pure(readc7e));

  expectType<ObjectState>(readc7e());

  // @ts-expect-error
  readc7e(fake<any>());

  // =-=-=

  const read50d = aMugR((state) => {
    expectType<AState>(state);
    return fake<ObjectState>();
  });

  expectType<ObjectState>(read50d());

  // =-=-=

  const read3c4 = aMugLikeR((state) => {
    expectType<AState>(state);
    return fake<ObjectState>();
  });

  expectType<ObjectState>(read3c4());

  // =-=-=

  const readd1a = possibleAMugR((state) => {
    expectAssignable<AState>(state);
    expectAssignable<typeof state>(fake<AState>());
    return fake<ObjectState>();
  });

  expectType<ObjectState>(readd1a());

  // =-=-=

  const read1c3 = possibleAMugLikeR((state) => {
    expectAssignable<AState>(state);
    expectAssignable<typeof state>(fake<AState>());
    return fake<ObjectState>();
  });

  expectType<ObjectState>(read1c3());

  // =-=-=

  const read8d6 = dirtyAMugR((state) => {
    expectType<AState>(state);
    return fake<ObjectState>();
  });

  expectType<ObjectState>(read8d6());

  // =-=-=

  const read9ad = r((state, s: string) => fake<ObjectState>());

  read9ad(fake<string>());

  // @ts-expect-error
  read9ad();

  // @ts-expect-error
  read9ad(fake<number>());

  // @ts-expect-error
  read9ad(fake<string>(), fake<any>());

  // =-=-=

  const read6a9 = r((state: ObjectState) => fake<ObjectState>());

  expectType<ObjectState>(read6a9());

  // =-=-=

  // @ts-expect-error
  r((state: SuperState) => fake<ObjectState>());

  // =-=-=

  // @ts-expect-error
  r((state: { n: number }) => fake<ObjectState>());

  // =-=-=

  const reade33 = r(<TState>(state: TState): TState => state);

  expectType<ReadSpecialOp<<TState>(state: TState) => TState, CompositeAMug>>(reade33);

  expectType<typeof reade33>(r(flatR(<TState>(state: TState): TState => state)));

  expectType<<TState>(state: TState) => TState>(pure(reade33));

  expectType<AState>(reade33());

  // @ts-expect-error
  reade33(fake<any>());

  // =-=-=

  const readf8d = r(<TState extends AState>(state: TState): TState => state);

  expectType<AState>(readf8d());

  // =-=-=

  const read45f = r(<TState extends ObjectState>(state: TState): TState => state);

  expectType<AState>(read45f());

  // =-=-=

  // @ts-expect-error
  r(<TState extends SuperState>(state: TState): TState => state);

  // =-=-=

  const readfeb = r(() => fake<ObjectState>());

  expectType<ReadSpecialOp<() => ObjectState, CompositeAMug>>(readfeb);

  expectType<typeof readfeb>(r(flatR(() => fake<ObjectState>())));

  expectType<() => ObjectState>(pure(readfeb));

  expectType<ObjectState>(readfeb());

  // @ts-expect-error
  readfeb(fake<any>());

  // =-=-=

  const read776 = r();

  expectType<ReadSpecialOp<GetIt, CompositeAMug>>(read776);

  expectType<typeof read776>(r(flatR(<TState>(state: TState) => state)));

  expectType<<TState>(state: TState) => TState>(pure(read776));

  expectType<typeof read776>(r(passThrough));

  expectType<typeof read776>(r(getIt));

  expectType<AState>(read776());

  // @ts-expect-error
  read776(fake<any>());
});

test('WriteSpecialOp, SetIt, AssignPatch', () => {
  type Writea2e = WriteSpecialOp<(state: AState) => AState, CompositeAMug>;

  expectType<(() => void) & WriteSpecialOpMeta<(state: AState) => AState, CompositeAMug>>(
    fake<Writea2e>(),
  );

  expectType<Writea2e>(fake<WriteSpecialOp<WriteProc<(state: AState) => AState>, CompositeAMug>>());

  // =-=-=

  expectType<(() => void) & WriteSpecialOpMeta<(state: AState) => AState, AMug>>(
    fake<WriteSpecialOp<(state: AState) => AState, AMug>>(),
  );

  // =-=-=

  expectType<(() => void) & WriteSpecialOpMeta<(state: AState) => AState, AMugLike>>(
    fake<WriteSpecialOp<(state: AState) => AState, AMugLike>>(),
  );

  // =-=-=

  expectType<(() => void) & WriteSpecialOpMeta<(state: AState) => AState, PossibleAMug>>(
    fake<WriteSpecialOp<(state: AState) => AState, PossibleAMug>>(),
  );

  // =-=-=

  expectType<(() => void) & WriteSpecialOpMeta<(state: AState) => AState, PossibleAMugLike>>(
    fake<WriteSpecialOp<(state: AState) => AState, PossibleAMugLike>>(),
  );

  // =-=-=

  expectType<(() => void) & WriteSpecialOpMeta<(state: AState) => AState, DirtyAMug>>(
    fake<WriteSpecialOp<(state: AState) => AState, DirtyAMug>>(),
  );

  // =-=-=

  expectType<
    ((s: string) => void) & WriteSpecialOpMeta<(state: AState, s: string) => AState, CompositeAMug>
  >(fake<WriteSpecialOp<(state: AState, s: string) => AState, CompositeAMug>>());

  // =-=-=

  expectType<(() => void) & WriteSpecialOpMeta<(state: AState) => SuperState, CompositeAMug>>(
    fake<WriteSpecialOp<(state: AState) => SuperState, CompositeAMug>>(),
  );

  // =-=-=

  fake<WriteSpecialOp<(state: AState) => ObjectState, CompositeAMug>>();

  // =-=-=

  expectType<(() => void) & WriteSpecialOpMeta<(state: ObjectState) => AState, CompositeAMug>>(
    fake<WriteSpecialOp<(state: ObjectState) => AState, CompositeAMug>>(),
  );

  // =-=-=

  fake<WriteSpecialOp<(state: SuperState) => AState, CompositeAMug>>();

  // =-=-=

  fake<WriteSpecialOp<(state: { n: number }) => AState, CompositeAMug>>();

  // =-=-=

  fake<WriteSpecialOp<(state: AState) => { n: number }, CompositeAMug>>();

  // =-=-=

  type Write42b = WriteSpecialOp<<TState>(state: TState) => TState, CompositeAMug>;

  expectType<(() => void) & WriteSpecialOpMeta<<TState>(state: TState) => TState, CompositeAMug>>(
    fake<Write42b>(),
  );

  expectType<Write42b>(
    fake<WriteSpecialOp<WriteProc<<TState>(state: TState) => TState>, CompositeAMug>>(),
  );

  // =-=-=

  expectType<
    (() => void) &
      WriteSpecialOpMeta<<TState extends AState>(state: TState) => TState, CompositeAMug>
  >(fake<WriteSpecialOp<<TState extends AState>(state: TState) => TState, CompositeAMug>>());

  // =-=-=

  expectType<
    (() => void) &
      WriteSpecialOpMeta<<TState extends ObjectState>(state: TState) => TState, CompositeAMug>
  >(fake<WriteSpecialOp<<TState extends ObjectState>(state: TState) => TState, CompositeAMug>>());

  // =-=-=

  fake<WriteSpecialOp<<TState extends SuperState>(state: TState) => TState, CompositeAMug>>();

  // =-=-=

  type Write697 = WriteSpecialOp<() => AState, CompositeAMug>;

  expectType<(() => void) & WriteSpecialOpMeta<() => AState, CompositeAMug>>(fake<Write697>());

  expectType<Write697>(fake<WriteSpecialOp<WriteProc<() => AState>, CompositeAMug>>());

  // =-=-=

  expectType<(() => void) & WriteSpecialOpMeta<() => SuperState, CompositeAMug>>(
    fake<WriteSpecialOp<() => SuperState, CompositeAMug>>(),
  );

  // =-=-=

  fake<WriteSpecialOp<() => ObjectState, CompositeAMug>>();

  // =-=-=

  type Write4f8 = WriteSpecialOp<SetIt, CompositeAMug>;

  expectType<
    ((patch: PossiblePatch<NoInfer<AState>>) => void) & WriteSpecialOpMeta<WriteProc, CompositeAMug>
  >(fake<Write4f8>());

  expectType<Write4f8>(fake<WriteSpecialOp<WriteProc, CompositeAMug>>());

  expectType<Write4f8>(fake<WriteSpecialOp<AssignPatch, CompositeAMug>>());
});

test('upon#w, pure, setIt, assignPatch', () => {
  expectType<typeof uponCompositeAMug.w>(w);

  // @ts-expect-error
  w(r());

  // =-=-=

  const write30d = w((state) => {
    expectType<AState>(state);
    return state;
  });

  expectType<WriteSpecialOp<(state: AState) => AState, CompositeAMug>>(write30d);

  expectType<typeof write30d>(w(flatW((state: AState) => state)));

  expectType<(state: AState) => AState>(pure(write30d));

  expectType<void>(write30d());

  // @ts-expect-error
  write30d(fake<any>());

  // =-=-=

  const write50d = aMugW((state) => {
    expectType<AState>(state);
    return state;
  });

  expectType<void>(write50d());

  // =-=-=

  const write113 = aMugLikeW((state) => {
    expectType<AState>(state);
    return state;
  });

  expectType<void>(write113());

  // =-=-=

  const write36c = possibleAMugW((state) => {
    expectAssignable<AState>(state);
    expectAssignable<typeof state>(fake<AState>());
    return state;
  });

  expectType<void>(write36c());

  // =-=-=

  const writedd7 = possibleAMugLikeW((state) => {
    expectAssignable<AState>(state);
    expectAssignable<typeof state>(fake<AState>());
    return state;
  });

  expectType<void>(writedd7());

  // =-=-=

  const write203 = dirtyAMugW((state) => {
    expectType<AState>(state);
    return state;
  });

  expectType<void>(write203());

  // =-=-=

  const writebb8 = w((state, s: string) => state);

  writebb8(fake<string>());

  // @ts-expect-error
  writebb8();

  // @ts-expect-error
  writebb8(fake<number>());

  // @ts-expect-error
  writebb8(fake<string>(), fake<any>());

  // =-=-=

  const writee27 = w((state) => fake<SuperState>());

  expectType<void>(writee27());

  // =-=-=

  // @ts-expect-error
  w((state) => fake<ObjectState>());

  // =-=-=

  const write8b5 = w((state: ObjectState) => fake<AState>());

  expectType<void>(write8b5());

  // =-=-=

  // @ts-expect-error
  w((state: SuperState) => fake<AState>());

  // =-=-=

  // @ts-expect-error
  w((state: { n: number }) => fake<AState>());

  // =-=-=

  // @ts-expect-error
  w((state) => fake<{ n: number }>());

  // =-=-=

  const write3f7 = w(<TState>(state: TState): TState => state);

  expectType<WriteSpecialOp<<TState>(state: TState) => TState, CompositeAMug>>(write3f7);

  expectType<typeof write3f7>(w(flatW(<TState>(state: TState): TState => state)));

  expectType<<TState>(state: TState) => TState>(pure(write3f7));

  expectType<void>(write3f7());

  // @ts-expect-error
  write3f7(fake<any>());

  // =-=-=

  const write519 = w(<TState extends AState>(state: TState): TState => state);

  expectType<void>(write519());

  // =-=-=

  const write4fd = w(<TState extends ObjectState>(state: TState): TState => state);

  expectType<void>(write4fd());

  // =-=-=

  // @ts-expect-error
  w(<TState extends SuperState>(state: TState): TState => state);

  // =-=-=

  const writed5e = w(() => fake<AState>());

  expectType<WriteSpecialOp<() => AState, CompositeAMug>>(writed5e);

  expectType<typeof writed5e>(w(flatW(() => fake<AState>())));

  expectType<() => AState>(pure(writed5e));

  expectType<void>(writed5e());

  // @ts-expect-error
  writed5e(fake<any>());

  // =-=-=

  const write6bb = w(() => fake<SuperState>());

  expectType<void>(write6bb());

  // =-=-=

  // @ts-expect-error
  w(() => fake<ObjectState>());

  // =-=-=

  const write8db = w();

  expectType<WriteSpecialOp<SetIt, CompositeAMug>>(write8db);

  expectType<{
    <TState>(state: TState, patch: PossiblePatch<NoInfer<TState>>): TState;
    [_builtinId]: typeof _bidFnAssignPatch;
  }>(pure(write8db));

  expectType<typeof write8db>(w(assignPatch));

  expectType<typeof write8db>(w(setIt));

  const patch422 = { potentialMuggyObject: { o: { s: fake<string>() } } };

  expectType<void>(write8db(patch422));

  // @ts-expect-error
  write8db();

  // @ts-expect-error
  write8db(patch422, fake<any>());
});
