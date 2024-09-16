import { expectType } from 'tsd';

import { fake } from '../tests/type-utils';
import { Mug, MugLike, PossibleMugLike } from './mug';
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

test('upon/flat', () => {
  type ANestedMug = Mug<AState, { potentialMuggyObject: Mug<ObjectState> }>;

  const [w, r, swirlA, checkA] = upon(fake<ANestedMug>());

  // =-=-=

  const write30d = w((state) => {
    expectType<AState>(state);
    return state;
  });

  expectType<ANestedMug>(write30d());

  const r380 = flat(write30d)(fake<AState>());
  expectType<AState>(r380);

  const r1aa = flat(write30d)(fake<Mug<AState>>());
  expectType<Mug<AState>>(r1aa);

  const rb36 = flat(write30d)(fake<ANestedMug>());
  expectType<ANestedMug>(rb36);

  const ra96 = flat(write30d)(fake<MugLike<AState, { potentialMuggyObject: Mug<ObjectState> }>>());
  expectType<MugLike<AState, { potentialMuggyObject: Mug<ObjectState> }>>(ra96);

  const re28 = flat(write30d)(fake<PossibleMugLike<AState>>());
  expectType<PossibleMugLike<AState>>(re28);

  // @ts-expect-error
  flat(write30d)(fake<ObjectState>());

  // @ts-expect-error
  flat(write30d)();

  // =-=-=

  // @ts-expect-error
  w((state) => fake<ObjectState>());

  w((state: ObjectState) => fake<AState>());

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

  expectType<ObjectState>(readc7e());

  expectType<ObjectState>(flat(readc7e)(fake<AState>()));

  const r1b7 = flat(readc7e)(fake<Mug<AState>>());
  expectType<ObjectState>(r1b7);

  const rdee = flat(readc7e)(fake<ANestedMug>());
  expectType<ObjectState>(rdee);

  const rcc4 = flat(readc7e)(fake<MugLike<AState, { potentialMuggyObject: Mug<ObjectState> }>>());
  expectType<ObjectState>(rcc4);

  const r65c = flat(readc7e)(fake<PossibleMugLike<AState>>());
  expectType<ObjectState>(r65c);

  // @ts-expect-error
  flat(readc7e)(fake<ObjectState>());

  // @ts-expect-error
  flat(readc7e)();

  // =-=-=

  r((state: ObjectState) => state);

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
  expectType<ANestedMug>(rcc8);

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

  const r586 = flat(swirlA)(fake<Mug<AState>>(), patch);
  expectType<Mug<AState>>(r586);

  const r014 = flat(swirlA)(fake<ANestedMug>(), patch);
  expectType<ANestedMug>(r014);

  const r8e9 = flat(swirlA)(
    fake<MugLike<AState, { potentialMuggyObject: Mug<ObjectState> }>>(),
    patch,
  );
  expectType<MugLike<AState, { potentialMuggyObject: Mug<ObjectState> }>>(r8e9);

  const rb02 = flat(swirlA)(fake<PossibleMugLike<AState>>(), patch);
  expectType<PossibleMugLike<AState>>(rb02);

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

  const r26b = flat(checkA)(fake<Mug<AState>>());
  expectType<AState>(r26b);

  const rc66 = flat(checkA)(fake<ANestedMug>());
  expectType<AState>(rc66);

  const refd = flat(checkA)(fake<MugLike<AState, { potentialMuggyObject: Mug<ObjectState> }>>());
  expectType<AState>(refd);

  const rb3e = flat(checkA)(fake<PossibleMugLike<AState>>());
  expectType<AState>(rb3e);

  // @ts-expect-error
  flat(checkA)(fake<ObjectState>());

  // @ts-expect-error
  flat(checkA)();
});
