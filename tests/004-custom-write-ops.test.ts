import { check, construction, Mug, PossibleMugLike, w } from '../src';
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

  describe('0deb0f9, the op directly returns the input state', () => {
    const customWriteFn = jest.fn((aState: AState): AState => {
      return aState;
    });

    const customWriteOp = w(customWriteFn);

    let checkedAStateBefore: any, checkedAStateAfter: any;
    let checkedObjectStateBefore: any, checkedObjectStateAfter: any;
    let opParamState: any, opReturn: any, finalReturn: any;

    describe('5fb96fe, writes a constant plain object state, [cite] 31f3463', () => {
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
        customWriteFn.mockClear();
        finalReturn = customWriteOp(aState);
        opParamState = customWriteFn.mock.calls[0][0];
        opReturn = customWriteFn.mock.results[0].value;
      });

      test('[verify] the op-param state and its fields equal the input state and its fields in ref and value', () => {
        expect(opParamState).toBe(aState);
        ownKeysOfObjectLike(aState).forEach((key) => {
          expect(opParamState[key]).toBe(aState[key]);
        });
        expect(opParamState).toStrictEqual(aState);
      });

      test('[verify] the final return and its fields equal the op return and its fields in ref and value', () => {
        expect(finalReturn).toBe(opReturn);
        ownKeysOfObjectLike(opReturn).forEach((key) => {
          expect(finalReturn[key]).toBe(opReturn[key]);
        });
        expect(finalReturn).toStrictEqual(opReturn);
      });
    });

    describe('e3e8bb7, writes a plain object mug, [cite] 11d55b6', () => {
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
        checkedAStateBefore = check(aMug);

        customWriteFn.mockClear();
        finalReturn = customWriteOp(aMug);
        opParamState = customWriteFn.mock.calls[0][0];
        opReturn = customWriteFn.mock.results[0].value;

        checkedAStateAfter = check(aMug);
      });

      test('[verify] the op-param state and its fields equal before-write checked state and its fields in ref and value', () => {
        expect(opParamState).toBe(checkedAStateBefore);
        ownKeysOfObjectLike(checkedAStateBefore).forEach((key) => {
          expect(opParamState[key]).toBe(checkedAStateBefore[key]);
        });
        expect(opParamState).toStrictEqual(checkedAStateBefore);
      });

      test('[verify] the checked state and its fields stays unchanged in ref and value', () => {
        expect(checkedAStateAfter).toBe(checkedAStateBefore);
        ownKeysOfObjectLike(checkedAStateBefore).forEach((key) => {
          expect(checkedAStateAfter[key]).toBe(checkedAStateBefore[key]);
        });
        expect(checkedAStateAfter).toStrictEqual(checkedAStateBefore);
      });

      test('[verify] the final return differs from the op return in ref', () => {
        expect(finalReturn).not.toBe(opReturn);
      });

      test('[verify] the final return equals the mug in ref and value', () => {
        expect(finalReturn).toBe(aMug);
        expect(finalReturn).toStrictEqual(aMug);
      });
    });

    describe('d822e05, writes a constant mug-nested object mug-like, [cite] 5b713bb', () => {
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
        checkedAStateBefore = check(aMugLike);
        checkedObjectStateBefore = check(objectMug);

        customWriteFn.mockClear();
        finalReturn = customWriteOp(aMugLike);
        opParamState = customWriteFn.mock.calls[0][0];
        opReturn = customWriteFn.mock.results[0].value;

        checkedAStateAfter = check(aMugLike);
        checkedObjectStateAfter = check(objectMug);
      });

      test('[verify] the op-param state and its fields equal before-write checked state and its fields in ref and value', () => {
        expect(opParamState).toBe(checkedAStateBefore);
        ownKeysOfObjectLike(checkedAStateBefore).forEach((key) => {
          expect(opParamState[key]).toBe(checkedAStateBefore[key]);
        });
        expect(opParamState).toStrictEqual(checkedAStateBefore);
      });

      test('[verify] the checked state and its fields stays unchanged in ref and value', () => {
        expect(checkedAStateAfter).toBe(checkedAStateBefore);
        ownKeysOfObjectLike(checkedAStateBefore).forEach((key) => {
          expect(checkedAStateAfter[key]).toBe(checkedAStateBefore[key]);
        });
        expect(checkedAStateAfter).toStrictEqual(checkedAStateBefore);
      });

      test('[verify] the checked state_s muggy object field and its child fields keep equal to the object mug_s checked state and its fields in ref and value', () => {
        expect(checkedAStateBefore.potentialMuggyObject).toBe(checkedObjectStateBefore);
        ownKeysOfObjectLike(checkedObjectStateBefore).forEach((key) => {
          expect(checkedAStateBefore.potentialMuggyObject[key]).toBe(checkedObjectStateBefore[key]);
        });
        expect(checkedAStateBefore.potentialMuggyObject).toStrictEqual(checkedObjectStateBefore);

        expect(checkedAStateAfter.potentialMuggyObject).toBe(checkedObjectStateAfter);
        ownKeysOfObjectLike(checkedObjectStateAfter).forEach((key) => {
          expect(checkedAStateAfter.potentialMuggyObject[key]).toBe(checkedObjectStateAfter[key]);
        });
        expect(checkedAStateAfter.potentialMuggyObject).toStrictEqual(checkedObjectStateAfter);
      });

      test('[verify] the final return differs from the op return in ref', () => {
        expect(finalReturn).not.toBe(opReturn);
      });

      test('[verify] the final return and its fields equal the mug-like and its fields in ref and value', () => {
        expect(finalReturn).toBe(aMugLike);
        ownKeysOfObjectLike(aMugLike).forEach((key) => {
          expect(finalReturn[key]).toBe(aMugLike[key]);
        });
        expect(finalReturn).toStrictEqual(aMugLike);
      });
    });
  });

  describe('cddad6f, the op generates a state overriding the input state_s string field and potential muggy object field_s string field with the input string, [cite] .:0deb0f9', () => {
    const customWriteFn = jest.fn((aState: AState, s: string): AState => {
      return {
        ...aState,
        s,
        potentialMuggyObject: {
          ...aState.potentialMuggyObject,
          s,
        },
      };
    });

    const customWriteOp = w(customWriteFn);

    let checkedAStateBefore: any, checkedAStateAfter: any;
    let checkedObjectStateBefore: any, checkedObjectStateAfter: any;
    let opParamState: any, opReturn: any, finalReturn: any;

    describe('f4df6bd, writes a plain object state with a different string', () => {
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
        customWriteFn.mockClear();
        finalReturn = customWriteOp(aState, 'sdf');
        opParamState = customWriteFn.mock.calls[0][0];
        opReturn = customWriteFn.mock.results[0].value;
      });

      test('[verify] the final return and its fields equal the op return and its fields in ref and value', () => {
        expect(finalReturn).toBe(opReturn);
        ownKeysOfObjectLike(opReturn).forEach((key) => {
          expect(finalReturn[key]).toBe(opReturn[key]);
        });
        expect(finalReturn).toStrictEqual(opReturn);
      });
    });

    describe('dfecf3a, writes a plain object state with a same string, [cite] .:f4df6bd', () => {
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
        customWriteFn.mockClear();
        finalReturn = customWriteOp(aState, 'asd');
        opParamState = customWriteFn.mock.calls[0][0];
        opReturn = customWriteFn.mock.results[0].value;
      });

      test('[verify] the final return and its fields equal the op return and its fields in ref and value', () => {
        expect(finalReturn).toBe(opReturn);
        ownKeysOfObjectLike(opReturn).forEach((key) => {
          expect(finalReturn[key]).toBe(opReturn[key]);
        });
        expect(finalReturn).toStrictEqual(opReturn);
      });
    });

    describe('d5f9703, writes a plain object mug with a different string', () => {
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
        checkedAStateBefore = check(aMug);

        customWriteFn.mockClear();
        finalReturn = customWriteOp(aMug, 'sdf');
        opParamState = customWriteFn.mock.calls[0][0];
        opReturn = customWriteFn.mock.results[0].value;

        checkedAStateAfter = check(aMug);
      });

      test('[verify] the final return differs from the op return in ref', () => {
        expect(finalReturn).not.toBe(opReturn);
      });

      test('[verify] the final return equals the mug in ref and value', () => {
        expect(finalReturn).toBe(aMug);
        expect(finalReturn).toStrictEqual(aMug);
      });

      test('[verify] the before-write checked state differs from the op return in ref', () => {
        expect(checkedAStateBefore).not.toBe(opReturn);
      });

      test('[verify] the before-write checked state_s object field and potential muggy object field_s object field equal the op return_s counterpart fields in ref and value', () => {
        expect(checkedAStateBefore.o).toBe(opReturn.o);
        expect(checkedAStateBefore.o).toStrictEqual(opReturn.o);
        expect(checkedAStateBefore.potentialMuggyObject.o).toBe(opReturn.potentialMuggyObject.o);
        expect(checkedAStateBefore.potentialMuggyObject.o).toStrictEqual(
          opReturn.potentialMuggyObject.o,
        );
      });

      test('[verify] the after-write checked state and its fields equal the op return and its fields in ref and value', () => {
        expect(checkedAStateAfter).toBe(opReturn);
        ownKeysOfObjectLike(opReturn).forEach((key) => {
          expect(checkedAStateAfter[key]).toBe(opReturn[key]);
        });
        expect(checkedAStateAfter).toStrictEqual(opReturn);
      });
    });

    describe('7ab7282, writes a plain object mug with a same string, [cite] .:d5f9703', () => {
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
        checkedAStateBefore = check(aMug);

        customWriteFn.mockClear();
        finalReturn = customWriteOp(aMug, 'asd');
        opParamState = customWriteFn.mock.calls[0][0];
        opReturn = customWriteFn.mock.results[0].value;

        checkedAStateAfter = check(aMug);
      });

      test('[verify] the final return differs from the op return in ref', () => {
        expect(finalReturn).not.toBe(opReturn);
      });

      test('[verify] the final return equals the mug in ref and value', () => {
        expect(finalReturn).toBe(aMug);
        expect(finalReturn).toStrictEqual(aMug);
      });

      test('[verify] the before-write checked state and its potential muggy object field differ from the op return and its counterpart field in ref', () => {
        expect(checkedAStateBefore).not.toBe(opReturn);
      });

      test('[verify] the before-write checked state_s string field, object field, and the potential muggy object field_s child fields equal the op return_s counterpart fields in ref and value', () => {
        expect(checkedAStateBefore.s).toBe(opReturn.s);
        expect(checkedAStateBefore.o).toBe(opReturn.o);
        expect(checkedAStateBefore.o).toStrictEqual(opReturn.o);
        ownKeysOfObjectLike(opReturn.potentialMuggyObject).forEach((key) => {
          expect(checkedAStateBefore.potentialMuggyObject[key]).toBe(
            opReturn.potentialMuggyObject[key],
          );
          expect(checkedAStateBefore.potentialMuggyObject[key]).toStrictEqual(
            opReturn.potentialMuggyObject[key],
          );
        });
      });

      test('[verify] the checked state stays unchanged in ref and value', () => {
        expect(checkedAStateAfter).toBe(checkedAStateBefore);
        ownKeysOfObjectLike(checkedAStateBefore).forEach((key) => {
          expect(checkedAStateAfter[key]).toBe(checkedAStateBefore[key]);
        });
        expect(checkedAStateAfter).toStrictEqual(checkedAStateBefore);
      });
    });

    describe('f73623e, writes a mug-nested plain object mug-like with a different string', () => {
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
        checkedAStateBefore = check(aMugLike);
        checkedObjectStateBefore = check(objectMug);

        customWriteFn.mockClear();
        finalReturn = customWriteOp(aMugLike, 'sdf');
        opParamState = customWriteFn.mock.calls[0][0];
        opReturn = customWriteFn.mock.results[0].value;

        checkedAStateAfter = check(aMugLike);
        checkedObjectStateAfter = check(objectMug);
      });

      test('[verify] the final return differs from the op return in ref', () => {
        expect(finalReturn).not.toBe(opReturn);
      });

      test('[verify] the final return_s non-muggy fields equal the op return_s counterpart fields in ref and value', () => {
        ownKeysOfObjectLike(opReturn)
          .filter((key) => key !== 'potentialMuggyObject')
          .forEach((key) => {
            expect(finalReturn[key]).toBe(opReturn[key]);
            expect(finalReturn[key]).toStrictEqual(opReturn[key]);
          });
      });

      test('[verify] the final return_s muggy object field differs from the op return_s counterpart field in ref', () => {
        expect(finalReturn.potentialMuggyObject).not.toBe(opReturn.potentialMuggyObject);
      });

      test('[verify] the final return_s muggy object field equals the object mug in ref and value', () => {
        expect(finalReturn.potentialMuggyObject).toBe(objectMug);
        expect(finalReturn.potentialMuggyObject).toStrictEqual(objectMug);
      });

      test('[verify] the before-write checked state differs from the op return in ref', () => {
        expect(checkedAStateBefore).not.toBe(opReturn);
      });

      test('[verify] the before-write checked state_s object field and muggy object field_s object field equal the op return_s counterpart fields in ref and value', () => {
        expect(checkedAStateBefore.o).toBe(opReturn.o);
        expect(checkedAStateBefore.o).toStrictEqual(opReturn.o);
        expect(checkedAStateBefore.potentialMuggyObject.o).toBe(opReturn.potentialMuggyObject.o);
        expect(checkedAStateBefore.potentialMuggyObject.o).toStrictEqual(
          opReturn.potentialMuggyObject.o,
        );
      });

      test('[verify] the after-write checked state differs from the op return in ref', () => {
        expect(checkedAStateAfter).not.toBe(opReturn);
      });

      test('[verify] the after-write checked state_s muggy object field and its child fields equal the op return_s counterpart field and its child fields in ref and value', () => {
        expect(checkedAStateAfter.potentialMuggyObject).toBe(opReturn.potentialMuggyObject);
        ownKeysOfObjectLike(opReturn.potentialMuggyObject).forEach((key) => {
          expect(checkedAStateAfter.potentialMuggyObject[key]).toBe(
            opReturn.potentialMuggyObject[key],
          );
        });
        expect(checkedAStateAfter.potentialMuggyObject).toStrictEqual(
          opReturn.potentialMuggyObject,
        );
      });

      test('[verify] the checked state_s non-muggy fields and muggy object field_s object field stay unchanged in ref and value', () => {
        ownKeysOfObjectLike(checkedAStateBefore)
          .filter((key) => key !== 'potentialMuggyObject')
          .forEach((key) => {
            expect(checkedAStateAfter[key]).toBe(checkedAStateBefore[key]);
            expect(checkedAStateAfter[key]).toStrictEqual(checkedAStateBefore[key]);
          });

        expect(checkedAStateAfter.potentialMuggyObject.o).toBe(
          checkedAStateBefore.potentialMuggyObject.o,
        );
        expect(checkedAStateAfter.potentialMuggyObject.o).toStrictEqual(
          checkedAStateBefore.potentialMuggyObject.o,
        );
      });

      test('[verify] the checked state_s muggy object field and its child fields keep equal to the object mug_s checked state and its fields in ref and value', () => {
        expect(checkedAStateBefore.potentialMuggyObject).toBe(checkedObjectStateBefore);
        ownKeysOfObjectLike(checkedObjectStateBefore).forEach((key) => {
          expect(checkedAStateBefore.potentialMuggyObject[key]).toBe(checkedObjectStateBefore[key]);
        });
        expect(checkedAStateBefore.potentialMuggyObject).toStrictEqual(checkedObjectStateBefore);

        expect(checkedAStateAfter.potentialMuggyObject).toBe(checkedObjectStateAfter);
        ownKeysOfObjectLike(checkedObjectStateAfter).forEach((key) => {
          expect(checkedAStateAfter.potentialMuggyObject[key]).toBe(checkedObjectStateAfter[key]);
        });
        expect(checkedAStateAfter.potentialMuggyObject).toStrictEqual(checkedObjectStateAfter);
      });
    });

    describe('2e24747, writes a mug-nested plain object mug-like with a same string, [cite] .:f73623e', () => {
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
        checkedAStateBefore = check(aMugLike);
        checkedObjectStateBefore = check(objectMug);

        customWriteFn.mockClear();
        finalReturn = customWriteOp(aMugLike, 'asd');
        opParamState = customWriteFn.mock.calls[0][0];
        opReturn = customWriteFn.mock.results[0].value;

        checkedAStateAfter = check(aMugLike);
        checkedObjectStateAfter = check(objectMug);
      });

      test('[verify] the final return differs from the op return in ref', () => {
        expect(finalReturn).not.toBe(opReturn);
      });

      test('[verify] the final return_s non-muggy fields equal the op return_s counterpart fields in ref and value', () => {
        ownKeysOfObjectLike(opReturn)
          .filter((key) => key !== 'potentialMuggyObject')
          .forEach((key) => {
            expect(finalReturn[key]).toBe(opReturn[key]);
            expect(finalReturn[key]).toStrictEqual(opReturn[key]);
          });
      });

      test('[verify] the final return_s muggy object field differs from the op return_s counterpart field in ref', () => {
        expect(finalReturn.potentialMuggyObject).not.toBe(opReturn.potentialMuggyObject);
      });

      test('[verify] the final return_s muggy object field equals the object mug in ref and value', () => {
        expect(finalReturn.potentialMuggyObject).toBe(objectMug);
        expect(finalReturn.potentialMuggyObject).toStrictEqual(objectMug);
      });

      test('[verify] the before-write checked state and its potential muggy object field differ from the op return and its counterpart field in ref', () => {
        expect(checkedAStateBefore).not.toBe(opReturn);
      });

      test('[verify] the before-write checked state_s string field, object field, and the muggy object field_s child fields equal the op return_s counterpart fields in ref and value', () => {
        expect(checkedAStateBefore.s).toBe(opReturn.s);
        expect(checkedAStateBefore.o).toBe(opReturn.o);
        expect(checkedAStateBefore.o).toStrictEqual(opReturn.o);
        ownKeysOfObjectLike(opReturn.potentialMuggyObject).forEach((key) => {
          expect(checkedAStateBefore.potentialMuggyObject[key]).toBe(
            opReturn.potentialMuggyObject[key],
          );
          expect(checkedAStateBefore.potentialMuggyObject[key]).toStrictEqual(
            opReturn.potentialMuggyObject[key],
          );
        });
      });

      test('[verify] the checked state and its fields stay unchanged in ref and value', () => {
        expect(checkedAStateAfter).toBe(checkedAStateBefore);
        ownKeysOfObjectLike(checkedAStateBefore).forEach((key) => {
          expect(checkedAStateAfter[key]).toBe(checkedAStateBefore[key]);
        });
        expect(checkedAStateAfter).toStrictEqual(checkedAStateBefore);
      });

      test('[verify] the checked state_s muggy object field and its child fields keep equal to the object mug_s checked state and its fields in ref and value', () => {
        expect(checkedAStateBefore.potentialMuggyObject).toBe(checkedObjectStateBefore);
        ownKeysOfObjectLike(checkedObjectStateBefore).forEach((key) => {
          expect(checkedAStateBefore.potentialMuggyObject[key]).toBe(checkedObjectStateBefore[key]);
        });
        expect(checkedAStateBefore.potentialMuggyObject).toStrictEqual(checkedObjectStateBefore);

        expect(checkedAStateAfter.potentialMuggyObject).toBe(checkedObjectStateAfter);
        ownKeysOfObjectLike(checkedObjectStateAfter).forEach((key) => {
          expect(checkedAStateAfter.potentialMuggyObject[key]).toBe(checkedObjectStateAfter[key]);
        });
        expect(checkedAStateAfter.potentialMuggyObject).toStrictEqual(checkedObjectStateAfter);
      });
    });
  });
});
