import { expectAssignable, expectType } from 'tsd';

import { fake } from '../tests/type-utils';
import { ReadAction, upon, WriteAction } from './actions';
import {
  _bidFnMergePatch,
  _builtinId,
  MergePatch,
  mergePatch,
  PassThrough,
  passThrough,
  PossiblePatch,
} from './builtin';
import {
  DirtyMug,
  Mug,
  Muggify,
  PossibleMug,
  PossibleMugLike,
  pure,
  ReadActionMeta,
  WriteActionMeta,
} from './mug';
import { r as flatR, w as flatW, GetIt, getIt, ReadOp, SetIt, setIt, WriteOp } from './op-mech';

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

type DirtyAMug = DirtyMug<
  {
    s: string;
    o: {
      s: string;
    };
    potentialMuggyObject: DirtyMug<ObjectState, { b: boolean }>;
  },
  { b: boolean }
>;

const uponNestedAMug = upon(fake<NestedAMug>());

const [r, w] = uponNestedAMug;

const [aMugR, aMugW] = upon(fake<AMug>());
const [aMugLikeR, aMugLikeW] = upon(fake<AMugLike>());
const [possibleAMugR, possibleAMugW] = upon(fake<PossibleAMug>());
const [possibleAMugLikeR, possibleAMugLikeW] = upon(fake<PossibleAMugLike>());
const [dirtyAMugR, dirtyAMugW] = upon(fake<DirtyAMug>());

test('ReadAction, GetIt, PassThrough', () => {
  type Read3dd = ReadAction<NestedAMug, (state: AState) => ObjectState>;

  expectType<
    (() => ObjectState) & ReadActionMeta<NestedAMug, ReadOp<(state: AState) => ObjectState>>
  >(fake<Read3dd>());

  expectType<Read3dd>(fake<ReadAction<NestedAMug, ReadOp<(state: AState) => ObjectState>>>());

  // =-=-=

  expectType<(() => ObjectState) & ReadActionMeta<AMug, ReadOp<(state: AState) => ObjectState>>>(
    fake<ReadAction<AMug, (state: AState) => ObjectState>>(),
  );

  // =-=-=

  expectType<
    (() => ObjectState) & ReadActionMeta<AMugLike, ReadOp<(state: AState) => ObjectState>>
  >(fake<ReadAction<AMugLike, (state: AState) => ObjectState>>());

  // =-=-=

  expectType<
    (() => ObjectState) & ReadActionMeta<PossibleAMug, ReadOp<(state: AState) => ObjectState>>
  >(fake<ReadAction<PossibleAMug, (state: AState) => ObjectState>>());

  // =-=-=

  expectType<
    (() => ObjectState) & ReadActionMeta<PossibleAMugLike, ReadOp<(state: AState) => ObjectState>>
  >(fake<ReadAction<PossibleAMugLike, (state: AState) => ObjectState>>());

  // =-=-=

  expectType<
    (() => ObjectState) & ReadActionMeta<DirtyAMug, ReadOp<(state: AState) => ObjectState>>
  >(fake<ReadAction<DirtyAMug, (state: AState) => ObjectState>>());

  // =-=-=

  expectType<
    ((s: string) => ObjectState) &
      ReadActionMeta<NestedAMug, ReadOp<(state: AState, s: string) => ObjectState>>
  >(fake<ReadAction<NestedAMug, (state: AState, s: string) => ObjectState>>());

  // =-=-=

  expectType<
    (() => ObjectState) & ReadActionMeta<NestedAMug, ReadOp<(state: ObjectState) => ObjectState>>
  >(fake<ReadAction<NestedAMug, (state: ObjectState) => ObjectState>>());

  // =-=-=

  fake<ReadAction<NestedAMug, (state: SuperState) => ObjectState>>();

  // =-=-=

  fake<ReadAction<NestedAMug, (state: { n: number }) => ObjectState>>();

  // =-=-=

  type Read68a = ReadAction<NestedAMug, <TState>(state: TState) => TState>;

  expectType<
    (() => AState) & ReadActionMeta<NestedAMug, ReadOp<<TState>(state: TState) => TState>>
  >(fake<Read68a>());

  expectType<Read68a>(fake<ReadAction<NestedAMug, ReadOp<<TState>(state: TState) => TState>>>());

  // =-=-=

  expectType<
    (() => AState) &
      ReadActionMeta<NestedAMug, ReadOp<<TState extends AState>(state: TState) => TState>>
  >(fake<ReadAction<NestedAMug, <TState extends AState>(state: TState) => TState>>());

  // =-=-=

  expectType<
    (() => AState) &
      ReadActionMeta<NestedAMug, ReadOp<<TState extends ObjectState>(state: TState) => TState>>
  >(fake<ReadAction<NestedAMug, <TState extends ObjectState>(state: TState) => TState>>());

  // =-=-=

  fake<ReadAction<NestedAMug, <TState extends SuperState>(state: TState) => TState>>();

  // =-=-=

  type Readc14 = ReadAction<NestedAMug, () => ObjectState>;

  expectType<(() => ObjectState) & ReadActionMeta<NestedAMug, ReadOp<() => ObjectState>>>(
    fake<Readc14>(),
  );

  expectType<Readc14>(fake<ReadAction<NestedAMug, ReadOp<() => ObjectState>>>());

  // =-=-=

  type Read43e = ReadAction<NestedAMug>;

  expectType<(() => AState) & ReadActionMeta<NestedAMug, ReadOp>>(fake<Read43e>());

  expectType<Read43e>(fake<ReadAction<NestedAMug, ReadOp>>());

  expectType<Read43e>(fake<ReadAction<NestedAMug, PassThrough>>());

  expectType<Read43e>(fake<ReadAction<NestedAMug, GetIt>>());
});

test('upon#r, pure, getIt, passThrough', () => {
  expectType<typeof uponNestedAMug.r>(r);

  // @ts-expect-error
  r(w());

  // =-=-=

  const readc7e = r((state) => {
    expectType<AState>(state);
    return fake<ObjectState>();
  });

  expectType<ReadAction<NestedAMug, (state: AState) => ObjectState>>(readc7e);

  expectType<typeof readc7e>(r(flatR((state: AState) => fake<ObjectState>())));

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

  expectType<ReadAction<NestedAMug, <TState>(state: TState) => TState>>(reade33);

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

  expectType<ReadAction<NestedAMug, () => ObjectState>>(readfeb);

  expectType<typeof readfeb>(r(flatR(() => fake<ObjectState>())));

  expectType<() => ObjectState>(pure(readfeb));

  expectType<ObjectState>(readfeb());

  // @ts-expect-error
  readfeb(fake<any>());

  // =-=-=

  const read776 = r();

  expectType<ReadAction<NestedAMug>>(read776);

  expectType<typeof read776>(r(flatR(<TState>(state: TState) => state)));

  expectType<<TState>(state: TState) => TState>(pure(read776));

  expectType<typeof read776>(r(passThrough));

  expectType<typeof read776>(r(getIt));

  expectType<AState>(read776());

  // @ts-expect-error
  read776(fake<any>());
});

test('WriteAction, SetIt, MergePatch', () => {
  type Writea2e = WriteAction<NestedAMug, (state: AState) => AState>;

  expectType<(() => void) & WriteActionMeta<NestedAMug, WriteOp<(state: AState) => AState>>>(
    fake<Writea2e>(),
  );

  expectType<Writea2e>(fake<WriteAction<NestedAMug, WriteOp<(state: AState) => AState>>>());

  // =-=-=

  expectType<(() => void) & WriteActionMeta<AMug, WriteOp<(state: AState) => AState>>>(
    fake<WriteAction<AMug, (state: AState) => AState>>(),
  );

  // =-=-=

  expectType<(() => void) & WriteActionMeta<AMugLike, WriteOp<(state: AState) => AState>>>(
    fake<WriteAction<AMugLike, (state: AState) => AState>>(),
  );

  // =-=-=

  expectType<(() => void) & WriteActionMeta<PossibleAMug, WriteOp<(state: AState) => AState>>>(
    fake<WriteAction<PossibleAMug, (state: AState) => AState>>(),
  );

  // =-=-=

  expectType<(() => void) & WriteActionMeta<PossibleAMugLike, WriteOp<(state: AState) => AState>>>(
    fake<WriteAction<PossibleAMugLike, (state: AState) => AState>>(),
  );

  // =-=-=

  expectType<(() => void) & WriteActionMeta<DirtyAMug, WriteOp<(state: AState) => AState>>>(
    fake<WriteAction<DirtyAMug, (state: AState) => AState>>(),
  );

  // =-=-=

  expectType<
    ((s: string) => void) &
      WriteActionMeta<NestedAMug, WriteOp<(state: AState, s: string) => AState>>
  >(fake<WriteAction<NestedAMug, (state: AState, s: string) => AState>>());

  // =-=-=

  expectType<(() => void) & WriteActionMeta<NestedAMug, WriteOp<(state: AState) => SuperState>>>(
    fake<WriteAction<NestedAMug, (state: AState) => SuperState>>(),
  );

  // =-=-=

  fake<WriteAction<NestedAMug, (state: AState) => ObjectState>>();

  // =-=-=

  expectType<(() => void) & WriteActionMeta<NestedAMug, WriteOp<(state: ObjectState) => AState>>>(
    fake<WriteAction<NestedAMug, (state: ObjectState) => AState>>(),
  );

  // =-=-=

  fake<WriteAction<NestedAMug, (state: SuperState) => AState>>();

  // =-=-=

  fake<WriteAction<NestedAMug, (state: { n: number }) => AState>>();

  // =-=-=

  fake<WriteAction<NestedAMug, (state: AState) => { n: number }>>();

  // =-=-=

  type Write42b = WriteAction<NestedAMug, <TState>(state: TState) => TState>;

  expectType<
    (() => void) & WriteActionMeta<NestedAMug, WriteOp<<TState>(state: TState) => TState>>
  >(fake<Write42b>());

  expectType<Write42b>(fake<WriteAction<NestedAMug, WriteOp<<TState>(state: TState) => TState>>>());

  // =-=-=

  expectType<
    (() => void) &
      WriteActionMeta<NestedAMug, WriteOp<<TState extends AState>(state: TState) => TState>>
  >(fake<WriteAction<NestedAMug, <TState extends AState>(state: TState) => TState>>());

  // =-=-=

  expectType<
    (() => void) &
      WriteActionMeta<NestedAMug, WriteOp<<TState extends ObjectState>(state: TState) => TState>>
  >(fake<WriteAction<NestedAMug, <TState extends ObjectState>(state: TState) => TState>>());

  // =-=-=

  fake<WriteAction<NestedAMug, <TState extends SuperState>(state: TState) => TState>>();

  // =-=-=

  type Write697 = WriteAction<NestedAMug, () => AState>;

  expectType<(() => void) & WriteActionMeta<NestedAMug, WriteOp<() => AState>>>(fake<Write697>());

  expectType<Write697>(fake<WriteAction<NestedAMug, WriteOp<() => AState>>>());

  // =-=-=

  expectType<(() => void) & WriteActionMeta<NestedAMug, WriteOp<() => SuperState>>>(
    fake<WriteAction<NestedAMug, () => SuperState>>(),
  );

  // =-=-=

  fake<WriteAction<NestedAMug, () => ObjectState>>();

  // =-=-=

  type Write4f8 = WriteAction<NestedAMug>;

  expectType<
    ((patch: PossiblePatch<NoInfer<AState>>) => void) & WriteActionMeta<NestedAMug, WriteOp>
  >(fake<Write4f8>());

  expectType<Write4f8>(fake<WriteAction<NestedAMug, WriteOp>>());

  expectType<Write4f8>(fake<WriteAction<NestedAMug, MergePatch>>());

  expectType<Write4f8>(fake<WriteAction<NestedAMug, SetIt>>());
});

test('upon#w, pure, setIt, mergePatch', () => {
  expectType<typeof uponNestedAMug.w>(w);

  // @ts-expect-error
  w(r());

  // =-=-=

  const write30d = w((state) => {
    expectType<AState>(state);
    return state;
  });

  expectType<WriteAction<NestedAMug, (state: AState) => AState>>(write30d);

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

  expectType<WriteAction<NestedAMug, <TState>(state: TState) => TState>>(write3f7);

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

  expectType<WriteAction<NestedAMug, () => AState>>(writed5e);

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

  expectType<WriteAction<NestedAMug>>(write8db);

  expectType<{
    <TState>(state: TState, patch: PossiblePatch<NoInfer<TState>>): TState;
    [_builtinId]: typeof _bidFnMergePatch;
  }>(pure(write8db));

  expectType<typeof write8db>(w(mergePatch));

  expectType<typeof write8db>(w(setIt));

  const patch422 = { potentialMuggyObject: { o: { s: fake<string>() } } };

  expectType<void>(write8db(patch422));

  // @ts-expect-error
  write8db();

  // @ts-expect-error
  write8db(patch422, fake<any>());
});
