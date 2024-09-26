import { expectAssignable, expectType } from 'tsd';

import { fake, from } from '../tests/type-utils';
import { upon } from './actions';
import { getIt, PossiblePatch, setIt } from './builtin-ops';
import { construction, flat, Mug, MugLike, PossibleMug, PossibleMugLike, pure, State } from './mug';
import { r as flatR, w as flatW } from './op-mech';

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

test('upon, flat, pure', () => {
  const uponNestedAMug = upon(fake<NestedAMug>());

  const [r, w] = uponNestedAMug;

  expectType<typeof uponNestedAMug.r>(r);
  expectType<typeof uponNestedAMug.w>(w);

  // @ts-expect-error
  w(r());
  // @ts-expect-error
  r(w());

  // =-=-=

  const [aMugR, aMugW] = upon(fake<AMug>());
  const [aMugLikeR, aMugLikeW] = upon(fake<AMugLike>());
  const [possibleAMugR, possibleAMugW] = upon(fake<PossibleAMug>());
  const [possibleAMugLikeR, possibleAMugLikeW] = upon(fake<PossibleAMugLike>());
  const [dirtyAMugR, dirtyAMugW] = upon(fake<DirtyAMug>());

  // =-=-=

  const readc7e = r((state) => {
    expectType<AState>(state);
    return fake<ObjectState>();
  });
  expectType<ObjectState>(readc7e());
  const flatReadc7e = flatR((state: AState) => fake<ObjectState>());
  expectType<typeof flatReadc7e>(flat(readc7e));
  expectType<typeof readc7e>(r(flatReadc7e));
  expectType<(state: AState) => ObjectState>(pure(readc7e));

  // =-=-=

  const read50d = aMugR((state) => {
    expectType<AState>(state);
    return fake<ObjectState>();
  });
  expectType<ObjectState>(read50d());
  const flatRead50d = flatR((state: AState) => fake<ObjectState>());
  expectType<typeof flatRead50d>(flat(read50d));
  expectType<typeof read50d>(aMugR(flatRead50d));
  expectType<(state: AState) => ObjectState>(pure(read50d));

  // =-=-=

  const read3c4 = aMugLikeR((state) => {
    expectType<AState>(state);
    return fake<ObjectState>();
  });
  expectType<ObjectState>(read3c4());
  const flatRead3c4 = flatR((state: AState) => fake<ObjectState>());
  expectType<typeof flatRead3c4>(flat(read3c4));
  expectType<typeof read3c4>(aMugLikeR(flatRead3c4));
  expectType<(state: AState) => ObjectState>(pure(read3c4));

  // =-=-=

  const readd1a = possibleAMugR((state) => {
    expectAssignable<AState>(state);
    expectAssignable<typeof state>(from<AState>());
    return fake<ObjectState>();
  });
  expectType<ObjectState>(readd1a());
  const flatReadd1a = flatR((state: State<PossibleMug<AState>>) => fake<ObjectState>());
  expectType<typeof flatReadd1a>(flat(readd1a));
  expectType<typeof readd1a>(possibleAMugR(flatReadd1a));
  expectType<(state: State<PossibleMug<AState>>) => ObjectState>(pure(readd1a));

  // =-=-=

  const read1c3 = possibleAMugLikeR((state) => {
    expectAssignable<AState>(state);
    expectAssignable<typeof state>(from<AState>());
    return fake<ObjectState>();
  });
  expectType<ObjectState>(read1c3());
  const flatRead1c3 = flatR((state: State<PossibleMugLike<AState>>) => fake<ObjectState>());
  expectType<typeof flatRead1c3>(flat(read1c3));
  expectType<typeof read1c3>(possibleAMugLikeR(flatRead1c3));
  expectType<(state: State<PossibleMugLike<AState>>) => ObjectState>(pure(read1c3));

  // =-=-=

  const read8d6 = dirtyAMugR((state) => {
    expectType<AState>(state);
    return fake<ObjectState>();
  });
  expectType<ObjectState>(read8d6());
  const flatRead8d6 = flatR((state: AState) => fake<ObjectState>());
  expectType<typeof flatRead8d6>(flat(read8d6));
  expectType<typeof read8d6>(dirtyAMugR(flatRead8d6));
  expectType<(state: AState) => ObjectState>(pure(read8d6));

  // =-=-=

  const read9ad = r((state, s: string) => fake<ObjectState>());

  read9ad(fake<string>());

  // @ts-expect-error
  read9ad();

  // @ts-expect-error
  read9ad(fake<number>());

  // @ts-expect-error
  read9ad(fake<string>(), fake<any>());

  const flatRead9ad = flatR((state: AState, s: string) => fake<ObjectState>());
  expectType<typeof flatRead9ad>(flat(read9ad));
  expectType<typeof read9ad>(r(flatRead9ad));
  expectType<(state: AState, s: string) => ObjectState>(pure(read9ad));

  // =-=-=

  const read6a9 = r((state: ObjectState) => state);
  expectType<ObjectState>(read6a9());
  const flatRead6a9 = flatR((state: ObjectState) => state);
  expectType<typeof flatRead6a9>(flat(read6a9));
  expectType<typeof read6a9>(r(flatRead6a9));
  expectType<(state: ObjectState) => ObjectState>(pure(read6a9));

  // =-=-=

  // @ts-expect-error
  r((state: SuperState) => fake<ObjectState>());
  // @ts-expect-error
  r(flatR((state: SuperState) => fake<ObjectState>()));

  // =-=-=

  const reade33 = r(<TState>(state: TState): TState => state);
  expectType<AState>(reade33());
  const flatReade33 = flatR(<TState>(state: TState): TState => state);
  expectType<typeof flatReade33>(flat(reade33));
  expectType<typeof reade33>(r(flatReade33));
  expectType<<TState>(state: TState) => TState>(pure(reade33));

  // =-=-=

  const readf8d = r(<TState extends AState>(state: TState): TState => state);
  expectType<AState>(readf8d());
  const flatReadf8d = flatR(<TState extends AState>(state: TState): TState => state);
  expectType<typeof flatReadf8d>(flat(readf8d));
  expectType<typeof readf8d>(r(flatReadf8d));
  expectType<<TState extends AState>(state: TState) => TState>(pure(readf8d));

  // =-=-=

  const read45f = r(<TState extends ObjectState>(state: TState): TState => state);
  expectType<AState>(read45f());
  const flatRead45f = flatR(<TState extends ObjectState>(state: TState): TState => state);
  expectType<typeof flatRead45f>(flat(read45f));
  expectType<typeof read45f>(r(flatRead45f));
  expectType<<TState extends ObjectState>(state: TState) => TState>(pure(read45f));

  // =-=-=

  // @ts-expect-error
  r(<TState extends SuperState>(state: TState): TState => state);
  // @ts-expect-error
  r(flatR(<TState extends SuperState>(state: TState): TState => state));

  // =-=-=

  const readfeb = r(() => fake<ObjectState>());
  expectType<ObjectState>(readfeb());
  const flatReadfeb = flatR(() => fake<ObjectState>());
  expectType<typeof flatReadfeb>(flat(readfeb));
  expectType<typeof readfeb>(r(flatReadfeb));
  expectType<() => ObjectState>(pure(readfeb));

  // =-=-=

  // @ts-expect-error
  r((state: { n: number }) => fake<ObjectState>());
  // @ts-expect-error
  r(flatW((state: { n: number }) => fake<ObjectState>()));

  // =-=-=

  const read776 = r();
  expectType<AState>(read776());
  const flatRead776 = getIt;
  expectType<typeof flatRead776>(flat(read776));
  expectType<typeof read776>(r(flatRead776));
  expectType<<TState>(state: TState) => TState>(pure(read776));

  // =-=-=

  const write30d = w((state) => {
    expectType<AState>(state);
    return state;
  });
  expectType<void>(write30d());
  const flatWrite30d = flatW((state: AState) => state);
  expectType<typeof flatWrite30d>(flat(write30d));
  expectType<typeof write30d>(w(flatWrite30d));

  // =-=-=

  const write50d = aMugW((state) => {
    expectType<AState>(state);
    return state;
  });
  expectType<void>(write50d());
  const flatWrite50d = flatW((state: AState) => state);
  expectType<typeof flatWrite50d>(flat(write50d));
  expectType<typeof write50d>(aMugW(flatWrite50d));
  expectType<(state: AState) => AState>(pure(write50d));

  // =-=-=

  const write113 = aMugLikeW((state) => {
    expectType<AState>(state);
    return state;
  });
  expectType<void>(write30d());
  const flatWrite113 = flatW((state: AState) => state);
  expectType<typeof flatWrite30d>(flat(write30d));
  expectType<typeof write113>(aMugLikeW(flatWrite113));
  expectType<(state: AState) => AState>(pure(write113));

  // =-=-=

  const write36c = possibleAMugW((state) => {
    expectAssignable<AState>(state);
    expectAssignable<typeof state>(from<AState>());
    return state;
  });
  expectType<void>(write36c());
  const flatWrite36c = flatW((state: State<PossibleMug<AState>>) => state);
  expectType<typeof flatWrite36c>(flat(write36c));
  expectType<typeof write36c>(possibleAMugW(flatWrite36c));
  expectType<(state: State<PossibleMug<AState>>) => State<PossibleMug<AState>>>(pure(write36c));

  // =-=-=

  const writedd7 = possibleAMugLikeW((state) => {
    expectAssignable<AState>(state);
    expectAssignable<typeof state>(from<AState>());
    return state;
  });
  expectType<void>(writedd7());
  const flatWritedd7 = flatW((state: State<PossibleMugLike<AState>>) => state);
  expectType<typeof flatWritedd7>(flat(writedd7));
  expectType<typeof writedd7>(possibleAMugLikeW(flatWritedd7));
  expectType<(state: State<PossibleMugLike<AState>>) => State<PossibleMugLike<AState>>>(
    pure(writedd7),
  );

  // =-=-=

  const write203 = dirtyAMugW((state) => {
    expectType<AState>(state);
    return state;
  });
  expectType<void>(write203());
  const flatWrite203 = flatW((state: AState) => state);
  expectType<typeof flatWrite203>(flat(write203));
  expectType<typeof write203>(dirtyAMugW(flatWrite203));
  expectType<(state: AState) => AState>(pure(write203));

  // =-=-=

  const writebb8 = w((state, s: string) => state);

  writebb8(fake<string>());

  // @ts-expect-error
  writebb8();

  // @ts-expect-error
  writebb8(fake<number>());

  // @ts-expect-error
  writebb8(fake<string>(), fake<any>());

  const flatWritebb8 = flatW((state: AState, s: string) => state);
  expectType<typeof flatWritebb8>(flat(writebb8));
  expectType<typeof writebb8>(w(flatWritebb8));
  expectType<(state: AState, s: string) => AState>(pure(writebb8));

  // =-=-=

  const writee27 = w((state) => fake<SuperState>());
  expectType<void>(writee27());
  const flatWritee27 = flatW((state: AState) => fake<SuperState>());
  expectType<typeof flatWritee27>(flat(writee27));
  expectType<typeof writee27>(w(flatWritee27));
  expectType<(state: AState) => SuperState>(pure(writee27));

  // @ts-expect-error
  w((state) => fake<ObjectState>());
  // @ts-expect-error
  w(flatW((state: AState) => fake<ObjectState>()));

  // =-=-=

  const write8b5 = w((state: ObjectState) => fake<AState>());
  expectType<void>(write8b5());
  const flatWrite8b5 = flatW((state: ObjectState) => fake<AState>());
  expectType<typeof flatWrite8b5>(flat(write8b5));
  expectType<typeof write8b5>(w(flatWrite8b5));
  expectType<(state: ObjectState) => AState>(pure(write8b5));

  // @ts-expect-error
  w((state: SuperState) => fake<AState>());
  // @ts-expect-error
  w(flatW((state: SuperState) => fake<AState>()));

  // =-=-=

  const write3f7 = w(<TState>(state: TState) => state);
  expectType<void>(write3f7());
  const flatWrite3f7 = flatW(<TState>(state: TState) => state);
  expectType<typeof flatWrite3f7>(flat(write3f7));
  expectType<typeof write3f7>(w(flatWrite3f7));
  expectType<<TState>(state: TState) => TState>(pure(write3f7));

  // =-=-=

  const write519 = w(<TState extends AState>(state: TState) => state);

  // =-=-=

  const write4fd = w(<TState extends ObjectState>(state: TState) => state);

  // =-=-=

  // @ts-expect-error
  w(<TState extends SuperState>(state: TState) => state);
  // @ts-expect-error
  w(flatW(<TState extends SuperState>(state: TState) => state));

  // =-=-=

  const writed5e = w(() => fake<AState>());
  expectType<void>(writed5e());
  const flatWrited5e = flatW(() => fake<AState>());
  expectType<typeof flatWrited5e>(flat(writed5e));
  expectType<typeof writed5e>(w(flatWrited5e));
  expectType<() => AState>(pure(writed5e));

  const write6bb = w(() => fake<SuperState>());
  expectType<void>(write6bb());
  const flatWrite6bb = flatW(() => fake<SuperState>());
  expectType<typeof flatWrite6bb>(flat(write6bb));
  expectType<typeof write6bb>(w(flatWrite6bb));
  expectType<() => SuperState>(pure(write6bb));

  // @ts-expect-error
  w(() => fake<ObjectState>());
  // @ts-expect-error
  w(flatW(() => fake<ObjectState>()));

  // =-=-=

  // @ts-expect-error
  w((state: { n: number }) => fake<AState>());
  // @ts-expect-error
  w(flatW((state: { n: number }) => fake<AState>()));

  // @ts-expect-error
  w((state) => fake<{ n: number }>());
  // @ts-expect-error
  w(flatW((state) => fake<{ n: number }>()));

  // =-=-=

  const write8db = w();
  expectType<void>(write8db({ potentialMuggyObject: { o: { s: fake<string>() } } }));
  const flatWrite8db = setIt;
  const op8db = flat(write8db);
  expectType<typeof flatWrite8db>(flat(write8db));
  expectType<typeof write8db>(w(flatWrite8db));
  expectType<<TState>(state: TState, patch: PossiblePatch<NoInfer<TState>>) => TState>(
    pure(write8db),
  );
});
