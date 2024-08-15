import { check, construction, Mug, PossibleMug, swirl } from '../src';
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

  test('reads the state before write, it equals the construction in ref and value', () => {
    const aState = check(aMug);
    expect(aState).toBe(aMug[construction]);
    expect(aState).toStrictEqual(aMug[construction]);
  });

  test('continuously reads the state, it stays unchanged in ref and value (before write)', () => {
    const aState1 = check(aMug);
    const aState2 = check(aMug);
    expect(aState2).toBe(aState1);
    expect(aState2).toStrictEqual(aState1);
  });

  describe('first writes the string field with a different string', () => {
    let aStateBefore: any, aStateAfter: any;
    let constructionBefore: any, constructionShallowCloneBefore: any;

    test('[action]', () => {
      aStateBefore = check(aMug);
      constructionBefore = aMug[construction];
      constructionShallowCloneBefore = { ...aMug[construction] };

      swirl(aMug, { s: 'sdf' });

      aStateAfter = check(aMug);
    });

    test('[verify] the state changes in ref and value', () => {
      expect(aStateAfter).not.toBe(aStateBefore);
      expect(aStateAfter).toStrictEqual({
        s: 'sdf',
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
      ownKeysOfObjectLike(aMug[construction]).forEach((key) => {
        expect(aMug[construction][key]).toBe(constructionShallowCloneBefore[key]);
      });
      expect(aMug[construction]).toStrictEqual({
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

  test('writes the string field with a same string, the state and its fields stay unchanged in ref and value', () => {
    swirl(aMug, { s: 'dfg' });
    const aStateBefore = check(aMug);
    expect(aStateBefore).toMatchObject({ s: 'dfg' });

    swirl(aMug, { s: 'dfg' });
    const aStateAfter = check(aMug);

    expect(aStateAfter).toBe(aStateBefore);
    expect(aStateAfter).toStrictEqual(aStateBefore);
    ownKeysOfObjectLike(aStateBefore).forEach((key) => {
      expect(aStateAfter[key]).toBe(aStateBefore[key]);
      expect(aStateAfter[key]).toStrictEqual(aStateBefore[key]);
    });
  });

  describe('writes the number array field', () => {
    test('with a dense bigger-length array of different items, the field changes in ref, length, and all items', () => {
      swirl(aMug, { na: [310, 310] });
      const aStateBefore = check(aMug);
      expect(aStateBefore).toMatchObject({ na: [310, 310] });

      swirl(aMug, { na: [320, 320, 320] });
      const aStateAfter = check(aMug);

      expect(aStateAfter.na).not.toBe(aStateBefore.na);
      expect(aStateAfter.na).toStrictEqual([320, 320, 320]);
    });

    test('with a dense smaller-length array of different items, the field changes in ref, length, and all items', () => {
      swirl(aMug, { na: [330, 330, 330] });
      const aStateBefore = check(aMug);
      expect(aStateBefore).toMatchObject({ na: [330, 330, 330] });

      swirl(aMug, { na: [340, 340] });
      const aStateAfter = check(aMug);

      expect(aStateAfter.na).not.toBe(aStateBefore.na);
      expect(aStateAfter.na).toStrictEqual([340, 340]);
    });

    test('with a dense same-length array of different items, the field changes in ref and all items', () => {
      swirl(aMug, { na: [350, 350] });
      const aStateBefore = check(aMug);
      expect(aStateBefore).toMatchObject({ na: [350, 350] });

      swirl(aMug, { na: [360, 360] });
      const aStateAfter = check(aMug);

      expect(aStateAfter.na).not.toBe(aStateBefore.na);
      expect(aStateAfter.na).toStrictEqual([360, 360]);
    });

    test('with a dense same-length array of same items, the field stay unchanged in ref and value', () => {
      swirl(aMug, { na: [370, 370] });
      const aStateBefore = check(aMug);
      expect(aStateBefore).toMatchObject({ na: [370, 370] });

      swirl(aMug, { na: [370, 370] });
      const aStateAfter = check(aMug);

      expect(aStateAfter.na).toBe(aStateBefore.na);
      expect(aStateAfter.na).toStrictEqual([370, 370]);
    });

    test('with a sparse bigger-length array of different items, the field changes in ref, length, and non-empty items', () => {
      swirl(aMug, { na: [380, 380] });
      const aStateBefore = check(aMug);
      expect(aStateBefore).toMatchObject({ na: [380, 380] });

      swirl(aMug, { na: [, 390, ,] });
      const aStateAfter = check(aMug);

      expect(aStateAfter.na).not.toBe(aStateBefore.na);
      expect(aStateAfter.na).toStrictEqual([380, 390, ,]);
    });

    test('with a sparse smaller-length array of different items, the field changes in ref, length, and non-empty items', () => {
      swirl(aMug, { na: [400, 400, 400] });
      const aStateBefore = check(aMug);
      expect(aStateBefore).toMatchObject({ na: [400, 400, 400] });

      swirl(aMug, { na: [410, ,] });
      const aStateAfter = check(aMug);

      expect(aStateAfter.na).not.toBe(aStateBefore.na);
      expect(aStateAfter.na).toStrictEqual([410, 400]);
    });

    test('with a sparse same-length array of different items, the field changes in ref and non-empty items', () => {
      swirl(aMug, { na: [420, 420] });
      const aStateBefore = check(aMug);
      expect(aStateBefore).toMatchObject({ na: [420, 420] });

      swirl(aMug, { na: [430, ,] });
      const aStateAfter = check(aMug);

      expect(aStateAfter.na).not.toBe(aStateBefore.na);
      expect(aStateAfter.na).toStrictEqual([430, 420]);
    });

    test('with a sparse same-length array of empty items, the field stays unchanged in ref and value', () => {
      swirl(aMug, { na: [440, 440] });
      const aStateBefore = check(aMug);
      expect(aStateBefore).toMatchObject({ na: [440, 440] });

      swirl(aMug, { na: [, ,] });
      const aStateAfter = check(aMug);

      expect(aStateAfter.na).toBe(aStateBefore.na);
      expect(aStateAfter.na).toStrictEqual([440, 440]);
    });
  });

  describe('writes the number tuple field', () => {
    test('with a dense tuple of different items, the field changes in ref and all items', () => {
      swirl(aMug, { nt: [310, 310, 310] });
      const aStateBefore = check(aMug);
      expect(aStateBefore).toMatchObject({ nt: [310, 310, 310] });

      swirl(aMug, { nt: [320, 320, 320] });
      const aStateAfter = check(aMug);

      expect(aStateAfter.nt).not.toBe(aStateBefore.nt);
      expect(aStateAfter.nt).toStrictEqual([320, 320, 320]);
    });

    test('with a dense tuple of same items, the field stays unchanged in ref and value', () => {
      swirl(aMug, { nt: [330, 330, 330] });
      const aStateBefore = check(aMug);
      expect(aStateBefore).toMatchObject({ nt: [330, 330, 330] });

      swirl(aMug, { nt: [330, 330, 330] });
      const aStateAfter = check(aMug);

      expect(aStateAfter.nt).toBe(aStateBefore.nt);
      expect(aStateAfter.nt).toStrictEqual([330, 330, 330]);
    });

    test('with a sparse tuple of different items, the field changes in ref and non-empty items', () => {
      swirl(aMug, { nt: [340, 340, 340] });
      const aStateBefore = check(aMug);
      expect(aStateBefore).toMatchObject({ nt: [340, 340, 340] });

      swirl(aMug, { nt: [, 350, ,] });

      const aStateAfter = check(aMug);

      expect(aStateAfter.nt).not.toBe(aStateBefore.nt);
      expect(aStateAfter.nt).toStrictEqual([340, 350, 340]);
    });

    test('with a sparse tuple of empty items, the field stays unchanged in ref and value', () => {
      swirl(aMug, { nt: [360, 360, 360] });
      const aStateBefore = check(aMug);
      expect(aStateBefore).toMatchObject({ nt: [360, 360, 360] });

      swirl(aMug, { nt: [, , ,] });

      const aStateAfter = check(aMug);

      expect(aStateAfter.nt).toBe(aStateBefore.nt);
      expect(aStateAfter.nt).toStrictEqual([360, 360, 360]);
    });
  });

  describe('writes the object array field', () => {
    test('with a bigger-length dense array of different full-fledged items, the field changes in ref, length, and all items', () => {
      swirl(aMug, {
        oa: [
          { s: 'asd', o: { s: 'asd' } },
          { s: 'asd', o: { s: 'asd' } },
        ],
      });
      const aStateBefore = check(aMug);
      expect(aStateBefore).toMatchObject({
        oa: [
          { s: 'asd', o: { s: 'asd' } },
          { s: 'asd', o: { s: 'asd' } },
        ],
      });

      swirl(aMug, {
        oa: [
          { s: 'sdf', o: { s: 'sdf' } },
          { s: 'sdf', o: { s: 'sdf' } },
          { s: 'sdf', o: { s: 'sdf' } },
        ],
      });
      const aStateAfter = check(aMug);

      expect(aStateAfter.oa).not.toBe(aStateBefore.oa);
      expect(aStateAfter.oa).toStrictEqual([
        { s: 'sdf', o: { s: 'sdf' } },
        { s: 'sdf', o: { s: 'sdf' } },
        { s: 'sdf', o: { s: 'sdf' } },
      ]);
    });

    describe('with a same-length dense array of full-fledged items one of which has a different string field', () => {
      let aStateBefore: any, aStateAfter: any;

      test('[action]', () => {
        swirl(aMug, {
          oa: [
            { s: 'dfg', o: { s: 'dfg' } },
            { s: 'dfg', o: { s: 'dfg' } },
          ],
        });
        aStateBefore = check(aMug);
        expect(aStateBefore).toMatchObject({
          oa: [
            { s: 'dfg', o: { s: 'dfg' } },
            { s: 'dfg', o: { s: 'dfg' } },
          ],
        });

        swirl(aMug, {
          oa: [
            { s: 'fgh', o: { s: 'dfg' } },
            { s: 'dfg', o: { s: 'dfg' } },
          ],
        });
        aStateAfter = check(aMug);
      });

      test('[verify] the field changes in ref and value', () => {
        expect(aStateAfter.oa).not.toBe(aStateBefore.oa);
        expect(aStateAfter.oa).toStrictEqual([
          { s: 'fgh', o: { s: 'dfg' } },
          { s: 'dfg', o: { s: 'dfg' } },
        ]);
      });

      test('[verify] that item changes in ref and value', () => {
        expect(aStateAfter.oa[0]).not.toBe(aStateBefore.oa[0]);
        expect(aStateAfter.oa[0]).toStrictEqual({ s: 'fgh', o: { s: 'dfg' } });
      });

      test('[verify] the rest items stay unchanged in ref and value', () => {
        expect(aStateAfter.oa[1]).toBe(aStateBefore.oa[1]);
        expect(aStateAfter.oa[1]).toStrictEqual(aStateBefore.oa[1]);
      });

      test('[verify] that item_s rest fields stay unchanged in ref and value', () => {
        ownKeysOfObjectLike(aStateAfter.oa[0].o)
          .filter((key) => key !== 's')
          .forEach((key) => {
            expect(aStateAfter.oa[0].o[key]).toBe(aStateBefore.oa[0].o[key]);
            expect(aStateAfter.oa[0].o[key]).toStrictEqual(aStateBefore.oa[0].o[key]);
          });
      });
    });

    describe('with a same-length sparse array of different full-fledged object items', () => {
      let aStateBefore: any, aStateAfter: any;

      test('[action]', () => {
        swirl(aMug, {
          oa: [
            { s: 'ghj', o: { s: 'ghj' } },
            { s: 'ghj', o: { s: 'ghj' } },
          ],
        });
        aStateBefore = check(aMug);
        expect(aStateBefore).toMatchObject({
          oa: [
            { s: 'ghj', o: { s: 'ghj' } },
            { s: 'ghj', o: { s: 'ghj' } },
          ],
        });

        swirl(aMug, {
          oa: [{ s: 'hjk', o: { s: 'hjk' } }, ,],
        });
        aStateAfter = check(aMug);
      });

      test('[verify] the field changes in ref, length, and non-empty items', () => {
        expect(aStateAfter.oa).not.toBe(aStateBefore.oa);
        expect(aStateAfter.oa).toStrictEqual([
          { s: 'hjk', o: { s: 'hjk' } },
          { s: 'ghj', o: { s: 'ghj' } },
        ]);
      });

      test('[verify] the empty items_ counterparts stay unchanged in ref and value', () => {
        expect(aStateAfter.oa[1]).toBe(aStateBefore.oa[1]);
        expect(aStateAfter.oa[1]).toStrictEqual(aStateBefore.oa[1]);
      });
    });
  });

  describe('writes the object tuple field with a sparse tuple of a partial object item that only has a different string field', () => {
    let aStateBefore: any, aStateAfter: any;

    test('[action]', () => {
      swirl(aMug, {
        ot: [
          { s: 'jkl', o: { s: 'jkl' } },
          { s: 'jkl', o: { s: 'jkl' } },
        ],
      });
      aStateBefore = check(aMug);
      expect(aStateBefore).toMatchObject({
        ot: [
          { s: 'jkl', o: { s: 'jkl' } },
          { s: 'jkl', o: { s: 'jkl' } },
        ],
      });

      swirl(aMug, {
        ot: [{ s: 'klz' }, ,],
      });

      aStateAfter = check(aMug);
    });

    test('[verify] the field changes in ref and value', () => {
      expect(aStateAfter.ot).not.toBe(aStateBefore.ot);
      expect(aStateAfter.ot).toStrictEqual([
        { s: 'klz', o: { s: 'jkl' } },
        { s: 'jkl', o: { s: 'jkl' } },
      ]);
    });

    test('[verify] that item changes in ref and value', () => {
      expect(aStateAfter.ot[0]).not.toBe(aStateBefore.ot[0]);
      expect(aStateAfter.ot[0]).toStrictEqual({ s: 'klz', o: { s: 'jkl' } });
    });

    test('[verify] that item_s rest fields stay unchanged in ref and value', () => {
      expect(aStateAfter.ot[1]).toBe(aStateBefore.ot[1]);
      expect(aStateAfter.ot[1]).toStrictEqual(aStateBefore.ot[1]);
    });
  });

  test('continuously reads the state, it stay unchanged in ref and value (after write)', () => {
    const aState1 = check(aMug);
    const aState2 = check(aMug);
    expect(aState2).toBe(aState1);
    expect(aState2).toStrictEqual(aState1);
  });
});

describe('operates a number mug by builtin ops', () => {
  const aMug: Mug<number> = {
    [construction]: 300,
  };

  test('reads the state before write, it equals the construction in value', () => {
    const aState = check(aMug);

    expect(aState).toBe(aMug[construction]);
  });

  test('writes the state with a different number, the state changes in value', () => {
    swirl(aMug, 310);
    const aState = check(aMug);

    expect(aState).toBe(310);
  });
});

describe('operates a class-defined mug by builtin ops', () => {
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

  test('reads the state before write, it equals the construction in ref and value', () => {
    const aState = check(aMug);
    expect(aState).toBe(aMug[construction]);
    expect(aState).toStrictEqual(aMug[construction]);
  });

  describe('first writes the string field with a different string', () => {
    let aStateBefore: any, aStateAfter: any;

    test('[action]', () => {
      aStateBefore = check(aMug);

      swirl(aMug, { s: 'sdf' });

      aStateAfter = check(aMug);
    });

    test('[verify] the state changes in ref and value', () => {
      expect(aStateAfter).not.toBe(aStateBefore);
      expect(aStateAfter).toStrictEqual({
        s: 'sdf',
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

  describe('writes the class-defined field', () => {
    test('with a different same-class instance that has different field values, the field changes in ref and value', () => {
      swirl(aMug, { position: new Point3D(310, 310, 310) });
      const aStateBefore = check(aMug);
      expect(aStateBefore).toMatchObject({
        position: new Point3D(310, 310, 310),
      });

      const newPosition = new Point3D(320, 320, 320);
      swirl(aMug, { position: newPosition });
      const aStateAfter = check(aMug);

      expect(aStateAfter.position).not.toBe(aStateBefore.position);
      expect(aStateAfter.position).toBe(newPosition);
      expect(aStateAfter.position).toStrictEqual(newPosition);
    });

    test('with a different same-class instance that has same field values, the field changes in ref', () => {
      swirl(aMug, { position: new Point3D(330, 330, 330) });
      const aStateBefore = check(aMug);
      expect(aStateBefore).toMatchObject({
        position: new Point3D(330, 330, 330),
      });

      const newPosition = new Point3D(330, 330, 330);
      swirl(aMug, { position: newPosition });
      const aStateAfter = check(aMug);

      expect(aStateAfter.position).not.toBe(aStateBefore.position);
      expect(aStateAfter.position).toBe(newPosition);
    });

    test('with a same same-class instance, the field stays unchanged in ref', () => {
      const oldPosition = new Point3D(340, 340, 340);
      swirl(aMug, { position: oldPosition });
      const aStateBefore = check(aMug);
      expect(aStateBefore).toMatchObject({
        position: new Point3D(340, 340, 340),
      });

      swirl(aMug, { position: oldPosition });
      const aStateAfter = check(aMug);

      expect(aStateAfter.position).toBe(aStateBefore.position);
    });

    test('with a plain object that has a matching field of a different value, the state stays unchanged in ref and value', () => {
      swirl(aMug, { position: new Point3D(340, 340, 340) });
      const aStateBefore = check(aMug);
      expect(aStateBefore).toMatchObject({
        position: new Point3D(340, 340, 340),
      });

      swirl(aMug, { position: { x: 350 } });
      const aStateAfter = check(aMug);

      expect(aStateAfter.position).toBe(aStateBefore.position);
      expect(aStateAfter.position).toStrictEqual(aStateBefore.position);
    });

    test('with a plain object that has all matching fields of different values, the field stays unchanged in ref and value', () => {
      swirl(aMug, { position: new Point3D(360, 360, 360) });
      const aStateBefore = check(aMug);
      expect(aStateBefore).toMatchObject({
        position: new Point3D(360, 360, 360),
      });

      swirl(aMug, { position: { x: 370, y: 370, z: 370 } });
      const aStateAfter = check(aMug);

      expect(aStateAfter.position).toBe(aStateBefore.position);
      expect(aStateAfter.position).toStrictEqual(aStateBefore.position);
    });

    test('with a sub-class instance that has different field values, the field stays unchanged in ref and value', () => {
      swirl(aMug, { position: new Point3D(370, 370, 370) });
      const aStateBefore = check(aMug);
      expect(aStateBefore).toMatchObject({
        position: new Point3D(370, 370, 370),
      });

      const newPosition = new Location3D(380, 380, 380, 'asd');
      swirl(aMug, { position: newPosition });
      const aStateAfter = check(aMug);

      expect(aStateAfter.position).toBe(aStateBefore.position);
      expect(aStateAfter.position).toStrictEqual(aStateBefore.position);
    });
  });
});

describe('operates a nested mug by builtin ops', () => {
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

  interface AState {
    object: ObjectState;
    muggyObject: ObjectState;
    latterMirrorMuggyObject: ObjectState;
    muggyNumber: number;
    latterMirrorMuggyNumber: number;
    potentialMuggyObject: ObjectState;
    potentialMuggyObjectArray: ObjectState[];
    muggyObjectSet: Set<Mug<ObjectState>>;
  }

  const aMug: PossibleMug<AState> = {
    [construction]: {
      object: { s: 'asd', o: { s: 'asd' } },
      muggyObject: objectMug,
      latterMirrorMuggyObject: objectMug,
      muggyNumber: numberMug,
      latterMirrorMuggyNumber: numberMug,
      potentialMuggyObject: { s: 'asd', o: { s: 'asd' } },
      potentialMuggyObjectArray: [],
      muggyObjectSet: new Set<Mug<ObjectState>>(),
    },
  };

  describe('reads the state before write', () => {
    let aState: any;

    test('[action]', () => {
      aState = check(aMug);
    });

    test('[verify] the state doesn_t equal the construction in ref', () => {
      expect(aState).not.toBe(aMug[construction]);
    });

    test('[verify] the state equals the construction in evaluated value', () => {
      expect(aState).toStrictEqual({
        object: { s: 'asd', o: { s: 'asd' } },
        muggyObject: { s: 'asd', o: { s: 'asd' } },
        latterMirrorMuggyObject: { s: 'asd', o: { s: 'asd' } },
        muggyNumber: 300,
        latterMirrorMuggyNumber: 300,
        potentialMuggyObject: { s: 'asd', o: { s: 'asd' } },
        potentialMuggyObjectArray: [],
        muggyObjectSet: new Set(),
      });
    });

    test('[verify] the object field equals the construction_s object field in ref and value', () => {
      expect(aState.object).toBe(aMug[construction].object);
      expect(aState.object).toStrictEqual(aMug[construction].object);
    });

    test('[verify] the muggy object field equals the object mug_s construction in ref and value', () => {
      expect(aState.muggyObject).toBe(objectMug[construction]);
      expect(aState.muggyObject).toStrictEqual(objectMug[construction]);
    });
  });

  test('continuously reads the state, it stay unchanged in ref and evaluated value (before write)', () => {
    const aState1 = check(aMug);
    const aState2 = check(aMug);
    expect(aState2).toBe(aState1);
    expect(aState2).toStrictEqual(aState1);
  });

  describe('first writes the muggy object field_s string field with a different string', () => {
    let aStateBefore: any, aStateAfter: any;
    let objectStateBefore: any, objectStateAfter: any;

    test('[action]', () => {
      aStateBefore = check(aMug);
      objectStateBefore = check(objectMug);

      swirl(aMug, { muggyObject: { s: 'sdf' } });

      aStateAfter = check(aMug);
      objectStateAfter = check(objectMug);
    });

    test('[verify] the state changes in ref and evaluated value', () => {
      expect(aStateAfter).not.toBe(aStateBefore);
      expect(aStateAfter).toStrictEqual({
        object: { s: 'asd', o: { s: 'asd' } },
        muggyObject: { s: 'sdf', o: { s: 'asd' } },
        latterMirrorMuggyObject: { s: 'sdf', o: { s: 'asd' } },
        muggyNumber: 300,
        latterMirrorMuggyNumber: 300,
        potentialMuggyObject: { s: 'asd', o: { s: 'asd' } },
        potentialMuggyObjectArray: [],
        muggyObjectSet: new Set(),
      });
    });

    test('[verify] the muggy object field changes in ref and evaluated value', () => {
      expect(aStateAfter.muggyObject).not.toBe(aStateBefore.muggyObject);
      expect(aStateAfter.muggyObject).toStrictEqual({ s: 'sdf', o: { s: 'asd' } });
    });

    test('[verify] the latter mirror muggy object field changes in ref and evaluated value', () => {
      expect(aStateAfter.latterMirrorMuggyObject).not.toBe(aStateBefore.latterMirrorMuggyObject);
      expect(aStateAfter.latterMirrorMuggyObject).toStrictEqual({ s: 'sdf', o: { s: 'asd' } });
    });

    test('[verify] the object mug_s state changes in ref and value', () => {
      expect(objectStateAfter).not.toBe(objectStateBefore);
      expect(objectStateAfter).toStrictEqual({ s: 'sdf', o: { s: 'asd' } });
    });

    test('[verify] the rest fields stay unchanged in ref and value', () => {
      ownKeysOfObjectLike(aStateAfter)
        .filter((key) => key !== 'muggyObject' && key !== 'latterMirrorMuggyObject')
        .forEach((key) => {
          expect(aStateAfter[key]).toBe(aStateBefore[key]);
          expect(aStateAfter[key]).toStrictEqual(aStateBefore[key]);
        });
    });
  });

  describe('writes the muggy object field_s string field with a same string', () => {
    let aStateBefore: any, aStateAfter: any;
    let objectStateBefore: any, objectStateAfter: any;

    test('[action]', () => {
      swirl(aMug, {
        muggyObject: { s: 'dfg' },
      });
      aStateBefore = check(aMug);
      expect(aStateBefore).toMatchObject({
        muggyObject: { s: 'dfg' },
      });
      objectStateBefore = check(objectMug);

      swirl(aMug, {
        muggyObject: { s: 'dfg' },
      });
      aStateAfter = check(aMug);
      objectStateAfter = check(objectMug);
    });

    test('[verify] the state and its fields stay unchanged in ref and evaluated value', () => {
      expect(aStateAfter).toBe(aStateBefore);
      expect(aStateAfter).toStrictEqual(aStateBefore);
      ownKeysOfObjectLike(aStateAfter).forEach((key) => {
        expect(aStateAfter[key]).toBe(aStateBefore[key]);
        expect(aStateAfter[key]).toStrictEqual(aStateBefore[key]);
      });
    });

    test('[verify] the object mug_s state and its fields stay unchanged in ref and value', () => {
      expect(objectStateAfter).toBe(objectStateBefore);
      expect(objectStateAfter).toStrictEqual(objectStateBefore);
      ownKeysOfObjectLike(objectStateAfter).forEach((key) => {
        expect(objectStateAfter[key]).toBe(objectStateBefore[key]);
        expect(objectStateAfter[key]).toStrictEqual(objectStateBefore[key]);
      });
    });
  });

  describe('writes the latter mirror muggy object field_s string field with a different string', () => {
    let aStateBefore: any, aStateAfter: any;
    let objectStateBefore: any, objectStateAfter: any;

    test('[action]', () => {
      swirl(aMug, {
        latterMirrorMuggyObject: { s: 'fgh' },
      });
      aStateBefore = check(aMug);
      expect(aStateBefore).toMatchObject({
        latterMirrorMuggyObject: { s: 'fgh' },
      });
      objectStateBefore = check(objectMug);

      swirl(aMug, {
        latterMirrorMuggyObject: { s: 'ghj' },
      });
      aStateAfter = check(aMug);
      objectStateAfter = check(objectMug);
    });

    test('[verify] the latter mirror muggy object field changes in ref and evaluated value', () => {
      expect(aStateAfter.latterMirrorMuggyObject).not.toBe(aStateBefore.latterMirrorMuggyObject);
      expect(aStateAfter.latterMirrorMuggyObject).toStrictEqual({ s: 'ghj', o: { s: 'asd' } });
    });

    test('[verify] the muggy object field changes in ref and evaluated value', () => {
      expect(aStateAfter.muggyObject).not.toBe(aStateBefore.muggyObject);
      expect(aStateAfter.muggyObject).toStrictEqual({ s: 'ghj', o: { s: 'asd' } });
    });

    test('[verify] the object mug_s state changes in ref and value', () => {
      expect(objectStateAfter).not.toBe(objectStateBefore);
      expect(objectStateAfter).toStrictEqual({ s: 'ghj', o: { s: 'asd' } });
    });

    test('[verify] the rest fields stay unchanged in ref and value', () => {
      ownKeysOfObjectLike(aStateAfter)
        .filter((key) => key !== 'muggyObject' && key !== 'latterMirrorMuggyObject')
        .forEach((key) => {
          expect(aStateAfter[key]).toBe(aStateBefore[key]);
          expect(aStateAfter[key]).toStrictEqual(aStateBefore[key]);
        });
    });
  });

  describe('writes the muggy object and the latter mirror muggy object fields_ string fields with different strings simultaneously', () => {
    let aStateBefore: any, aStateAfter: any;
    let objectStateBefore: any, objectStateAfter: any;

    test('[action]', () => {
      swirl(aMug, {
        muggyObject: { s: 'hjk' },
        latterMirrorMuggyObject: { s: 'hjk' },
      });
      aStateBefore = check(aMug);
      expect(aStateBefore).toMatchObject({
        muggyObject: { s: 'hjk' },
        latterMirrorMuggyObject: { s: 'hjk' },
      });
      objectStateBefore = check(objectMug);

      swirl(aMug, {
        muggyObject: { s: 'jkl' },
        latterMirrorMuggyObject: { s: 'klz' },
      });
      aStateAfter = check(aMug);
      objectStateAfter = check(objectMug);
    });

    test('[verify] the muggy object and the latter mirror muggy object fields change in ref and evaluated value as per the muggy object_s string field value', () => {
      expect(aStateAfter.muggyObject).toStrictEqual({ s: 'jkl', o: { s: 'asd' } });
      expect(aStateAfter.latterMirrorMuggyObject).toStrictEqual({ s: 'jkl', o: { s: 'asd' } });
    });

    test('[verify] the object mug_s state chagnes as per the muggy object_s string field value', () => {
      expect(objectStateAfter).toStrictEqual({ s: 'jkl', o: { s: 'asd' } });
    });
  });

  describe('writes the object mug_s string field with a different string', () => {
    let aStateBefore: any, aStateAfter: any;

    test('[action]', () => {
      swirl(objectMug, { s: 'fgh' });
      const objectStateBefore = check(objectMug);
      expect(objectStateBefore).toMatchObject({ s: 'fgh' });
      aStateBefore = check(aMug);

      swirl(objectMug, { s: 'ghj' });
      aStateAfter = check(aMug);
    });

    test('[verify] the muggy object field changes in ref and evaluated value', () => {
      expect(aStateAfter.muggyObject).not.toBe(aStateBefore.muggyObject);
      expect(aStateAfter.muggyObject).toStrictEqual({ s: 'ghj', o: { s: 'asd' } });
    });

    test('[verify] the latter mirror muggy object field changes in ref and evaluated value', () => {
      expect(aStateAfter.latterMirrorMuggyObject).not.toBe(aStateBefore.latterMirrorMuggyObject);
      expect(aStateAfter.latterMirrorMuggyObject).toStrictEqual({ s: 'ghj', o: { s: 'asd' } });
    });

    test('[verify] the rest field stays unchanged in ref and value', () => {
      ownKeysOfObjectLike(aStateAfter)
        .filter((key) => key !== 'muggyObject' && key !== 'latterMirrorMuggyObject')
        .forEach((key) => {
          expect(aStateAfter[key]).toBe(aStateBefore[key]);
          expect(aStateAfter[key]).toStrictEqual(aStateBefore[key]);
        });
    });
  });

  test('writes the object mug_s string field with a same string, the state and its fields stay unchanged in ref, value, and evaluated value', () => {
    swirl(objectMug, { s: 'hjk' });
    const objectStateBefore = check(objectMug);
    expect(objectStateBefore).toMatchObject({ s: 'hjk' });
    const aStateBefore = check(aMug);

    swirl(objectMug, { s: 'hjk' });
    const aStateAfter = check(aMug);

    expect(aStateAfter).toBe(aStateBefore);
    expect(aStateAfter).toStrictEqual(aStateBefore);
    ownKeysOfObjectLike(aStateAfter).forEach((key) => {
      expect(aStateAfter[key]).toBe(aStateBefore[key]);
      expect(aStateAfter[key]).toStrictEqual(aStateBefore[key]);
    });
  });

  test('first writes the muggy number field with a different number, the field and the latter mirror muggy number field change in value', () => {
    swirl(aMug, {
      muggyNumber: 310,
    });

    const aState = check(aMug);

    expect(aState.muggyNumber).toBe(310);
    expect(aState.latterMirrorMuggyNumber).toBe(310);
  });

  test('writes the latter mirror muggy number field with a different number, the field and the muggy number field change in value', () => {
    swirl(aMug, { muggyNumber: 320 });
    const aStateBefore = check(aMug);
    expect(aStateBefore).toMatchObject({
      muggyNumber: 320,
      latterMirrorMuggyNumber: 320,
    });

    swirl(aMug, {
      latterMirrorMuggyNumber: 330,
    });
    const aStateAfter = check(aMug);

    expect(aStateAfter.muggyNumber).toBe(330);
    expect(aStateAfter.latterMirrorMuggyNumber).toBe(330);
  });

  test('first writes the potential muggy object field with a new object mug whose construction has different field values, the field stays unchanged in ref and value', () => {
    const aStateBefore = check(aMug);

    const newObjectMug: Mug<ObjectState> = {
      [construction]: {
        s: 'sdf',
        o: {
          s: 'sdf',
        },
      },
    };

    swirl(aMug, { potentialMuggyObject: newObjectMug });

    const aStateAfter = check(aMug);

    expect(aStateAfter.potentialMuggyObject).toBe(aStateBefore.potentialMuggyObject);
    expect(aStateAfter.potentialMuggyObject).toStrictEqual(aStateBefore.potentialMuggyObject);
  });

  describe('writes the potential muggy object array field with a bigger-length dense array of new object mugs whose constructions have different field values', () => {
    let aStateBefore: any, aStateAfter: any;

    test('[action]', () => {
      swirl(aMug, {
        potentialMuggyObjectArray: [
          { s: 'dfg', o: { s: 'dfg' } },
          { s: 'dfg', o: { s: 'dfg' } },
        ],
      });
      aStateBefore = check(aMug);
      expect(aStateBefore).toMatchObject({
        potentialMuggyObjectArray: [
          { s: 'dfg', o: { s: 'dfg' } },
          { s: 'dfg', o: { s: 'dfg' } },
        ],
      });

      const newObjectMugArray = [
        { [construction]: { s: 'fgh', o: { s: 'fgh' } } },
        { [construction]: { s: 'fgh', o: { s: 'fgh' } } },
        { [construction]: { s: 'fgh', o: { s: 'fgh' } } },
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

    test('[verify] the field_s items stay unchanged in ref and value', () => {
      expect(aStateAfter.potentialMuggyObjectArray[0]).toBe(
        aStateBefore.potentialMuggyObjectArray[0],
      );
      expect(aStateAfter.potentialMuggyObjectArray[0]).toStrictEqual(
        aStateBefore.potentialMuggyObjectArray[0],
      );

      expect(aStateAfter.potentialMuggyObjectArray[1]).toBe(
        aStateBefore.potentialMuggyObjectArray[1],
      );
      expect(aStateAfter.potentialMuggyObjectArray[1]).toStrictEqual(
        aStateBefore.potentialMuggyObjectArray[1],
      );
    });

    test('[verify] the field_s added items go empty', () => {
      expect(aStateAfter.potentialMuggyObjectArray.hasOwnProperty(2)).toBe(false);
    });
  });

  test('writes the potential muggy object array field with a same-length dense array of new object mugs whose constructions have different field values, the field stays unchanged in ref and value', () => {
    swirl(aMug, {
      potentialMuggyObjectArray: [
        { s: 'ghj', o: { s: 'ghj' } },
        { s: 'ghj', o: { s: 'ghj' } },
      ],
    });
    const aStateBefore = check(aMug);
    expect(aStateBefore).toMatchObject({
      potentialMuggyObjectArray: [
        { s: 'ghj', o: { s: 'ghj' } },
        { s: 'ghj', o: { s: 'ghj' } },
      ],
    });

    const newObjectMugArray = [
      { [construction]: { s: 'hjk', o: { s: 'hjk' } } },
      { [construction]: { s: 'hjk', o: { s: 'hjk' } } },
    ];
    swirl(aMug, {
      potentialMuggyObjectArray: newObjectMugArray,
    });
    const aStateAfter = check(aMug);

    expect(aStateAfter.potentialMuggyObjectArray).toBe(aStateBefore.potentialMuggyObjectArray);
    expect(aStateAfter.potentialMuggyObjectArray).toStrictEqual(
      aStateBefore.potentialMuggyObjectArray,
    );
  });

  describe('first writes the muggy object set field with a new object mug set', () => {
    let aStateBefore: any, aStateAfter: any;

    const newObjectMugSet = new Set<Mug<ObjectState>>([
      { [construction]: { s: 'jkl', o: { s: 'jkl' } } },
      { [construction]: { s: 'jkl', o: { s: 'jkl' } } },
    ]);

    test('[action]', () => {
      aStateBefore = check(aMug);

      swirl(aMug, {
        muggyObjectSet: newObjectMugSet,
      });

      aStateAfter = check(aMug);
    });

    test('[verify] the field changes in ref', () => {
      expect(aStateAfter.muggyObjectSet).not.toBe(aStateBefore.muggyObjectSet);
      expect(aStateAfter.muggyObjectSet).toBe(newObjectMugSet);
    });

    test('[verify] the field_s object mugs stay unevaluated', () => {
      expect(aStateAfter.muggyObjectSet.size).toBe(newObjectMugSet.size);
      aStateAfter.muggyObjectSet.forEach((objectMug: Mug<ObjectState>) => {
        newObjectMugSet.has(objectMug);
        expect(objectMug).toStrictEqual({ [construction]: { s: 'jkl', o: { s: 'jkl' } } });
      });
    });
  });

  test('continuously reads the state, it stays unchanged in ref and evaluated value (after write)', () => {
    const aState1 = check(aMug);
    const aState2 = check(aMug);
    expect(aState2).toBe(aState1);
    expect(aState2).toStrictEqual(aState1);
  });
});
