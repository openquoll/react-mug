import { check, construction, Mug, swirl } from '../src';
import { ownKeysOfObjectLike } from '../src/mug';

describe('operates a plain object mug by builtin ops', () => {
  interface AState {
    s: string;
    o: {
      s: string;
    };
    na: number[];
    nt: [x: number, y: number, z: number];
    oa: { s: string; o: { s: string } }[];
    ot: [{ s: string; o: { s: string } }, { s: string; o: { s: string } }];
  }

  const aMug: Mug<AState> = {
    [construction]: {
      s: 'qwe',
      o: {
        s: 'qwe',
      },
      na: [],
      nt: [100, 100, 100],
      oa: [],
      ot: [
        { s: 'qwe', o: { s: 'qwe' } },
        { s: 'qwe', o: { s: 'qwe' } },
      ],
    },
  };

  test('the state read before write equals the construction in ref and value', () => {
    const aState = check(aMug);
    expect(aState).toBe(aMug[construction]);
    expect(aState).toEqual(aMug[construction]);
  });

  test('the continuously read states stay unchanged in ref and value (before write)', () => {
    const aState1 = check(aMug);
    const aState2 = check(aMug);
    expect(aState1).toBe(aState2);
    expect(aState1).toEqual(aState2);
  });

  describe('writes the string field with a different value', () => {
    let aStateBefore: any, aStateAfter: any;
    let constructionBefore: any, constructionShallowCloneBefore: any;

    test('[action]', () => {
      aStateBefore = check(aMug);
      constructionBefore = aMug[construction];
      constructionShallowCloneBefore = { ...aMug[construction] };

      swirl(aMug, { s: 'wer' });

      aStateAfter = check(aMug);
    });

    test('[verify] the state changes in ref and value', () => {
      expect(aStateAfter).not.toBe(aStateBefore);
      expect(aStateAfter).toEqual({
        s: 'wer',
        o: {
          s: 'qwe',
        },
        na: [],
        nt: [100, 100, 100],
        oa: [],
        ot: [
          { s: 'qwe', o: { s: 'qwe' } },
          { s: 'qwe', o: { s: 'qwe' } },
        ],
      });
    });

    test('[verify] the construction and its fields stay unchanged in ref and value', () => {
      expect(aMug[construction]).toBe(constructionBefore);
      ownKeysOfObjectLike(aMug[construction]).forEach((key) => {
        expect(aMug[construction][key]).toBe(constructionShallowCloneBefore[key]);
      });
      expect(aMug[construction]).toEqual({
        s: 'qwe',
        o: {
          s: 'qwe',
        },
        na: [],
        nt: [100, 100, 100],
        oa: [],
        ot: [
          { s: 'qwe', o: { s: 'qwe' } },
          { s: 'qwe', o: { s: 'qwe' } },
        ],
      });
    });

    test('[verify] the rest fields stay unchanged in ref and value', () => {
      ownKeysOfObjectLike(aStateBefore)
        .filter((key) => key !== 's')
        .forEach((key) => {
          expect(aStateAfter[key]).toBe(aStateBefore[key]);
          expect(aStateAfter[key]).toEqual(aStateBefore[key]);
        });
    });
  });

  test('writes the string field with a same string, the state and its fields stay unchanged in ref and value', () => {
    const aStateBefore = check(aMug);

    swirl(aMug, { s: 'wer' });

    const aStateAfter = check(aMug);

    expect(aStateAfter).toBe(aStateBefore);
    ownKeysOfObjectLike(aStateBefore).forEach((key) => {
      expect(aStateAfter[key]).toBe(aStateBefore[key]);
      expect(aStateAfter[key]).toEqual(aStateBefore[key]);
    });
  });

  describe('writes the number array field', () => {
    test('with a dense bigger-length array of different items, the field changes in ref, length, and all items', () => {
      const aStateBefore = check(aMug);

      swirl(aMug, { na: [100, 100, 100] });

      const aStateAfter = check(aMug);

      expect(aStateAfter.na).not.toBe(aStateBefore.na);
      expect(aStateAfter.na).toEqual([100, 100, 100]);
    });

    test('with a dense smaller-length array of different items, the field changes in ref, length, and all items', () => {
      const aStateBefore = check(aMug);

      swirl(aMug, { na: [110, 110] });

      const aStateAfter = check(aMug);

      expect(aStateAfter.na).not.toBe(aStateBefore.na);
      expect(aStateAfter.na).toEqual([110, 110]);
    });

    test('with a dense same-length array of different items, the field changes in ref and all items', () => {
      const aStateBefore = check(aMug);

      swirl(aMug, { na: [120, 120] });

      const aStateAfter = check(aMug);

      expect(aStateAfter.na).not.toBe(aStateBefore.na);
      expect(aStateAfter.na).toEqual([120, 120]);
    });

    test('with a dense same-length array of same items, the field stay unchanged in ref and value', () => {
      const aStateBefore = check(aMug);

      swirl(aMug, { na: [120, 120] });

      const aStateAfter = check(aMug);

      expect(aStateAfter.na).toBe(aStateBefore.na);
      expect(aStateAfter.na).toEqual([120, 120]);
    });

    test('with a sparse bigger-length array of different items, the field changes in ref, length, and non-empty items', () => {
      const aState1 = check(aMug);

      swirl(aMug, { na: [, 130, ,] });

      const aState2 = check(aMug);
      expect(aState2.na).not.toBe(aState1.na);
      expect(aState2.na).toEqual([120, 130, ,]);
    });

    test('with a sparse smaller-length array of different items, the field changes in ref, length, and non-empty items', () => {
      const aStateBefore = check(aMug);

      swirl(aMug, { na: [140, ,] });

      const aStateAfter = check(aMug);
      expect(aStateAfter.na).not.toBe(aStateBefore.na);
      expect(aStateAfter.na).toEqual([140, 130]);
    });

    test('with a sparse same-length array of different items, the field changes in ref and non-empty items', () => {
      const aStateBefore = check(aMug);

      swirl(aMug, { na: [150, ,] });

      const aStateAfter = check(aMug);
      expect(aStateAfter.na).not.toBe(aStateBefore.na);
      expect(aStateAfter.na).toEqual([150, 130]);
    });

    test('with a sparse same-length array of empty items, the field stays unchanged in ref and value', () => {
      const aStateBefore = check(aMug);

      swirl(aMug, { na: [, ,] });

      const aStateAfter = check(aMug);
      expect(aStateAfter.na).toBe(aStateBefore.na);
      expect(aStateAfter.na).toEqual([150, 130]);
    });
  });

  describe('writes the number tuple field', () => {
    test('with a dense tuple of different items, the field changes in field ref and all items', () => {
      const aState1 = check(aMug);

      swirl(aMug, { nt: [110, 110, 110] });

      const aState2 = check(aMug);

      expect(aState2.nt).not.toBe(aState1.nt);
      expect(aState2.nt).toEqual([110, 110, 110]);
    });

    test('with a dense tuple of same items, the field stays unchanged in ref and value', () => {
      const aState1 = check(aMug);

      swirl(aMug, { nt: [110, 110, 110] });

      const aState2 = check(aMug);

      expect(aState2.nt).toBe(aState1.nt);
      expect(aState2.nt).toEqual([110, 110, 110]);
    });

    test('with a sparse tuple of different items, the field changes in field ref and non-empty items', () => {
      const aState1 = check(aMug);

      swirl(aMug, { nt: [, 120, ,] });

      const aState2 = check(aMug);

      expect(aState2.nt).not.toBe(aState1.nt);
      expect(aState2.nt).toEqual([110, 120, 110]);
    });

    test('with a sparse tuple of empty items, the field stays unchanged in ref and value', () => {
      const aState1 = check(aMug);

      swirl(aMug, { nt: [, , ,] });

      const aState2 = check(aMug);

      expect(aState2.nt).toBe(aState1.nt);
      expect(aState2.nt).toEqual([110, 120, 110]);
    });
  });

  describe('writes the object array field', () => {
    test('with a bigger-length dense array of different full-fledged items, the field changes in ref, length, and all items', () => {
      const aStateBefore = check(aMug);

      swirl(aMug, {
        oa: [
          { s: 'qwe', o: { s: 'qwe' } },
          { s: 'qwe', o: { s: 'qwe' } },
        ],
      });

      const aStateAfter = check(aMug);

      expect(aStateAfter.oa).not.toBe(aStateBefore.oa);
      expect(aStateAfter.oa).toEqual([
        { s: 'qwe', o: { s: 'qwe' } },
        { s: 'qwe', o: { s: 'qwe' } },
      ]);
    });

    describe('with a same-length dense array of full-fledged items one of which has a different string field', () => {
      let aStateBefore: any, aStateAfter: any;

      test('[action]', () => {
        aStateBefore = check(aMug);

        swirl(aMug, {
          oa: [
            { s: 'wer', o: { s: 'qwe' } },
            { s: 'qwe', o: { s: 'qwe' } },
          ],
        });

        aStateAfter = check(aMug);
      });

      test('[verify] the field changes in ref and value', () => {
        expect(aStateAfter.oa).not.toBe(aStateBefore.oa);
        expect(aStateAfter.oa).toEqual([
          { s: 'wer', o: { s: 'qwe' } },
          { s: 'qwe', o: { s: 'qwe' } },
        ]);
      });

      test('[verify] that item changes in ref and value', () => {
        expect(aStateAfter.oa[0]).not.toBe(aStateBefore.oa[0]);
        expect(aStateAfter.oa[0]).toEqual({ s: 'wer', o: { s: 'qwe' } });
      });

      test('[verify] the rest items stay unchanged in ref and value', () => {
        expect(aStateAfter.oa[1]).toBe(aStateBefore.oa[1]);
        expect(aStateAfter.oa[1]).toEqual(aStateBefore.oa[1]);
      });

      test(`[verify] that item's rest fields stay unchanged in ref and value`, () => {
        ownKeysOfObjectLike(aStateAfter.oa[0].o)
          .filter((key) => key !== 's')
          .forEach((key) => {
            expect(aStateAfter.oa[0].o[key]).toBe(aStateBefore.oa[0].o[key]);
            expect(aStateAfter.oa[0].o[key]).toEqual(aStateBefore.oa[0].o[key]);
          });
      });
    });

    describe('with a same-length sparse array of different full-fledged object items', () => {
      let aStateBefore: any, aStateAfter: any;
      test('[action]', () => {
        aStateBefore = check(aMug);

        swirl(aMug, {
          oa: [{ s: 'ert', o: { s: 'ert' } }, ,],
        });

        aStateAfter = check(aMug);
      });

      test('[verify] the field changes in ref, length, and non-empty items', () => {
        expect(aStateAfter.oa).not.toBe(aStateBefore.oa);
        expect(aStateAfter.oa).toEqual([
          { s: 'ert', o: { s: 'ert' } },
          { s: 'qwe', o: { s: 'qwe' } },
        ]);
      });

      test(`[verify] the empty items' counterparts stay unchanged in ref and value`, () => {
        expect(aStateAfter.oa[1]).toBe(aStateBefore.oa[1]);
        expect(aStateAfter.oa[1]).toEqual(aStateBefore.oa[1]);
      });
    });
  });

  describe('writes the object tuple field with a sparse tuple of a partial object item that only has a different string field', () => {
    let aStateBefore: any, aStateAfter: any;

    test('[action]', () => {
      aStateBefore = check(aMug);

      swirl(aMug, {
        ot: [{ s: 'wer' }, ,],
      });

      aStateAfter = check(aMug);
    });

    test('[verify] the field changes in ref and value', () => {
      expect(aStateAfter.ot).not.toBe(aStateBefore.ot);
      expect(aStateAfter.ot).toEqual([
        { s: 'wer', o: { s: 'qwe' } },
        { s: 'qwe', o: { s: 'qwe' } },
      ]);
    });

    test('[verify] that item changes in ref and value', () => {
      expect(aStateAfter.ot[0]).not.toBe(aStateBefore.ot[0]);
      expect(aStateAfter.ot[0]).toEqual({ s: 'wer', o: { s: 'qwe' } });
    });

    test(`[verify] that item's rest fields stay unchanged in ref and value`, () => {
      expect(aStateAfter.ot[1]).toBe(aStateBefore.ot[1]);
      expect(aStateAfter.ot[1]).toEqual(aStateBefore.ot[1]);
    });
  });

  test('the continuously read states stay unchanged in ref and value (after write)', () => {
    const aState1 = check(aMug);
    const aState2 = check(aMug);
    expect(aState1).toBe(aState2);
    expect(aState1).toEqual(aState2);
  });
});

describe('operates a number mug by builtin ops', () => {
  const aMug: Mug<number> = {
    [construction]: 100,
  };

  test('the state read before write equals the construction value', () => {
    const aState = check(aMug);

    expect(aState).toBe(aMug[construction]);
  });

  test('writes the state, the state changes', () => {
    swirl(aMug, 110);

    const aState = check(aMug);

    expect(aState).toBe(110);
  });
});
