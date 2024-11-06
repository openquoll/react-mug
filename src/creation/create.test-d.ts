import { expectType } from 'tsd';

import { fake, from } from '../../tests/type-utils';
import { upon } from '../actions';
import { construction, flat, Muggify, MugLike, pure } from '../mug';
import { create } from './create';

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
