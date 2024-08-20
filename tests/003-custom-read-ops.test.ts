import { check, r, swirl } from '../src';
import { construction, Mug, ownKeysOfObjectLike, PossibleMugLike } from '../src/mug';

describe('dd10061, operates by a plain object state custom read op', () => {
  interface ObjectState {
    s: string;
    o: {
      s: string;
    };
  }

  interface AState extends ObjectState {
    potentialMuggyObject: ObjectState;
  }

  describe('a9760b1, the op generates a new return on each call', () => {
    const customReadFn = jest.fn(
      (state: AState, extra: Pick<ObjectState, 'o'>): Pick<ObjectState, 'o'> => {
        return {
          o: {
            s: `${extra.o.s}:${state.potentialMuggyObject.o.s}`,
          },
        };
      },
    );

    const customReadOp = r(customReadFn);

    describe('efdaecb, continuously reads a plain object state with a constant extra', () => {
      const aState = {
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

      const extra: Pick<ObjectState, 'o'> = {
        o: {
          s: 'asd',
        },
      };

      let opParamState1: any, opParamState2: any;
      let opParamExtra1: any, opParamExtra2: any;
      let opReturn1: any, opReturn2: any;
      let finalReturn1: any, finalReturn2: any;

      test('[action]', () => {
        customReadFn.mockClear();
        finalReturn1 = customReadOp(aState, extra);
        opParamState1 = customReadFn.mock.calls[0][0];
        opParamExtra1 = customReadFn.mock.calls[0][1];
        opReturn1 = customReadFn.mock.results[0].value;

        customReadFn.mockClear();
        finalReturn2 = customReadOp(aState, extra);
        opParamState2 = customReadFn.mock.calls[0][0];
        opParamExtra2 = customReadFn.mock.calls[0][1];
        opReturn2 = customReadFn.mock.results[0].value;
      });

      test('[verify] the first op-param state and its fields equal the input state and its fields in ref and value', () => {
        expect(opParamState1).toBe(aState);
        ownKeysOfObjectLike(aState).forEach((key) => {
          expect(opParamState1[key]).toBe(aState[key]);
        });
        expect(opParamState1).toStrictEqual(aState);
      });

      test('[verify] the op-param state and its fields stay unchanged in ref and value', () => {
        expect(opParamState2).toBe(opParamState1);
        ownKeysOfObjectLike(opParamState1).forEach((key) => {
          expect(opParamState2[key]).toBe(opParamState1[key]);
        });
        expect(opParamState2).toStrictEqual(opParamState1);
      });

      test('[verify] the first op-param extra and its fields equal the input extra and its fields in ref and value', () => {
        expect(opParamExtra1).toBe(extra);
        ownKeysOfObjectLike(extra).forEach((key) => {
          expect(opParamExtra1[key]).toBe(extra[key]);
        });
        expect(opParamExtra1).toStrictEqual(extra);
      });

      test('[verify] the op-param extra and its fields stay unchanged in ref and value', () => {
        expect(opParamExtra2).toBe(opParamExtra1);
        ownKeysOfObjectLike(opParamExtra1).forEach((key) => {
          expect(opParamExtra2[key]).toBe(opParamExtra1[key]);
        });
        expect(opParamExtra2).toStrictEqual(opParamExtra1);
      });

      test('[verify] the final return and its fields keep equal to the op return and its fields in ref and value', () => {
        expect(finalReturn1).toBe(opReturn1);
        ownKeysOfObjectLike(opReturn1).forEach((key) => {
          expect(finalReturn1[key]).toBe(opReturn1[key]);
        });
        expect(finalReturn1).toStrictEqual(opReturn1);

        expect(finalReturn2).toBe(opReturn2);
        ownKeysOfObjectLike(opReturn2).forEach((key) => {
          expect(finalReturn2[key]).toBe(opReturn2[key]);
        });
        expect(finalReturn2).toStrictEqual(opReturn2);
      });

      test('[verify] the final return and its fields change in ref but not in value', () => {
        expect(finalReturn2).not.toBe(finalReturn1);
        ownKeysOfObjectLike(finalReturn1).forEach((key) => {
          expect(finalReturn2[key]).not.toBe(finalReturn1[key]);
        });
        expect(finalReturn2).toStrictEqual(finalReturn1);
      });
    });

    describe('c2f5436, continuously reads a plain object mug with a constant extra before write, [cite] .:efdaecb', () => {
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

      const extra: Pick<ObjectState, 'o'> = {
        o: {
          s: 'asd',
        },
      };

      let opParamState1: any, opParamState2: any;
      let opParamExtra1: any, opParamExtra2: any;
      let opReturn1: any, opReturn2: any;
      let finalReturn1: any, finalReturn2: any;

      test('[action]', () => {
        customReadFn.mockClear();
        finalReturn1 = customReadOp(aMug, extra);
        opParamState1 = customReadFn.mock.calls[0][0];
        opParamExtra1 = customReadFn.mock.calls[0][1];
        opReturn1 = customReadFn.mock.results[0].value;

        customReadFn.mockClear();
        finalReturn2 = customReadOp(aMug, extra);
        opParamState2 = customReadFn.mock.calls[0][0];
        opParamExtra2 = customReadFn.mock.calls[0][1];
        opReturn2 = customReadFn.mock.results[0].value;
      });

      test('[verify] the first op-param state and its fields equal the mug_s construction and its fields in ref and value', () => {
        expect(opParamState1).toBe(aMug[construction]);
        ownKeysOfObjectLike(aMug[construction]).forEach((key) => {
          expect(opParamState1[key]).toBe(aMug[construction][key]);
        });
        expect(opParamState1).toStrictEqual(aMug[construction]);
      });

      test('[verify] the op-param state and its fields stay unchanged in ref and value', () => {
        expect(opParamState2).toBe(opParamState1);
        ownKeysOfObjectLike(opParamState1).forEach((key) => {
          expect(opParamState2[key]).toBe(opParamState1[key]);
        });
        expect(opParamState2).toStrictEqual(opParamState1);
      });

      test('[verify] the first op-param extra and its fields equal the input extra and its fields in ref and value', () => {
        expect(opParamExtra1).toBe(extra);
        ownKeysOfObjectLike(extra).forEach((key) => {
          expect(opParamExtra1[key]).toBe(extra[key]);
        });
        expect(opParamExtra1).toStrictEqual(extra);
      });

      test('[verify] the op-param extra and its fields stay unchanged in ref and value', () => {
        expect(opParamExtra2).toBe(opParamExtra1);
        ownKeysOfObjectLike(opParamExtra1).forEach((key) => {
          expect(opParamExtra2[key]).toBe(opParamExtra1[key]);
        });
        expect(opParamExtra2).toStrictEqual(opParamExtra1);
      });

      test('[verify] the final return and its fields keep equal to the op return and its fields in ref and value', () => {
        expect(finalReturn1).toBe(opReturn1);
        ownKeysOfObjectLike(opReturn1).forEach((key) => {
          expect(finalReturn1[key]).toBe(opReturn1[key]);
        });
        expect(finalReturn1).toStrictEqual(opReturn1);

        expect(finalReturn2).toBe(opReturn2);
        ownKeysOfObjectLike(opReturn2).forEach((key) => {
          expect(finalReturn2[key]).toBe(opReturn2[key]);
        });
        expect(finalReturn2).toStrictEqual(opReturn2);
      });

      test('[verify] the final return and its fields change in ref but not in value', () => {
        expect(finalReturn2).not.toBe(finalReturn1);
        ownKeysOfObjectLike(finalReturn1).forEach((key) => {
          expect(finalReturn2[key]).not.toBe(finalReturn1[key]);
        });
        expect(finalReturn2).toStrictEqual(finalReturn1);
      });
    });

    describe('888be13, continuously reads a plain object mug with a constant extra after write, [cite] .:c2f5436', () => {
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

      const extra: Pick<ObjectState, 'o'> = {
        o: {
          s: 'asd',
        },
      };

      let checkedState: any;
      let opParamState1: any, opParamState2: any;
      let opParamExtra1: any, opParamExtra2: any;
      let opReturn1: any, opReturn2: any;
      let finalReturn1: any, finalReturn2: any;

      test('[action]', () => {
        swirl(aMug, {
          potentialMuggyObject: { s: 'sdf' },
        });
        checkedState = check(aMug);
        expect(checkedState).toMatchObject({
          potentialMuggyObject: { s: 'sdf' },
        });

        customReadFn.mockClear();
        finalReturn1 = customReadOp(aMug, extra);
        opParamState1 = customReadFn.mock.calls[0][0];
        opParamExtra1 = customReadFn.mock.calls[0][1];
        opReturn1 = customReadFn.mock.results[0].value;

        customReadFn.mockClear();
        finalReturn2 = customReadOp(aMug, extra);
        opParamState2 = customReadFn.mock.calls[0][0];
        opParamExtra2 = customReadFn.mock.calls[0][1];
        opReturn2 = customReadFn.mock.results[0].value;
      });

      test('[verify] the first op-param state and its fields equal the checked state and its fields in ref and value', () => {
        expect(opParamState1).toBe(checkedState);
        ownKeysOfObjectLike(checkedState).forEach((key) => {
          expect(opParamState1[key]).toBe(checkedState[key]);
        });
        expect(opParamState1).toStrictEqual(checkedState);
      });

      test('[verify] the op-param state and its fields stay unchanged in ref and value', () => {
        expect(opParamState2).toBe(opParamState1);
        ownKeysOfObjectLike(opParamState1).forEach((key) => {
          expect(opParamState2[key]).toBe(opParamState1[key]);
        });
        expect(opParamState2).toStrictEqual(opParamState1);
      });

      test('[verify] the first op-param extra and its fields equal the input extra and its fields in ref and value', () => {
        expect(opParamExtra1).toBe(extra);
        ownKeysOfObjectLike(extra).forEach((key) => {
          expect(opParamExtra1[key]).toBe(extra[key]);
        });
        expect(opParamExtra1).toStrictEqual(extra);
      });

      test('[verify] the op-param extra and its fields stay unchanged in ref and value', () => {
        expect(opParamExtra2).toBe(opParamExtra1);
        ownKeysOfObjectLike(opParamExtra1).forEach((key) => {
          expect(opParamExtra2[key]).toBe(opParamExtra1[key]);
        });
        expect(opParamExtra2).toStrictEqual(opParamExtra1);
      });

      test('[verify] the final return and its fields keep equal to the op return and its fields in ref and value', () => {
        expect(finalReturn1).toBe(opReturn1);
        ownKeysOfObjectLike(opReturn1).forEach((key) => {
          expect(finalReturn1[key]).toBe(opReturn1[key]);
        });
        expect(finalReturn1).toStrictEqual(opReturn1);

        expect(finalReturn2).toBe(opReturn2);
        ownKeysOfObjectLike(opReturn2).forEach((key) => {
          expect(finalReturn2[key]).toBe(opReturn2[key]);
        });
        expect(finalReturn2).toStrictEqual(opReturn2);
      });

      test('[verify] the final return and its fields change in ref but not in value', () => {
        expect(finalReturn2).not.toBe(finalReturn1);
        ownKeysOfObjectLike(finalReturn1).forEach((key) => {
          expect(finalReturn2[key]).not.toBe(finalReturn1[key]);
        });
        expect(finalReturn2).toStrictEqual(finalReturn1);
      });
    });

    describe('6e9b3ce, continuously reads a mug-nested plain object mug-like with a constant extra before write, [cite] .:efdaecb', () => {
      const objectMug: Mug<ObjectState> = {
        [construction]: {
          s: 'asd',
          o: {
            s: 'asd',
          },
        },
      };

      const aMugLike: PossibleMugLike<AState> = {
        s: 'asd',
        o: {
          s: 'asd',
        },
        potentialMuggyObject: objectMug,
      };

      const extra: Pick<ObjectState, 'o'> = {
        o: {
          s: 'asd',
        },
      };

      let opParamState1: any, opParamState2: any;
      let opParamExtra1: any, opParamExtra2: any;
      let opReturn1: any, opReturn2: any;
      let finalReturn1: any, finalReturn2: any;

      test('[action]', () => {
        customReadFn.mockClear();
        finalReturn1 = customReadOp(aMugLike, extra);
        opParamState1 = customReadFn.mock.calls[0][0];
        opParamExtra1 = customReadFn.mock.calls[0][1];
        opReturn1 = customReadFn.mock.results[0].value;

        customReadFn.mockClear();
        finalReturn2 = customReadOp(aMugLike, extra);
        opParamState2 = customReadFn.mock.calls[0][0];
        opParamExtra2 = customReadFn.mock.calls[0][1];
        opReturn2 = customReadFn.mock.results[0].value;
      });

      test('[verify] the first op-param state doesn_t equal the mug-like in ref', () => {
        expect(opParamState1).not.toBe(aMugLike);
      });

      test('[verify] the first op-param state_s muggy object field and its child fields equal the object mug_s construction and its fields in ref and value', () => {
        expect(opParamState1.potentialMuggyObject).toBe(objectMug[construction]);
        ownKeysOfObjectLike(objectMug[construction]).forEach((key) => {
          expect(opParamState1.potentialMuggyObject[key]).toBe(objectMug[construction][key]);
        });
        expect(opParamState1.potentialMuggyObject).toStrictEqual(objectMug[construction]);
      });

      test('[verify] the first op-param state_s normal fields equal the mug-like_s normal fields in ref and value', () => {
        ownKeysOfObjectLike(aMugLike)
          .filter((key: any) => key !== 'potentialMuggyObject')
          .forEach((key) => {
            expect(opParamState1[key]).toBe(aMugLike[key]);
            expect(opParamState1[key]).toStrictEqual(aMugLike[key]);
          });
      });

      test('[verify] the op-param state and its fields stay unchanged in ref and value', () => {
        expect(opParamState2).toBe(opParamState1);
        ownKeysOfObjectLike(opParamState1).forEach((key) => {
          expect(opParamState2[key]).toBe(opParamState1[key]);
        });
        expect(opParamState2).toStrictEqual(opParamState1);
      });

      test('[verify] the first op-param extra and its fields equal the input extra and its fields in ref and value', () => {
        expect(opParamExtra1).toBe(extra);
        ownKeysOfObjectLike(extra).forEach((key) => {
          expect(opParamExtra1[key]).toBe(extra[key]);
        });
        expect(opParamExtra1).toStrictEqual(extra);
      });

      test('[verify] the op-param extra and its fields stay unchanged in ref and value', () => {
        expect(opParamExtra2).toBe(opParamExtra1);
        ownKeysOfObjectLike(opParamExtra1).forEach((key) => {
          expect(opParamExtra2[key]).toBe(opParamExtra1[key]);
        });
        expect(opParamExtra2).toStrictEqual(opParamExtra1);
      });

      test('[verify] the final return and its fields keep equal to the op return and its fields in ref and value', () => {
        expect(finalReturn1).toBe(opReturn1);
        ownKeysOfObjectLike(opReturn1).forEach((key) => {
          expect(finalReturn1[key]).toBe(opReturn1[key]);
        });
        expect(finalReturn1).toStrictEqual(opReturn1);

        expect(finalReturn2).toBe(opReturn2);
        ownKeysOfObjectLike(opReturn2).forEach((key) => {
          expect(finalReturn2[key]).toBe(opReturn2[key]);
        });
        expect(finalReturn2).toStrictEqual(opReturn2);
      });

      test('[verify] the final return and its fields change in ref but not in value', () => {
        expect(finalReturn2).not.toBe(finalReturn1);
        ownKeysOfObjectLike(finalReturn1).forEach((key) => {
          expect(finalReturn2[key]).not.toBe(finalReturn1[key]);
        });
        expect(finalReturn2).toStrictEqual(finalReturn1);
      });
    });

    describe('25cfa11, continuously reads a mug-nested plain object mug-like with an extra after write, [cite] .:6e9b3ce', () => {
      const objectMug: Mug<ObjectState> = {
        [construction]: {
          s: 'asd',
          o: {
            s: 'asd',
          },
        },
      };

      const aMugLike: PossibleMugLike<AState> = {
        s: 'asd',
        o: {
          s: 'asd',
        },
        potentialMuggyObject: objectMug,
      };

      const extra: Pick<ObjectState, 'o'> = {
        o: {
          s: 'asd',
        },
      };

      let checkedState: any;
      let checkedObjectState: any;
      let opParamState1: any, opParamState2: any;
      let opParamExtra1: any, opParamExtra2: any;
      let opReturn1: any, opReturn2: any;
      let finalReturn1: any, finalReturn2: any;

      test('[action]', () => {
        swirl(aMugLike, {
          potentialMuggyObject: { s: 'sdf' },
        });
        checkedState = check(aMugLike);
        expect(checkedState).toMatchObject({
          potentialMuggyObject: { s: 'sdf' },
        });
        checkedObjectState = check(objectMug);
        expect(checkedObjectState).toMatchObject({ s: 'sdf' });

        customReadFn.mockClear();
        finalReturn1 = customReadOp(aMugLike, extra);
        opParamState1 = customReadFn.mock.calls[0][0];
        opParamExtra1 = customReadFn.mock.calls[0][1];
        opReturn1 = customReadFn.mock.results[0].value;

        customReadFn.mockClear();
        finalReturn2 = customReadOp(aMugLike, extra);
        opParamState2 = customReadFn.mock.calls[0][0];
        opParamExtra2 = customReadFn.mock.calls[0][1];
        opReturn2 = customReadFn.mock.results[0].value;
      });

      test('[verify] the first op-param state doesn_t equal the checked state in ref', () => {
        expect(opParamState1).not.toBe(aMugLike);
      });

      test('[verify] the first op-param state_s muggy object field and its child fields equal the checked state_s counterpart field and its child fields in ref and value', () => {
        expect(opParamState1.potentialMuggyObject).toBe(checkedState.potentialMuggyObject);
        ownKeysOfObjectLike(checkedState.potentialMuggyObject).forEach((key) => {
          expect(opParamState1.potentialMuggyObject[key]).toBe(
            checkedState.potentialMuggyObject[key],
          );
        });
        expect(opParamState1.potentialMuggyObject).toStrictEqual(checkedState.potentialMuggyObject);
      });

      test('[verify] the first op-param state_s muggy object field and its child fields equal the checked object state and its fields in ref and value', () => {
        expect(opParamState1.potentialMuggyObject).toBe(checkedObjectState);
        ownKeysOfObjectLike(checkedObjectState).forEach((key) => {
          expect(opParamState1.potentialMuggyObject[key]).toBe(checkedObjectState[key]);
        });
        expect(opParamState1.potentialMuggyObject).toStrictEqual(checkedObjectState);
      });

      test('[verify] the first op-param state_s normal fields equal the mug-like_s normal fields in ref and value', () => {
        ownKeysOfObjectLike(aMugLike)
          .filter((key: any) => key !== 'potentialMuggyObject')
          .forEach((key) => {
            expect(opParamState1[key]).toBe(aMugLike[key]);
            expect(opParamState1[key]).toStrictEqual(aMugLike[key]);
          });
      });

      test('[verify] the op-param state and its fields stay unchanged in ref and value', () => {
        expect(opParamState2).toBe(opParamState1);
        ownKeysOfObjectLike(opParamState1).forEach((key) => {
          expect(opParamState2[key]).toBe(opParamState1[key]);
        });
        expect(opParamState2).toStrictEqual(opParamState1);
      });

      test('[verify] the first op-param extra and its fields equal the input extra and its fields in ref and value', () => {
        expect(opParamExtra1).toBe(extra);
        ownKeysOfObjectLike(extra).forEach((key) => {
          expect(opParamExtra1[key]).toBe(extra[key]);
        });
        expect(opParamExtra1).toStrictEqual(extra);
      });

      test('[verify] the op-param extra and its fields stay unchanged in ref and value', () => {
        expect(opParamExtra2).toBe(opParamExtra1);
        ownKeysOfObjectLike(opParamExtra1).forEach((key) => {
          expect(opParamExtra2[key]).toBe(opParamExtra1[key]);
        });
        expect(opParamExtra2).toStrictEqual(opParamExtra1);
      });

      test('[verify] the final return and its fields keep equal to the op return and its fields in ref and value', () => {
        expect(finalReturn1).toBe(opReturn1);
        ownKeysOfObjectLike(opReturn1).forEach((key) => {
          expect(finalReturn1[key]).toBe(opReturn1[key]);
        });
        expect(finalReturn1).toStrictEqual(opReturn1);

        expect(finalReturn2).toBe(opReturn2);
        ownKeysOfObjectLike(opReturn2).forEach((key) => {
          expect(finalReturn2[key]).toBe(opReturn2[key]);
        });
        expect(finalReturn2).toStrictEqual(opReturn2);
      });

      test('[verify] the final return and its fields change in ref but not in value', () => {
        expect(finalReturn2).not.toBe(finalReturn1);
        ownKeysOfObjectLike(finalReturn1).forEach((key) => {
          expect(finalReturn2[key]).not.toBe(finalReturn1[key]);
        });
        expect(finalReturn2).toStrictEqual(finalReturn1);
      });
    });
  });

  describe('dec9c67, the op selects an existing field on each call, [cite] .:a9760b1', () => {
    const customReadFn = jest.fn((state: AState): ObjectState => {
      return state.potentialMuggyObject;
    });

    const customReadOp = r(customReadFn);

    describe('0ae4ce0, continuously reads a mug-nested plain object mug-like after write', () => {
      const objectMug: Mug<ObjectState> = {
        [construction]: {
          s: 'asd',
          o: {
            s: 'asd',
          },
        },
      };

      const aMugLike: PossibleMugLike<AState> = {
        s: 'asd',
        o: {
          s: 'asd',
        },
        potentialMuggyObject: objectMug,
      };

      let finalReturn1: any, finalReturn2: any;

      test('[action]', () => {
        swirl(aMugLike, {
          potentialMuggyObject: { s: 'sdf' },
        });
        const checkedState = check(aMugLike);
        expect(checkedState).toMatchObject({
          potentialMuggyObject: { s: 'sdf' },
        });
        const checkedObjectState = check(objectMug);
        expect(checkedObjectState).toMatchObject({ s: 'sdf' });

        customReadFn.mockClear();
        finalReturn1 = customReadOp(aMugLike);

        customReadFn.mockClear();
        finalReturn2 = customReadOp(aMugLike);
      });

      test('[verify] the final return and its fields stay unchanged in ref and value', () => {
        expect(finalReturn2).toBe(finalReturn1);
        ownKeysOfObjectLike(finalReturn1).forEach((key) => {
          expect(finalReturn2[key]).toBe(finalReturn1[key]);
        });
        expect(finalReturn2).toStrictEqual(finalReturn1);
      });
    });
  });
});
