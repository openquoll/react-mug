import { expectAssignable, expectType } from 'tsd';

import { fake } from '../tests/type-utils';
import { ReadAction, upon, WriteAction } from './actions';
import {
  _bidFnAssignPatch,
  _builtinId,
  AssignPatch,
  assignPatch,
  PassThrough,
  passThrough,
  PossiblePatch,
} from './builtin';
import {
  Mug,
  MugLike,
  PossibleMug,
  PossibleMugLike,
  pure,
  ReadActionMeta,
  WithAttachments,
  WriteActionMeta,
} from './mug';
import { r as flatR, w as flatW, GetIt, getIt, ReadProc, SetIt, setIt, WriteProc } from './mechanism';

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

test('ReadAction, GetIt, PassThrough', () => {
  type Read3dd = ReadAction<(state: AState) => ObjectState, CompositeAMug>;

  expectType<(() => ObjectState) & ReadActionMeta<(state: AState) => ObjectState, CompositeAMug>>(
    fake<Read3dd>(),
  );

  expectType<Read3dd>(fake<ReadAction<ReadProc<(state: AState) => ObjectState>, CompositeAMug>>());

  // =-=-=

  expectType<(() => ObjectState) & ReadActionMeta<(state: AState) => ObjectState, AMug>>(
    fake<ReadAction<(state: AState) => ObjectState, AMug>>(),
  );

  // =-=-=

  expectType<(() => ObjectState) & ReadActionMeta<(state: AState) => ObjectState, AMugLike>>(
    fake<ReadAction<(state: AState) => ObjectState, AMugLike>>(),
  );

  // =-=-=

  expectType<(() => ObjectState) & ReadActionMeta<(state: AState) => ObjectState, PossibleAMug>>(
    fake<ReadAction<(state: AState) => ObjectState, PossibleAMug>>(),
  );

  // =-=-=

  expectType<
    (() => ObjectState) & ReadActionMeta<(state: AState) => ObjectState, PossibleAMugLike>
  >(fake<ReadAction<(state: AState) => ObjectState, PossibleAMugLike>>());

  // =-=-=

  expectType<(() => ObjectState) & ReadActionMeta<(state: AState) => ObjectState, DirtyAMug>>(
    fake<ReadAction<(state: AState) => ObjectState, DirtyAMug>>(),
  );

  // =-=-=

  expectType<
    ((s: string) => ObjectState) &
      ReadActionMeta<(state: AState, s: string) => ObjectState, CompositeAMug>
  >(fake<ReadAction<(state: AState, s: string) => ObjectState, CompositeAMug>>());

  // =-=-=

  expectType<
    (() => ObjectState) & ReadActionMeta<(state: ObjectState) => ObjectState, CompositeAMug>
  >(fake<ReadAction<(state: ObjectState) => ObjectState, CompositeAMug>>());

  // =-=-=

  fake<ReadAction<(state: SuperState) => ObjectState, CompositeAMug>>();

  // =-=-=

  fake<ReadAction<(state: { n: number }) => ObjectState, CompositeAMug>>();

  // =-=-=

  type Read68a = ReadAction<<TState>(state: TState) => TState, CompositeAMug>;

  expectType<(() => AState) & ReadActionMeta<<TState>(state: TState) => TState, CompositeAMug>>(
    fake<Read68a>(),
  );

  expectType<Read68a>(fake<ReadAction<ReadProc<<TState>(state: TState) => TState>, CompositeAMug>>());

  // =-=-=

  expectType<
    (() => AState) & ReadActionMeta<<TState extends AState>(state: TState) => TState, CompositeAMug>
  >(fake<ReadAction<<TState extends AState>(state: TState) => TState, CompositeAMug>>());

  // =-=-=

  expectType<
    (() => AState) &
      ReadActionMeta<<TState extends ObjectState>(state: TState) => TState, CompositeAMug>
  >(fake<ReadAction<<TState extends ObjectState>(state: TState) => TState, CompositeAMug>>());

  // =-=-=

  fake<ReadAction<<TState extends SuperState>(state: TState) => TState, CompositeAMug>>();

  // =-=-=

  type Readc14 = ReadAction<() => ObjectState, CompositeAMug>;

  expectType<(() => ObjectState) & ReadActionMeta<() => ObjectState, CompositeAMug>>(
    fake<Readc14>(),
  );

  expectType<Readc14>(fake<ReadAction<ReadProc<() => ObjectState>, CompositeAMug>>());

  // =-=-=

  type Read43e = ReadAction<GetIt, CompositeAMug>;

  expectType<(() => AState) & ReadActionMeta<ReadProc, CompositeAMug>>(fake<Read43e>());

  expectType<Read43e>(fake<ReadAction<ReadProc, CompositeAMug>>());

  expectType<Read43e>(fake<ReadAction<PassThrough, CompositeAMug>>());
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

  expectType<ReadAction<(state: AState) => ObjectState, CompositeAMug>>(readc7e);

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

  expectType<ReadAction<<TState>(state: TState) => TState, CompositeAMug>>(reade33);

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

  expectType<ReadAction<() => ObjectState, CompositeAMug>>(readfeb);

  expectType<typeof readfeb>(r(flatR(() => fake<ObjectState>())));

  expectType<() => ObjectState>(pure(readfeb));

  expectType<ObjectState>(readfeb());

  // @ts-expect-error
  readfeb(fake<any>());

  // =-=-=

  const read776 = r();

  expectType<ReadAction<GetIt, CompositeAMug>>(read776);

  expectType<typeof read776>(r(flatR(<TState>(state: TState) => state)));

  expectType<<TState>(state: TState) => TState>(pure(read776));

  expectType<typeof read776>(r(passThrough));

  expectType<typeof read776>(r(getIt));

  expectType<AState>(read776());

  // @ts-expect-error
  read776(fake<any>());
});

test('WriteAction, SetIt, AssignPatch', () => {
  type Writea2e = WriteAction<(state: AState) => AState, CompositeAMug>;

  expectType<(() => void) & WriteActionMeta<(state: AState) => AState, CompositeAMug>>(
    fake<Writea2e>(),
  );

  expectType<Writea2e>(fake<WriteAction<WriteProc<(state: AState) => AState>, CompositeAMug>>());

  // =-=-=

  expectType<(() => void) & WriteActionMeta<(state: AState) => AState, AMug>>(
    fake<WriteAction<(state: AState) => AState, AMug>>(),
  );

  // =-=-=

  expectType<(() => void) & WriteActionMeta<(state: AState) => AState, AMugLike>>(
    fake<WriteAction<(state: AState) => AState, AMugLike>>(),
  );

  // =-=-=

  expectType<(() => void) & WriteActionMeta<(state: AState) => AState, PossibleAMug>>(
    fake<WriteAction<(state: AState) => AState, PossibleAMug>>(),
  );

  // =-=-=

  expectType<(() => void) & WriteActionMeta<(state: AState) => AState, PossibleAMugLike>>(
    fake<WriteAction<(state: AState) => AState, PossibleAMugLike>>(),
  );

  // =-=-=

  expectType<(() => void) & WriteActionMeta<(state: AState) => AState, DirtyAMug>>(
    fake<WriteAction<(state: AState) => AState, DirtyAMug>>(),
  );

  // =-=-=

  expectType<
    ((s: string) => void) & WriteActionMeta<(state: AState, s: string) => AState, CompositeAMug>
  >(fake<WriteAction<(state: AState, s: string) => AState, CompositeAMug>>());

  // =-=-=

  expectType<(() => void) & WriteActionMeta<(state: AState) => SuperState, CompositeAMug>>(
    fake<WriteAction<(state: AState) => SuperState, CompositeAMug>>(),
  );

  // =-=-=

  fake<WriteAction<(state: AState) => ObjectState, CompositeAMug>>();

  // =-=-=

  expectType<(() => void) & WriteActionMeta<(state: ObjectState) => AState, CompositeAMug>>(
    fake<WriteAction<(state: ObjectState) => AState, CompositeAMug>>(),
  );

  // =-=-=

  fake<WriteAction<(state: SuperState) => AState, CompositeAMug>>();

  // =-=-=

  fake<WriteAction<(state: { n: number }) => AState, CompositeAMug>>();

  // =-=-=

  fake<WriteAction<(state: AState) => { n: number }, CompositeAMug>>();

  // =-=-=

  type Write42b = WriteAction<<TState>(state: TState) => TState, CompositeAMug>;

  expectType<(() => void) & WriteActionMeta<<TState>(state: TState) => TState, CompositeAMug>>(
    fake<Write42b>(),
  );

  expectType<Write42b>(
    fake<WriteAction<WriteProc<<TState>(state: TState) => TState>, CompositeAMug>>(),
  );

  // =-=-=

  expectType<
    (() => void) & WriteActionMeta<<TState extends AState>(state: TState) => TState, CompositeAMug>
  >(fake<WriteAction<<TState extends AState>(state: TState) => TState, CompositeAMug>>());

  // =-=-=

  expectType<
    (() => void) &
      WriteActionMeta<<TState extends ObjectState>(state: TState) => TState, CompositeAMug>
  >(fake<WriteAction<<TState extends ObjectState>(state: TState) => TState, CompositeAMug>>());

  // =-=-=

  fake<WriteAction<<TState extends SuperState>(state: TState) => TState, CompositeAMug>>();

  // =-=-=

  type Write697 = WriteAction<() => AState, CompositeAMug>;

  expectType<(() => void) & WriteActionMeta<() => AState, CompositeAMug>>(fake<Write697>());

  expectType<Write697>(fake<WriteAction<WriteProc<() => AState>, CompositeAMug>>());

  // =-=-=

  expectType<(() => void) & WriteActionMeta<() => SuperState, CompositeAMug>>(
    fake<WriteAction<() => SuperState, CompositeAMug>>(),
  );

  // =-=-=

  fake<WriteAction<() => ObjectState, CompositeAMug>>();

  // =-=-=

  type Write4f8 = WriteAction<SetIt, CompositeAMug>;

  expectType<
    ((patch: PossiblePatch<NoInfer<AState>>) => void) & WriteActionMeta<WriteProc, CompositeAMug>
  >(fake<Write4f8>());

  expectType<Write4f8>(fake<WriteAction<WriteProc, CompositeAMug>>());

  expectType<Write4f8>(fake<WriteAction<AssignPatch, CompositeAMug>>());
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

  expectType<WriteAction<(state: AState) => AState, CompositeAMug>>(write30d);

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

  expectType<WriteAction<<TState>(state: TState) => TState, CompositeAMug>>(write3f7);

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

  expectType<WriteAction<() => AState, CompositeAMug>>(writed5e);

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

  expectType<WriteAction<SetIt, CompositeAMug>>(write8db);

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
