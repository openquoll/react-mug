import { expectType } from 'tsd';

import { fake, from } from '../../tests/type-utils';
import { upon } from '../actions';
import { construction, flat, Muggify, MugLike, pure } from '../mug';
import { creator } from './creator';

interface ObjectState {
  s: string;
  o: {
    s: string;
  };
}

interface AState extends ObjectState {
  potentialMuggyObject: ObjectState;
}

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
