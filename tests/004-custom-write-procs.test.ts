import { construction, getIt, Mug, MugLike, w } from '../src';
import { ownKeysOfObjectLike } from '../src/mug';

describe('900ce35, writes by an object state custom write proc', () => {
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

    const customWriteProc = w(customWriteFn);

    let gotAStateBefore: AState, gotAStateAfter: AState;
    let gotObjectStateBefore: ObjectState, gotObjectStateAfter: ObjectState;
    let fnParamState: AState, fnReturn: AState, procReturn: any;

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
        procReturn = customWriteProc(aState);
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

      test('[verify] the proc return and its fields equal the fn return and its fields in ref and value', () => {
        expect(procReturn).toBe(fnReturn);
        ownKeysOfObjectLike(fnReturn).forEach((key) => {
          expect(procReturn[key]).toBe(fnReturn[key]);
        });
        expect(procReturn).toStrictEqual(fnReturn);
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
        gotAStateBefore = getIt(aMug);

        procReturn = customWriteProc(aMug);
        fnParamState = customWriteFn.mock.calls[0][0];
        fnReturn = customWriteFn.mock.results[0].value;

        gotAStateAfter = getIt(aMug);
      });

      test('[verify] the fn-param state and its fields equal before-write got state and its fields in ref and value', () => {
        expect(fnParamState).toBe(gotAStateBefore);
        ownKeysOfObjectLike(gotAStateBefore).forEach((key) => {
          expect(fnParamState[key]).toBe(gotAStateBefore[key]);
        });
        expect(fnParamState).toStrictEqual(gotAStateBefore);
      });

      test('[verify] the got state and its fields stays unchanged in ref and value', () => {
        expect(gotAStateAfter).toBe(gotAStateBefore);
        ownKeysOfObjectLike(gotAStateBefore).forEach((key) => {
          expect(gotAStateAfter[key]).toBe(gotAStateBefore[key]);
        });
        expect(gotAStateAfter).toStrictEqual(gotAStateBefore);
      });

      test('[verify] the proc return differs from the fn return in ref', () => {
        expect(procReturn).not.toBe(fnReturn);
      });

      test('[verify] the proc return equals the mug in ref and value', () => {
        expect(procReturn).toBe(aMug);
        expect(procReturn).toStrictEqual(aMug);
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
        gotAStateBefore = getIt(aMug);

        procReturn = customWriteProc(aMug);
        fnParamState = customWriteFn.mock.calls[0][0];
        fnReturn = customWriteFn.mock.results[0].value;

        gotAStateAfter = getIt(aMug);
      });

      test('[verify] the fn-param state and its fields equal before-write got state and its fields in ref and value', () => {
        expect(fnParamState).toBe(gotAStateBefore);
        ownKeysOfObjectLike(gotAStateBefore).forEach((key) => {
          expect(fnParamState[key]).toBe(gotAStateBefore[key]);
        });
        expect(fnParamState).toStrictEqual(gotAStateBefore);
      });

      test('[verify] the got state and its fields stays unchanged in ref and value', () => {
        expect(gotAStateAfter).toBe(gotAStateBefore);
        ownKeysOfObjectLike(gotAStateBefore).forEach((key) => {
          expect(gotAStateAfter[key]).toBe(gotAStateBefore[key]);
        });
        expect(gotAStateAfter).toStrictEqual(gotAStateBefore);
      });

      test('[verify] the proc return differs from the fn return in ref', () => {
        expect(procReturn).not.toBe(fnReturn);
      });

      test('[verify] the proc return equals the mug in ref and value', () => {
        expect(procReturn).toBe(aMug);
        expect(procReturn).toStrictEqual(aMug);
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
        gotAStateBefore = getIt(aMugLike);
        gotObjectStateBefore = getIt(objectMug);

        procReturn = customWriteProc(aMugLike);
        fnParamState = customWriteFn.mock.calls[0][0];
        fnReturn = customWriteFn.mock.results[0].value;

        gotAStateAfter = getIt(aMugLike);
        gotObjectStateAfter = getIt(objectMug);
      });

      test('[verify] the fn-param state and its fields equal before-write got state and its fields in ref and value', () => {
        expect(fnParamState).toBe(gotAStateBefore);
        ownKeysOfObjectLike(gotAStateBefore).forEach((key) => {
          expect(fnParamState[key]).toBe(gotAStateBefore[key]);
        });
        expect(fnParamState).toStrictEqual(gotAStateBefore);
      });

      test('[verify] the got state and its fields stays unchanged in ref and value', () => {
        expect(gotAStateAfter).toBe(gotAStateBefore);
        ownKeysOfObjectLike(gotAStateBefore).forEach((key) => {
          expect(gotAStateAfter[key]).toBe(gotAStateBefore[key]);
        });
        expect(gotAStateAfter).toStrictEqual(gotAStateBefore);
      });

      test('[verify] the got state_s muggy object field and its child fields keep equal to the object mug_s got state and its fields in ref and value', () => {
        expect(gotAStateBefore.potentialMuggyObject).toBe(gotObjectStateBefore);
        ownKeysOfObjectLike(gotObjectStateBefore).forEach((key) => {
          expect(gotAStateBefore.potentialMuggyObject[key]).toBe(gotObjectStateBefore[key]);
        });
        expect(gotAStateBefore.potentialMuggyObject).toStrictEqual(gotObjectStateBefore);

        expect(gotAStateAfter.potentialMuggyObject).toBe(gotObjectStateAfter);
        ownKeysOfObjectLike(gotObjectStateAfter).forEach((key) => {
          expect(gotAStateAfter.potentialMuggyObject[key]).toBe(gotObjectStateAfter[key]);
        });
        expect(gotAStateAfter.potentialMuggyObject).toStrictEqual(gotObjectStateAfter);
      });

      test('[verify] the proc return differs from the fn return in ref', () => {
        expect(procReturn).not.toBe(fnReturn);
      });

      test('[verify] the proc return and its fields equal the mug-like and its fields in ref and value', () => {
        expect(procReturn).toBe(aMugLike);
        ownKeysOfObjectLike(aMugLike).forEach((key) => {
          expect(procReturn[key]).toBe(aMugLike[key]);
        });
        expect(procReturn).toStrictEqual(aMugLike);
      });
    });

    describe('87d8b65, calls "w" with the proc', () => {
      test('[action, verify] the return equals the proc in ref', () => {
        expect(w(customWriteProc)).toBe(customWriteProc);
      });
    });
  });

  describe('cddad6f, the proc generates a state overriding the input state_s string field and potential muggy object field_s string field with the input string, [cite] .:0deb0f9', () => {
    const customWriteFn = jest.fn((state: AState, s: string): AState => {
      return {
        ...state,
        s,
        potentialMuggyObject: {
          ...state.potentialMuggyObject,
          s,
        },
      };
    });

    const customWriteProc = w(customWriteFn);

    let gotAStateBefore: AState, gotAStateAfter: AState;
    let gotObjectStateBefore: ObjectState, gotObjectStateAfter: ObjectState;
    let fnParamState: AState, fnReturn: AState, procReturn: any;

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
        procReturn = customWriteProc(aState, 'sdf');
        fnParamState = customWriteFn.mock.calls[0][0];
        fnReturn = customWriteFn.mock.results[0].value;
      });

      test('[verify] the proc return and its fields equal the fn return and its fields in ref and value', () => {
        expect(procReturn).toBe(fnReturn);
        ownKeysOfObjectLike(fnReturn).forEach((key) => {
          expect(procReturn[key]).toBe(fnReturn[key]);
        });
        expect(procReturn).toStrictEqual(fnReturn);
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
        procReturn = customWriteProc(aState, 'asd');
        fnParamState = customWriteFn.mock.calls[0][0];
        fnReturn = customWriteFn.mock.results[0].value;
      });

      test('[verify] the proc return and its fields equal the fn return and its fields in ref and value', () => {
        expect(procReturn).toBe(fnReturn);
        ownKeysOfObjectLike(fnReturn).forEach((key) => {
          expect(procReturn[key]).toBe(fnReturn[key]);
        });
        expect(procReturn).toStrictEqual(fnReturn);
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
        gotAStateBefore = getIt(aMug);

        procReturn = customWriteProc(aMug, 'sdf');
        fnParamState = customWriteFn.mock.calls[0][0];
        fnReturn = customWriteFn.mock.results[0].value;

        gotAStateAfter = getIt(aMug);
      });

      test('[verify] the proc return differs from the fn return in ref', () => {
        expect(procReturn).not.toBe(fnReturn);
      });

      test('[verify] the proc return equals the mug in ref and value', () => {
        expect(procReturn).toBe(aMug);
        expect(procReturn).toStrictEqual(aMug);
      });

      test('[verify] the before-write got state differs from the fn return in ref', () => {
        expect(gotAStateBefore).not.toBe(fnReturn);
      });

      test('[verify] the before-write got state_s object field and potential muggy object field_s object field equal the fn return_s counterpart fields in ref and value', () => {
        expect(gotAStateBefore.o).toBe(fnReturn.o);
        expect(gotAStateBefore.o).toStrictEqual(fnReturn.o);
        expect(gotAStateBefore.potentialMuggyObject.o).toBe(fnReturn.potentialMuggyObject.o);
        expect(gotAStateBefore.potentialMuggyObject.o).toStrictEqual(
          fnReturn.potentialMuggyObject.o,
        );
      });

      test('[verify] the after-write got state and its fields equal the fn return and its fields in ref and value', () => {
        expect(gotAStateAfter).toBe(fnReturn);
        ownKeysOfObjectLike(fnReturn).forEach((key) => {
          expect(gotAStateAfter[key]).toBe(fnReturn[key]);
        });
        expect(gotAStateAfter).toStrictEqual(fnReturn);
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
        gotAStateBefore = getIt(aMug);

        procReturn = customWriteProc(aMug, 'asd');
        fnParamState = customWriteFn.mock.calls[0][0];
        fnReturn = customWriteFn.mock.results[0].value;

        gotAStateAfter = getIt(aMug);
      });

      test('[verify] the proc return differs from the fn return in ref', () => {
        expect(procReturn).not.toBe(fnReturn);
      });

      test('[verify] the proc return equals the mug in ref and value', () => {
        expect(procReturn).toBe(aMug);
        expect(procReturn).toStrictEqual(aMug);
      });

      test('[verify] the before-write got state and its potential muggy object field differ from the fn return and its counterpart field in ref', () => {
        expect(gotAStateBefore).not.toBe(fnReturn);
      });

      test('[verify] the before-write got state_s string field, object field, and the potential muggy object field_s child fields equal the fn return_s counterpart fields in ref and value', () => {
        expect(gotAStateBefore.s).toBe(fnReturn.s);
        expect(gotAStateBefore.o).toBe(fnReturn.o);
        expect(gotAStateBefore.o).toStrictEqual(fnReturn.o);
        ownKeysOfObjectLike(fnReturn.potentialMuggyObject).forEach((key) => {
          expect(gotAStateBefore.potentialMuggyObject[key]).toBe(
            fnReturn.potentialMuggyObject[key],
          );
          expect(gotAStateBefore.potentialMuggyObject[key]).toStrictEqual(
            fnReturn.potentialMuggyObject[key],
          );
        });
      });

      test('[verify] the got state stays unchanged in ref and value', () => {
        expect(gotAStateAfter).toBe(gotAStateBefore);
        ownKeysOfObjectLike(gotAStateBefore).forEach((key) => {
          expect(gotAStateAfter[key]).toBe(gotAStateBefore[key]);
        });
        expect(gotAStateAfter).toStrictEqual(gotAStateBefore);
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
        gotAStateBefore = getIt(aMugLike);
        gotObjectStateBefore = getIt(objectMug);

        procReturn = customWriteProc(aMugLike, 'sdf');
        fnParamState = customWriteFn.mock.calls[0][0];
        fnReturn = customWriteFn.mock.results[0].value;

        gotAStateAfter = getIt(aMugLike);
        gotObjectStateAfter = getIt(objectMug);
      });

      test('[verify] the proc return differs from the fn return in ref', () => {
        expect(procReturn).not.toBe(fnReturn);
      });

      test('[verify] the proc return_s non-muggy fields equal the fn return_s counterpart fields in ref and value', () => {
        ownKeysOfObjectLike(fnReturn)
          .filter((key) => key !== 'potentialMuggyObject')
          .forEach((key) => {
            expect(procReturn[key]).toBe(fnReturn[key]);
            expect(procReturn[key]).toStrictEqual(fnReturn[key]);
          });
      });

      test('[verify] the proc return_s muggy object field differs from the fn return_s counterpart field in ref', () => {
        expect(procReturn.potentialMuggyObject).not.toBe(fnReturn.potentialMuggyObject);
      });

      test('[verify] the proc return_s muggy object field equals the object mug in ref and value', () => {
        expect(procReturn.potentialMuggyObject).toBe(objectMug);
        expect(procReturn.potentialMuggyObject).toStrictEqual(objectMug);
      });

      test('[verify] the before-write got state differs from the fn return in ref', () => {
        expect(gotAStateBefore).not.toBe(fnReturn);
      });

      test('[verify] the before-write got state_s object field and muggy object field_s object field equal the fn return_s counterpart fields in ref and value', () => {
        expect(gotAStateBefore.o).toBe(fnReturn.o);
        expect(gotAStateBefore.o).toStrictEqual(fnReturn.o);
        expect(gotAStateBefore.potentialMuggyObject.o).toBe(fnReturn.potentialMuggyObject.o);
        expect(gotAStateBefore.potentialMuggyObject.o).toStrictEqual(
          fnReturn.potentialMuggyObject.o,
        );
      });

      test('[verify] the after-write got state differs from the fn return in ref', () => {
        expect(gotAStateAfter).not.toBe(fnReturn);
      });

      test('[verify] the after-write got state_s muggy object field and its child fields equal the fn return_s counterpart field and its child fields in ref and value', () => {
        expect(gotAStateAfter.potentialMuggyObject).toBe(fnReturn.potentialMuggyObject);
        ownKeysOfObjectLike(fnReturn.potentialMuggyObject).forEach((key) => {
          expect(gotAStateAfter.potentialMuggyObject[key]).toBe(fnReturn.potentialMuggyObject[key]);
        });
        expect(gotAStateAfter.potentialMuggyObject).toStrictEqual(fnReturn.potentialMuggyObject);
      });

      test('[verify] the got state_s non-muggy fields and muggy object field_s object field stay unchanged in ref and value', () => {
        ownKeysOfObjectLike(gotAStateBefore)
          .filter((key) => key !== 'potentialMuggyObject')
          .forEach((key) => {
            expect(gotAStateAfter[key]).toBe(gotAStateBefore[key]);
            expect(gotAStateAfter[key]).toStrictEqual(gotAStateBefore[key]);
          });

        expect(gotAStateAfter.potentialMuggyObject.o).toBe(gotAStateBefore.potentialMuggyObject.o);
        expect(gotAStateAfter.potentialMuggyObject.o).toStrictEqual(
          gotAStateBefore.potentialMuggyObject.o,
        );
      });

      test('[verify] the got state_s muggy object field and its child fields keep equal to the object mug_s got state and its fields in ref and value', () => {
        expect(gotAStateBefore.potentialMuggyObject).toBe(gotObjectStateBefore);
        ownKeysOfObjectLike(gotObjectStateBefore).forEach((key) => {
          expect(gotAStateBefore.potentialMuggyObject[key]).toBe(gotObjectStateBefore[key]);
        });
        expect(gotAStateBefore.potentialMuggyObject).toStrictEqual(gotObjectStateBefore);

        expect(gotAStateAfter.potentialMuggyObject).toBe(gotObjectStateAfter);
        ownKeysOfObjectLike(gotObjectStateAfter).forEach((key) => {
          expect(gotAStateAfter.potentialMuggyObject[key]).toBe(gotObjectStateAfter[key]);
        });
        expect(gotAStateAfter.potentialMuggyObject).toStrictEqual(gotObjectStateAfter);
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
        gotAStateBefore = getIt(aMugLike);
        gotObjectStateBefore = getIt(objectMug);

        procReturn = customWriteProc(aMugLike, 'asd');
        fnParamState = customWriteFn.mock.calls[0][0];
        fnReturn = customWriteFn.mock.results[0].value;

        gotAStateAfter = getIt(aMugLike);
        gotObjectStateAfter = getIt(objectMug);
      });

      test('[verify] the proc return differs from the fn return in ref', () => {
        expect(procReturn).not.toBe(fnReturn);
      });

      test('[verify] the proc return_s non-muggy fields equal the fn return_s counterpart fields in ref and value', () => {
        ownKeysOfObjectLike(fnReturn)
          .filter((key) => key !== 'potentialMuggyObject')
          .forEach((key) => {
            expect(procReturn[key]).toBe(fnReturn[key]);
            expect(procReturn[key]).toStrictEqual(fnReturn[key]);
          });
      });

      test('[verify] the proc return_s muggy object field differs from the fn return_s counterpart field in ref', () => {
        expect(procReturn.potentialMuggyObject).not.toBe(fnReturn.potentialMuggyObject);
      });

      test('[verify] the proc return_s muggy object field equals the object mug in ref and value', () => {
        expect(procReturn.potentialMuggyObject).toBe(objectMug);
        expect(procReturn.potentialMuggyObject).toStrictEqual(objectMug);
      });

      test('[verify] the before-write got state and its potential muggy object field differ from the fn return and its counterpart field in ref', () => {
        expect(gotAStateBefore).not.toBe(fnReturn);
      });

      test('[verify] the before-write got state_s string field, object field, and the muggy object field_s child fields equal the fn return_s counterpart fields in ref and value', () => {
        expect(gotAStateBefore.s).toBe(fnReturn.s);
        expect(gotAStateBefore.o).toBe(fnReturn.o);
        expect(gotAStateBefore.o).toStrictEqual(fnReturn.o);
        ownKeysOfObjectLike(fnReturn.potentialMuggyObject).forEach((key) => {
          expect(gotAStateBefore.potentialMuggyObject[key]).toBe(
            fnReturn.potentialMuggyObject[key],
          );
          expect(gotAStateBefore.potentialMuggyObject[key]).toStrictEqual(
            fnReturn.potentialMuggyObject[key],
          );
        });
      });

      test('[verify] the got state and its fields stay unchanged in ref and value', () => {
        expect(gotAStateAfter).toBe(gotAStateBefore);
        ownKeysOfObjectLike(gotAStateBefore).forEach((key) => {
          expect(gotAStateAfter[key]).toBe(gotAStateBefore[key]);
        });
        expect(gotAStateAfter).toStrictEqual(gotAStateBefore);
      });

      test('[verify] the got state_s muggy object field and its child fields keep equal to the object mug_s got state and its fields in ref and value', () => {
        expect(gotAStateBefore.potentialMuggyObject).toBe(gotObjectStateBefore);
        ownKeysOfObjectLike(gotObjectStateBefore).forEach((key) => {
          expect(gotAStateBefore.potentialMuggyObject[key]).toBe(gotObjectStateBefore[key]);
        });
        expect(gotAStateBefore.potentialMuggyObject).toStrictEqual(gotObjectStateBefore);

        expect(gotAStateAfter.potentialMuggyObject).toBe(gotObjectStateAfter);
        ownKeysOfObjectLike(gotObjectStateAfter).forEach((key) => {
          expect(gotAStateAfter.potentialMuggyObject[key]).toBe(gotObjectStateAfter[key]);
        });
        expect(gotAStateAfter.potentialMuggyObject).toStrictEqual(gotObjectStateAfter);
      });
    });
  });
});
