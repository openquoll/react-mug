import { check, construction, Mug, MugLike, r, swirl } from '../src';
import { ownKeysOfObjectLike } from '../src/mug';

describe('dd10061, operates by an object state custom read op', () => {
  interface ObjectState {
    s: string;
    o: {
      s: string;
    };
  }

  interface AState extends ObjectState {
    potentialMuggyObject: ObjectState;
  }

  describe('a9760b1, the op accepts a constant extra and generates a new return', () => {
    const customReadFn = jest.fn(
      (aState: AState, extra: Pick<ObjectState, 'o'>): Pick<ObjectState, 'o'> => {
        return {
          o: {
            s: `${extra.o.s}:${aState.potentialMuggyObject.o.s}`,
          },
        };
      },
    );

    const customReadOp = r(customReadFn);

    const extra: Pick<ObjectState, 'o'> = {
      o: {
        s: 'asd',
      },
    };

    let checkedAState: any;
    let checkedObjectState: any;
    let fnParamState1: any, fnParamState2: any;
    let fnParamExtra1: any, fnParamExtra2: any;
    let fnReturn1: any, fnReturn2: any;
    let finalReturn1: any, finalReturn2: any;

    /**
     * Required variables:
     * - checkedAState
     * - opParamState1, opParamState2
     * - opParamExtra1, opParamExtra2
     * - opReturn1, opReturn2,
     * - finalReturn1, finalReturn2
     */
    function sharedVerifyCases() {
      test('[verify] the first fn-param state and its fields equal the checked state and its fields in ref and value', () => {
        expect(fnParamState1).toBe(checkedAState);
        ownKeysOfObjectLike(checkedAState).forEach((key) => {
          expect(fnParamState1[key]).toBe(checkedAState[key]);
        });
        expect(fnParamState1).toStrictEqual(checkedAState);
      });

      test('[verify] the fn-param state and its fields stay unchanged in ref and value', () => {
        expect(fnParamState2).toBe(fnParamState1);
        ownKeysOfObjectLike(fnParamState1).forEach((key) => {
          expect(fnParamState2[key]).toBe(fnParamState1[key]);
        });
        expect(fnParamState2).toStrictEqual(fnParamState1);
      });

      test('[verify] the first fn-param extra and its fields equal the input extra and its fields in ref and value', () => {
        expect(fnParamExtra1).toBe(extra);
        ownKeysOfObjectLike(extra).forEach((key) => {
          expect(fnParamExtra1[key]).toBe(extra[key]);
        });
        expect(fnParamExtra1).toStrictEqual(extra);
      });

      test('[verify] the fn-param extra and its fields stay unchanged in ref and value', () => {
        expect(fnParamExtra2).toBe(fnParamExtra1);
        ownKeysOfObjectLike(fnParamExtra1).forEach((key) => {
          expect(fnParamExtra2[key]).toBe(fnParamExtra1[key]);
        });
        expect(fnParamExtra2).toStrictEqual(fnParamExtra1);
      });

      test('[verify] the final return and its fields keep equal to the fn return and its fields in ref and value', () => {
        expect(finalReturn1).toBe(fnReturn1);
        ownKeysOfObjectLike(fnReturn1).forEach((key) => {
          expect(finalReturn1[key]).toBe(fnReturn1[key]);
        });
        expect(finalReturn1).toStrictEqual(fnReturn1);

        expect(finalReturn2).toBe(fnReturn2);
        ownKeysOfObjectLike(fnReturn2).forEach((key) => {
          expect(finalReturn2[key]).toBe(fnReturn2[key]);
        });
        expect(finalReturn2).toStrictEqual(fnReturn2);
      });

      test('[verify] the final return and its fields change in ref but not in value', () => {
        expect(finalReturn2).not.toBe(finalReturn1);
        ownKeysOfObjectLike(finalReturn1).forEach((key) => {
          expect(finalReturn2[key]).not.toBe(finalReturn1[key]);
        });
        expect(finalReturn2).toStrictEqual(finalReturn1);
      });
    }

    describe('efdaecb, continuously reads a constant plain object state', () => {
      const aState: AState = {
        s: 'asd',
        o: {
          s: 'asd',
        },
        potentialMuggyObject: {
          s: 'asd',
          o: {
            s: 'asd',
          },
        },
      };

      test('[action]', () => {
        checkedAState = check(aState);

        finalReturn1 = customReadOp(aState, extra);
        fnParamState1 = customReadFn.mock.calls[0][0];
        fnParamExtra1 = customReadFn.mock.calls[0][1];
        fnReturn1 = customReadFn.mock.results[0].value;

        finalReturn2 = customReadOp(aState, extra);
        fnParamState2 = customReadFn.mock.calls[1][0];
        fnParamExtra2 = customReadFn.mock.calls[1][1];
        fnReturn2 = customReadFn.mock.results[1].value;
      });

      test('[verify] the first fn-param state and its fields equal the input state and its fields in ref and value', () => {
        expect(fnParamState1).toBe(aState);
        ownKeysOfObjectLike(aState).forEach((key) => {
          expect(fnParamState1[key]).toBe(aState[key]);
        });
        expect(fnParamState1).toStrictEqual(aState);
      });

      sharedVerifyCases();
    });

    describe('c2f5436, continuously reads a plain object mug before write', () => {
      const aMug: Mug<AState> = {
        [construction]: {
          s: 'asd',
          o: {
            s: 'asd',
          },
          potentialMuggyObject: {
            s: 'asd',
            o: {
              s: 'asd',
            },
          },
        },
      };

      test('[action]', () => {
        checkedAState = check(aMug);

        finalReturn1 = customReadOp(aMug, extra);
        fnParamState1 = customReadFn.mock.calls[0][0];
        fnParamExtra1 = customReadFn.mock.calls[0][1];
        fnReturn1 = customReadFn.mock.results[0].value;

        finalReturn2 = customReadOp(aMug, extra);
        fnParamState2 = customReadFn.mock.calls[1][0];
        fnParamExtra2 = customReadFn.mock.calls[1][1];
        fnReturn2 = customReadFn.mock.results[1].value;
      });

      test('[verify] the first fn-param state and its fields equal the mug_s construction and its fields in ref and value', () => {
        expect(fnParamState1).toBe(aMug[construction]);
        ownKeysOfObjectLike(aMug[construction]).forEach((key) => {
          expect(fnParamState1[key]).toBe(aMug[construction][key]);
        });
        expect(fnParamState1).toStrictEqual(aMug[construction]);
      });

      sharedVerifyCases();
    });

    describe('888be13, continuously reads a plain object mug after write', () => {
      const aMug: Mug<AState> = {
        [construction]: {
          s: 'asd',
          o: {
            s: 'asd',
          },
          potentialMuggyObject: {
            s: 'asd',
            o: {
              s: 'asd',
            },
          },
        },
      };

      test('[action]', () => {
        swirl(aMug, {
          potentialMuggyObject: { s: 'sdf' },
        });
        checkedAState = check(aMug);
        expect(checkedAState).toMatchObject({
          potentialMuggyObject: { s: 'sdf' },
        });

        finalReturn1 = customReadOp(aMug, extra);
        fnParamState1 = customReadFn.mock.calls[0][0];
        fnParamExtra1 = customReadFn.mock.calls[0][1];
        fnReturn1 = customReadFn.mock.results[0].value;

        finalReturn2 = customReadOp(aMug, extra);
        fnParamState2 = customReadFn.mock.calls[1][0];
        fnParamExtra2 = customReadFn.mock.calls[1][1];
        fnReturn2 = customReadFn.mock.results[1].value;
      });

      sharedVerifyCases();
    });

    describe('6e9b3ce, continuously reads a constant mug-nested object mug-like before write', () => {
      const objectMug: Mug<ObjectState> = {
        [construction]: {
          s: 'asd',
          o: {
            s: 'asd',
          },
        },
      };

      const aMugLike: MugLike<AState, { potentialMuggyObject: Mug<ObjectState> }> = {
        s: 'asd',
        o: {
          s: 'asd',
        },
        potentialMuggyObject: objectMug,
      };

      test('[action]', () => {
        checkedAState = check(aMugLike);
        checkedObjectState = check(objectMug);

        finalReturn1 = customReadOp(aMugLike, extra);
        fnParamState1 = customReadFn.mock.calls[0][0];
        fnParamExtra1 = customReadFn.mock.calls[0][1];
        fnReturn1 = customReadFn.mock.results[0].value;

        finalReturn2 = customReadOp(aMugLike, extra);
        fnParamState2 = customReadFn.mock.calls[1][0];
        fnParamExtra2 = customReadFn.mock.calls[1][1];
        fnReturn2 = customReadFn.mock.results[1].value;
      });

      test('[verify] the first fn-param state differs from the mug-like in ref', () => {
        expect(fnParamState1).not.toBe(aMugLike);
      });

      test('[verify] the first fn-param state_s muggy object field and its child fields equal the object mug_s construction and its fields in ref and value', () => {
        expect(fnParamState1.potentialMuggyObject).toBe(objectMug[construction]);
        ownKeysOfObjectLike(objectMug[construction]).forEach((key) => {
          expect(fnParamState1.potentialMuggyObject[key]).toBe(objectMug[construction][key]);
        });
        expect(fnParamState1.potentialMuggyObject).toStrictEqual(objectMug[construction]);
      });

      test('[verify] the first fn-param state_s muggy object field and its child fields equal the checked object state and its fields in ref and value', () => {
        expect(fnParamState1.potentialMuggyObject).toBe(checkedObjectState);
        ownKeysOfObjectLike(objectMug[construction]).forEach((key) => {
          expect(fnParamState1.potentialMuggyObject[key]).toBe(checkedObjectState[key]);
        });
        expect(fnParamState1.potentialMuggyObject).toStrictEqual(checkedObjectState);
      });

      test('[verify] the first fn-param state_s non-muggy fields equal the mug-like_s non-muggy fields in ref and value', () => {
        ownKeysOfObjectLike(aMugLike)
          .filter((key: any) => key !== 'potentialMuggyObject')
          .forEach((key) => {
            expect(fnParamState1[key]).toBe(aMugLike[key]);
            expect(fnParamState1[key]).toStrictEqual(aMugLike[key]);
          });
      });

      sharedVerifyCases();
    });

    describe('25cfa11, continuously reads a constant mug-nested object mug-like after write', () => {
      const objectMug: Mug<ObjectState> = {
        [construction]: {
          s: 'asd',
          o: {
            s: 'asd',
          },
        },
      };

      const aMugLike: MugLike<AState, { potentialMuggyObject: Mug<ObjectState> }> = {
        s: 'asd',
        o: {
          s: 'asd',
        },
        potentialMuggyObject: objectMug,
      };

      test('[action]', () => {
        swirl(aMugLike, {
          potentialMuggyObject: { s: 'sdf' },
        });
        checkedAState = check(aMugLike);
        expect(checkedAState).toMatchObject({
          potentialMuggyObject: { s: 'sdf' },
        });
        checkedObjectState = check(objectMug);
        expect(checkedObjectState).toMatchObject({ s: 'sdf' });

        finalReturn1 = customReadOp(aMugLike, extra);
        fnParamState1 = customReadFn.mock.calls[0][0];
        fnParamExtra1 = customReadFn.mock.calls[0][1];
        fnReturn1 = customReadFn.mock.results[0].value;

        finalReturn2 = customReadOp(aMugLike, extra);
        fnParamState2 = customReadFn.mock.calls[1][0];
        fnParamExtra2 = customReadFn.mock.calls[1][1];
        fnReturn2 = customReadFn.mock.results[1].value;
      });

      test('[verify] the first fn-param state_s muggy object field and its child fields equal the checked object state and its fields in ref and value', () => {
        expect(fnParamState1.potentialMuggyObject).toBe(checkedObjectState);
        ownKeysOfObjectLike(checkedObjectState).forEach((key) => {
          expect(fnParamState1.potentialMuggyObject[key]).toBe(checkedObjectState[key]);
        });
        expect(fnParamState1.potentialMuggyObject).toStrictEqual(checkedObjectState);
      });

      test('[verify] the first fn-param state_s non-muggy fields equal the mug-like_s non-muggy fields in ref and value', () => {
        ownKeysOfObjectLike(aMugLike)
          .filter((key: any) => key !== 'potentialMuggyObject')
          .forEach((key) => {
            expect(fnParamState1[key]).toBe(aMugLike[key]);
            expect(fnParamState1[key]).toStrictEqual(aMugLike[key]);
          });
      });

      sharedVerifyCases();
    });
  });

  describe('dec9c67, the op only selects an existing field, [cite] .:a9760b1', () => {
    const customReadFn = jest.fn((state: AState): ObjectState => {
      return state.potentialMuggyObject;
    });

    const customReadOp = r(customReadFn);

    describe('0ae4ce0, continuously reads a constant mug-nested object mug-like after write', () => {
      const objectMug: Mug<ObjectState> = {
        [construction]: {
          s: 'asd',
          o: {
            s: 'asd',
          },
        },
      };

      const aMugLike: MugLike<AState, { potentialMuggyObject: Mug<ObjectState> }> = {
        s: 'asd',
        o: {
          s: 'asd',
        },
        potentialMuggyObject: objectMug,
      };

      test('[action, verify] the final return and its fields stay unchanged in ref and value', () => {
        swirl(aMugLike, {
          potentialMuggyObject: { s: 'sdf' },
        });
        const checkedAState = check(aMugLike);
        expect(checkedAState).toMatchObject({
          potentialMuggyObject: { s: 'sdf' },
        });
        const checkedObjectState = check(objectMug);
        expect(checkedObjectState).toMatchObject({ s: 'sdf' });

        const finalReturn1 = customReadOp(aMugLike);

        const finalReturn2 = customReadOp(aMugLike);

        expect(finalReturn2).toBe(finalReturn1);
        ownKeysOfObjectLike(finalReturn1).forEach((key) => {
          expect(finalReturn2[key]).toBe(finalReturn1[key]);
        });
        expect(finalReturn2).toStrictEqual(finalReturn1);
      });
    });
  });
});
