import { check, construction, Mug, PossibleMug, swirl } from '../src';
import { MugError, ownKeysOfObjectLike } from '../src/mug';

describe('11d55b6, operates "a plain object mug" by builtin ops', () => {
  interface ObjectState {
    s: string;
    o: {
      s: string;
    };
  }

  interface AState extends ObjectState {
    na: number[];
    nt: [x: number, y: number, z: number];
    oa: ObjectState[];
    ot: [ObjectState, ObjectState];
  }

  const aMug: Mug<AState> = {
    [construction]: {
      s: 'asd',
      o: {
        s: 'asd',
      },
      na: [],
      nt: [300, 300, 300],
      oa: [],
      ot: [
        { s: 'asd', o: { s: 'asd' } },
        { s: 'asd', o: { s: 'asd' } },
      ],
    },
  };

  describe('f639968, reads the mug before write', () => {
    test('[action, verify] the state equals the construction in ref and value', () => {
      const aState = check(aMug);

      expect(aState).toBe(aMug[construction]);
      expect(aState).toStrictEqual(aMug[construction]);
    });
  });

  describe('908db7b, continuously reads the mug before write', () => {
    test('[action, verify] the state and its fields stays unchanged in ref and value', () => {
      const aState1 = check(aMug);
      const aState2 = check(aMug);

      expect(aState2).toBe(aState1);
      ownKeysOfObjectLike(aState1).forEach((key) => {
        expect(aState2[key]).toBe(aState1[key]);
      });
      expect(aState2).toStrictEqual(aState1);
    });
  });

  describe('ee05c41, first writes "the string field" with a different value', () => {
    let aStateBefore: any, aStateAfter: any;
    let constructionBefore: any, constructionShallowCloneBefore: any;
    const constructionDeepCloneBefore = {
      s: 'asd',
      o: {
        s: 'asd',
      },
      na: [],
      nt: [300, 300, 300],
      oa: [],
      ot: [
        { s: 'asd', o: { s: 'asd' } },
        { s: 'asd', o: { s: 'asd' } },
      ],
    };

    test('[action]', () => {
      aStateBefore = check(aMug);
      constructionBefore = aMug[construction];
      constructionShallowCloneBefore = { ...aMug[construction] };

      swirl(aMug, { s: 'a31' });

      aStateAfter = check(aMug);
    });

    test('[verify] the state changes in ref and value', () => {
      expect(aStateAfter).not.toBe(aStateBefore);
      expect(aStateAfter).toStrictEqual({
        s: 'a31',
        o: {
          s: 'asd',
        },
        na: [],
        nt: [300, 300, 300],
        oa: [],
        ot: [
          { s: 'asd', o: { s: 'asd' } },
          { s: 'asd', o: { s: 'asd' } },
        ],
      });
    });

    test('[verify] the construction and its fields stay unchanged in ref and value', () => {
      expect(aMug[construction]).toBe(constructionBefore);
      ownKeysOfObjectLike(constructionShallowCloneBefore).forEach((key) => {
        expect((aMug[construction] as any)[key]).toBe(constructionShallowCloneBefore[key]);
      });
      expect(aMug[construction]).toStrictEqual(constructionDeepCloneBefore);
    });

    test('[verify] the rest fields stay unchanged in ref and value', () => {
      ownKeysOfObjectLike(aStateBefore)
        .filter((key) => key !== 's')
        .forEach((key) => {
          expect(aStateAfter[key]).toBe(aStateBefore[key]);
          expect(aStateAfter[key]).toStrictEqual(aStateBefore[key]);
        });
    });
  });

  describe('faa37a7, writes "the string field" with a same value', () => {
    test('[action, verify] the state and its fields stay unchanged in ref and value', () => {
      swirl(aMug, { s: 'a91' });
      const aStateBefore = check(aMug);
      expect(aStateBefore).toMatchObject({ s: 'a91' });

      swirl(aMug, { s: 'a91' });
      const aStateAfter = check(aMug);

      expect(aStateAfter).toBe(aStateBefore);
      ownKeysOfObjectLike(aStateBefore).forEach((key) => {
        expect(aStateAfter[key]).toBe(aStateBefore[key]);
      });
      expect(aStateAfter).toStrictEqual(aStateBefore);
    });
  });

  describe('4dee5ea, writes "the number array field"', () => {
    describe('72d1e10, with a dense bigger-length array of different items', () => {
      test('[action, verify] the field changes in ref, length, and all items', () => {
        swirl(aMug, { na: [879, 879] });
        const aStateBefore = check(aMug);
        expect(aStateBefore).toMatchObject({ na: [879, 879] });

        swirl(aMug, { na: [269, 269, 269] });
        const aStateAfter = check(aMug);

        expect(aStateAfter.na).not.toBe(aStateBefore.na);
        expect(aStateAfter.na).toStrictEqual([269, 269, 269]);
      });
    });

    describe('c68f6ef, with a dense smaller-length array of different items', () => {
      test('[action, verify] the field changes in ref, length, and all items', () => {
        swirl(aMug, { na: [899, 899, 899] });
        const aStateBefore = check(aMug);
        expect(aStateBefore).toMatchObject({ na: [899, 899, 899] });

        swirl(aMug, { na: [953, 953] });
        const aStateAfter = check(aMug);

        expect(aStateAfter.na).not.toBe(aStateBefore.na);
        expect(aStateAfter.na).toStrictEqual([953, 953]);
      });
    });

    describe('95113f0, with a dense same-length array of different items', () => {
      test('[action, verify] the field changes in ref and all items but not in length', () => {
        swirl(aMug, { na: [987, 987] });
        const aStateBefore = check(aMug);
        expect(aStateBefore).toMatchObject({ na: [987, 987] });

        swirl(aMug, { na: [180, 180] });
        const aStateAfter = check(aMug);

        expect(aStateAfter.na).not.toBe(aStateBefore.na);
        expect(aStateAfter.na).toStrictEqual([180, 180]);
      });
    });

    describe('1215e15, with a dense same-length array of same items', () => {
      test('[action, verify]  the field stay unchanged in ref and value', () => {
        swirl(aMug, { na: [574, 574] });
        const aStateBefore = check(aMug);
        expect(aStateBefore).toMatchObject({ na: [574, 574] });

        swirl(aMug, { na: [574, 574] });
        const aStateAfter = check(aMug);

        expect(aStateAfter.na).toBe(aStateBefore.na);
        expect(aStateAfter.na).toStrictEqual([574, 574]);
      });
    });

    describe('cf5141b, with a sparse bigger-length array of different items', () => {
      test('[action, verify] the field changes in ref, length, and non-empty items', () => {
        swirl(aMug, { na: [195, 195] });
        const aStateBefore = check(aMug);
        expect(aStateBefore).toMatchObject({ na: [195, 195] });

        swirl(aMug, { na: [, 271, ,] });
        const aStateAfter = check(aMug);

        expect(aStateAfter.na).not.toBe(aStateBefore.na);
        expect(aStateAfter.na).toStrictEqual([195, 271, ,]);
      });
    });

    describe('f0690e6, with a sparse smaller-length array of different items', () => {
      test('[action, verify] the field changes in ref, length, and non-empty items', () => {
        swirl(aMug, { na: [127, 127, 127] });
        const aStateBefore = check(aMug);
        expect(aStateBefore).toMatchObject({ na: [127, 127, 127] });

        swirl(aMug, { na: [443, ,] });
        const aStateAfter = check(aMug);

        expect(aStateAfter.na).not.toBe(aStateBefore.na);
        expect(aStateAfter.na).toStrictEqual([443, 127]);
      });
    });

    describe('5cce97c, with a sparse same-length array of different items', () => {
      test('[action, verify] the field changes in ref and non-empty items but not in length', () => {
        swirl(aMug, { na: [380, 380] });
        const aStateBefore = check(aMug);
        expect(aStateBefore).toMatchObject({ na: [380, 380] });

        swirl(aMug, { na: [269, ,] });
        const aStateAfter = check(aMug);

        expect(aStateAfter.na).not.toBe(aStateBefore.na);
        expect(aStateAfter.na).toStrictEqual([269, 380]);
      });
    });

    describe('79ce862, with a sparse same-length array of empty items', () => {
      test('[action, verify] the field stays unchanged in ref and value', () => {
        swirl(aMug, { na: [532, 532] });
        const aStateBefore = check(aMug);
        expect(aStateBefore).toMatchObject({ na: [532, 532] });

        swirl(aMug, { na: [, ,] });
        const aStateAfter = check(aMug);

        expect(aStateAfter.na).toBe(aStateBefore.na);
        expect(aStateAfter.na).toStrictEqual([532, 532]);
      });
    });
  });

  describe('7ba1869, writes "the number tuple field"', () => {
    describe('87c9500, with a dense tuple of different items', () => {
      test('[action, verify] the field changes in ref and all items', () => {
        swirl(aMug, { nt: [995, 995, 995] });
        const aStateBefore = check(aMug);
        expect(aStateBefore).toMatchObject({ nt: [995, 995, 995] });

        swirl(aMug, { nt: [803, 803, 803] });
        const aStateAfter = check(aMug);

        expect(aStateAfter.nt).not.toBe(aStateBefore.nt);
        expect(aStateAfter.nt).toStrictEqual([803, 803, 803]);
      });
    });

    describe('ffff9b8, with a dense tuple of same items', () => {
      test('[action, verify] the field stays unchanged in ref and value', () => {
        swirl(aMug, { nt: [258, 258, 258] });
        const aStateBefore = check(aMug);
        expect(aStateBefore).toMatchObject({ nt: [258, 258, 258] });

        swirl(aMug, { nt: [258, 258, 258] });
        const aStateAfter = check(aMug);

        expect(aStateAfter.nt).toBe(aStateBefore.nt);
        expect(aStateAfter.nt).toStrictEqual([258, 258, 258]);
      });
    });

    describe('08a411a, with a sparse tuple of different items', () => {
      test('[action, verify] the field changes in ref and non-empty items', () => {
        swirl(aMug, { nt: [801, 801, 801] });
        const aStateBefore = check(aMug);
        expect(aStateBefore).toMatchObject({ nt: [801, 801, 801] });

        swirl(aMug, { nt: [, 933, ,] });

        const aStateAfter = check(aMug);

        expect(aStateAfter.nt).not.toBe(aStateBefore.nt);
        expect(aStateAfter.nt).toStrictEqual([801, 933, 801]);
      });
    });

    describe('a570ba9, with a sparse tuple of empty items', () => {
      test('[action, verify] the field stays unchanged in ref and value', () => {
        swirl(aMug, { nt: [273, 273, 273] });
        const aStateBefore = check(aMug);
        expect(aStateBefore).toMatchObject({ nt: [273, 273, 273] });

        swirl(aMug, { nt: [, , ,] });

        const aStateAfter = check(aMug);

        expect(aStateAfter.nt).toBe(aStateBefore.nt);
        expect(aStateAfter.nt).toStrictEqual([273, 273, 273]);
      });
    });
  });

  describe('ae8aba7, writes "the object array field", [cite] .:4dee5ea', () => {
    describe('7d919a6, with a dense bigger-length array of different full-fledged items', () => {
      test('[action, verify] the field changes in ref, length, and all items', () => {
        swirl(aMug, {
          oa: [
            { s: 'de9', o: { s: 'de9' } },
            { s: 'de9', o: { s: 'de9' } },
          ],
        });
        const aStateBefore = check(aMug);
        expect(aStateBefore).toMatchObject({
          oa: [
            { s: 'de9', o: { s: 'de9' } },
            { s: 'de9', o: { s: 'de9' } },
          ],
        });

        swirl(aMug, {
          oa: [
            { s: 'e64', o: { s: 'e64' } },
            { s: 'e64', o: { s: 'e64' } },
            { s: 'e64', o: { s: 'e64' } },
          ],
        });
        const aStateAfter = check(aMug);

        expect(aStateAfter.oa).not.toBe(aStateBefore.oa);
        expect(aStateAfter.oa).toStrictEqual([
          { s: 'e64', o: { s: 'e64' } },
          { s: 'e64', o: { s: 'e64' } },
          { s: 'e64', o: { s: 'e64' } },
        ]);
      });
    });

    describe('1d6dfa6, with a same-length dense array of full-fledged items one of which has a different string field value', () => {
      let aStateBefore: any, aStateAfter: any;

      test('[action]', () => {
        swirl(aMug, {
          oa: [
            { s: '555', o: { s: '555' } },
            { s: '555', o: { s: '555' } },
          ],
        });
        aStateBefore = check(aMug);
        expect(aStateBefore).toMatchObject({
          oa: [
            { s: '555', o: { s: '555' } },
            { s: '555', o: { s: '555' } },
          ],
        });

        swirl(aMug, {
          oa: [
            { s: '237', o: { s: '555' } },
            { s: '555', o: { s: '555' } },
          ],
        });
        aStateAfter = check(aMug);
      });

      test('[verify] the field changes in ref and value but not in length', () => {
        expect(aStateAfter.oa).not.toBe(aStateBefore.oa);
        expect(aStateAfter.oa).toStrictEqual([
          { s: '237', o: { s: '555' } },
          { s: '555', o: { s: '555' } },
        ]);
      });

      test('[verify] that item changes in ref and value', () => {
        expect(aStateAfter.oa[0]).not.toBe(aStateBefore.oa[0]);
        expect(aStateAfter.oa[0]).toStrictEqual({ s: '237', o: { s: '555' } });
      });

      test('[verify] that item_s rest fields stay unchanged in ref and value', () => {
        ownKeysOfObjectLike(aStateBefore.oa[0].o)
          .filter((key) => key !== 's')
          .forEach((key) => {
            expect(aStateAfter.oa[0].o[key]).toBe(aStateBefore.oa[0].o[key]);
            expect(aStateAfter.oa[0].o[key]).toStrictEqual(aStateBefore.oa[0].o[key]);
          });
      });

      test('[verify] the rest items stay unchanged in ref and value', () => {
        expect(aStateAfter.oa[1]).toBe(aStateBefore.oa[1]);
        expect(aStateAfter.oa[1]).toStrictEqual(aStateBefore.oa[1]);
      });
    });

    describe('5eb2042, with a same-length sparse array of different full-fledged object items', () => {
      let aStateBefore: any, aStateAfter: any;

      test('[action]', () => {
        swirl(aMug, {
          oa: [
            { s: 'ff2', o: { s: 'ff2' } },
            { s: 'ff2', o: { s: 'ff2' } },
          ],
        });
        aStateBefore = check(aMug);
        expect(aStateBefore).toMatchObject({
          oa: [
            { s: 'ff2', o: { s: 'ff2' } },
            { s: 'ff2', o: { s: 'ff2' } },
          ],
        });

        swirl(aMug, {
          oa: [{ s: '9bd', o: { s: '9bd' } }, ,],
        });
        aStateAfter = check(aMug);
      });

      test('[verify] the field changes in ref and non-empty items but not in length', () => {
        expect(aStateAfter.oa).not.toBe(aStateBefore.oa);
        expect(aStateAfter.oa).toStrictEqual([
          { s: '9bd', o: { s: '9bd' } },
          { s: 'ff2', o: { s: 'ff2' } },
        ]);
      });

      test('[verify] the empty items_ counterparts stay unchanged in ref and value', () => {
        expect(aStateAfter.oa[1]).toBe(aStateBefore.oa[1]);
        expect(aStateAfter.oa[1]).toStrictEqual(aStateBefore.oa[1]);
      });
    });
  });

  describe('1240350, writes "the object tuple field" with a sparse tuple of a partial object item that has a different string field value, [cite] .:ae8aba7', () => {
    let aStateBefore: any, aStateAfter: any;

    test('[action]', () => {
      swirl(aMug, {
        ot: [
          { s: 'ebc', o: { s: 'ebc' } },
          { s: 'ebc', o: { s: 'ebc' } },
        ],
      });
      aStateBefore = check(aMug);
      expect(aStateBefore).toMatchObject({
        ot: [
          { s: 'ebc', o: { s: 'ebc' } },
          { s: 'ebc', o: { s: 'ebc' } },
        ],
      });

      swirl(aMug, {
        ot: [{ s: 'df4' }, ,],
      });

      aStateAfter = check(aMug);
    });

    test('[verify] the field changes in ref and value', () => {
      expect(aStateAfter.ot).not.toBe(aStateBefore.ot);
      expect(aStateAfter.ot).toStrictEqual([
        { s: 'df4', o: { s: 'ebc' } },
        { s: 'ebc', o: { s: 'ebc' } },
      ]);
    });

    test('[verify] that item changes in ref and value', () => {
      expect(aStateAfter.ot[0]).not.toBe(aStateBefore.ot[0]);
      expect(aStateAfter.ot[0]).toStrictEqual({ s: 'df4', o: { s: 'ebc' } });
    });

    test('[verify] that item_s rest fields stay unchanged in ref and value', () => {
      expect(aStateAfter.ot[1]).toBe(aStateBefore.ot[1]);
      expect(aStateAfter.ot[1]).toStrictEqual(aStateBefore.ot[1]);
    });
  });

  describe('bea0ff2, continuously reads the mug after write, [cite] .:908db7b', () => {
    test('[action, verify] the state and its fields stay unchanged in ref and value', () => {
      const aState1 = check(aMug);
      const aState2 = check(aMug);

      expect(aState2).toBe(aState1);
      ownKeysOfObjectLike(aState1).forEach((key) => {
        expect(aState2[key]).toBe(aState1[key]);
      });
      expect(aState2).toStrictEqual(aState1);
    });
  });
});

describe('c2b8bbf, operates "a number mug" by builtin ops', () => {
  const aMug: Mug<number> = {
    [construction]: 300,
  };

  describe('622ed4d, reads the mug before write', () => {
    test('[action, verify] the state equals the construction in value', () => {
      const aState = check(aMug);

      expect(aState).toBe(aMug[construction]);
    });
  });

  describe('72d99b8, first writes the mug with a different value', () => {
    test('[action, verify] the state changes in value', () => {
      swirl(aMug, 953);
      const aState = check(aMug);

      expect(aState).toBe(953);
    });
  });
});

describe('abed36c, operates "a plain array mug" by builtin ops, [cite] 11d55b6', () => {
  interface ObjectState {
    s: string;
    o: {
      s: string;
    };
  }

  const aMug: Mug<ObjectState[]> = {
    [construction]: [
      { s: 'asd', o: { s: 'asd' } },
      { s: 'asd', o: { s: 'asd' } },
    ],
  };

  describe('1d892e7, reads the mug before write', () => {
    test('[action, verify], the state equals the construction in ref and value', () => {
      const aState = check(aMug);

      expect(aState).toBe(aMug[construction]);
      expect(aState).toStrictEqual(aMug[construction]);
    });
  });

  describe('6d47edb, first writes with a sparse bigger-length array of a full-fledged object item that has a different string field value', () => {
    test('[action, verify] the state changes in ref, length, and value', () => {
      const aStateBefore = check(aMug);

      swirl(aMug, [, { s: 'c16', o: { s: 'asd' } }, ,]);

      const aStateAfter = check(aMug);
      expect(aStateAfter).not.toBe(aStateBefore);
      expect(aStateAfter).toStrictEqual([
        { s: 'asd', o: { s: 'asd' } },
        { s: 'c16', o: { s: 'asd' } },
        ,
      ]);
    });
  });
});

describe('10aed7c, operates "a plain tuple mug" by builtin ops, [cite] abed36c', () => {
  interface ObjectState {
    s: string;
    o: {
      s: string;
    };
  }

  const aMug: Mug<[ObjectState, ObjectState]> = {
    [construction]: [
      { s: 'asd', o: { s: 'asd' } },
      { s: 'asd', o: { s: 'asd' } },
    ],
  };

  describe('9ce0578, first writes with a sparse tuple of a partial object item that has a different string field value', () => {
    test('[action, verify] the state changes in ref and value', () => {
      const aStateBefore = check(aMug);

      swirl(aMug, [{ s: '1eb' }, ,]);

      const aStateAfter = check(aMug);

      expect(aStateAfter).not.toBe(aStateBefore);
      expect(aStateAfter).toStrictEqual([
        { s: '1eb', o: { s: 'asd' } },
        { s: 'asd', o: { s: 'asd' } },
      ]);
    });
  });
});

describe('18a9e96, operates "a class-defined" object mug by builtin ops', () => {
  class Point3D {
    constructor(
      public x: number = 300,
      public y: number = 300,
      public z: number = 300,
    ) {}
  }

  class Location3D extends Point3D {
    constructor(
      x?: number,
      y?: number,
      z?: number,
      public name: string = '',
    ) {
      super(x, y, z);
    }
  }

  interface AState {
    s: string;
    o: {
      s: string;
    };
    position: Point3D;
  }

  class AMug implements Mug<AState> {
    [construction] = {
      s: 'asd',
      o: {
        s: 'asd',
      },
      position: new Point3D(),
    };
  }

  const aMug = new AMug();

  describe('5a68e9a, reads the mug before write', () => {
    test('[action, verify] the state equals the construction in ref and value', () => {
      const aState = check(aMug);

      expect(aState).toBe(aMug[construction]);
      expect(aState).toStrictEqual(aMug[construction]);
    });
  });

  describe('85be01b, first writes "the string field" with a different value', () => {
    let aStateBefore: any, aStateAfter: any;

    test('[action]', () => {
      aStateBefore = check(aMug);

      swirl(aMug, { s: '22a' });

      aStateAfter = check(aMug);
    });

    test('[verify] the state changes in ref and value', () => {
      expect(aStateAfter).not.toBe(aStateBefore);
      expect(aStateAfter).toStrictEqual({
        s: '22a',
        o: {
          s: 'asd',
        },
        position: new Point3D(),
      });
    });

    test('[verify] the rest fields stay unchanged in ref and value', () => {
      ownKeysOfObjectLike(aStateBefore)
        .filter((key) => key !== 's')
        .forEach((key) => {
          expect(aStateAfter[key]).toBe(aStateBefore[key]);
          expect(aStateAfter[key]).toStrictEqual(aStateBefore[key]);
        });
    });
  });

  describe('e3c090c, writes "the class-defined field"', () => {
    describe('88cb782, with a different same-class instance that has different field values', () => {
      test('[action, verify] the field changes in ref and value', () => {
        swirl(aMug, { position: new Point3D(830, 830, 830) });
        const aStateBefore = check(aMug);
        expect(aStateBefore).toMatchObject({
          position: new Point3D(830, 830, 830),
        });

        const newPosition = new Point3D(530, 530, 530);
        swirl(aMug, { position: newPosition });
        const aStateAfter = check(aMug);

        expect(aStateAfter.position).not.toBe(aStateBefore.position);
        expect(aStateAfter.position).toBe(newPosition);
        expect(aStateAfter.position).toStrictEqual(newPosition);
      });
    });

    describe('db739e5, with a different same-class instance that has same field values', () => {
      test('[action, verify] the field changes in ref', () => {
        swirl(aMug, { position: new Point3D(577, 577, 577) });
        const aStateBefore = check(aMug);
        expect(aStateBefore).toMatchObject({
          position: new Point3D(577, 577, 577),
        });

        const newPosition = new Point3D(577, 577, 577);
        swirl(aMug, { position: newPosition });
        const aStateAfter = check(aMug);

        expect(aStateAfter.position).not.toBe(aStateBefore.position);
        expect(aStateAfter.position).toBe(newPosition);
      });
    });

    describe('9f16d66, with a same same-class instance', () => {
      test('[action, verify] the field stays unchanged in ref', () => {
        const oldPosition = new Point3D(368, 368, 368);
        swirl(aMug, { position: oldPosition });
        const aStateBefore = check(aMug);
        expect(aStateBefore).toMatchObject({
          position: new Point3D(368, 368, 368),
        });

        swirl(aMug, { position: oldPosition });
        const aStateAfter = check(aMug);

        expect(aStateAfter.position).toBe(aStateBefore.position);
      });
    });

    describe('0b23c89, with a plain object that has a matching field of a different value', () => {
      test('[action, verify] the state stays unchanged in ref and value', () => {
        swirl(aMug, { position: new Point3D(617, 617, 617) });
        const aStateBefore = check(aMug);
        expect(aStateBefore).toMatchObject({
          position: new Point3D(617, 617, 617),
        });

        swirl(aMug, { position: { x: 660 } });
        const aStateAfter = check(aMug);

        expect(aStateAfter.position).toBe(aStateBefore.position);
        expect(aStateAfter.position).toStrictEqual(aStateBefore.position);
      });
    });

    describe('65bcc71, with a plain object that has all matching fields of different values', () => {
      test('[action, verify] the field stays unchanged in ref and value', () => {
        swirl(aMug, { position: new Point3D(683, 683, 683) });
        const aStateBefore = check(aMug);
        expect(aStateBefore).toMatchObject({
          position: new Point3D(683, 683, 683),
        });

        swirl(aMug, { position: { x: 722, y: 722, z: 722 } });
        const aStateAfter = check(aMug);

        expect(aStateAfter.position).toBe(aStateBefore.position);
        expect(aStateAfter.position).toStrictEqual(aStateBefore.position);
      });
    });

    describe('56c6da6, with a sub-class instance that has different field values', () => {
      test('[action, verify] the field stays unchanged in ref and value', () => {
        swirl(aMug, { position: new Point3D(921, 921, 921) });
        const aStateBefore = check(aMug);
        expect(aStateBefore).toMatchObject({
          position: new Point3D(921, 921, 921),
        });

        const newPosition = new Location3D(261, 261, 261, 'a08');
        swirl(aMug, { position: newPosition });
        const aStateAfter = check(aMug);

        expect(aStateAfter.position).toBe(aStateBefore.position);
        expect(aStateAfter.position).toStrictEqual(aStateBefore.position);
      });
    });
  });
});

describe('6a8c78f, operates "a mug-nested normal mug" by builtin ops, [cite] 11d55b6', () => {
  interface ObjectState {
    s: string;
    o: {
      s: string;
    };
  }

  const objectMug: Mug<ObjectState> = {
    [construction]: {
      s: 'asd',
      o: {
        s: 'asd',
      },
    },
  };

  const numberMug: Mug<number> = {
    [construction]: 300,
  };

  const muggyObjectArrayItemMug: Mug<ObjectState> = {
    [construction]: {
      s: 'asd',
      o: {
        s: 'asd',
      },
    },
  };

  interface AState extends ObjectState {
    muggyObject: ObjectState;
    latterMirrorMuggyObject: ObjectState;

    muggyNumber: number;
    latterMirrorMuggyNumber: number;

    muggyObjectArray: ObjectState[];

    potentialMuggyObject: ObjectState;
    potentialMuggyObjectArray: ObjectState[];

    objectMugSet: Set<Mug<ObjectState>>;
  }

  const aMug: PossibleMug<AState> = {
    [construction]: {
      s: 'asd',
      o: {
        s: 'asd',
      },

      muggyObject: objectMug,
      latterMirrorMuggyObject: objectMug,

      muggyNumber: numberMug,
      latterMirrorMuggyNumber: numberMug,

      muggyObjectArray: [muggyObjectArrayItemMug, muggyObjectArrayItemMug],

      potentialMuggyObject: { s: 'asd', o: { s: 'asd' } },
      potentialMuggyObjectArray: [],

      objectMugSet: new Set<Mug<ObjectState>>(),
    },
  };

  describe('635abca, reads the mug before write', () => {
    let aState: any;

    test('[action]', () => {
      aState = check(aMug);
    });

    test('[verify] the state doesn_t equal the construction in ref', () => {
      expect(aState).not.toBe(aMug[construction]);
    });

    test('[verify] the state equals the construction in evaluated value', () => {
      expect(aState).toStrictEqual({
        s: 'asd',
        o: {
          s: 'asd',
        },
        muggyObject: { s: 'asd', o: { s: 'asd' } },
        latterMirrorMuggyObject: { s: 'asd', o: { s: 'asd' } },
        muggyNumber: 300,
        latterMirrorMuggyNumber: 300,
        muggyObjectArray: [
          { s: 'asd', o: { s: 'asd' } },
          { s: 'asd', o: { s: 'asd' } },
        ],
        potentialMuggyObject: { s: 'asd', o: { s: 'asd' } },
        potentialMuggyObjectArray: [],
        objectMugSet: new Set(),
      });
    });

    test('[verify] the object field equals the construction_s object field in ref and value', () => {
      expect(aState.o).toBe(aMug[construction].o);
      expect(aState.o).toStrictEqual(aMug[construction].o);
    });

    test('[verify] the muggy object field equals the object mug_s construction in ref and value', () => {
      expect(aState.muggyObject).toBe(objectMug[construction]);
      expect(aState.muggyObject).toStrictEqual(objectMug[construction]);
    });

    test('[verify] the latter mirror muggy object field equals the object mug_s construction in ref and value', () => {
      expect(aState.latterMirrorMuggyObject).toBe(objectMug[construction]);
      expect(aState.latterMirrorMuggyObject).toStrictEqual(objectMug[construction]);
    });
  });

  describe('30cb2f8, continuously reads the mug before write', () => {
    test('[action, verify] the state and its fields stay unchanged in ref and value', () => {
      const aState1 = check(aMug);
      const aState2 = check(aMug);

      expect(aState2).toBe(aState1);
      ownKeysOfObjectLike(aState1).forEach((key) => {
        expect(aState2[key]).toBe(aState1[key]);
      });
      expect(aState2).toStrictEqual(aState1);
    });
  });

  describe('59a67cf, first writes "the string field" with a different value', () => {
    let aStateBefore: any, aStateAfter: any;

    test('[action]', () => {
      aStateBefore = check(aMug);

      swirl(aMug, { s: 'd99' });

      aStateAfter = check(aMug);
    });

    test('[verify] the state changes in ref and value', () => {
      expect(aStateAfter).not.toBe(aStateBefore);
      expect(aStateAfter).toStrictEqual({
        s: 'd99',
        o: {
          s: 'asd',
        },
        muggyObject: { s: 'asd', o: { s: 'asd' } },
        latterMirrorMuggyObject: { s: 'asd', o: { s: 'asd' } },
        muggyNumber: 300,
        latterMirrorMuggyNumber: 300,
        muggyObjectArray: [
          { s: 'asd', o: { s: 'asd' } },
          { s: 'asd', o: { s: 'asd' } },
        ],
        potentialMuggyObject: { s: 'asd', o: { s: 'asd' } },
        potentialMuggyObjectArray: [],
        objectMugSet: new Set(),
      });
    });

    test('[verify] the rest fields stay unchanged changes in ref and value, [important]', () => {
      ownKeysOfObjectLike(aStateBefore)
        .filter((key) => key !== 's')
        .forEach((key) => {
          expect(aStateAfter[key]).toBe(aStateBefore[key]);
          expect(aStateAfter[key]).toStrictEqual(aStateBefore[key]);
        });
    });
  });

  describe('bf62d1f, first writes "the muggy object field_s string field" with a different value', () => {
    let aStateBefore: any, aStateAfter: any;
    let objectStateBefore: any, objectStateAfter: any;

    test('[action]', () => {
      aStateBefore = check(aMug);
      objectStateBefore = check(objectMug);

      swirl(aMug, { muggyObject: { s: 'd24' } });

      aStateAfter = check(aMug);
      objectStateAfter = check(objectMug);
    });

    test('[verify] the muggy object field changes in ref and value', () => {
      expect(aStateAfter.muggyObject).not.toBe(aStateBefore.muggyObject);
      expect(aStateAfter.muggyObject).toStrictEqual({ s: 'd24', o: { s: 'asd' } });
    });

    test('[verify] the muggy object field_s rest fields stay unchanged in ref and value', () => {
      ownKeysOfObjectLike(aStateBefore.muggyObject)
        .filter((key) => key !== 's')
        .forEach((key) => {
          expect(aStateAfter.muggyObject[key]).toBe(aStateBefore.muggyObject[key]);
          expect(aStateAfter.muggyObject[key]).toStrictEqual(aStateBefore.muggyObject[key]);
        });
    });

    test('[verify] the latter mirror muggy object field equals the muggy object field in ref and value before and after', () => {
      expect(aStateBefore.latterMirrorMuggyObject).toBe(aStateBefore.muggyObject);
      expect(aStateBefore.latterMirrorMuggyObject).toStrictEqual(aStateBefore.muggyObject);
      expect(aStateAfter.latterMirrorMuggyObject).toBe(aStateAfter.muggyObject);
      expect(aStateAfter.latterMirrorMuggyObject).toStrictEqual(aStateAfter.muggyObject);
    });

    test('[verify] the object mug_s state equals the muggy object field in ref and value before and after', () => {
      expect(objectStateBefore).toBe(aStateBefore.muggyObject);
      expect(objectStateBefore).toStrictEqual(aStateBefore.muggyObject);
      expect(objectStateAfter).toBe(aStateAfter.muggyObject);
      expect(objectStateAfter).toStrictEqual(aStateAfter.muggyObject);
    });

    test('[verify] the rest fields stay unchanged in ref and value', () => {
      ownKeysOfObjectLike(aStateBefore)
        .filter((key) => key !== 'muggyObject' && key !== 'latterMirrorMuggyObject')
        .forEach((key) => {
          expect(aStateAfter[key]).toBe(aStateBefore[key]);
          expect(aStateAfter[key]).toStrictEqual(aStateBefore[key]);
        });
    });
  });

  describe('694282b, writes "the muggy object field_s string field" with a same value, [cite] .:bf62d1f', () => {
    let aStateBefore: any, aStateAfter: any;
    let objectStateBefore: any, objectStateAfter: any;

    test('[action]', () => {
      swirl(aMug, {
        muggyObject: { s: 'b52' },
      });
      aStateBefore = check(aMug);
      expect(aStateBefore).toMatchObject({
        muggyObject: { s: 'b52' },
        latterMirrorMuggyObject: { s: 'b52' },
      });
      objectStateBefore = check(objectMug);

      swirl(aMug, {
        muggyObject: { s: 'b52' },
      });
      aStateAfter = check(aMug);
      objectStateAfter = check(objectMug);
    });

    test('[verify] the state and its fields stay unchanged in ref and value', () => {
      expect(aStateAfter).toBe(aStateBefore);
      ownKeysOfObjectLike(aStateBefore).forEach((key) => {
        expect(aStateAfter[key]).toBe(aStateBefore[key]);
      });
      expect(aStateAfter).toStrictEqual(aStateBefore);
    });

    test('[verify] the object mug_s state and its fields stay unchanged in ref and value', () => {
      expect(objectStateAfter).toBe(objectStateBefore);
      ownKeysOfObjectLike(objectStateBefore).forEach((key) => {
        expect(objectStateAfter[key]).toBe(objectStateBefore[key]);
      });
      expect(objectStateAfter).toStrictEqual(objectStateBefore);
    });
  });

  describe('33fb29a, writes "the latter mirror muggy object field_s string field" with a different value, [cite] .:bf62d1f', () => {
    let aStateBefore: any, aStateAfter: any;
    let objectStateBefore: any, objectStateAfter: any;

    test('[action]', () => {
      swirl(aMug, {
        muggyObject: { s: '04c' },
      });
      aStateBefore = check(aMug);
      expect(aStateBefore).toMatchObject({
        muggyObject: { s: '04c' },
        latterMirrorMuggyObject: { s: '04c' },
      });
      objectStateBefore = check(objectMug);

      swirl(aMug, {
        latterMirrorMuggyObject: { s: 'b67' },
      });
      aStateAfter = check(aMug);
      objectStateAfter = check(objectMug);
    });

    test('[verify] the latter mirror muggy object field changes in ref and value', () => {
      expect(aStateAfter.latterMirrorMuggyObject).not.toBe(aStateBefore.latterMirrorMuggyObject);
      expect(aStateAfter.latterMirrorMuggyObject).toStrictEqual({ s: 'b67', o: { s: 'asd' } });
    });

    test('[verify] the muggy object field equals the latter mirror muggy object field in ref and value before and after', () => {
      expect(aStateBefore.muggyObject).toBe(aStateBefore.latterMirrorMuggyObject);
      expect(aStateBefore.muggyObject).toStrictEqual(aStateBefore.latterMirrorMuggyObject);
      expect(aStateAfter.muggyObject).toBe(aStateAfter.latterMirrorMuggyObject);
      expect(aStateAfter.muggyObject).toStrictEqual(aStateAfter.latterMirrorMuggyObject);
    });

    test('[verify] the object mug_s state equals the latter mirror muggy object field in ref and value before and after', () => {
      expect(objectStateBefore).toBe(aStateBefore.latterMirrorMuggyObject);
      expect(objectStateBefore).toStrictEqual(aStateBefore.latterMirrorMuggyObject);
      expect(objectStateAfter).toBe(aStateAfter.latterMirrorMuggyObject);
      expect(objectStateAfter).toStrictEqual(aStateAfter.latterMirrorMuggyObject);
    });
  });

  describe('7e06f81, writes "the muggy object and the latter mirror muggy object fields_ string fields" with different values simultaneously, [cite] .:bf62d1f', () => {
    let aStateBefore: any, aStateAfter: any;
    let objectStateBefore: any, objectStateAfter: any;

    test('[action]', () => {
      swirl(aMug, {
        muggyObject: { s: '041' },
      });
      aStateBefore = check(aMug);
      expect(aStateBefore).toMatchObject({
        muggyObject: { s: '041' },
        latterMirrorMuggyObject: { s: '041' },
      });
      objectStateBefore = check(objectMug);

      swirl(aMug, {
        muggyObject: { s: '78f' },
        latterMirrorMuggyObject: { s: '77d' },
      });
      aStateAfter = check(aMug);
      objectStateAfter = check(objectMug);
    });

    test('[verify] the muggy object changes in ref and value as per the muggy object field_s new string field value', () => {
      expect(aStateAfter.muggyObject).not.toBe(aStateBefore.muggyObject);
      expect(aStateAfter.muggyObject).toStrictEqual({ s: '78f', o: { s: 'asd' } });
    });

    test('[verify] the muggy object field equals the latter mirror muggy field in ref and value before and after', () => {
      expect(aStateBefore.muggyObject).toBe(aStateBefore.latterMirrorMuggyObject);
      expect(aStateBefore.muggyObject).toStrictEqual(aStateBefore.latterMirrorMuggyObject);
      expect(aStateAfter.muggyObject).toBe(aStateAfter.latterMirrorMuggyObject);
      expect(aStateAfter.muggyObject).toStrictEqual(aStateAfter.latterMirrorMuggyObject);
    });

    test('[verify] the object mug_s state equals the muggy object field in ref and value before and after', () => {
      expect(objectStateBefore).toBe(aStateBefore.muggyObject);
      expect(objectStateBefore).toStrictEqual(aStateBefore.muggyObject);
      expect(objectStateAfter).toBe(aStateAfter.muggyObject);
      expect(objectStateAfter).toStrictEqual(aStateAfter.muggyObject);
    });
  });

  describe('fc86947, writes "the object mug_s string field" with a different value, [cite] .:bf62d1f', () => {
    let aStateBefore: any, aStateAfter: any;
    let objectStateBefore: any, objectStateAfter: any;

    test('[action]', () => {
      swirl(aMug, {
        muggyObject: { s: 'f8b' },
      });
      aStateBefore = check(aMug);
      expect(aStateBefore).toMatchObject({
        muggyObject: { s: 'f8b' },
        latterMirrorMuggyObject: { s: 'f8b' },
      });
      objectStateBefore = check(objectMug);
      expect(objectStateBefore).toMatchObject({ s: 'f8b' });

      swirl(objectMug, { s: '805' });
      objectStateAfter = check(objectMug);
      aStateAfter = check(aMug);
    });

    test('[verify] the parent mug_s state and the muggy object field changes in ref', () => {
      expect(aStateAfter).not.toBe(aStateBefore);
      expect(aStateAfter.muggyObject).not.toBe(aStateBefore.muggyObject);
    });

    test('[verify] the muggy object and the latter mirror muggy object fields equal the object mug_s state in ref and value before and after', () => {
      expect(aStateBefore.muggyObject).toBe(objectStateBefore);
      expect(aStateBefore.muggyObject).toStrictEqual(objectStateBefore);
      expect(aStateAfter.muggyObject).toBe(objectStateAfter);
      expect(aStateAfter.muggyObject).toStrictEqual(objectStateAfter);

      expect(aStateBefore.latterMirrorMuggyObject).toBe(objectStateBefore);
      expect(aStateBefore.latterMirrorMuggyObject).toStrictEqual(objectStateBefore);
      expect(aStateAfter.latterMirrorMuggyObject).toBe(objectStateAfter);
      expect(aStateAfter.latterMirrorMuggyObject).toStrictEqual(objectStateAfter);
    });

    test('[verify] the parent mug_s rest fields stay unchanged in ref and value', () => {
      ownKeysOfObjectLike(aStateBefore)
        .filter((key) => key !== 'muggyObject' && key !== 'latterMirrorMuggyObject')
        .forEach((key) => {
          expect(aStateAfter[key]).toBe(aStateBefore[key]);
          expect(aStateAfter[key]).toStrictEqual(aStateBefore[key]);
        });
    });
  });

  describe('c8f0abf, writes "the object mug_s string field" with a same value, [cite] .:bf62d1f', () => {
    test('[action, verify] the parent mug_s state and its fields stay unchanged in ref and value', () => {
      swirl(aMug, {
        muggyObject: { s: '7b6' },
      });
      const aStateBefore = check(aMug);
      expect(aStateBefore).toMatchObject({
        muggyObject: { s: '7b6' },
        latterMirrorMuggyObject: { s: '7b6' },
      });
      const objectStateBefore = check(objectMug);
      expect(objectStateBefore).toMatchObject({ s: '7b6' });

      swirl(objectMug, { s: '7b6' });
      const aStateAfter = check(aMug);

      expect(aStateAfter).toBe(aStateBefore);
      ownKeysOfObjectLike(aStateBefore).forEach((key) => {
        expect(aStateAfter[key]).toBe(aStateBefore[key]);
      });
      expect(aStateAfter).toStrictEqual(aStateBefore);
    });
  });

  describe('c2d5e4f, first writes "the muggy number field" with a different value', () => {
    test('[action, verify] the parent mug_s state changes in ref, the field, the latter mirror muggy number field, and the number mug_s state change in value', () => {
      const aStateBefore = check(aMug);
      swirl(aMug, { muggyNumber: 123 });

      const aStateAfter = check(aMug);
      const numberState = check(numberMug);

      expect(aStateAfter).not.toBe(aStateBefore);
      expect(aStateAfter.muggyNumber).toBe(123);
      expect(aStateAfter.latterMirrorMuggyNumber).toBe(123);
      expect(numberState).toBe(123);
    });
  });

  describe('baa7548, writes "the latter mirror muggy number field" with a different value, [cite] .:c2d5e4f', () => {
    test('[action, verify], the parent mug_s state changes in ref, the field, the muggy number field, and the number mug_s state change in value', () => {
      swirl(aMug, { muggyNumber: 555 });
      const aStateBefore = check(aMug);
      expect(aStateBefore).toMatchObject({
        muggyNumber: 555,
        latterMirrorMuggyNumber: 555,
      });

      swirl(aMug, { latterMirrorMuggyNumber: 566 });
      const aStateAfter = check(aMug);
      const numberStateAfter = check(numberMug);

      expect(aStateAfter).not.toBe(aStateBefore);
      expect(aStateAfter.muggyNumber).toBe(566);
      expect(aStateAfter.latterMirrorMuggyNumber).toBe(566);
      expect(numberStateAfter).toBe(566);
    });
  });

  describe('4d45544, writes "the muggy number field" with a same value, [cite] .:c2d5e4f', () => {
    test('[action, verify] the state and the number mug_s state stays unchanged in ref and value', () => {
      swirl(aMug, { muggyNumber: 975 });
      const aStateBefore = check(aMug);
      expect(aStateBefore).toMatchObject({
        muggyNumber: 975,
        latterMirrorMuggyNumber: 975,
      });
      const numberStateBefore = check(numberMug);

      swirl(aMug, { muggyNumber: 975 });

      const aStateAfter = check(aMug);
      const numberStateAfter = check(numberMug);

      expect(aStateAfter).toBe(aStateBefore);
      expect(aStateAfter).toStrictEqual(aStateBefore);
      expect(numberStateAfter).toBe(numberStateBefore);
    });
  });

  describe('e23ccc9, writes "the number mug" with a different value, [cite] .:c2d5e4f', () => {
    test('[action, verify] the parent mug_s state changes in ref, the muggy number field and the latter mirror muggy number field change in value', () => {
      swirl(aMug, { muggyNumber: 796 });
      const aStateBefore = check(aMug);
      expect(aStateBefore).toMatchObject({
        muggyNumber: 796,
        latterMirrorMuggyNumber: 796,
      });

      swirl(numberMug, 850);
      const aStateAfter = check(aMug);

      expect(aStateAfter).not.toBe(aStateBefore);
      expect(aStateAfter.muggyNumber).toBe(850);
      expect(aStateAfter.latterMirrorMuggyNumber).toBe(850);
    });
  });

  describe('1b5f6ea, writes "the number mug" with a same value, [cite] .:c2d5e4f', () => {
    test('[action, verify] the parent mug_s state stay unchaged in ref and value', () => {
      swirl(aMug, { muggyNumber: 737 });
      const aStateBefore = check(aMug);
      expect(aStateBefore).toMatchObject({
        muggyNumber: 737,
        latterMirrorMuggyNumber: 737,
      });

      swirl(numberMug, 737);
      const aStateAfter = check(aMug);

      expect(aStateAfter).toBe(aStateBefore);
      expect(aStateAfter).toStrictEqual(aStateBefore);
    });
  });

  describe('5761e9a, first writes "the muggy object array field" with a sparse same-length array of a full-fledged object index-0 item that has a different string field value', () => {
    let aStateBefore: any, aStateAfter: any;
    let muggyObjectArrayItemStateBefore: any, muggyObjectArrayItemStateAfter: any;

    test('[action]', () => {
      aStateBefore = check(aMug);
      muggyObjectArrayItemStateBefore = check(muggyObjectArrayItemMug);

      swirl(aMug, {
        muggyObjectArray: [{ s: '58e', o: { s: 'asd' } }, ,],
      });

      aStateAfter = check(aMug);
      muggyObjectArrayItemStateAfter = check(muggyObjectArrayItemMug);
    });

    test('[verify] the field changes in ref but not in length', () => {
      expect(aStateAfter.muggyObjectArray).not.toBe(aStateBefore.muggyObjectArray);
      expect(aStateAfter.muggyObjectArray).toHaveLength(aStateBefore.muggyObjectArray.length);
    });

    test('[verify] that item changes in ref and value', () => {
      expect(aStateAfter.muggyObjectArray[0]).not.toBe(aStateBefore.muggyObjectArray[0]);
      expect(aStateAfter.muggyObjectArray[0]).toStrictEqual({ s: '58e', o: { s: 'asd' } });
    });

    test('[verify] that item_s rest fields stay unchanged in ref and value', () => {
      ownKeysOfObjectLike(aStateBefore.muggyObjectArray[0]).forEach((key) => {
        expect(aStateAfter.muggyObjectArray[0][key]).toBe(aStateAfter.muggyObjectArray[0][key]);
        expect(aStateAfter.muggyObjectArray[0][key]).toStrictEqual(
          aStateAfter.muggyObjectArray[0][key],
        );
      });
    });

    test('[verify] the field_s mirror index-1 item equals that item in ref and value', () => {
      expect(aStateAfter.muggyObjectArray[1]).toBe(aStateAfter.muggyObjectArray[0]);
      expect(aStateAfter.muggyObjectArray[1]).toStrictEqual(aStateAfter.muggyObjectArray[0]);
      expect(aStateBefore.muggyObjectArray[1]).toBe(aStateBefore.muggyObjectArray[0]);
      expect(aStateBefore.muggyObjectArray[1]).toStrictEqual(aStateBefore.muggyObjectArray[0]);
    });

    test('[verify] the muggy object array item mug_s state equals that item in ref and value before and after', () => {
      expect(muggyObjectArrayItemStateAfter).toBe(aStateAfter.muggyObjectArray[0]);
      expect(muggyObjectArrayItemStateAfter).toStrictEqual(aStateAfter.muggyObjectArray[0]);
      expect(muggyObjectArrayItemStateBefore).toBe(aStateBefore.muggyObjectArray[0]);
      expect(muggyObjectArrayItemStateBefore).toStrictEqual(aStateBefore.muggyObjectArray[0]);
    });
  });

  describe('29925d3, writes "the muggy object array field" with a sparse same-length array of a full-fledged object index-0 item that has a same string field value, [cite] .:5761e9a', () => {
    let aStateBefore: any, aStateAfter: any;
    let muggyObjectArrayItemStateBefore: any, muggyObjectArrayItemStateAfter: any;

    test('[action]', () => {
      swirl(aMug, {
        muggyObjectArray: [{ s: '4ec', o: { s: 'asd' } }, ,],
      });
      aStateBefore = check(aMug);
      expect(aStateBefore).toMatchObject({
        muggyObjectArray: [
          { s: '4ec', o: { s: 'asd' } },
          { s: '4ec', o: { s: 'asd' } },
        ],
      });
      muggyObjectArrayItemStateBefore = check(muggyObjectArrayItemMug);
      expect(muggyObjectArrayItemStateBefore).toMatchObject({ s: '4ec', o: { s: 'asd' } });

      swirl(aMug, {
        muggyObjectArray: [{ s: '4ec', o: { s: 'asd' } }, ,],
      });

      aStateAfter = check(aMug);
      muggyObjectArrayItemStateAfter = check(muggyObjectArrayItemMug);
    });

    test('[verify] the state and its fields stays unchanged in ref and value', () => {
      expect(aStateAfter).toBe(aStateBefore);
      ownKeysOfObjectLike(aStateBefore).forEach((key) => {
        expect(aStateAfter[key]).toBe(aStateBefore[key]);
      });
      expect(aStateAfter).toStrictEqual(aStateBefore);
    });

    test('[verify] the muggy object array field_s items stay unchanged in ref and value', () => {
      aStateAfter.muggyObjectArray.forEach((item: any, i: number) => {
        expect(aStateBefore.muggyObjectArray[i]).toBe(item);
        expect(aStateBefore.muggyObjectArray[i]).toStrictEqual(item);
      });
    });

    test('[verify] the muggy object array item mug_s state stays unchanged in ref and value', () => {
      expect(muggyObjectArrayItemStateAfter).toBe(muggyObjectArrayItemStateBefore);
      expect(muggyObjectArrayItemStateAfter).toStrictEqual(muggyObjectArrayItemStateBefore);
    });
  });

  describe('f311c76, writes "the muggy object array field" with a sparse same-length array of a full-fledged object index-1 item that has a different string field value, [cite] .:5761e9a', () => {
    let aStateBefore: any, aStateAfter: any;
    let muggyObjectArrayItemStateBefore: any, muggyObjectArrayItemStateAfter: any;

    test('[action]', () => {
      swirl(aMug, {
        muggyObjectArray: [{ s: 'f22', o: { s: 'asd' } }, ,],
      });
      aStateBefore = check(aMug);
      expect(aStateBefore).toMatchObject({
        muggyObjectArray: [
          { s: 'f22', o: { s: 'asd' } },
          { s: 'f22', o: { s: 'asd' } },
        ],
      });
      muggyObjectArrayItemStateBefore = check(muggyObjectArrayItemMug);
      expect(muggyObjectArrayItemStateBefore).toMatchObject({ s: 'f22', o: { s: 'asd' } });

      swirl(aMug, {
        muggyObjectArray: [, { s: '018', o: { s: 'asd' } }],
      });

      aStateAfter = check(aMug);
      muggyObjectArrayItemStateAfter = check(muggyObjectArrayItemMug);
    });

    test('[verify] that item changes in ref and value', () => {
      expect(aStateAfter.muggyObjectArray[1]).not.toBe(aStateBefore.muggyObjectArray[1]);
      expect(aStateAfter.muggyObjectArray[1]).toStrictEqual({ s: '018', o: { s: 'asd' } });
    });

    test('[verify] the field_s mirror index-0 item equals that item in ref and value before and after', () => {
      expect(aStateAfter.muggyObjectArray[0]).toBe(aStateAfter.muggyObjectArray[1]);
      expect(aStateAfter.muggyObjectArray[0]).toStrictEqual(aStateAfter.muggyObjectArray[1]);
      expect(aStateBefore.muggyObjectArray[0]).toBe(aStateBefore.muggyObjectArray[1]);
      expect(aStateBefore.muggyObjectArray[0]).toStrictEqual(aStateBefore.muggyObjectArray[1]);
    });

    test('[verify] the muggy object array item mug_s state equals that item in ref and value before and after', () => {
      expect(muggyObjectArrayItemStateAfter).toBe(aStateAfter.muggyObjectArray[1]);
      expect(muggyObjectArrayItemStateAfter).toStrictEqual(aStateAfter.muggyObjectArray[1]);
      expect(muggyObjectArrayItemStateBefore).toBe(aStateBefore.muggyObjectArray[1]);
      expect(muggyObjectArrayItemStateBefore).toStrictEqual(aStateBefore.muggyObjectArray[1]);
    });
  });

  describe('59b94c2, writes "the muggy object array field" with a dense same-length array of full-fledged object items that have different string field values simultaneously, [cite] .:5761e9a', () => {
    let aStateBefore: any, aStateAfter: any;
    let muggyObjectArrayItemStateBefore: any, muggyObjectArrayItemStateAfter: any;

    test('[action]', () => {
      swirl(aMug, {
        muggyObjectArray: [{ s: '7e8', o: { s: 'asd' } }, ,],
      });
      aStateBefore = check(aMug);
      expect(aStateBefore).toMatchObject({
        muggyObjectArray: [
          { s: '7e8', o: { s: 'asd' } },
          { s: '7e8', o: { s: 'asd' } },
        ],
      });
      muggyObjectArrayItemStateBefore = check(muggyObjectArrayItemMug);
      expect(muggyObjectArrayItemStateBefore).toMatchObject({ s: '7e8', o: { s: 'asd' } });

      swirl(aMug, {
        muggyObjectArray: [
          { s: '84a', o: { s: 'asd' } },
          { s: 'b35', o: { s: 'asd' } },
        ],
      });

      aStateAfter = check(aMug);
      muggyObjectArrayItemStateAfter = check(muggyObjectArrayItemMug);
    });

    test('[verify] the field_s index-0 item changes in ref and value as per the index-0 item_s new string field value', () => {
      expect(aStateAfter.muggyObjectArray[0]).not.toBe(aStateBefore.muggyObjectArray[0]);
      expect(aStateAfter.muggyObjectArray[0]).toStrictEqual({ s: '84a', o: { s: 'asd' } });
    });

    test('[verify] the field_s items equal each other in ref and value before and after', () => {
      expect(aStateAfter.muggyObjectArray[1]).toBe(aStateAfter.muggyObjectArray[0]);
      expect(aStateAfter.muggyObjectArray[1]).toStrictEqual(aStateAfter.muggyObjectArray[0]);
      expect(aStateBefore.muggyObjectArray[1]).toBe(aStateBefore.muggyObjectArray[0]);
      expect(aStateBefore.muggyObjectArray[1]).toStrictEqual(aStateBefore.muggyObjectArray[0]);
    });

    test('[verify] the muggy object array item mug_s state equals the field_s index-0 item in ref and value before and after', () => {
      expect(muggyObjectArrayItemStateAfter).toBe(aStateAfter.muggyObjectArray[0]);
      expect(muggyObjectArrayItemStateAfter).toStrictEqual(aStateAfter.muggyObjectArray[0]);
      expect(muggyObjectArrayItemStateBefore).toBe(aStateBefore.muggyObjectArray[0]);
      expect(muggyObjectArrayItemStateBefore).toStrictEqual(aStateBefore.muggyObjectArray[0]);
    });
  });

  describe('b0fe53a, writes "the muggy object array item mug_s string field" with a different value, [cite] .:5761e9a', () => {
    let aStateBefore: any, aStateAfter: any;
    let muggyObjectArrayItemStateBefore: any, muggyObjectArrayItemStateAfter: any;

    test('[action]', () => {
      swirl(aMug, {
        muggyObjectArray: [{ s: 'a3a', o: { s: 'asd' } }, ,],
      });
      aStateBefore = check(aMug);
      expect(aStateBefore).toMatchObject({
        muggyObjectArray: [
          { s: 'a3a', o: { s: 'asd' } },
          { s: 'a3a', o: { s: 'asd' } },
        ],
      });
      muggyObjectArrayItemStateBefore = check(muggyObjectArrayItemMug);
      expect(muggyObjectArrayItemStateBefore).toMatchObject({ s: 'a3a', o: { s: 'asd' } });

      swirl(muggyObjectArrayItemMug, { s: 'c6b' });

      muggyObjectArrayItemStateAfter = check(muggyObjectArrayItemMug);
      aStateAfter = check(aMug);
    });

    test('[verify] the muggy object array field changes in ref but not in length', () => {
      expect(aStateAfter.muggyObjectArray).not.toBe(aStateBefore.muggyObjectArray);
      expect(aStateAfter.muggyObjectArray).toHaveLength(aStateBefore.muggyObjectArray.length);
    });

    test('[verify] the muggy object array field_s items equals the mug_s state in ref and value before and after', () => {
      aStateBefore.muggyObjectArray.forEach((item: any) => {
        expect(item).toBe(muggyObjectArrayItemStateBefore);
        expect(item).toStrictEqual(muggyObjectArrayItemStateBefore);
      });
      aStateAfter.muggyObjectArray.forEach((item: any) => {
        expect(item).toBe(muggyObjectArrayItemStateAfter);
        expect(item).toStrictEqual(muggyObjectArrayItemStateAfter);
      });
    });

    test('[verify] the parent mug_s rest fields stay unchanged in ref and value', () => {
      ownKeysOfObjectLike(aStateBefore)
        .filter((key) => key !== 'muggyObjectArray')
        .forEach((key) => {
          expect(aStateAfter[key]).toBe(aStateBefore[key]);
          expect(aStateAfter[key]).toStrictEqual(aStateBefore[key]);
        });
    });
  });

  describe('fff90bc, writes "the muggy object array item mug_s string field" with a same value, [cite] .:5761e9a', () => {
    test('[action, verify], the parent mug_s state, its fields, and the muggy object array items stay unchanged in ref and value', () => {
      swirl(aMug, {
        muggyObjectArray: [{ s: 'cbd', o: { s: 'asd' } }, ,],
      });
      const aStateBefore = check(aMug);
      expect(aStateBefore).toMatchObject({
        muggyObjectArray: [
          { s: 'cbd', o: { s: 'asd' } },
          { s: 'cbd', o: { s: 'asd' } },
        ],
      });
      const muggyObjectArrayItemState = check(muggyObjectArrayItemMug);
      expect(muggyObjectArrayItemState).toMatchObject({ s: 'cbd', o: { s: 'asd' } });

      swirl(muggyObjectArrayItemMug, { s: 'cbd' });
      const aStateAfter = check(aMug);

      expect(aStateAfter).toBe(aStateBefore);
      ownKeysOfObjectLike(aStateBefore).forEach((key) => {
        expect(aStateAfter[key]).toBe(aStateBefore[key]);
      });
      aStateBefore.muggyObjectArray.forEach((item: any, i: number) => {
        expect(aStateAfter.muggyObjectArray[i]).toBe(item);
      });
      expect(aStateAfter).toStrictEqual(aStateBefore);
    });
  });

  describe('a8013a5, first writes "the potential muggy object field" with a new object mug whose construction has different field values', () => {
    test('[action, verify] the field stays unchanged in ref and value', () => {
      const aStateBefore = check(aMug);

      const newObjectMug: Mug<ObjectState> = {
        [construction]: {
          s: '43c',
          o: {
            s: '43c',
          },
        },
      };

      swirl(aMug, { potentialMuggyObject: newObjectMug });

      const aStateAfter = check(aMug);

      expect(aStateAfter.potentialMuggyObject).toBe(aStateBefore.potentialMuggyObject);
      expect(aStateAfter.potentialMuggyObject).toStrictEqual(aStateBefore.potentialMuggyObject);
    });
  });

  describe('14b1d66, writes "the potential muggy object array field" with a dense bigger-length array of new object item mugs whose constructions have different field values', () => {
    let aStateBefore: any, aStateAfter: any;

    test('[action]', () => {
      swirl(aMug, {
        potentialMuggyObjectArray: [
          { s: 'afd', o: { s: 'afd' } },
          { s: 'afd', o: { s: 'afd' } },
        ],
      });
      aStateBefore = check(aMug);
      expect(aStateBefore).toMatchObject({
        potentialMuggyObjectArray: [
          { s: 'afd', o: { s: 'afd' } },
          { s: 'afd', o: { s: 'afd' } },
        ],
      });

      const newObjectMugArray = [
        { [construction]: { s: 'faf', o: { s: 'faf' } } },
        { [construction]: { s: 'faf', o: { s: 'faf' } } },
        { [construction]: { s: 'faf', o: { s: 'faf' } } },
      ];
      swirl(aMug, {
        potentialMuggyObjectArray: newObjectMugArray,
      });

      aStateAfter = check(aMug);
    });

    test('[verify] the field changes in ref and length', () => {
      expect(aStateAfter.potentialMuggyObjectArray).not.toBe(
        aStateBefore.potentialMuggyObjectArray,
      );
      expect(aStateAfter.potentialMuggyObjectArray).toHaveLength(3);
    });

    test('[verify] the existing field_s items stay unchanged in ref and value', () => {
      aStateBefore.potentialMuggyObjectArray.forEach((item: any, i: number) => {
        expect(aStateAfter.potentialMuggyObjectArray[i]).toBe(item);
        expect(aStateAfter.potentialMuggyObjectArray[i]).toStrictEqual(item);
      });
    });

    test('[verify] the field_s added items go empty', () => {
      expect(aStateAfter.potentialMuggyObjectArray.hasOwnProperty(2)).toBe(false);
    });
  });

  describe('cc093e5, writes "the potential muggy object array" field with a dense same-length array of new object item mugs whose constructions have different field values', () => {
    let aStateBefore: any, aStateAfter: any;

    test('[action]', () => {
      swirl(aMug, {
        potentialMuggyObjectArray: [
          { s: 'd4b', o: { s: 'd4b' } },
          { s: 'd4b', o: { s: 'd4b' } },
        ],
      });
      aStateBefore = check(aMug);
      expect(aStateBefore).toMatchObject({
        potentialMuggyObjectArray: [
          { s: 'd4b', o: { s: 'd4b' } },
          { s: 'd4b', o: { s: 'd4b' } },
        ],
      });

      const newObjectMugArray = [
        { [construction]: { s: 'ffa', o: { s: 'ffa' } } },
        { [construction]: { s: 'ffa', o: { s: 'ffa' } } },
      ];
      swirl(aMug, {
        potentialMuggyObjectArray: newObjectMugArray,
      });
      aStateAfter = check(aMug);
    });

    test('[verify] the field stays unchanged in ref and value', () => {
      expect(aStateAfter.potentialMuggyObjectArray).toBe(aStateBefore.potentialMuggyObjectArray);
      expect(aStateAfter.potentialMuggyObjectArray).toStrictEqual(
        aStateBefore.potentialMuggyObjectArray,
      );
    });

    test('[verify] the field_s items stays unchanged in ref and value', () => {
      aStateBefore.potentialMuggyObjectArray.forEach((item: any, i: number) => {
        expect(aStateAfter.potentialMuggyObjectArray[i]).toBe(item);
        expect(aStateAfter.potentialMuggyObjectArray[i]).toStrictEqual(item);
      });
    });
  });

  describe('1ecb1b4, first writes "the muggy object set field" with a new object mug set', () => {
    let aStateBefore: any, aStateAfter: any;

    const newObjectMugSet = new Set<Mug<ObjectState>>([
      { [construction]: { s: 'cbb', o: { s: 'cbb' } } },
      { [construction]: { s: 'cbb', o: { s: 'cbb' } } },
    ]);

    test('[action]', () => {
      aStateBefore = check(aMug);

      swirl(aMug, {
        objectMugSet: newObjectMugSet,
      });

      aStateAfter = check(aMug);
    });

    test('[verify] the field changes in ref', () => {
      expect(aStateAfter.objectMugSet).not.toBe(aStateBefore.objectMugSet);
      expect(aStateAfter.objectMugSet).toBe(newObjectMugSet);
    });

    test('[verify] the field_s object mugs stay unevaluated', () => {
      expect(aStateAfter.objectMugSet.size).toBe(newObjectMugSet.size);
      aStateAfter.objectMugSet.forEach((objectMug: Mug<ObjectState>) => {
        newObjectMugSet.has(objectMug);
        expect(objectMug).toStrictEqual({ [construction]: { s: 'cbb', o: { s: 'cbb' } } });
      });
    });
  });

  describe('f68c346, continuously reads the mug after write, [cite] .:30cb2f8', () => {
    test('[action, verify] the state and its fields stay unchanged in ref and evaluated value', () => {
      const aState1 = check(aMug);
      const aState2 = check(aMug);

      expect(aState2).toBe(aState1);
      ownKeysOfObjectLike(aState1).forEach((key) => {
        expect(aState2[key]).toBe(aState1[key]);
      });
      expect(aState2).toStrictEqual(aState1);
    });
  });
});

describe('269f475, operates "a circular-referenced mug" by builtin ops', () => {
  interface ObjectState {
    s: string;
    o: {
      s: string;
    };
  }

  const aMug: Mug<ObjectState & { bMug?: Mug<ObjectState> }> = {
    [construction]: {
      s: 'asd',
      o: {
        s: 'asd',
      },
    },
  };

  const bMug: Mug<ObjectState & { aMug?: Mug<ObjectState> }> = {
    [construction]: {
      s: 'asd',
      o: {
        s: 'asd',
      },
    },
  };

  aMug[construction].bMug = bMug;
  bMug[construction].aMug = aMug;

  describe('reads the mug before write', () => {
    test('[action, verify] throws a mug error', () => {
      expect(() => {
        check(aMug);
      }).toThrow(MugError);
    });
  });

  describe('first writes the mug_s string field with a different string', () => {
    test('[action, verify] throws a mug error', () => {
      expect(() => {
        swirl(aMug, { s: 'cd7' });
      }).toThrow(MugError);
    });
  });
});
