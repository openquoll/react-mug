import { check, construction, EmptyItem, Mug, swirl, tuple } from '../src';
import { MugLike, ownKeysOfObjectLike } from '../src/mug';

interface ObjectState {
  s: string;
  o: {
    s: string;
  };
}

describe('31f3463, operates "a constant plain object state" by builtin ops', () => {
  interface AState extends ObjectState {}

  const aState: AState = {
    s: 'asd',
    o: {
      s: 'asd',
    },
  };

  describe('62e2cc9, reads the state', () => {
    test('[action, verify] the read return and its fields equals the state and its fields in ref and value', () => {
      const readReturn = check(aState);

      expect(readReturn).toBe(aState);
      ownKeysOfObjectLike(aState).forEach((key) => {
        expect(readReturn[key]).toBe(aState[key]);
      });
      expect(readReturn).toStrictEqual(aState);
    });
  });

  describe('4dd8338, first writes "the string field" with a different value', () => {
    let readReturn: AState;
    const aStateShallowCloneBefore = { ...aState };
    const aStateDeepCloneBefore: AState = {
      s: 'asd',
      o: {
        s: 'asd',
      },
    };

    test('[action]', () => {
      swirl(aState, { s: '358' });

      readReturn = check(aState);
    });

    test('[verify] the state_s fields stay unchanged in ref and value', () => {
      ownKeysOfObjectLike(aStateShallowCloneBefore).forEach((key) => {
        expect(aState[key]).toBe(aStateShallowCloneBefore[key]);
        expect(aState[key]).toStrictEqual(aStateDeepCloneBefore[key]);
      });
    });

    test('[verify] the read return and its fields equals the state and its field in ref and value', () => {
      expect(readReturn).toBe(aState);
      ownKeysOfObjectLike(aState).forEach((key) => {
        expect(readReturn[key]).toBe(aState[key]);
      });
      expect(readReturn).toStrictEqual(aState);
    });
  });
});

describe('5b713bb, operates "a constant mug-nested object mug-like" by builtin ops, [cite] 001:6a8c78f', () => {
  interface AState extends ObjectState {
    muggyObject: ObjectState;
    muggyNumber: number;
    muggyObjectArray: ObjectState[];
  }

  type AMugLike = MugLike<
    AState,
    {
      muggyObject: Mug<ObjectState>;
      muggyNumber: Mug<number>;
      muggyObjectArray: (Mug<ObjectState> | EmptyItem)[];
    }
  >;

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

  const aMugLike: AMugLike = {
    s: 'asd',
    o: {
      s: 'asd',
    },
    muggyObject: objectMug,
    muggyNumber: numberMug,
    muggyObjectArray: [{ s: 'asd', o: { s: 'asd' } }, muggyObjectArrayItemMug],
  };

  describe('13f6e62, reads the mug-like before write', () => {
    let aState: AState;

    test('[action]', () => {
      aState = check(aMugLike);
    });

    test('[verify] the state differs from the mug-like in ref', () => {
      expect(aState).not.toBe(aMugLike);
    });

    test('[verify] the state equals the mug-like in evaluated value', () => {
      expect(aState).toStrictEqual({
        s: 'asd',
        o: {
          s: 'asd',
        },
        muggyObject: {
          s: 'asd',
          o: {
            s: 'asd',
          },
        },
        muggyNumber: 300,
        muggyObjectArray: [
          { s: 'asd', o: { s: 'asd' } },
          { s: 'asd', o: { s: 'asd' } },
        ],
      });
    });

    test('[verify] the object field equals the mug-like_s counterpart field in ref and value', () => {
      expect(aState.o).toBe(aMugLike.o);
      expect(aState.o).toStrictEqual(aMugLike.o);
    });

    test('[verify] the muggy object field equals the object mug_s construction in ref and value', () => {
      expect(aState.muggyObject).toBe(objectMug[construction]);
      expect(aState.muggyObject).toStrictEqual(objectMug[construction]);
    });

    test('[verify] the muggy number field equals the number mug_s construction and value', () => {
      expect(aState.muggyNumber).toBe(numberMug[construction]);
    });

    test('[verify] the muggy object array field_s object index-0 item equals the mug-like_s counterpart field in ref and value', () => {
      expect(aState.muggyObjectArray[0]).toBe(aMugLike.muggyObjectArray[0]);
      expect(aState.muggyObjectArray[0]).toStrictEqual(aMugLike.muggyObjectArray[0]);
    });

    test('[verify] the muggy object array field_s muggy object index-1 item equals the muggy object array item mug_s construction in ref and value', () => {
      expect(aState.muggyObjectArray[1]).toBe(muggyObjectArrayItemMug[construction]);
      expect(aState.muggyObjectArray[1]).toStrictEqual(muggyObjectArrayItemMug[construction]);
    });
  });

  describe('49ec8d1, continuously reads the mug-like before write', () => {
    test('[action, verify] the state and its fields stay unchanged in ref and value', () => {
      const aState1 = check(aMugLike);
      const aState2 = check(aMugLike);

      expect(aState2).toBe(aState1);
      ownKeysOfObjectLike(aState1).forEach((key) => {
        expect(aState2[key]).toBe(aState1[key]);
      });
      expect(aState2).toStrictEqual(aState1);
    });
  });

  describe('d17ce18, first writes "the string field" with a different value', () => {
    let aStateBefore: AState, aStateAfter: AState;
    const aMugLikeShallowCloneBefore: AMugLike = { ...aMugLike };

    test('[action]', () => {
      aStateBefore = check(aMugLike);

      swirl(aMugLike, { s: '705' });

      aStateAfter = check(aMugLike);
    });

    test('[verify] the mug-like_s fields stay unchanged in ref and value', () => {
      ownKeysOfObjectLike(aMugLikeShallowCloneBefore).forEach((key) => {
        expect(aMugLike[key]).toBe(aMugLikeShallowCloneBefore[key]);
        expect(aMugLike[key]).toStrictEqual(aMugLikeShallowCloneBefore[key]);
      });
    });

    test('[verify] the state and its fields stays unchanged in ref and value', () => {
      expect(aStateAfter).toBe(aStateBefore);
      ownKeysOfObjectLike(aStateBefore).forEach((key) => {
        expect(aStateAfter[key]).toBe(aStateBefore[key]);
      });
      expect(aStateAfter).toStrictEqual(aStateBefore);
    });
  });

  describe('91ca40a, first writes "the muggy object field_s string field" with a different value', () => {
    let aStateBefore: AState, aStateAfter: AState;
    let objectStateBefore: ObjectState, objectStateAfter: ObjectState;

    test('[action]', () => {
      aStateBefore = check(aMugLike);
      objectStateBefore = check(objectMug);

      swirl(aMugLike, { muggyObject: { s: 'a67' } });

      aStateAfter = check(aMugLike);
      objectStateAfter = check(objectMug);
    });

    test('[verify] the state changes in ref and value', () => {
      expect(aStateAfter).not.toBe(aStateBefore);
      expect(aStateAfter).toStrictEqual({
        s: 'asd',
        o: {
          s: 'asd',
        },
        muggyObject: {
          s: 'a67',
          o: {
            s: 'asd',
          },
        },
        muggyNumber: 300,
        muggyObjectArray: [
          { s: 'asd', o: { s: 'asd' } },
          { s: 'asd', o: { s: 'asd' } },
        ],
      });
    });

    test('[verify] the muggy object field changes in ref and value', () => {
      expect(aStateAfter.muggyObject).not.toBe(aStateBefore.muggyObject);
      expect(aStateAfter.muggyObject).toStrictEqual({ s: 'a67', o: { s: 'asd' } });
    });

    test('[verify] the muggy object field_s rest fields stay unchanged in ref and value', () => {
      ownKeysOfObjectLike(aStateBefore.muggyObject)
        .filter((key) => key !== 's')
        .forEach((key) => {
          expect(aStateAfter.muggyObject[key]).toBe(aStateBefore.muggyObject[key]);
          expect(aStateAfter.muggyObject[key]).toStrictEqual(aStateBefore.muggyObject[key]);
        });
    });

    test('[verify] the object mug_s state equals the muggy object field in ref and value before and after', () => {
      expect(objectStateBefore).toBe(aStateBefore.muggyObject);
      expect(objectStateBefore).toStrictEqual(aStateBefore.muggyObject);
      expect(objectStateAfter).toBe(aStateAfter.muggyObject);
      expect(objectStateAfter).toStrictEqual(aStateAfter.muggyObject);
    });

    test('[verify] the object field equals the mug-like_s object field in ref and value', () => {
      expect(aStateAfter.o).toBe(aMugLike.o);
      expect(aStateAfter.o).toStrictEqual(aMugLike.o);
    });
  });

  describe('a00880a, writes "the muggy object field_s string field" with a same value, [cite] .:91ca40a', () => {
    let aStateBefore: AState, aStateAfter: AState;
    let objectStateBefore: ObjectState, objectStateAfter: ObjectState;

    test('[action]', () => {
      swirl(aMugLike, {
        muggyObject: { s: '575' },
      });
      aStateBefore = check(aMugLike);
      expect(aStateBefore).toMatchObject({
        muggyObject: { s: '575' },
      });
      objectStateBefore = check(objectMug);
      expect(objectStateBefore).toMatchObject({ s: '575' });

      swirl(aMugLike, {
        muggyObject: { s: '575' },
      });
      aStateAfter = check(aMugLike);
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

  describe('4979aa2, writes "the object mug_s string field" with a different value, [cite] .:91ca40a', () => {
    let aStateBefore: AState, aStateAfter: AState;
    let objectStateBefore: ObjectState, objectStateAfter: ObjectState;

    test('[action]', () => {
      swirl(aMugLike, { muggyObject: { s: '5ac' } });
      aStateBefore = check(aMugLike);
      expect(aStateBefore).toMatchObject({
        muggyObject: { s: '5ac' },
      });
      objectStateBefore = check(objectMug);
      expect(objectStateBefore).toMatchObject({ s: '5ac' });

      swirl(objectMug, { s: 'bf2' });
      objectStateAfter = check(objectMug);
      aStateAfter = check(aMugLike);
    });

    test('[verify] the muggy object field changes in ref', () => {
      expect(aStateAfter.muggyObject).not.toBe(aStateBefore.muggyObject);
    });

    test('[verify] the muggy object field equals the object mug_s state in ref and value before and after', () => {
      expect(aStateBefore.muggyObject).toBe(objectStateBefore);
      expect(aStateBefore.muggyObject).toStrictEqual(objectStateBefore);
      expect(aStateAfter.muggyObject).toBe(objectStateAfter);
      expect(aStateAfter.muggyObject).toStrictEqual(objectStateAfter);
    });

    test('[verify] the parent mug-like_s rest fields stay unchanged in ref and value', () => {
      ownKeysOfObjectLike(aStateBefore)
        .filter((key) => key !== 'muggyObject')
        .forEach((key) => {
          expect(aStateAfter[key]).toBe(aStateBefore[key]);
          expect(aStateAfter[key]).toStrictEqual(aStateBefore[key]);
        });
    });
  });

  describe('4ab59e0, writes "the object mug_s string field" with a same value, [cite] .:91ca40a', () => {
    test('[action, verify], the parent mug-like_s state and its fields stay unchanged in ref and value', () => {
      swirl(aMugLike, {
        muggyObject: { s: 'fed' },
      });
      const aStateBefore = check(aMugLike);
      expect(aStateBefore).toMatchObject({
        muggyObject: { s: 'fed' },
      });
      const objectStateBefore = check(objectMug);
      expect(objectStateBefore).toMatchObject({ s: 'fed' });

      swirl(objectMug, { s: 'fed' });
      const aStateAfter = check(aMugLike);

      expect(aStateAfter).toBe(aStateBefore);
      ownKeysOfObjectLike(aStateBefore).forEach((key) => {
        expect(aStateAfter[key]).toBe(aStateBefore[key]);
      });
      expect(aStateAfter).toStrictEqual(aStateBefore);
    });
  });

  describe('d0668a2, first writes "the muggy number field" with a different value', () => {
    test('[action, verify] the field and the number mug_s state change in value', () => {
      swirl(aMugLike, { muggyNumber: 787 });

      const aState = check(aMugLike);
      const numberState = check(numberMug);

      expect(aState.muggyNumber).toBe(787);
      expect(numberState).toBe(787);
    });
  });

  describe('bff5b97, writes "the muggy number field" with a same value, [cite] .:d0668a2', () => {
    test('[action, verify] the state and the number mug_s state stay unchanged in ref and value', () => {
      swirl(aMugLike, { muggyNumber: 975 });
      const aStateBefore = check(aMugLike);
      expect(aStateBefore).toMatchObject({
        muggyNumber: 975,
      });
      const numberStateBefore = check(numberMug);
      expect(numberStateBefore).toBe(975);

      swirl(aMugLike, { muggyNumber: 975 });

      const aStateAfter = check(aMugLike);
      const numberStateAfter = check(numberMug);

      expect(aStateAfter).toBe(aStateBefore);
      expect(aStateAfter).toStrictEqual(aStateBefore);
      expect(numberStateAfter).toBe(numberStateBefore);
    });
  });

  describe('fa1fd97, writes "the number mug" with a different value, [cite] .:d0668a2', () => {
    test('[action, verify], the parent mug-like_s state changes in ref, the muggy number field changes in value', () => {
      swirl(aMugLike, { muggyNumber: 945 });
      const aStateBefore = check(aMugLike);
      expect(aStateBefore).toMatchObject({
        muggyNumber: 945,
      });
      const numberStateBefore = check(numberMug);
      expect(numberStateBefore).toBe(945);

      swirl(numberMug, 830);
      const aStateAfter = check(aMugLike);

      expect(aStateAfter).not.toBe(aStateBefore);
      expect(aStateAfter.muggyNumber).toBe(830);
    });
  });

  describe('bff5b97, writes "the number mug" with a same value, [cite] .:d0668a2', () => {
    test('[action, verify] the parent mug-like_s state stays unchanged in ref and value', () => {
      swirl(aMugLike, { muggyNumber: 366 });
      const aStateBefore = check(aMugLike);
      expect(aStateBefore).toMatchObject({
        muggyNumber: 366,
      });
      const numberStateBefore = check(numberMug);
      expect(numberStateBefore).toBe(366);

      swirl(aMugLike, { muggyNumber: 366 });

      const aStateAfter = check(aMugLike);

      expect(aStateAfter).toBe(aStateBefore);
      expect(aStateAfter).toStrictEqual(aStateBefore);
    });
  });

  describe('497c64f, first writes "the muggy object array field" with a sparse bigger-length array of a full-fledged object index-0 item that has a different string field value', () => {
    let aStateBefore: AState, aStateAfter: AState;

    test('[action]', () => {
      aStateBefore = check(aMugLike);

      swirl(aMugLike, { muggyObjectArray: [{ s: '705', o: { s: 'asd' } }, , ,] });

      aStateAfter = check(aMugLike);
    });

    test('[verify] the state stays unchanged in ref, length, and value', () => {
      expect(aStateAfter).toBe(aStateBefore);
      expect(aStateAfter).toStrictEqual(aStateBefore);
    });

    test('[verify] that item equals the mug-like_s muggy object array field_s index-0 item in ref and value', () => {
      expect(aStateAfter.muggyObjectArray[0]).toBe(aMugLike.muggyObjectArray[0]);
      expect(aStateAfter.muggyObjectArray[0]).toStrictEqual(aMugLike.muggyObjectArray[0]);
    });
  });

  describe('35a67f9, first writes "the muggy object array field" with a sparse same-length array of a full-fledged object index-1 item that has a different string field value', () => {
    let aStateBefore: AState, aStateAfter: AState;
    let muggyObjectArrayItemStateBefore: ObjectState, muggyObjectArrayItemStateAfter: ObjectState;

    test('[action]', () => {
      aStateBefore = check(aMugLike);
      muggyObjectArrayItemStateBefore = check(muggyObjectArrayItemMug);

      swirl(aMugLike, {
        muggyObjectArray: [, { s: '58e', o: { s: 'asd' } }],
      });

      aStateAfter = check(aMugLike);
      muggyObjectArrayItemStateAfter = check(muggyObjectArrayItemMug);
    });

    test('[verify] the field changes in ref but not in length', () => {
      expect(aStateAfter.muggyObjectArray).not.toBe(aStateBefore.muggyObjectArray);
      expect(aStateAfter.muggyObjectArray).toHaveLength(aStateBefore.muggyObjectArray.length);
    });

    test('[verify] that item changes in ref and value', () => {
      expect(aStateAfter.muggyObjectArray[1]).not.toBe(aStateBefore.muggyObjectArray[0]);
      expect(aStateAfter.muggyObjectArray[1]).toStrictEqual({ s: '58e', o: { s: 'asd' } });
    });

    test('[verify] that item_s rest fields stay unchanged in ref and value', () => {
      ownKeysOfObjectLike(aStateBefore.muggyObjectArray[1])
        .filter((key) => key !== 's')
        .forEach((key) => {
          expect(aStateAfter.muggyObjectArray[1][key]).toBe(aStateAfter.muggyObjectArray[1][key]);
          expect(aStateAfter.muggyObjectArray[1][key]).toStrictEqual(
            aStateAfter.muggyObjectArray[1][key],
          );
        });
    });

    test('[verify] the muggy object array item mug_s state equals that item in ref and value before and after', () => {
      expect(muggyObjectArrayItemStateAfter).toBe(aStateAfter.muggyObjectArray[1]);
      expect(muggyObjectArrayItemStateAfter).toStrictEqual(aStateAfter.muggyObjectArray[1]);
      expect(muggyObjectArrayItemStateBefore).toBe(aStateBefore.muggyObjectArray[1]);
      expect(muggyObjectArrayItemStateBefore).toStrictEqual(aStateBefore.muggyObjectArray[1]);
    });

    test('[verify] the field_s index-0 item equals the mug-like_s muggy object array field_s index-0 item in ref and value', () => {
      expect(aStateAfter.muggyObjectArray[0]).toBe(aMugLike.muggyObjectArray[0]);
      expect(aStateAfter.muggyObjectArray[0]).toStrictEqual(aMugLike.muggyObjectArray[0]);
    });
  });

  describe('3a6041b, writes "the muggy object array field" with a sparse same-length array of a full-fledged object index-1 item that has a same string field value, [cite] .:35a67f9', () => {
    let aStateBefore: AState, aStateAfter: AState;
    let muggyObjectArrayItemStateBefore: ObjectState, muggyObjectArrayItemStateAfter: ObjectState;

    test('[action]', () => {
      swirl(aMugLike, {
        muggyObjectArray: [, { s: '4ec', o: { s: 'asd' } }],
      });
      aStateBefore = check(aMugLike);
      expect(aStateBefore).toMatchObject({
        muggyObjectArray: [
          { s: 'asd', o: { s: 'asd' } },
          { s: '4ec', o: { s: 'asd' } },
        ],
      });
      muggyObjectArrayItemStateBefore = check(muggyObjectArrayItemMug);
      expect(muggyObjectArrayItemStateBefore).toMatchObject({ s: '4ec', o: { s: 'asd' } });

      swirl(aMugLike, {
        muggyObjectArray: [, { s: '4ec', o: { s: 'asd' } }],
      });

      aStateAfter = check(aMugLike);
      muggyObjectArrayItemStateAfter = check(muggyObjectArrayItemMug);
    });

    test('[verify] the state and its fields stays unchanged in ref and value', () => {
      expect(aStateAfter).toBe(aStateBefore);
      ownKeysOfObjectLike(aStateBefore).forEach((key) => {
        expect(aStateAfter[key]).toBe(aStateBefore[key]);
      });
      expect(aStateAfter).toStrictEqual(aStateBefore);
    });

    test('[verify] the field_s items stay unchanged in ref and value', () => {
      aStateAfter.muggyObjectArray.forEach((item, i) => {
        expect(aStateBefore.muggyObjectArray[i]).toBe(item);
        expect(aStateBefore.muggyObjectArray[i]).toStrictEqual(item);
      });
    });

    test('[verify] the muggy object array item mug_s state stays unchanged in ref and value', () => {
      expect(muggyObjectArrayItemStateAfter).toBe(muggyObjectArrayItemStateBefore);
      expect(muggyObjectArrayItemStateAfter).toStrictEqual(muggyObjectArrayItemStateBefore);
    });
  });

  describe('c7807f5, writes "the muggy object array item mug_s string field" with a different value, [cite] .:35a67f9', () => {
    let aStateBefore: AState, aStateAfter: AState;
    let muggyObjectArrayItemStateBefore: ObjectState, muggyObjectArrayItemStateAfter: ObjectState;

    test('[action]', () => {
      swirl(aMugLike, {
        muggyObjectArray: [, { s: 'a3a', o: { s: 'asd' } }],
      });
      aStateBefore = check(aMugLike);
      expect(aStateBefore).toMatchObject({
        muggyObjectArray: [
          { s: 'asd', o: { s: 'asd' } },
          { s: 'a3a', o: { s: 'asd' } },
        ],
      });
      muggyObjectArrayItemStateBefore = check(muggyObjectArrayItemMug);
      expect(muggyObjectArrayItemStateBefore).toMatchObject({ s: 'a3a', o: { s: 'asd' } });

      swirl(muggyObjectArrayItemMug, { s: 'c6b' });

      muggyObjectArrayItemStateAfter = check(muggyObjectArrayItemMug);
      aStateAfter = check(aMugLike);
    });

    test('[verify] the muggy object array field changes in ref but not in length', () => {
      expect(aStateAfter.muggyObjectArray).not.toBe(aStateBefore.muggyObjectArray);
      expect(aStateAfter.muggyObjectArray).toHaveLength(aStateBefore.muggyObjectArray.length);
    });

    test('[verify] the parent mug-like_s rest fields stay unchanged in ref and value', () => {
      ownKeysOfObjectLike(aStateBefore)
        .filter((key) => key !== 'muggyObjectArray')
        .forEach((key) => {
          expect(aStateAfter[key]).toBe(aStateBefore[key]);
          expect(aStateAfter[key]).toStrictEqual(aStateBefore[key]);
        });
    });

    test('[verify] the muggy object array field_s index-1 item equal the mug_s state in ref and value before and after', () => {
      expect(aStateBefore.muggyObjectArray[1]).toBe(muggyObjectArrayItemStateBefore);
      expect(aStateBefore.muggyObjectArray[1]).toStrictEqual(muggyObjectArrayItemStateBefore);
      expect(aStateAfter.muggyObjectArray[1]).toBe(muggyObjectArrayItemStateAfter);
      expect(aStateAfter.muggyObjectArray[1]).toStrictEqual(muggyObjectArrayItemStateAfter);
    });

    test('[verify] the muggy object array field_s rest items stay unchanged in ref and value', () => {
      aStateBefore.muggyObjectArray.forEach((item, i) => {
        if (i === 1) {
          return;
        }
        expect(aStateAfter.muggyObjectArray[i]).toBe(item);
        expect(aStateAfter.muggyObjectArray[i]).toStrictEqual(item);
      });
    });
  });

  describe('f2ddb4d, writes "the muggy object array item mug_s string field" with a same value, [cite] .:35a67f9', () => {
    test('[action, verify] the parent mug-like_s state, its fields, and the muggy object array items stay unchanged in ref and value', () => {
      swirl(aMugLike, {
        muggyObjectArray: [, { s: 'cbd', o: { s: 'asd' } }],
      });
      const aStateBefore = check(aMugLike);
      expect(aStateBefore).toMatchObject({
        muggyObjectArray: [
          { s: 'asd', o: { s: 'asd' } },
          { s: 'cbd', o: { s: 'asd' } },
        ],
      });
      const muggyObjectArrayItemState = check(muggyObjectArrayItemMug);
      expect(muggyObjectArrayItemState).toMatchObject({ s: 'cbd', o: { s: 'asd' } });

      swirl(muggyObjectArrayItemMug, { s: 'cbd' });
      const aStateAfter = check(aMugLike);

      expect(aStateAfter).toBe(aStateBefore);
      ownKeysOfObjectLike(aStateBefore).forEach((key) => {
        expect(aStateAfter[key]).toBe(aStateBefore[key]);
      });
      aStateBefore.muggyObjectArray.forEach((item, i) => {
        expect(aStateAfter.muggyObjectArray[i]).toBe(item);
      });
      expect(aStateAfter).toStrictEqual(aStateBefore);
    });
  });

  describe('4b22b5e, continuously reads the mug-like after write, [cite] .:49ec8d1', () => {
    test('[action, verify] the state and its fields stay unchanged in ref and value', () => {
      const aState1 = check(aMugLike);
      const aState2 = check(aMugLike);

      expect(aState2).toBe(aState1);
      ownKeysOfObjectLike(aState1).forEach((key) => {
        expect(aState2[key]).toBe(aState1[key]);
      });
      expect(aState2).toStrictEqual(aState1);
    });
  });
});

describe('d2451be, operates "a constant mug-nested array mug-like" by builtin ops, [cite] .:5b713bb', () => {
  type AState = ObjectState[];

  const objectMug: Mug<ObjectState> = {
    [construction]: {
      s: 'asd',
      o: {
        s: 'asd',
      },
    },
  };

  const aMugLike: MugLike<AState, (Mug<ObjectState> | EmptyItem)[]> = [
    {
      s: 'asd',
      o: {
        s: 'asd',
      },
    },
    objectMug,
  ];

  describe('b1341cb, reads the mug-like before write', () => {
    let aState: AState;

    test('[action]', () => {
      aState = check(aMugLike);
    });

    test('[verify] the state differs from the mug-like in ref', () => {
      expect(aState).not.toBe(aMugLike);
    });

    test('[verify] the state equals the mug-like in evaluated value', () => {
      expect(aState).toStrictEqual([
        { s: 'asd', o: { s: 'asd' } },
        { s: 'asd', o: { s: 'asd' } },
      ]);
    });

    test('[verify] the object index-0 item equals the mug-like_s object item in ref and value', () => {
      expect(aState[0]).toBe(aMugLike[0]);
      expect(aState[0]).toStrictEqual(aMugLike[0]);
    });

    test('[verify] the muggy object index-1 item equals the object mug_s construction in ref and value', () => {
      expect(aState[1]).toBe(objectMug[construction]);
      expect(aState[1]).toStrictEqual(objectMug[construction]);
    });
  });

  describe('6d47edb, first writes with a sparse bigger-length array of a full-fledged object index-1 item that has a different string field value', () => {
    let aStateBefore: AState, aStateAfter: AState;
    let objectStateBefore: ObjectState, objectStateAfter: ObjectState;

    test('[action]', () => {
      aStateBefore = check(aMugLike);
      objectStateBefore = check(objectMug);

      swirl(aMugLike, [, { s: 'bac', o: { s: 'asd' } }, ,]);

      aStateAfter = check(aMugLike);
      objectStateAfter = check(objectMug);
    });

    test('[verify] the state changes in ref but not in length', () => {
      expect(aStateAfter).not.toBe(aStateBefore);
      expect(aStateAfter).toHaveLength(aStateBefore.length);
    });

    test('[verify] the rest items stay unchanged in ref and value', () => {
      aStateBefore.forEach((item, i) => {
        if (i === 1) {
          return;
        }
        expect(aStateAfter[i]).toBe(item);
        expect(aStateAfter[i]).toStrictEqual(item);
      });
    });

    test('[verify] the object mug_s state equals the index-1 item in ref and value before and after', () => {
      expect(objectStateBefore).toBe(aStateBefore[1]);
      expect(objectStateBefore).toStrictEqual(aStateBefore[1]);
      expect(objectStateAfter).toBe(aStateAfter[1]);
      expect(objectStateAfter).toStrictEqual(aStateAfter[1]);
    });
  });
});

describe('00f8db6, operates "a constant mug-nested tuple mug-like" by builtin ops, [cite] .:6d47edb', () => {
  type AState = [ObjectState, ObjectState];

  const objectMug: Mug<ObjectState> = {
    [construction]: {
      s: 'asd',
      o: {
        s: 'asd',
      },
    },
  };

  const aMugLike: MugLike<AState, [EmptyItem, Mug<ObjectState>]> = tuple(
    {
      s: 'asd',
      o: {
        s: 'asd',
      },
    },
    objectMug,
  );

  describe('6d47edb, first writes with a sparse tuple of a partial object index-1 item that has a different string field value', () => {
    let aStateBefore: AState, aStateAfter: AState;
    let objectStateBefore: ObjectState, objectStateAfter: ObjectState;

    test('[action]', () => {
      aStateBefore = check(aMugLike);
      objectStateBefore = check(objectMug);

      swirl(aMugLike, [, { s: 'bac' }]);

      aStateAfter = check(aMugLike);
      objectStateAfter = check(objectMug);
    });

    test('[verify] the state changes in ref', () => {
      expect(aStateAfter).not.toBe(aStateBefore);
    });

    test('[verify] the rest items stay unchanged in ref and value', () => {
      aStateBefore.forEach((item, i) => {
        if (i === 1) {
          return;
        }
        expect(aStateAfter[i]).toBe(item);
        expect(aStateAfter[i]).toStrictEqual(item);
      });
    });

    test('[verify] the object mug_s state equals the index-1 item in ref and value before and after', () => {
      expect(objectStateBefore).toBe(aStateBefore[1]);
      expect(objectStateBefore).toStrictEqual(aStateBefore[1]);
      expect(objectStateAfter).toBe(aStateAfter[1]);
      expect(objectStateAfter).toStrictEqual(aStateAfter[1]);
    });
  });
});

describe('ec28331, operates "temporary mug-nested mug-likes" by builtin ops, [cite] .:5b713bb, .:00f8db6', () => {
  const objectMug1: Mug<ObjectState> = {
    [construction]: {
      s: 'asd',
      o: {
        s: 'asd',
      },
    },
  };

  const objectMug2: Mug<ObjectState> = {
    [construction]: {
      s: 'asd',
      o: {
        s: 'asd',
      },
    },
  };

  describe('07d7675, reads a temporary object mug-like before write', () => {
    test('[action, verify] the muggy object fields equal the object mugs_ constructions in ref and value', () => {
      const aState = check({
        o1: objectMug1,
        o2: objectMug2,
      });

      expect(aState.o1).toBe(objectMug1[construction]);
      expect(aState.o1).toStrictEqual(objectMug1[construction]);
      expect(aState.o2).toBe(objectMug2[construction]);
      expect(aState.o2).toStrictEqual(objectMug2[construction]);
    });
  });

  describe('5518c70, reads a temporary tuple mug-like before write', () => {
    test('[action, verify] the muggy items equal the object mugs_ constructions in ref and value', () => {
      const aState = check([objectMug1, objectMug2]);

      expect(aState[0]).toBe(objectMug1[construction]);
      expect(aState[0]).toStrictEqual(objectMug1[construction]);
      expect(aState[1]).toBe(objectMug2[construction]);
      expect(aState[1]).toStrictEqual(objectMug2[construction]);
    });
  });

  describe('f3a611c, continuously reads same-structure temporary object mug-likes before write', () => {
    let aState1: {
        o1: ObjectState;
        o2: ObjectState;
      },
      aState2: {
        o1: ObjectState;
        o2: ObjectState;
      };

    test('[action]', () => {
      aState1 = check({
        o1: objectMug1,
        o2: objectMug2,
      });
      aState2 = check({
        o1: objectMug1,
        o2: objectMug2,
      });
    });

    test('[verify] the state changes in ref but not in value', () => {
      expect(aState2).not.toBe(aState1);
      expect(aState2).toStrictEqual(aState1);
    });

    test('[verify] the muggy fields stay unchanged in ref and value', () => {
      ownKeysOfObjectLike(aState1).forEach((key) => {
        expect(aState2[key]).toBe(aState1[key]);
        expect(aState2[key]).toStrictEqual(aState1[key]);
      });
    });
  });

  describe('07a43eb, continuously reads same-structure temporary tuple mug-likes before write', () => {
    let aState1: [ObjectState, ObjectState], aState2: [ObjectState, ObjectState];

    test('[action]', () => {
      aState1 = check(tuple(objectMug1, objectMug2));
      aState2 = check(tuple(objectMug1, objectMug2));
    });

    test('[verify] the state changes in ref but not in value', () => {
      expect(aState2).not.toBe(aState1);
      expect(aState2).toStrictEqual(aState1);
    });

    test('[verify] the muggy items stay unchanged in ref and value', () => {
      aState1.forEach((item, i) => {
        expect(aState2[i]).toBe(item);
        expect(aState2[i]).toStrictEqual(item);
      });
    });
  });

  describe('3e3c46b, continuously reads a temporary object mug-likes and a temporary tuple mug-like before write', () => {
    test('[action, verify] the muggy items equal the muggy fields in ref and value before and after', () => {
      const aState1 = check({
        o1: objectMug1,
        o2: objectMug2,
      });
      const aState2 = check(tuple(objectMug1, objectMug2));

      expect(aState2[0]).toBe(aState1.o1);
      expect(aState2[1]).toBe(aState1.o2);
    });
  });

  describe('5c83fac, writes a temporary object mug-like_s first muggy object field_s string field with a different value and reads a same-structure temporary mug-like', () => {
    let aStateBefore: {
        o1: ObjectState;
        o2: ObjectState;
      },
      aStateAfter: {
        o1: ObjectState;
        o2: ObjectState;
      };
    let objectStateBefore: ObjectState, objectStateAfter: ObjectState;

    test('[action]', () => {
      swirl(objectMug1, { s: 'd6d' });
      aStateBefore = check({
        o1: objectMug1,
        o2: objectMug2,
      });
      objectStateBefore = check(objectMug1);

      swirl(
        {
          o1: objectMug1,
          o2: objectMug2,
        },
        {
          o1: { s: '6a4' },
        },
      );

      aStateAfter = check({
        o1: objectMug1,
        o2: objectMug2,
      });
      objectStateAfter = check(objectMug1);
    });

    test('[verify] that muggy object field changes in ref and value', () => {
      expect(aStateAfter.o1).not.toBe(aStateBefore.o1);
      expect(aStateAfter.o1).toStrictEqual({ s: '6a4', o: { s: 'asd' } });
    });

    test('[verify] that muggy object field_s rest fields stay unchanged in ref and value', () => {
      ownKeysOfObjectLike(aStateBefore.o1)
        .filter((key) => key !== 's')
        .forEach((key) => {
          expect(aStateAfter.o1[key]).toBe(aStateBefore.o1[key]);
          expect(aStateAfter.o1[key]).toStrictEqual(aStateBefore.o1[key]);
        });
    });

    test('[verify] that counterpart mug_s state equals that muggy object field in ref and value before and after', () => {
      expect(objectStateBefore).toBe(aStateBefore.o1);
      expect(objectStateBefore).toStrictEqual(aStateBefore.o1);
      expect(objectStateAfter).toBe(aStateAfter.o1);
      expect(objectStateAfter).toStrictEqual(aStateAfter.o1);
    });

    test('[verify] the rest muggy object fields stay unchanged in ref and value', () => {
      ownKeysOfObjectLike(aStateBefore)
        .filter((key) => key !== 'o1')
        .forEach((key) => {
          expect(aStateAfter[key]).toBe(aStateBefore[key]);
          expect(aStateAfter[key]).toStrictEqual(aStateBefore[key]);
        });
    });
  });

  describe('706f544, writes a temporary tuple mug-like with a sparse tuple of a partial object index-0 item that has a different string field value and reads a same-structure temporary mug-like', () => {
    let aStateBefore: [ObjectState, ObjectState], aStateAfter: [ObjectState, ObjectState];
    let objectStateBefore: ObjectState, objectStateAfter: ObjectState;

    test('[action]', () => {
      swirl(objectMug1, { s: 'e64' });
      aStateBefore = check([objectMug1, objectMug2]);
      objectStateBefore = check(objectMug1);

      swirl(tuple(objectMug1, objectMug2), [{ s: '857' }, ,]);

      aStateAfter = check(tuple(objectMug1, objectMug2));
      objectStateAfter = check(objectMug1);
    });

    test('[verify] that item changes in ref and value', () => {
      expect(aStateAfter[0]).not.toBe(aStateBefore[0]);
      expect(aStateAfter[0]).toStrictEqual({ s: '857', o: { s: 'asd' } });
    });

    test('[verify] that item_s rest fields stay unchanged in ref and value', () => {
      ownKeysOfObjectLike(aStateBefore[0])
        .filter((key) => key !== 's')
        .forEach((key) => {
          expect(aStateAfter[0][key]).toBe(aStateBefore[0][key]);
          expect(aStateAfter[0][key]).toStrictEqual(aStateBefore[0][key]);
        });
    });

    test('[verify] that counterpart mug_s state equals that item in ref and value before and after', () => {
      expect(objectStateBefore).toBe(aStateBefore[0]);
      expect(objectStateBefore).toStrictEqual(aStateBefore[0]);
      expect(objectStateAfter).toBe(aStateAfter[0]);
      expect(objectStateAfter).toStrictEqual(aStateAfter[0]);
    });

    test('[verify] the rest muggy items stay unchanged in ref and value', () => {
      aStateBefore.forEach((item, i) => {
        if (i === 0) {
          return;
        }
        expect(aStateAfter[i]).toBe(item);
        expect(aStateAfter[i]).toStrictEqual(item);
      });
    });
  });

  describe('234c96a, continuously reads same-structure temporary object mug-likes after write, [cite] .:f3a611c', () => {
    let aState1: {
        o1: ObjectState;
        o2: ObjectState;
      },
      aState2: {
        o1: ObjectState;
        o2: ObjectState;
      };

    test('[action]', () => {
      aState1 = check({
        o1: objectMug1,
        o2: objectMug2,
      });
      aState2 = check({
        o1: objectMug1,
        o2: objectMug2,
      });
    });

    test('[verify] the state changes in ref but not in value', () => {
      expect(aState2).not.toBe(aState1);
      expect(aState2).toStrictEqual(aState1);
    });

    test('[verify] the muggy fields stay unchanged in ref and value', () => {
      ownKeysOfObjectLike(aState1).forEach((key) => {
        expect(aState2[key]).toBe(aState1[key]);
        expect(aState2[key]).toStrictEqual(aState1[key]);
      });
    });
  });

  describe('fb9a2da, continuously reads same-structure temporary tuple mug-likes after write, [cite] .:07a43eb', () => {
    let aState1: [ObjectState, ObjectState], aState2: [ObjectState, ObjectState];

    test('[action]', () => {
      aState1 = check(tuple(objectMug1, objectMug2));
      aState2 = check(tuple(objectMug1, objectMug2));
    });

    test('[verify] the state changes in ref but not in value', () => {
      expect(aState2).not.toBe(aState1);
      expect(aState2).toStrictEqual(aState1);
    });

    test('[verify] the muggy items stay unchanged in ref and value', () => {
      aState1.forEach((item, i) => {
        expect(aState2[i]).toBe(item);
        expect(aState2[i]).toStrictEqual(item);
      });
    });
  });

  describe('31b2508, continuously reads a temporary object mug-likes and a temporary tuple mug-like after write, [cite] .:3e3c46b', () => {
    test('[action, verify] the muggy items equal the muggy fields in ref and value before and after', () => {
      const aState1 = check({
        o1: objectMug1,
        o2: objectMug2,
      });
      const aState2 = check([objectMug1, objectMug2]);

      expect(aState2[0]).toBe(aState1.o1);
      expect(aState2[1]).toBe(aState1.o2);
    });
  });
});
