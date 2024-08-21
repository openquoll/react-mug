import { check, construction, Mug, PossibleMugLike, swirl, w } from '../src';
import { ownKeysOfObjectLike } from '../src/mug';

describe('900ce35, operates by an object state custom write op', () => {
  interface ObjectState {
    s: string;
    o: {
      s: string;
    };
  }

  interface AState extends ObjectState {
    potentialMuggyObject: ObjectState;
  }

  describe('0deb0f9, the op directly returns the input state, [cite] dd10061', () => {
    const customWriteFn = jest.fn((aState: AState): AState => {
      return aState;
    });

    const customWriteOp = w(customWriteFn);

    let checkedState: any;
    let checkedObjectState: any;
    let opParamState1: any, opParamState2: any;
    let opReturn1: any, opReturn2: any;
    let finalReturn1: any, finalReturn2: any;

    function verifyOpParamStateAndItsFieldsStayUnchanged() {
      test('[verify] the op-param state and its fields stay unchanged in ref and value', () => {
        expect(opParamState2).toBe(opParamState1);
        ownKeysOfObjectLike(opParamState1).forEach((key) => {
          expect(opParamState2[key]).toBe(opParamState1[key]);
        });
        expect(opParamState2).toStrictEqual(opParamState1);
      });
    }

    function verifyFinalReturnKeepsDifferentFromOpReturn() {
      test('[verify] the final return keeps different from the op return in ref', () => {
        expect(finalReturn1).not.toBe(opReturn1);
        expect(finalReturn2).not.toBe(opReturn2);
      });
    }

    describe('5fb96fe, continuously writes a constant plain object state', () => {
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

      test('[action]', () => {
        customWriteFn.mockClear();
        finalReturn1 = customWriteOp(aState);
        opParamState1 = customWriteFn.mock.calls[0][0];
        opReturn1 = customWriteFn.mock.results[0].value;

        customWriteFn.mockClear();
        finalReturn2 = customWriteOp(aState);
        opParamState2 = customWriteFn.mock.calls[0][0];
        opReturn2 = customWriteFn.mock.results[0].value;
      });

      test('[verify] the first op-param state and its fields equals the input state and its fields in ref and value', () => {
        expect(opParamState1).toBe(aState);
        ownKeysOfObjectLike(aState).forEach((key) => {
          expect(opParamState1[key]).toBe(aState[key]);
        });
        expect(opParamState1).toStrictEqual(aState);
      });

      verifyOpParamStateAndItsFieldsStayUnchanged();

      test('[verify] the final return and its fields keep same as the op return and its fields in ref and value', () => {
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

      test('[verify] the final return and its fields stay unchanged in ref and value', () => {
        expect(finalReturn2).toBe(finalReturn1);
        ownKeysOfObjectLike(finalReturn1).forEach((key) => {
          expect(finalReturn2[key]).toBe(finalReturn1[key]);
        });
        expect(finalReturn2).toStrictEqual(finalReturn1);
      });
    });

    describe('e3e8bb7, continuously writes a plain object mug before effective write', () => {
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
        customWriteFn.mockClear();
        finalReturn1 = customWriteOp(aMug);
        opParamState1 = customWriteFn.mock.calls[0][0];
        opReturn1 = customWriteFn.mock.results[0].value;

        customWriteFn.mockClear();
        finalReturn2 = customWriteOp(aMug);
        opParamState2 = customWriteFn.mock.calls[0][0];
        opReturn2 = customWriteFn.mock.results[0].value;
      });

      test('[verify] the first op-param state and its fields equal the mug_s construction and its fields in ref and value', () => {
        expect(opParamState1).toBe(aMug[construction]);
        ownKeysOfObjectLike(aMug[construction]).forEach((key) => {
          expect(opParamState1[key]).toBe(aMug[construction][key]);
        });
        expect(opParamState1).toStrictEqual(aMug[construction]);
      });

      verifyOpParamStateAndItsFieldsStayUnchanged();

      verifyFinalReturnKeepsDifferentFromOpReturn();

      test('[verify] the final return keeps same as the mug in ref and value', () => {
        expect(finalReturn1).toBe(aMug);
        expect(finalReturn1).toStrictEqual(aMug);

        expect(finalReturn2).toBe(aMug);
        expect(finalReturn2).toStrictEqual(aMug);
      });
    });

    describe('7de9e00, continuously writes a plain object mug after effective write', () => {
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
        checkedState = check(aMug);
        expect(checkedState).toMatchObject({
          potentialMuggyObject: { s: 'sdf' },
        });

        customWriteFn.mockClear();
        finalReturn1 = customWriteOp(aMug);
        opParamState1 = customWriteFn.mock.calls[0][0];
        opReturn1 = customWriteFn.mock.results[0].value;

        customWriteFn.mockClear();
        finalReturn2 = customWriteOp(aMug);
        opParamState2 = customWriteFn.mock.calls[0][0];
        opReturn2 = customWriteFn.mock.results[0].value;
      });

      test('[verify] the first op-param state and its fields equal the checked state and its fields in ref and value', () => {
        expect(opParamState1).toBe(checkedState);
        ownKeysOfObjectLike(checkedState).forEach((key) => {
          expect(opParamState1[key]).toBe(checkedState[key]);
        });
        expect(opParamState1).toStrictEqual(checkedState);
      });

      verifyOpParamStateAndItsFieldsStayUnchanged();

      verifyFinalReturnKeepsDifferentFromOpReturn();

      test('[verify] the final return keeps same as the mug in ref and value', () => {
        expect(finalReturn1).toBe(aMug);
        expect(finalReturn1).toStrictEqual(aMug);

        expect(finalReturn2).toBe(aMug);
        expect(finalReturn2).toStrictEqual(aMug);
      });
    });

    describe('d822e05, continuously writes a constant mug-nested object mug-like before effective write', () => {
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

      test('[action]', () => {
        checkedState = check(aMugLike);

        customWriteFn.mockClear();
        finalReturn1 = customWriteOp(aMugLike);
        opParamState1 = customWriteFn.mock.calls[0][0];
        opReturn1 = customWriteFn.mock.results[0].value;

        customWriteFn.mockClear();
        finalReturn2 = customWriteOp(aMugLike);
        opParamState2 = customWriteFn.mock.calls[0][0];
        opReturn2 = customWriteFn.mock.results[0].value;
      });

      test('[verify] the first op-param state doesn_t equal the mug-like in ref', () => {
        expect(opParamState1).not.toBe(aMugLike);
      });

      test('[verify] the first op-param state and its fields equal the checked state and its fields in ref and value', () => {
        expect(opParamState1).toBe(checkedState);
        ownKeysOfObjectLike(checkedState).forEach((key) => {
          expect(opParamState1[key]).toBe(checkedState[key]);
        });
        expect(opParamState1).toStrictEqual(checkedState);
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

      verifyOpParamStateAndItsFieldsStayUnchanged();

      verifyFinalReturnKeepsDifferentFromOpReturn();

      test('[verify] the final return and its fields keep same as the mug-like and its fields in ref and value', () => {
        expect(finalReturn1).toBe(aMugLike);
        ownKeysOfObjectLike(aMugLike).forEach((key) => {
          expect(finalReturn1[key]).toBe(aMugLike[key]);
        });
        expect(finalReturn1).toStrictEqual(aMugLike);

        expect(finalReturn2).toBe(aMugLike);
        ownKeysOfObjectLike(aMugLike).forEach((key) => {
          expect(finalReturn2[key]).toBe(aMugLike[key]);
        });
        expect(finalReturn2).toStrictEqual(aMugLike);
      });
    });

    describe('25e1139, continuously writes a constant mug-nested object mug-like after effective write', () => {
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

        customWriteFn.mockClear();
        finalReturn1 = customWriteOp(aMugLike);
        opParamState1 = customWriteFn.mock.calls[0][0];
        opReturn1 = customWriteFn.mock.results[0].value;

        customWriteFn.mockClear();
        finalReturn2 = customWriteOp(aMugLike);
        opParamState2 = customWriteFn.mock.calls[0][0];
        opReturn2 = customWriteFn.mock.results[0].value;
      });

      test('[verify] the first op-param state and its fields equal the checked state and its fields in ref and value', () => {
        expect(opParamState1).toBe(checkedState);
        ownKeysOfObjectLike(checkedState).forEach((key) => {
          expect(opParamState1[key]).toBe(checkedState[key]);
        });
        expect(opParamState1).toStrictEqual(checkedState);
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

      verifyOpParamStateAndItsFieldsStayUnchanged();

      verifyFinalReturnKeepsDifferentFromOpReturn();

      test('[verify] the final return and its fields keep same as the mug-like and its fields in ref and value', () => {
        expect(finalReturn1).toBe(aMugLike);
        ownKeysOfObjectLike(aMugLike).forEach((key) => {
          expect(finalReturn1[key]).toBe(aMugLike[key]);
        });
        expect(finalReturn1).toStrictEqual(aMugLike);

        expect(finalReturn2).toBe(aMugLike);
        ownKeysOfObjectLike(aMugLike).forEach((key) => {
          expect(finalReturn2[key]).toBe(aMugLike[key]);
        });
        expect(finalReturn2).toStrictEqual(aMugLike);
      });
    });
  });
});
