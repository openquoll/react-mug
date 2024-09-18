import { expectAssignable, expectType } from 'tsd';

import { fake, from } from '../tests/type-utils';
import { construction, Mug, MugLike, PossibleMug, PossibleMugLike } from './mug';
import { flat, upon } from './sugar';

interface ObjectState {
  s: string;
  o: {
    s: string;
  };
}

interface AState extends ObjectState {
  potentialMuggyObject: ObjectState;
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

test('upon/flat', () => {
  const [w, r, swirlA, checkA] = upon(fake<NestedAMug>());

  const uponA = upon(fake<NestedAMug>());

  expectType<typeof w>(uponA.w);
  expectType<typeof r>(uponA.r);
  expectType<typeof swirlA>(uponA.swirl);
  expectType<typeof checkA>(uponA.check);

  // @ts-expect-error
  uponA.w = fake<any>;

  // @ts-expect-error
  uponA[0] = fake<any>;

  // =-=-=

  const write30d = w((state) => {
    expectType<AState>(state);
    return state;
  });

  upon(fake<DirtyAMug>()).w((state) => {
    expectType<AState>(state);
    return state;
  });

  expectType<NestedAMug>(write30d());

  const r380 = flat(write30d)(fake<AState>());
  expectType<AState>(r380);

  const r1aa = flat(write30d)(fake<AMug>());
  expectType<AMug>(r1aa);

  const rb36 = flat(write30d)(fake<NestedAMug>());
  expectType<NestedAMug>(rb36);

  const ra96 = flat(write30d)(fake<AMugLike>());
  expectType<AMugLike>(ra96);

  const rbdb = flat(write30d)(fake<PossibleAMug>());
  expectType<PossibleAMug>(rbdb);

  const re28 = flat(write30d)(fake<PossibleAMugLike>());
  expectType<PossibleAMugLike>(re28);

  const r421 = flat(write30d)(fake<DirtyAMug>());
  expectType<DirtyAMug>(r421);

  // @ts-expect-error
  flat(write30d)(fake<ObjectState>());

  // @ts-expect-error
  flat(write30d)();

  // =-=-=

  w(() => fake<AState>());

  // @ts-expect-error
  w((state) => fake<ObjectState>());

  w((state: ObjectState) => fake<AState>());

  // @ts-expect-error
  w((state: { n: number }) => fake<AState>());

  // =-=-=

  const writebb8 = w((state, s: string) => state);

  writebb8(fake<string>());

  // @ts-expect-error
  writebb8();

  // @ts-expect-error
  writebb8(fake<number>());

  // @ts-expect-error
  writebb8(fake<string>(), fake<any>());

  flat(writebb8)(fake<AState>(), fake<string>());

  // @ts-expect-error
  flat(writebb8)(fake<AState>());

  // @ts-expect-error
  flat(writebb8)(fake<AState>(), fake<number>());

  // @ts-expect-error
  flat(writebb8)(fake<AState>(), fake<string>(), fake<any>());

  // =-=-=

  const readc7e = r((state) => {
    expectType<AState>(state);
    return fake<ObjectState>();
  });

  upon(fake<DirtyAMug>()).r((state) => {
    expectType<AState>(state);
    return fake<ObjectState>();
  });

  expectType<ObjectState>(readc7e());

  expectType<ObjectState>(flat(readc7e)(fake<AState>()));

  const r1b7 = flat(readc7e)(fake<AMug>());
  expectType<ObjectState>(r1b7);

  const rdee = flat(readc7e)(fake<NestedAMug>());
  expectType<ObjectState>(rdee);

  const rcc4 = flat(readc7e)(fake<AMugLike>());
  expectType<ObjectState>(rcc4);

  const re31 = flat(readc7e)(fake<PossibleAMug>());
  expectType<ObjectState>(re31);

  const r65c = flat(readc7e)(fake<PossibleAMugLike>());
  expectType<ObjectState>(r65c);

  const r9e3 = flat(readc7e)(fake<DirtyAMug>());
  expectType<ObjectState>(r9e3);

  // @ts-expect-error
  flat(readc7e)(fake<ObjectState>());

  // @ts-expect-error
  flat(readc7e)();

  // =-=-=

  r(() => fake<ObjectState>());

  r((state: ObjectState) => state);

  // @ts-expect-error
  r((state: { n: number }) => state);

  // =-=-=

  const read2e0 = r((state, s: string) => fake<ObjectState>());

  read2e0(fake<string>());

  // @ts-expect-error
  read2e0();

  // @ts-expect-error
  read2e0(fake<number>());

  // @ts-expect-error
  read2e0(fake<string>(), fake<any>());

  flat(read2e0)(fake<AState>(), fake<string>());

  // @ts-expect-error
  flat(read2e0)(fake<AState>());

  // @ts-expect-error
  flat(read2e0)(fake<AState>(), fake<number>());

  // @ts-expect-error
  flat(read2e0)(fake<AState>(), fake<string>(), fake<any>());

  // =-=-=

  const patch = { potentialMuggyObject: { o: { s: fake<string>() } } };

  const rcc8 = swirlA(patch);
  expectType<NestedAMug>(rcc8);

  // @ts-expect-error
  swirlA({ n: fake<number>() });

  // @ts-expect-error
  swirlA({ s: fake<string>(), n: fake<number>() });

  // @ts-expect-error
  swirlA();

  // @ts-expect-error
  swirlA(patch, fake<any>());

  const r73a = flat(swirlA)(fake<AState>(), patch);
  expectType<AState>(r73a);

  const r586 = flat(swirlA)(fake<AMug>(), patch);
  expectType<AMug>(r586);

  const r014 = flat(swirlA)(fake<NestedAMug>(), patch);
  expectType<NestedAMug>(r014);

  const r8e9 = flat(swirlA)(fake<AMugLike>(), patch);
  expectType<AMugLike>(r8e9);

  const r12e = flat(swirlA)(fake<PossibleAMug>(), patch);
  expectType<PossibleAMug>(r12e);

  const rb02 = flat(swirlA)(fake<PossibleAMugLike>(), patch);
  expectType<PossibleAMugLike>(rb02);

  const rf52 = flat(swirlA)(fake<DirtyAMug>(), patch);
  expectType<DirtyAMug>(rf52);

  // @ts-expect-error
  flat(swirlA)(fake<ObjectState>(), { o: { s: fake<string>() } });

  // @ts-expect-error
  flat(swirlA)(fake<AState>(), { n: fake<number>() });

  // @ts-expect-error
  flat(swirlA)(fake<AState>(), { s: fake<string>(), n: fake<number>() });

  // @ts-expect-error
  flat(swirlA)(fake<AState>());

  // @ts-expect-error
  flat(swirlA)();

  // @ts-expect-error
  flat(swirlA)(fake<AState>(), patch, fake<any>());

  // =-=-=

  expectType<AState>(checkA());

  // @ts-expect-error
  checkA(fake<any>());

  const re59 = flat(checkA)(fake<AState>());
  expectType<AState>(re59);

  const r26b = flat(checkA)(fake<AMug>());
  expectType<AState>(r26b);

  const rc66 = flat(checkA)(fake<NestedAMug>());
  expectType<AState>(rc66);

  const refd = flat(checkA)(fake<AMugLike>());
  expectType<AState>(refd);

  const reeb = flat(checkA)(fake<PossibleAMug>());
  expectAssignable<AState>(reeb);
  expectAssignable<typeof reeb>(from<AState>());

  const rb3e = flat(checkA)(fake<PossibleAMugLike>());
  expectAssignable<AState>(rb3e);
  expectAssignable<typeof rb3e>(from<AState>());

  const r74b = flat(checkA)(fake<DirtyAMug>());
  expectType<AState>(r74b);

  // @ts-expect-error
  flat(checkA)(fake<ObjectState>());

  // @ts-expect-error
  flat(checkA)();
});
