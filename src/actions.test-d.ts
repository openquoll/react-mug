import { expectAssignable, expectType } from 'tsd';

import { fake } from '../tests/type-utils';
import { upon } from './actions';
import { getIt, setIt } from './builtin-ops';
import {
  Mug,
  Muggify,
  PossibleMug,
  PossibleMugLike,
  pure,
  ReadActionMeta,
  ReadOpMeta,
  WriteActionMeta,
  WriteOpMeta,
} from './mug';
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

test('upon, pure', () => {
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

  expectType<typeof readc7e>(r(flatR((state: AState) => fake<ObjectState>())));

  expectType<
    (() => ObjectState) &
      ReadActionMeta<
        NestedAMug,
        ((mugLike: PossibleMugLike<AState>) => ObjectState) &
          ReadOpMeta<(state: AState) => ObjectState>
      >
  >(readc7e);
  expectType<(state: AState) => ObjectState>(pure(readc7e));

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

  const reade33 = r(<TState>(state: TState): TState => state);
  expectType<AState>(reade33());

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
  expectType<ObjectState>(readfeb());

  // =-=-=

  // @ts-expect-error
  r((state: { n: number }) => fake<ObjectState>());

  // =-=-=

  const read776 = r();
  expectType<AState>(read776());

  expectType<typeof read776>(r(getIt));

  // =-=-=

  const write30d = w((state) => {
    expectType<AState>(state);
    return state;
  });
  expectType<void>(write30d());

  expectType<typeof write30d>(w(flatW((state: AState) => state)));

  expectType<
    (() => void) &
      WriteActionMeta<
        NestedAMug,
        (<TMugLike extends PossibleMugLike<AState>>(mugLike: TMugLike) => TMugLike) &
          WriteOpMeta<(state: AState) => AState>
      >
  >(write30d);
  expectType<(state: AState) => AState>(pure(write30d));

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
  expectType<void>(write30d());

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

  // @ts-expect-error
  w((state) => fake<ObjectState>());
  // @ts-expect-error
  w(flatW((state: AState) => fake<ObjectState>()));

  // =-=-=

  const write8b5 = w((state: ObjectState) => fake<AState>());
  expectType<void>(write8b5());

  // @ts-expect-error
  w((state: SuperState) => fake<AState>());

  // =-=-=

  const write3f7 = w(<TState>(state: TState) => state);
  expectType<void>(write3f7());

  // =-=-=

  const write519 = w(<TState extends AState>(state: TState) => state);
  expectType<void>(write519());
  // =-=-=

  const write4fd = w(<TState extends ObjectState>(state: TState) => state);
  expectType<void>(write519());
  // =-=-=

  // @ts-expect-error
  w(<TState extends SuperState>(state: TState) => state);

  // =-=-=

  const writed5e = w(() => fake<AState>());
  expectType<void>(writed5e());

  const write6bb = w(() => fake<SuperState>());
  expectType<void>(write6bb());

  // @ts-expect-error
  w(() => fake<ObjectState>());

  // =-=-=

  // @ts-expect-error
  w((state: { n: number }) => fake<AState>());

  // @ts-expect-error
  w((state) => fake<{ n: number }>());

  // =-=-=

  const write8db = w();
  expectType<void>(write8db({ potentialMuggyObject: { o: { s: fake<string>() } } }));

  expectType<typeof write8db>(w(setIt));
});
