import { check, construction, swirl } from '../src';
import { Mug, ownKeysOfObjectLike } from '../src/mug';

describe('reads and writes a simple mug', () => {
  interface AState {
    s: string;
    o: {
      b: boolean;
    };
    a: number[];
    t: [x: number, y: number, z: number];
  }

  const aMug: Mug<AState> = {
    [construction]: {
      s: 'qwe',
      o: {
        b: false,
      },
      a: [],
      t: [100, 100, 100],
    },
  };

  test('reads the initial state which equals to the construction value', () => {
    const aState = check(aMug);
    expect(aState).toEqual({
      s: 'qwe',
      o: {
        b: false,
      },
      a: [],
      t: [100, 100, 100],
    });
  });

  test('writes a part of the state, the construction value stays untouched', () => {
    const refOfConstruction = aMug[construction];
    const refsOfConstructionFields = { ...aMug[construction] };

    swirl(aMug, { s: 'asd' });

    const aState = check(aMug);
    expect(aState).toEqual({
      s: 'asd',
      o: {
        b: false,
      },
      a: [],
      t: [100, 100, 100],
    });

    expect(aMug[construction]).toBe(refOfConstruction);
    ownKeysOfObjectLike(aMug[construction]).forEach((key) => {
      expect(aMug[construction][key]).toBe(refsOfConstructionFields[key]);
    });
  });

  test('writes a part of the state, the rest parts stay untouched', () => {
    const oldAState = check(aMug);
    const untouchedParts = {
      o: oldAState.o,
      a: oldAState.a,
      t: oldAState.t,
    };

    swirl(aMug, { s: 'zxc' });

    const newAState = check(aMug);
    expect(newAState).toEqual({
      s: 'zxc',
      o: {
        b: false,
      },
      a: [],
      t: [100, 100, 100],
    });

    ownKeysOfObjectLike(untouchedParts).forEach((key) => {
      expect(newAState[key]).toBe(untouchedParts[key]);
    });
  });
});
