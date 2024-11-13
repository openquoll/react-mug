import { construction, flat, getIt, Mug, MugLike, pure, r, setIt } from '../src';
import { ownKeysOfObjectLike } from '../src/mug';

describe('dd10061, reads by an object state custom read op', () => {
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
      (state: AState, extra: Pick<ObjectState, 'o'>): Pick<ObjectState, 'o'> => {
        return {
          o: {
            s: `${extra.o.s}:${state.potentialMuggyObject.o.s}`,
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

    let gotAState: AState;
    let fnParamState1: AState, fnParamState2: AState;
    let fnParamExtra1: Pick<ObjectState, 'o'>, fnParamExtra2: Pick<ObjectState, 'o'>;
    let fnReturn1: Pick<ObjectState, 'o'>, fnReturn2: Pick<ObjectState, 'o'>;
    let opReturn1: Pick<ObjectState, 'o'>, opReturn2: Pick<ObjectState, 'o'>;

    /**
     * Required variables:
     * - gotAState
     * - opParamState1, opParamState2
     * - opParamExtra1, opParamExtra2
     * - opReturn1, opReturn2,
     * - opReturn1, opReturn2
     */
    function sharedVerifyCases() {
      test('[verify] the first fn-param state and its fields equal the got state and its fields in ref and value', () => {
        expect(fnParamState1).toBe(gotAState);
        ownKeysOfObjectLike(gotAState).forEach((key) => {
          expect(fnParamState1[key]).toBe(gotAState[key]);
        });
        expect(fnParamState1).toStrictEqual(gotAState);
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

      test('[verify] the op return and its fields keep equal to the fn return and its fields in ref and value', () => {
        expect(opReturn1).toBe(fnReturn1);
        ownKeysOfObjectLike(fnReturn1).forEach((key) => {
          expect(opReturn1[key]).toBe(fnReturn1[key]);
        });
        expect(opReturn1).toStrictEqual(fnReturn1);

        expect(opReturn2).toBe(fnReturn2);
        ownKeysOfObjectLike(fnReturn2).forEach((key) => {
          expect(opReturn2[key]).toBe(fnReturn2[key]);
        });
        expect(opReturn2).toStrictEqual(fnReturn2);
      });

      test('[verify] the op return and its fields change in ref but not in value', () => {
        expect(opReturn2).not.toBe(opReturn1);
        ownKeysOfObjectLike(opReturn1).forEach((key) => {
          expect(opReturn2[key]).not.toBe(opReturn1[key]);
        });
        expect(opReturn2).toStrictEqual(opReturn1);
      });
    }

    describe('efdaecb, continuously reads a constant plain object state, [cite] 002', () => {
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
        gotAState = getIt(aState);

        opReturn1 = customReadOp(aState, extra);
        fnParamState1 = customReadFn.mock.calls[0][0];
        fnParamExtra1 = customReadFn.mock.calls[0][1];
        fnReturn1 = customReadFn.mock.results[0].value;

        opReturn2 = customReadOp(aState, extra);
        fnParamState2 = customReadFn.mock.calls[1][0];
        fnParamExtra2 = customReadFn.mock.calls[1][1];
        fnReturn2 = customReadFn.mock.results[1].value;
      });

      sharedVerifyCases();
    });

    describe('c2f5436, continuously reads a plain object mug before write, [cite] 001', () => {
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
        gotAState = getIt(aMug);

        opReturn1 = customReadOp(aMug, extra);
        fnParamState1 = customReadFn.mock.calls[0][0];
        fnParamExtra1 = customReadFn.mock.calls[0][1];
        fnReturn1 = customReadFn.mock.results[0].value;

        opReturn2 = customReadOp(aMug, extra);
        fnParamState2 = customReadFn.mock.calls[1][0];
        fnParamExtra2 = customReadFn.mock.calls[1][1];
        fnReturn2 = customReadFn.mock.results[1].value;
      });

      sharedVerifyCases();
    });

    describe('888be13, continuously reads a plain object mug after write, [cite] 001', () => {
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
        setIt(aMug, {
          potentialMuggyObject: { s: 'sdf' },
        });
        gotAState = getIt(aMug);
        expect(gotAState).toMatchObject({
          potentialMuggyObject: { s: 'sdf' },
        });

        opReturn1 = customReadOp(aMug, extra);
        fnParamState1 = customReadFn.mock.calls[0][0];
        fnParamExtra1 = customReadFn.mock.calls[0][1];
        fnReturn1 = customReadFn.mock.results[0].value;

        opReturn2 = customReadOp(aMug, extra);
        fnParamState2 = customReadFn.mock.calls[1][0];
        fnParamExtra2 = customReadFn.mock.calls[1][1];
        fnReturn2 = customReadFn.mock.results[1].value;
      });

      sharedVerifyCases();
    });

    describe('3c73402, continuously reads a class-defined object mug before write, [cite] 001', () => {
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
        gotAState = getIt(aMug);

        opReturn1 = customReadOp(aMug, extra);
        fnParamState1 = customReadFn.mock.calls[0][0];
        fnParamExtra1 = customReadFn.mock.calls[0][1];
        fnReturn1 = customReadFn.mock.results[0].value;

        opReturn2 = customReadOp(aMug, extra);
        fnParamState2 = customReadFn.mock.calls[1][0];
        fnParamExtra2 = customReadFn.mock.calls[1][1];
        fnReturn2 = customReadFn.mock.results[1].value;
      });

      sharedVerifyCases();
    });

    describe('e8d45b9, continuously reads a class-defined object mug after write, [cite] 001', () => {
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
        setIt(aMug, {
          potentialMuggyObject: { s: 'sdf' },
        });
        gotAState = getIt(aMug);
        expect(gotAState).toMatchObject({
          potentialMuggyObject: { s: 'sdf' },
        });

        opReturn1 = customReadOp(aMug, extra);
        fnParamState1 = customReadFn.mock.calls[0][0];
        fnParamExtra1 = customReadFn.mock.calls[0][1];
        fnReturn1 = customReadFn.mock.results[0].value;

        opReturn2 = customReadOp(aMug, extra);
        fnParamState2 = customReadFn.mock.calls[1][0];
        fnParamExtra2 = customReadFn.mock.calls[1][1];
        fnReturn2 = customReadFn.mock.results[1].value;
      });

      sharedVerifyCases();
    });

    describe('6e9b3ce, continuously reads a constant mug-nested object mug-like before write, [cite] 002', () => {
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
        gotAState = getIt(aMugLike);

        opReturn1 = customReadOp(aMugLike, extra);
        fnParamState1 = customReadFn.mock.calls[0][0];
        fnParamExtra1 = customReadFn.mock.calls[0][1];
        fnReturn1 = customReadFn.mock.results[0].value;

        opReturn2 = customReadOp(aMugLike, extra);
        fnParamState2 = customReadFn.mock.calls[1][0];
        fnParamExtra2 = customReadFn.mock.calls[1][1];
        fnReturn2 = customReadFn.mock.results[1].value;
      });

      sharedVerifyCases();
    });

    describe('25cfa11, continuously reads a constant mug-nested object mug-like after write, [cite] 002', () => {
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
        setIt(aMugLike, {
          potentialMuggyObject: { s: 'sdf' },
        });
        gotAState = getIt(aMugLike);
        expect(gotAState).toMatchObject({
          potentialMuggyObject: { s: 'sdf' },
        });

        opReturn1 = customReadOp(aMugLike, extra);
        fnParamState1 = customReadFn.mock.calls[0][0];
        fnParamExtra1 = customReadFn.mock.calls[0][1];
        fnReturn1 = customReadFn.mock.results[0].value;

        opReturn2 = customReadOp(aMugLike, extra);
        fnParamState2 = customReadFn.mock.calls[1][0];
        fnParamExtra2 = customReadFn.mock.calls[1][1];
        fnReturn2 = customReadFn.mock.results[1].value;
      });

      sharedVerifyCases();
    });

    describe('87d8b65, calls "r" with the op', () => {
      test('[action, verify] the return equals the op in ref', () => {
        expect(r(customReadOp)).toBe(customReadOp);
      });
    });

    describe('cf2f9b9, calls "flat" with the op', () => {
      test('[action, verify] the return equals the op in ref', () => {
        expect(flat(customReadOp)).toBe(customReadOp);
      });
    });

    describe('8addc1d, accesses the op_s "pure" field', () => {
      test('[action, verify] the field equals the fn in ref', () => {
        expect(customReadOp.pure).toBe(customReadFn);
      });
    });

    describe('9e9d139, calls "pure" with the op', () => {
      test('[action, verify] the return equals the fn in ref', () => {
        expect(pure(customReadOp)).toBe(customReadFn);
      });
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

      test('[action, verify] the op return and its fields stay unchanged in ref and value', () => {
        setIt(aMugLike, {
          potentialMuggyObject: { s: 'sdf' },
        });
        const gotAState = getIt(aMugLike);
        expect(gotAState).toMatchObject({
          potentialMuggyObject: { s: 'sdf' },
        });
        const gotObjectState = getIt(objectMug);
        expect(gotObjectState).toMatchObject({ s: 'sdf' });

        const opReturn1 = customReadOp(aMugLike);

        const opReturn2 = customReadOp(aMugLike);

        expect(opReturn2).toBe(opReturn1);
        ownKeysOfObjectLike(opReturn1).forEach((key) => {
          expect(opReturn2[key]).toBe(opReturn1[key]);
        });
        expect(opReturn2).toStrictEqual(opReturn1);
      });
    });
  });
});
