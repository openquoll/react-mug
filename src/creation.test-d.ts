import { expectType } from 'tsd';

import { fake, from } from '../tests/type-utils';
import { upon } from './actions';
import { create, creator } from './creation';
import { construction, flat, Mug, Muggify, MugLike, pure } from './mug';

interface ObjectState {
  s: string;
  o: {
    s: string;
  };
}

interface AState extends ObjectState {
  potentialMuggyObject: ObjectState;
}

describe('create', () => {
  const aMug0f0Phase1 = create<AState>({
    s: fake<string>(),
    o: {
      s: fake<string>(),
    },
    potentialMuggyObject: fake<ObjectState>(),
  });

  expectType<{
    [construction]: AState;
    s: string;
    o: {
      s: string;
    };
    potentialMuggyObject: ObjectState;
  }>(from<Omit<typeof aMug0f0Phase1, 'attach'>>());

  const [aMug0f0R, aMug0f0W] = upon(fake<{ [construction]: AState } & AState>());

  const readcd8 = aMug0f0R();
  const read827 = aMug0f0R((state) => fake<ObjectState>());
  const read06b = aMug0f0R((state, s: string) => fake<ObjectState>());

  const write51f = aMug0f0W();
  const write3a9 = aMug0f0W((state) => fake<AState>());
  const writee58 = aMug0f0W((state, s: string) => fake<AState>());

  const aMug9f6Phase2 = aMug0f0Phase1.attach(({ r, w, mug }) => {
    expectType<{ [construction]: AState } & AState>(mug);

    expectType<typeof aMug0f0R>(r);
    expectType<typeof aMug0f0W>(w);

    const read42c = r();
    const read60b = r((state) => fake<ObjectState>());
    const read45f = r((state) => flat(read60b)(state));
    const read5d2 = r((state) => pure(read60b)(state));
    const read506 = r((state, s: string) => fake<ObjectState>());
    function read4ec(s: string) {
      return read506(s);
    }

    const write6c1 = w();
    const write541 = w((state) => fake<AState>());
    const writeb0a = w((state) => flat(write541)(state));
    const write3be = w((state) => pure(write541)(state));
    const write495 = w((state, s: string) => fake<AState>());
    function writeb4d(s: string) {
      return write495(s);
    }

    return {
      read42c,
      read60b,
      read45f,
      read5d2,
      read506,
      read4ec,

      write6c1,
      write541,
      writeb0a,
      write3be,
      write495,
      writeb4d,
    };
  });

  expectType<
    {
      [construction]: AState;
    } & AState & {
        read42c: typeof readcd8;
        read60b: typeof read827;
        read45f: typeof read827;
        read5d2: typeof read827;
        read506: typeof read06b;
        read4ec(s: string): ObjectState;

        write6c1: typeof write51f;
        write541: typeof write3a9;
        writeb0a: typeof write3a9;
        write3be: typeof write3a9;
        write495: typeof writee58;
        writeb4d(s: string): void;
      }
  >(aMug9f6Phase2);

  // =-=-=

  const aMug92c = create(fake<AState>()).attach(({ r, w }) => ({
    read3d7: r(),
    write725: w(),
  }));

  expectType<
    {
      [construction]: AState;
    } & AState & {
        read3d7: typeof readcd8;
        write725: typeof write51f;
      }
  >(aMug92c);

  // =-=-=

  const objectMug499 = create<ObjectState>({
    s: fake<string>(),
    o: {
      s: fake<string>(),
    },
  }).attach(({ r, w }) => ({
    read2a7: r((state) => fake<string>()),
    writec5b: w((state) => fake<ObjectState>()),
  }));

  type ObjectMug499 = typeof objectMug499;

  const [nestedAMugb3dR, nestedAMugb3dW] =
    upon(
      fake<
        {
          [construction]: MugLike<AState, { potentialMuggyObject: ObjectMug499 }>;
        } & MugLike<AState, { potentialMuggyObject: ObjectMug499 }>
      >(),
    );

  const readf53 = nestedAMugb3dR((state) => fake<string>());
  const writead3 = nestedAMugb3dW((state) => fake<AState>());

  const nestedAMugb3d = create<Muggify<AState, { potentialMuggyObject: ObjectMug499 }>>({
    s: fake<string>(),
    o: {
      s: fake<string>(),
    },
    potentialMuggyObject: objectMug499,
  }).attach(({ r, w, mug }) => ({
    read754: r((state) => pure(mug.potentialMuggyObject.read2a7)(state.potentialMuggyObject)),
    writeed8: w((state) => ({
      ...state,
      potentialMuggyObject: pure(mug.potentialMuggyObject.writec5b)(state.potentialMuggyObject),
    })),
  }));

  expectType<
    {
      [construction]: MugLike<AState, { potentialMuggyObject: ObjectMug499 }>;
    } & MugLike<AState, { potentialMuggyObject: ObjectMug499 }> & {
        read754: typeof readf53;
        writeed8: typeof writead3;
      }
  >(nestedAMugb3d);
});

describe('creator', () => {
  const createAMug4fdPhase1 = creator<(s: string) => AState>((s) => ({
    s,
    o: {
      s,
    },
    potentialMuggyObject: fake<ObjectState>(),
  }));

  const aMug4fdPhase1 = createAMug4fdPhase1(fake<string>());

  expectType<{
    [construction]: AState;
    s: string;
    o: {
      s: string;
    };
    potentialMuggyObject: ObjectState;
  }>(from<Omit<typeof aMug4fdPhase1, 'attach'>>());

  const [aMug4fdR, aMug4fdW] = upon(fake<{ [construction]: AState } & AState>());

  const readead = aMug4fdR();
  const read67d = aMug4fdR((state) => fake<ObjectState>());
  const read26d = aMug4fdR((state, s: string) => fake<ObjectState>());

  const writea1b = aMug4fdW();
  const write87d = aMug4fdW((state) => fake<AState>());
  const write2bb = aMug4fdW((state, s: string) => fake<AState>());

  const createAMug4fdPhase2 = createAMug4fdPhase1.attach(({ r, w, mug }) => {
    expectType<{ [construction]: AState } & AState>(mug);

    expectType<typeof aMug4fdR>(r);
    expectType<typeof aMug4fdW>(w);

    const read947 = r();
    const read52a = r((state) => fake<ObjectState>());
    const read841 = r((state) => flat(read52a)(state));
    const read095 = r((state) => pure(read52a)(state));
    const reade2d = r((state, s: string) => fake<ObjectState>());
    function read5c7(s: string) {
      return reade2d(s);
    }

    const write2f0 = w();
    const writec33 = w((state) => fake<AState>());
    const write801 = w((state) => flat(writec33)(state));
    const write678 = w((state) => pure(writec33)(state));
    const write870 = w((state, s: string) => fake<AState>());
    function write7af(s: string) {
      return write870(s);
    }

    return {
      read947,
      read52a,
      read841,
      read095,
      reade2d,
      read5c7,

      write2f0,
      writec33,
      write801,
      write678,
      write870,
      write7af,
    };
  });

  const aMug4fd = createAMug4fdPhase2(fake<string>());

  expectType<
    {
      [construction]: AState;
    } & AState & {
        read947: typeof readead;
        read52a: typeof read67d;
        read841: typeof read67d;
        read095: typeof read67d;
        reade2d: typeof read26d;
        read5c7: (s: string) => ObjectState;

        write2f0: typeof writea1b;
        writec33: typeof write87d;
        write801: typeof write87d;
        write678: typeof write87d;
        write870: typeof write2bb;
        write7af: (s: string) => void;
      }
  >(aMug4fd);

  // =-=-=

  const createAMug92c = creator(() => fake<AState>()).attach(({ r, w }) => ({
    read3d7: r(),
    write725: w(),
  }));

  const aMug92c = createAMug92c();

  expectType<
    {
      [construction]: AState;
    } & AState & {
        read3d7: typeof readead;
        write725: typeof writea1b;
      }
  >(aMug92c);

  // =-=-=

  const createObjectMug3d0 = creator<() => ObjectState>(() => ({
    s: fake<string>(),
    o: {
      s: fake<string>(),
    },
  })).attach(({ r, w }) => ({
    readba8: r((state) => fake<string>()),
    writed84: w((state) => fake<ObjectState>()),
  }));

  type ObjectMug3d0 = ReturnType<typeof createObjectMug3d0>;

  const [nestedAMugafeR, nestedAMugafeW] =
    upon(
      fake<
        {
          [construction]: MugLike<AState, { potentialMuggyObject: ObjectMug3d0 }>;
        } & MugLike<AState, { potentialMuggyObject: ObjectMug3d0 }>
      >(),
    );

  const read034 = nestedAMugafeR((state) => fake<string>());
  const write5e2 = nestedAMugafeW((state) => fake<AState>());

  const createNestedAMugafe = creator<
    () => Muggify<AState, { potentialMuggyObject: ObjectMug3d0 }>
  >(() => ({
    s: fake<string>(),
    o: {
      s: fake<string>(),
    },
    potentialMuggyObject: createObjectMug3d0(),
  })).attach(({ r, w, mug }) => ({
    read4ab: r((state) => pure(mug.potentialMuggyObject.readba8)(state.potentialMuggyObject)),
    writec29: w((state) => ({
      ...state,
      potentialMuggyObject: pure(mug.potentialMuggyObject.writed84)(state.potentialMuggyObject),
    })),
  }));

  const nestedAMugafe = createNestedAMugafe();

  expectType<
    {
      [construction]: MugLike<AState, { potentialMuggyObject: ObjectMug3d0 }>;
    } & MugLike<AState, { potentialMuggyObject: ObjectMug3d0 }> & {
        read4ab: typeof read034;
        writec29: typeof write5e2;
      }
  >(nestedAMugafe);
});
