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
  expectType<typeof flatReadc7e>(readc7e.flat);
  expectType<typeof readc7e.flat>(flat(readc7e));
  expectType<typeof readc7e>(r(flatReadc7e));
  expectType<(state: AState) => ObjectState>(readc7e.pure);
  expectType<typeof readc7e.pure>(pure(readc7e));

  // =-=-=

  const read50d = aMugR((state) => {
    expectType<AState>(state);
    return fake<ObjectState>();
  });
  expectType<ObjectState>(read50d());
  const flatRead50d = flatR((state: AState) => fake<ObjectState>());
  expectType<typeof flatRead50d>(read50d.flat);
  expectType<typeof read50d.flat>(flat(read50d));
  expectType<typeof read50d>(aMugR(flatRead50d));
  expectType<(state: AState) => ObjectState>(read50d.pure);
  expectType<typeof read50d.pure>(pure(read50d));

  // =-=-=

  const read3c4 = aMugLikeR((state) => {
    expectType<AState>(state);
    return fake<ObjectState>();
  });
  expectType<ObjectState>(read3c4());
  const flatRead3c4 = flatR((state: AState) => fake<ObjectState>());
  expectType<typeof flatRead3c4>(read3c4.flat);
  expectType<typeof read3c4.flat>(flat(read3c4));
  expectType<typeof read3c4>(aMugLikeR(flatRead3c4));
  expectType<(state: AState) => ObjectState>(read3c4.pure);
  expectType<typeof read3c4.pure>(pure(read3c4));

  // =-=-=

  const readd1a = possibleAMugR((state) => {
    expectAssignable<AState>(state);
    expectAssignable<typeof state>(from<AState>());
    return fake<ObjectState>();
  });
  expectType<ObjectState>(readd1a());
  const flatReadd1a = flatR((state: State<PossibleMug<AState>>) => fake<ObjectState>());
  expectType<typeof flatReadd1a>(readd1a.flat);
  expectType<typeof readd1a.flat>(flat(readd1a));
  expectType<typeof readd1a>(possibleAMugR(flatReadd1a));
  expectType<(state: State<PossibleMug<AState>>) => ObjectState>(readd1a.pure);
  expectType<typeof readd1a.pure>(pure(readd1a));

  // =-=-=

  const read1c3 = possibleAMugLikeR((state) => {
    expectAssignable<AState>(state);
    expectAssignable<typeof state>(from<AState>());
    return fake<ObjectState>();
  });
  expectType<ObjectState>(read1c3());
  const flatRead1c3 = flatR((state: State<PossibleMugLike<AState>>) => fake<ObjectState>());
  expectType<typeof flatRead1c3>(read1c3.flat);
  expectType<typeof read1c3.flat>(flat(read1c3));
  expectType<typeof read1c3>(possibleAMugLikeR(flatRead1c3));
  expectType<(state: State<PossibleMugLike<AState>>) => ObjectState>(read1c3.pure);
  expectType<typeof read1c3.pure>(pure(read1c3));

  // =-=-=

  const read8d6 = dirtyAMugR((state) => {
    expectType<AState>(state);
    return fake<ObjectState>();
  });
  expectType<ObjectState>(read8d6());
  const flatRead8d6 = flatR((state: AState) => fake<ObjectState>());
  expectType<typeof flatRead8d6>(read8d6.flat);
  expectType<typeof read8d6.flat>(flat(read8d6));
  expectType<typeof read8d6>(dirtyAMugR(flatRead8d6));
  expectType<(state: AState) => ObjectState>(read8d6.pure);
  expectType<typeof read8d6.pure>(pure(read8d6));

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
  expectType<typeof flatRead9ad>(read9ad.flat);
  expectType<typeof read9ad.flat>(flat(read9ad));
  expectType<typeof read9ad>(r(flatRead9ad));
  expectType<(state: AState, s: string) => ObjectState>(read9ad.pure);
  expectType<typeof read9ad.pure>(pure(read9ad));

  // =-=-=

  const read6a9 = r((state: ObjectState) => state);
  expectType<ObjectState>(read6a9());
  const flatRead6a9 = flatR((state: ObjectState) => state);
  expectType<typeof flatRead6a9>(read6a9.flat);
  expectType<typeof read6a9.flat>(flat(read6a9));
  expectType<typeof read6a9>(r(flatRead6a9));
  expectType<(state: ObjectState) => ObjectState>(read6a9.pure);
  expectType<typeof read6a9.pure>(pure(read6a9));

  // =-=-=

  // @ts-expect-error
  r((state: SuperState) => fake<ObjectState>());
  // @ts-expect-error
  r(flatR((state: SuperState) => fake<ObjectState>()));

  // =-=-=

  const reade33 = r(<TState>(state: TState): TState => state);
  expectType<AState>(reade33());
  const flatReade33 = flatR(<TState>(state: TState): TState => state);
  expectType<typeof flatReade33>(reade33.flat);
  expectType<typeof reade33.flat>(flat(reade33));
  expectType<typeof reade33>(r(flatReade33));
  expectType<<TState>(state: TState) => TState>(reade33.pure);
  expectType<typeof reade33.pure>(pure(reade33));

  // =-=-=

  const readf8d = r(<TState extends AState>(state: TState): TState => state);
  expectType<AState>(readf8d());
  const flatReadf8d = flatR(<TState extends AState>(state: TState): TState => state);
  expectType<typeof flatReadf8d>(readf8d.flat);
  expectType<typeof readf8d.flat>(flat(readf8d));
  expectType<typeof readf8d>(r(flatReadf8d));
  expectType<<TState extends AState>(state: TState) => TState>(readf8d.pure);
  expectType<typeof readf8d.pure>(pure(readf8d));

  // =-=-=

  const read45f = r(<TState extends ObjectState>(state: TState): TState => state);
  expectType<AState>(read45f());
  const flatRead45f = flatR(<TState extends ObjectState>(state: TState): TState => state);
  expectType<typeof flatRead45f>(read45f.flat);
  expectType<typeof read45f.flat>(flat(read45f));
  expectType<typeof read45f>(r(flatRead45f));
  expectType<<TState extends ObjectState>(state: TState) => TState>(read45f.pure);
  expectType<typeof read45f.pure>(pure(read45f));

  // =-=-=

  // @ts-expect-error
  r(<TState extends SuperState>(state: TState): TState => state);
  // @ts-expect-error
  r(flatR(<TState extends SuperState>(state: TState): TState => state));

  // =-=-=

  const readfeb = r(() => fake<ObjectState>());
  expectType<ObjectState>(readfeb());
  const flatReadfeb = flatR(() => fake<ObjectState>());
  expectType<typeof flatReadfeb>(readfeb.flat);
  expectType<typeof readfeb.flat>(flat(readfeb));
  expectType<typeof readfeb>(r(flatReadfeb));
  expectType<() => ObjectState>(readfeb.pure);
  expectType<typeof readfeb.pure>(pure(readfeb));

  // =-=-=

  // @ts-expect-error
  r((state: { n: number }) => fake<ObjectState>());
  // @ts-expect-error
  r(flatW((state: { n: number }) => fake<ObjectState>()));

  // =-=-=

  const read776 = r();
  expectType<AState>(read776());
  const flatRead776 = getIt;
  expectType<typeof flatRead776>(read776.flat);
  expectType<typeof read776.flat>(flat(read776));
  expectType<typeof read776>(r(flatRead776));
  expectType<<TState>(state: TState) => TState>(read776.pure);
  expectType<typeof read776.pure>(pure(read776));

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
  expectType<typeof flatWrite50d>(write50d.flat);
  expectType<typeof write50d.flat>(flat(write50d));
  expectType<typeof write50d>(aMugW(flatWrite50d));
  expectType<(state: AState) => AState>(write50d.pure);
  expectType<typeof write50d.pure>(pure(write50d));

  // =-=-=

  const write113 = aMugLikeW((state) => {
    expectType<AState>(state);
    return state;
  });
  expectType<void>(write30d());
  const flatWrite113 = flatW((state: AState) => state);
  expectType<typeof flatWrite30d>(write30d.flat);
  expectType<typeof write30d.flat>(flat(write30d));
  expectType<typeof write113>(aMugLikeW(flatWrite113));
  expectType<(state: AState) => AState>(write113.pure);
  expectType<typeof write113.pure>(pure(write113));

  // =-=-=

  const write36c = possibleAMugW((state) => {
    expectAssignable<AState>(state);
    expectAssignable<typeof state>(from<AState>());
    return state;
  });
  expectType<void>(write36c());
  const flatWrite36c = flatW((state: State<PossibleMug<AState>>) => state);
  expectType<typeof flatWrite36c>(write36c.flat);
  expectType<typeof write36c.flat>(flat(write36c));
  expectType<typeof write36c>(possibleAMugW(flatWrite36c));
  expectType<(state: State<PossibleMug<AState>>) => State<PossibleMug<AState>>>(write36c.pure);
  expectType<typeof write36c.pure>(pure(write36c));

  // =-=-=

  const writedd7 = possibleAMugLikeW((state) => {
    expectAssignable<AState>(state);
    expectAssignable<typeof state>(from<AState>());
    return state;
  });
  expectType<void>(writedd7());
  const flatWritedd7 = flatW((state: State<PossibleMugLike<AState>>) => state);
  expectType<typeof flatWritedd7>(writedd7.flat);
  expectType<typeof flatWritedd7>(flat(writedd7));
  expectType<typeof writedd7>(possibleAMugLikeW(flatWritedd7));
  expectType<(state: State<PossibleMugLike<AState>>) => State<PossibleMugLike<AState>>>(
    writedd7.pure,
  );
  expectType<typeof writedd7.pure>(pure(writedd7));

  // =-=-=

  const write203 = dirtyAMugW((state) => {
    expectType<AState>(state);
    return state;
  });
  expectType<void>(write203());
  const flatWrite203 = flatW((state: AState) => state);
  expectType<typeof flatWrite203>(write203.flat);
  expectType<typeof write203.flat>(flat(write203));
  expectType<typeof write203>(dirtyAMugW(flatWrite203));
  expectType<(state: AState) => AState>(write203.pure);
  expectType<typeof write203.pure>(pure(write203));

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
  expectType<typeof flatWritebb8>(writebb8.flat);
  expectType<typeof writebb8.flat>(flat(writebb8));
  expectType<typeof writebb8>(w(flatWritebb8));
  expectType<(state: AState, s: string) => AState>(writebb8.pure);
  expectType<typeof writebb8.pure>(pure(writebb8));

  // =-=-=

  const writee27 = w((state) => fake<SuperState>());
  expectType<void>(writee27());
  const flatWritee27 = flatW((state: AState) => fake<SuperState>());
  expectType<typeof flatWritee27>(writee27.flat);
  expectType<typeof writee27.flat>(flat(writee27));
  expectType<typeof writee27>(w(flatWritee27));
  expectType<(state: AState) => SuperState>(writee27.pure);
  expectType<typeof writee27.pure>(pure(writee27));

  // @ts-expect-error
  w((state) => fake<ObjectState>());
  // @ts-expect-error
  w(flatW((state: AState) => fake<ObjectState>()));

  // =-=-=

  const write8b5 = w((state: ObjectState) => fake<AState>());
  expectType<void>(write8b5());
  const flatWrite8b5 = flatW((state: ObjectState) => fake<AState>());
  expectType<typeof flatWrite8b5>(write8b5.flat);
  expectType<typeof write8b5.flat>(flat(write8b5));
  expectType<typeof write8b5>(w(flatWrite8b5));
  expectType<(state: ObjectState) => AState>(write8b5.pure);
  expectType<typeof write8b5.pure>(pure(write8b5));

  // @ts-expect-error
  w((state: SuperState) => fake<AState>());
  // @ts-expect-error
  w(flatW((state: SuperState) => fake<AState>()));

  // =-=-=

  const write3f7 = w(<TState>(state: TState) => state);
  expectType<void>(write3f7());
  const flatWrite3f7 = flatW(<TState>(state: TState) => state);
  expectType<typeof flatWrite3f7>(write3f7.flat);
  expectType<typeof write3f7.flat>(flat(write3f7));
  expectType<typeof write3f7>(w(flatWrite3f7));
  expectType<<TState>(state: TState) => TState>(write3f7.pure);
  expectType<typeof write3f7.pure>(pure(write3f7));

  // =-=-=

  const write519 = w(<TState extends AState>(state: TState) => state);
  expectType<void>(write519());
  const flatWrite519 = flatW(<TState extends AState>(state: TState) => state);
  expectType<typeof flatWrite519>(write519.flat);
  expectType<typeof write519.flat>(flat(write519));
  expectType<typeof write519>(w(flatWrite519));
  expectType<<TState extends AState>(state: TState) => TState>(write519.pure);
  expectType<typeof write519.pure>(pure(write519));

  // =-=-=

  const write4fd = w(<TState extends ObjectState>(state: TState) => state);
  expectType<void>(write519());
  const flatWrite4fd = flatW(<TState extends ObjectState>(state: TState) => state);
  expectType<typeof flatWrite4fd>(write4fd.flat);
  expectType<typeof write4fd.flat>(flat(write4fd));
  expectType<typeof write4fd>(w(flatWrite4fd));
  expectType<<TState extends ObjectState>(state: TState) => TState>(write4fd.pure);
  expectType<typeof write4fd.pure>(pure(write4fd));

  // =-=-=

  // @ts-expect-error
  w(<TState extends SuperState>(state: TState) => state);
  // @ts-expect-error
  w(flatW(<TState extends SuperState>(state: TState) => state));

  // =-=-=

  const writed5e = w(() => fake<AState>());
  expectType<void>(writed5e());
  const flatWrited5e = flatW(() => fake<AState>());
  expectType<typeof flatWrited5e>(writed5e.flat);
  expectType<typeof writed5e.flat>(flat(writed5e));
  expectType<typeof writed5e>(w(flatWrited5e));
  expectType<() => AState>(writed5e.pure);
  expectType<typeof writed5e.pure>(pure(writed5e));

  const write6bb = w(() => fake<SuperState>());
  expectType<void>(write6bb());
  const flatWrite6bb = flatW(() => fake<SuperState>());
  expectType<typeof flatWrite6bb>(write6bb.flat);
  expectType<typeof write6bb.flat>(flat(write6bb));
  expectType<typeof write6bb>(w(flatWrite6bb));
  expectType<() => SuperState>(write6bb.pure);
  expectType<typeof write6bb.pure>(pure(write6bb));

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
  expectType<typeof flatWrite8db>(write8db.flat);
  expectType<typeof write8db.flat>(flat(write8db));
  expectType<typeof write8db>(w(flatWrite8db));
  expectType<<TState>(state: TState, patch: PossiblePatch<NoInfer<TState>>) => TState>(
    write8db.pure,
  );
  expectType<typeof write8db.pure>(pure(write8db));
});
