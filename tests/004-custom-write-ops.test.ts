import { check, construction, Mug, MugLike, w } from '../src';
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

  describe('0deb0f9, the fn directly returns the input state', () => {
    const customWriteFn = jest.fn((state: AState): AState => state);

    const customWriteOp = w(customWriteFn);

    let checkedAStateBefore: AState, checkedAStateAfter: AState;
    let checkedObjectStateBefore: ObjectState, checkedObjectStateAfter: ObjectState;
    let fnParamState: AState, fnReturn: AState, opReturn: any;

    describe('5fb96fe, writes a constant plain object state, [cite] 002:31f3463', () => {
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
        opReturn = customWriteOp(aState);
        fnParamState = customWriteFn.mock.calls[0][0];
        fnReturn = customWriteFn.mock.results[0].value;
      });

      test('[verify] the fn-param state and its fields equal the input state and its fields in ref and value', () => {
        expect(fnParamState).toBe(aState);
        ownKeysOfObjectLike(aState).forEach((key) => {
          expect(fnParamState[key]).toBe(aState[key]);
        });
        expect(fnParamState).toStrictEqual(aState);
      });

      test('[verify] the op return and its fields equal the fn return and its fields in ref and value', () => {
        expect(opReturn).toBe(fnReturn);
        ownKeysOfObjectLike(fnReturn).forEach((key) => {
          expect(opReturn[key]).toBe(fnReturn[key]);
        });
        expect(opReturn).toStrictEqual(fnReturn);
      });
    });

    describe('e3e8bb7, writes a plain object mug, [cite] 001:11d55b6', () => {
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

        opReturn = customWriteOp(aMug);
        fnParamState = customWriteFn.mock.calls[0][0];
        fnReturn = customWriteFn.mock.results[0].value;

        checkedAStateAfter = check(aMug);
      });

      test('[verify] the fn-param state and its fields equal before-write checked state and its fields in ref and value', () => {
        expect(fnParamState).toBe(checkedAStateBefore);
        ownKeysOfObjectLike(checkedAStateBefore).forEach((key) => {
          expect(fnParamState[key]).toBe(checkedAStateBefore[key]);
        });
        expect(fnParamState).toStrictEqual(checkedAStateBefore);
      });

      test('[verify] the checked state and its fields stays unchanged in ref and value', () => {
        expect(checkedAStateAfter).toBe(checkedAStateBefore);
        ownKeysOfObjectLike(checkedAStateBefore).forEach((key) => {
          expect(checkedAStateAfter[key]).toBe(checkedAStateBefore[key]);
        });
        expect(checkedAStateAfter).toStrictEqual(checkedAStateBefore);
      });

      test('[verify] the op return differs from the fn return in ref', () => {
        expect(opReturn).not.toBe(fnReturn);
      });

      test('[verify] the op return equals the mug in ref and value', () => {
        expect(opReturn).toBe(aMug);
        expect(opReturn).toStrictEqual(aMug);
      });
    });

    describe('e783e85, writes a class-defined object mug, [cite] 001:18a9e96', () => {
      class AMug implements Mug<AState> {
        [construction] = {
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

        b: boolean = false;

        getB() {
          return this.b;
        }

        setB(b: boolean) {
          this.b = b;
        }
      }

      const aMug = new AMug();

      test('[action]', () => {
        checkedAStateBefore = check(aMug);

        opReturn = customWriteOp(aMug);
        fnParamState = customWriteFn.mock.calls[0][0];
        fnReturn = customWriteFn.mock.results[0].value;

        checkedAStateAfter = check(aMug);
      });

      test('[verify] the fn-param state and its fields equal before-write checked state and its fields in ref and value', () => {
        expect(fnParamState).toBe(checkedAStateBefore);
        ownKeysOfObjectLike(checkedAStateBefore).forEach((key) => {
          expect(fnParamState[key]).toBe(checkedAStateBefore[key]);
        });
        expect(fnParamState).toStrictEqual(checkedAStateBefore);
      });

      test('[verify] the checked state and its fields stays unchanged in ref and value', () => {
        expect(checkedAStateAfter).toBe(checkedAStateBefore);
        ownKeysOfObjectLike(checkedAStateBefore).forEach((key) => {
          expect(checkedAStateAfter[key]).toBe(checkedAStateBefore[key]);
        });
        expect(checkedAStateAfter).toStrictEqual(checkedAStateBefore);
      });

      test('[verify] the op return differs from the fn return in ref', () => {
        expect(opReturn).not.toBe(fnReturn);
      });

      test('[verify] the op return equals the mug in ref and value', () => {
        expect(opReturn).toBe(aMug);
        expect(opReturn).toStrictEqual(aMug);
      });
    });

    describe('d822e05, writes a constant mug-nested object mug-like, [cite] 002:5b713bb', () => {
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
        checkedAStateBefore = check(aMugLike);
        checkedObjectStateBefore = check(objectMug);

        opReturn = customWriteOp(aMugLike);
        fnParamState = customWriteFn.mock.calls[0][0];
        fnReturn = customWriteFn.mock.results[0].value;

        checkedAStateAfter = check(aMugLike);
        checkedObjectStateAfter = check(objectMug);
      });

      test('[verify] the fn-param state and its fields equal before-write checked state and its fields in ref and value', () => {
        expect(fnParamState).toBe(checkedAStateBefore);
        ownKeysOfObjectLike(checkedAStateBefore).forEach((key) => {
          expect(fnParamState[key]).toBe(checkedAStateBefore[key]);
        });
        expect(fnParamState).toStrictEqual(checkedAStateBefore);
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

      test('[verify] the op return differs from the fn return in ref', () => {
        expect(opReturn).not.toBe(fnReturn);
      });

      test('[verify] the op return and its fields equal the mug-like and its fields in ref and value', () => {
        expect(opReturn).toBe(aMugLike);
        ownKeysOfObjectLike(aMugLike).forEach((key) => {
          expect(opReturn[key]).toBe(aMugLike[key]);
        });
        expect(opReturn).toStrictEqual(aMugLike);
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

    let checkedAStateBefore: AState, checkedAStateAfter: AState;
    let checkedObjectStateBefore: ObjectState, checkedObjectStateAfter: ObjectState;
    let fnParamState: AState, fnReturn: AState, opReturn: any;

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
        opReturn = customWriteOp(aState, 'sdf');
        fnParamState = customWriteFn.mock.calls[0][0];
        fnReturn = customWriteFn.mock.results[0].value;
      });

      test('[verify] the op return and its fields equal the fn return and its fields in ref and value', () => {
        expect(opReturn).toBe(fnReturn);
        ownKeysOfObjectLike(fnReturn).forEach((key) => {
          expect(opReturn[key]).toBe(fnReturn[key]);
        });
        expect(opReturn).toStrictEqual(fnReturn);
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
        opReturn = customWriteOp(aState, 'asd');
        fnParamState = customWriteFn.mock.calls[0][0];
        fnReturn = customWriteFn.mock.results[0].value;
      });

      test('[verify] the op return and its fields equal the fn return and its fields in ref and value', () => {
        expect(opReturn).toBe(fnReturn);
        ownKeysOfObjectLike(fnReturn).forEach((key) => {
          expect(opReturn[key]).toBe(fnReturn[key]);
        });
        expect(opReturn).toStrictEqual(fnReturn);
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

        opReturn = customWriteOp(aMug, 'sdf');
        fnParamState = customWriteFn.mock.calls[0][0];
        fnReturn = customWriteFn.mock.results[0].value;

        checkedAStateAfter = check(aMug);
      });

      test('[verify] the op return differs from the fn return in ref', () => {
        expect(opReturn).not.toBe(fnReturn);
      });

      test('[verify] the op return equals the mug in ref and value', () => {
        expect(opReturn).toBe(aMug);
        expect(opReturn).toStrictEqual(aMug);
      });

      test('[verify] the before-write checked state differs from the fn return in ref', () => {
        expect(checkedAStateBefore).not.toBe(fnReturn);
      });

      test('[verify] the before-write checked state_s object field and potential muggy object field_s object field equal the fn return_s counterpart fields in ref and value', () => {
        expect(checkedAStateBefore.o).toBe(fnReturn.o);
        expect(checkedAStateBefore.o).toStrictEqual(fnReturn.o);
        expect(checkedAStateBefore.potentialMuggyObject.o).toBe(fnReturn.potentialMuggyObject.o);
        expect(checkedAStateBefore.potentialMuggyObject.o).toStrictEqual(
          fnReturn.potentialMuggyObject.o,
        );
      });

      test('[verify] the after-write checked state and its fields equal the fn return and its fields in ref and value', () => {
        expect(checkedAStateAfter).toBe(fnReturn);
        ownKeysOfObjectLike(fnReturn).forEach((key) => {
          expect(checkedAStateAfter[key]).toBe(fnReturn[key]);
        });
        expect(checkedAStateAfter).toStrictEqual(fnReturn);
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

        opReturn = customWriteOp(aMug, 'asd');
        fnParamState = customWriteFn.mock.calls[0][0];
        fnReturn = customWriteFn.mock.results[0].value;

        checkedAStateAfter = check(aMug);
      });

      test('[verify] the op return differs from the fn return in ref', () => {
        expect(opReturn).not.toBe(fnReturn);
      });

      test('[verify] the op return equals the mug in ref and value', () => {
        expect(opReturn).toBe(aMug);
        expect(opReturn).toStrictEqual(aMug);
      });

      test('[verify] the before-write checked state and its potential muggy object field differ from the fn return and its counterpart field in ref', () => {
        expect(checkedAStateBefore).not.toBe(fnReturn);
      });

      test('[verify] the before-write checked state_s string field, object field, and the potential muggy object field_s child fields equal the fn return_s counterpart fields in ref and value', () => {
        expect(checkedAStateBefore.s).toBe(fnReturn.s);
        expect(checkedAStateBefore.o).toBe(fnReturn.o);
        expect(checkedAStateBefore.o).toStrictEqual(fnReturn.o);
        ownKeysOfObjectLike(fnReturn.potentialMuggyObject).forEach((key) => {
          expect(checkedAStateBefore.potentialMuggyObject[key]).toBe(
            fnReturn.potentialMuggyObject[key],
          );
          expect(checkedAStateBefore.potentialMuggyObject[key]).toStrictEqual(
            fnReturn.potentialMuggyObject[key],
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

      const aMugLike: MugLike<AState, { potentialMuggyObject: Mug<ObjectState> }> = {
        s: 'asd',
        o: {
          s: 'asd',
        },
        potentialMuggyObject: objectMug,
      };

      test('[action]', () => {
        checkedAStateBefore = check(aMugLike);
        checkedObjectStateBefore = check(objectMug);

        opReturn = customWriteOp(aMugLike, 'sdf');
        fnParamState = customWriteFn.mock.calls[0][0];
        fnReturn = customWriteFn.mock.results[0].value;

        checkedAStateAfter = check(aMugLike);
        checkedObjectStateAfter = check(objectMug);
      });

      test('[verify] the op return differs from the fn return in ref', () => {
        expect(opReturn).not.toBe(fnReturn);
      });

      test('[verify] the op return_s non-muggy fields equal the fn return_s counterpart fields in ref and value', () => {
        ownKeysOfObjectLike(fnReturn)
          .filter((key) => key !== 'potentialMuggyObject')
          .forEach((key) => {
            expect(opReturn[key]).toBe(fnReturn[key]);
            expect(opReturn[key]).toStrictEqual(fnReturn[key]);
          });
      });

      test('[verify] the op return_s muggy object field differs from the fn return_s counterpart field in ref', () => {
        expect(opReturn.potentialMuggyObject).not.toBe(fnReturn.potentialMuggyObject);
      });

      test('[verify] the op return_s muggy object field equals the object mug in ref and value', () => {
        expect(opReturn.potentialMuggyObject).toBe(objectMug);
        expect(opReturn.potentialMuggyObject).toStrictEqual(objectMug);
      });

      test('[verify] the before-write checked state differs from the fn return in ref', () => {
        expect(checkedAStateBefore).not.toBe(fnReturn);
      });

      test('[verify] the before-write checked state_s object field and muggy object field_s object field equal the fn return_s counterpart fields in ref and value', () => {
        expect(checkedAStateBefore.o).toBe(fnReturn.o);
        expect(checkedAStateBefore.o).toStrictEqual(fnReturn.o);
        expect(checkedAStateBefore.potentialMuggyObject.o).toBe(fnReturn.potentialMuggyObject.o);
        expect(checkedAStateBefore.potentialMuggyObject.o).toStrictEqual(
          fnReturn.potentialMuggyObject.o,
        );
      });

      test('[verify] the after-write checked state differs from the fn return in ref', () => {
        expect(checkedAStateAfter).not.toBe(fnReturn);
      });

      test('[verify] the after-write checked state_s muggy object field and its child fields equal the fn return_s counterpart field and its child fields in ref and value', () => {
        expect(checkedAStateAfter.potentialMuggyObject).toBe(fnReturn.potentialMuggyObject);
        ownKeysOfObjectLike(fnReturn.potentialMuggyObject).forEach((key) => {
          expect(checkedAStateAfter.potentialMuggyObject[key]).toBe(
            fnReturn.potentialMuggyObject[key],
          );
        });
        expect(checkedAStateAfter.potentialMuggyObject).toStrictEqual(
          fnReturn.potentialMuggyObject,
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

      const aMugLike: MugLike<AState, { potentialMuggyObject: Mug<ObjectState> }> = {
        s: 'asd',
        o: {
          s: 'asd',
        },
        potentialMuggyObject: objectMug,
      };

      test('[action]', () => {
        checkedAStateBefore = check(aMugLike);
        checkedObjectStateBefore = check(objectMug);

        opReturn = customWriteOp(aMugLike, 'asd');
        fnParamState = customWriteFn.mock.calls[0][0];
        fnReturn = customWriteFn.mock.results[0].value;

        checkedAStateAfter = check(aMugLike);
        checkedObjectStateAfter = check(objectMug);
      });

      test('[verify] the op return differs from the fn return in ref', () => {
        expect(opReturn).not.toBe(fnReturn);
      });

      test('[verify] the op return_s non-muggy fields equal the fn return_s counterpart fields in ref and value', () => {
        ownKeysOfObjectLike(fnReturn)
          .filter((key) => key !== 'potentialMuggyObject')
          .forEach((key) => {
            expect(opReturn[key]).toBe(fnReturn[key]);
            expect(opReturn[key]).toStrictEqual(fnReturn[key]);
          });
      });

      test('[verify] the op return_s muggy object field differs from the fn return_s counterpart field in ref', () => {
        expect(opReturn.potentialMuggyObject).not.toBe(fnReturn.potentialMuggyObject);
      });

      test('[verify] the op return_s muggy object field equals the object mug in ref and value', () => {
        expect(opReturn.potentialMuggyObject).toBe(objectMug);
        expect(opReturn.potentialMuggyObject).toStrictEqual(objectMug);
      });

      test('[verify] the before-write checked state and its potential muggy object field differ from the fn return and its counterpart field in ref', () => {
        expect(checkedAStateBefore).not.toBe(fnReturn);
      });

      test('[verify] the before-write checked state_s string field, object field, and the muggy object field_s child fields equal the fn return_s counterpart fields in ref and value', () => {
        expect(checkedAStateBefore.s).toBe(fnReturn.s);
        expect(checkedAStateBefore.o).toBe(fnReturn.o);
        expect(checkedAStateBefore.o).toStrictEqual(fnReturn.o);
        ownKeysOfObjectLike(fnReturn.potentialMuggyObject).forEach((key) => {
          expect(checkedAStateBefore.potentialMuggyObject[key]).toBe(
            fnReturn.potentialMuggyObject[key],
          );
          expect(checkedAStateBefore.potentialMuggyObject[key]).toStrictEqual(
            fnReturn.potentialMuggyObject[key],
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
