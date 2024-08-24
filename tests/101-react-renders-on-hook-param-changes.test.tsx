import { render } from '@testing-library/react';

import { check, construction, Mug, PossibleMugLike, r, useOperator } from '../src';
import { ownKeysOfObjectLike } from '../src/mug';

describe('229a728, react renders on hook param changes', () => {
  interface ObjectState {
    s: string;
    o: {
      s: string;
    };
  }

  interface AState extends ObjectState {
    potentialMuggyObject: ObjectState;
  }

  const tapHookReturn = jest.fn();

  describe('cbf2e14, the read op changes', () => {
    const readFn1 = jest.fn((aState: AState): ObjectState['o'] => {
      return { s: 'ba9' };
    });

    const readOp1 = r(readFn1);

    const readFn2 = jest.fn((aState: AState): ObjectState['o'] => {
      return { s: 'c50' };
    });

    const readOp2 = r(readFn2);

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

    type Props = {
      readOp: (mugLike: any, ...restArgs: any) => any;
    };

    const AComponent = jest.fn(({ readOp }: Props) => {
      const hookReturn = useOperator(readOp, aMug);
      tapHookReturn(hookReturn);
      return <div />;
    });

    describe('ff6702a, initially renders with read op#1', () => {
      let checkedState1: any;
      let readFn1ParamState1: any, readFn1Return1: any;
      let hookReturn1: any;

      test('[action]', () => {
        checkedState1 = check(aMug);
        render(<AComponent readOp={readOp1} />);
        readFn1ParamState1 = readFn1.mock.calls[0][0];
        readFn1Return1 = readFn1.mock.results[0].value;
        hookReturn1 = tapHookReturn.mock.calls[0][0];
      });

      test('[verify] read fn#1 is called 1 time', () => {
        expect(readFn1).toHaveBeenCalledTimes(1);
      });

      test('[verify] read fn#1 param state and its fields equal the checked state and its fields in ref and value', () => {
        expect(readFn1ParamState1).toBe(checkedState1);
        ownKeysOfObjectLike(checkedState1).forEach((key) => {
          expect(readFn1ParamState1[key]).toBe(checkedState1[key]);
        });
        expect(readFn1ParamState1).toStrictEqual(checkedState1);
      });

      test('[verify] the component render is called 1 time', () => {
        expect(AComponent).toHaveBeenCalledTimes(1);
      });

      test('[verify] the hook return equals read fn#1 return in ref and value', () => {
        expect(hookReturn1).toBe(readFn1Return1);
        ownKeysOfObjectLike(readFn1Return1).forEach((key) => {
          expect(hookReturn1[key]).toBe(readFn1Return1[key]);
        });
        expect(hookReturn1).toStrictEqual(readFn1Return1);
      });
    });

    describe('209e098, initially renders with read op#1, rerenders with read op#2, [cite] .:ff6702a', () => {
      let hookReturn1: any, hookReturn2: any;

      test('[action]', () => {
        const { rerender } = render(<AComponent readOp={readOp1} />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        readFn1.mockClear();
        rerender(<AComponent readOp={readOp2} />);
        hookReturn2 = tapHookReturn.mock.calls[1][0];
      });

      test('[verify] read fn#1 is not called on rerender', () => {
        expect(readFn1).not.toHaveBeenCalled();
      });

      test('[verify] read fn#2 is not called', () => {
        expect(readFn2).not.toHaveBeenCalled();
      });

      test('[verify] the component render is called 2 times', () => {
        expect(AComponent).toHaveBeenCalledTimes(2);
      });

      test('[verify] the hook return and its fields stay unchanged in ref and value', () => {
        expect(hookReturn2).toBe(hookReturn1);
        ownKeysOfObjectLike(hookReturn1).forEach((key) => {
          expect(hookReturn2[key]).toBe(hookReturn1[key]);
        });
        expect(hookReturn2).toStrictEqual(hookReturn1);
      });
    });

    describe('be7a5e5, initially renders and rerenders with read op#1, [cite] .:ff6702a', () => {
      let hookReturn1: any, hookReturn2: any;

      test('[action]', () => {
        const { rerender } = render(<AComponent readOp={readOp1} />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        readFn1.mockClear();
        rerender(<AComponent readOp={readOp1} />);
        hookReturn2 = tapHookReturn.mock.calls[1][0];
      });

      test('[verify] read fn#1 is not called on rerender', () => {
        expect(readFn1).not.toHaveBeenCalled();
      });

      test('[verify] the component render is called 2 times', () => {
        expect(AComponent).toHaveBeenCalledTimes(2);
      });

      test('[verify] the read fn return and its fields stay unchanged in ref and value', () => {
        expect(hookReturn2).toBe(hookReturn1);
        ownKeysOfObjectLike(hookReturn1).forEach((key) => {
          expect(hookReturn2[key]).toBe(hookReturn1[key]);
        });
        expect(hookReturn2).toStrictEqual(hookReturn1);
      });
    });
  });

  describe('0e73ab1, the mug-like changes', () => {
    const readFn = jest.fn((aState: AState) => {
      return aState;
    });

    const readOp = r(readFn);

    type Props = {
      mugLike: PossibleMugLike<AState>;
    };

    const AComponent = jest.fn(({ mugLike }: Props) => {
      const hookReturn = useOperator(readOp, mugLike);
      tapHookReturn(hookReturn);
      return <div />;
    });

    let checkedState1: any, checkedState2: any;
    let readFnParamState1: any, readFnParamState2: any;
    let readFnReturn1: any, readFnReturn2: any;
    let hookReturn1: any, hookReturn2: any;

    /**
     * Required variables: hookReturn1, hookReturn2
     */
    function sharedVerifyCasesOfReadFnNotCalledOnRerenderAndHookResultUnchanged() {
      test('[verify] the read fn is not called on rerender', () => {
        expect(readFn).not.toHaveBeenCalled();
      });

      test('[verify] the component render is called 2 times', () => {
        expect(AComponent).toHaveBeenCalledTimes(2);
      });

      test('[verify] the read fn return and its fields stay unchanged in ref and value', () => {
        expect(hookReturn2).toBe(hookReturn1);
        ownKeysOfObjectLike(hookReturn1).forEach((key) => {
          expect(hookReturn2[key]).toBe(hookReturn1[key]);
        });
        expect(hookReturn2).toStrictEqual(hookReturn1);
      });
    }

    /**
     * Required variables: readFnReturn2, hookReturn1, hookReturn2
     */
    function sharedVerifyCasesOfReadFnCalledOnRerenderAndHookResultChanged() {
      test('[verify] the read fn is called 1 time on rerender', () => {
        expect(readFn).toHaveBeenCalledTimes(1);
      });

      test('[verify] the component render is called 2 times', () => {
        expect(AComponent).toHaveBeenCalledTimes(2);
      });

      test('[verify] the hook result changes in ref', () => {
        expect(hookReturn2).not.toBe(hookReturn1);
      });

      test('[verify] the hook on-rerender result and its fields equal the read fn on-rerender return in ref and value', () => {
        expect(hookReturn2).toBe(readFnReturn2);
        ownKeysOfObjectLike(readFnReturn2).forEach((key) => {
          expect(hookReturn2[key]).toBe(readFnReturn2[key]);
        });
        expect(hookReturn2).toStrictEqual(readFnReturn2);
      });
    }

    /**
     * Required variables: readFnReturn2, hookReturn1, hookReturn2
     */
    function sharedVerifyCasesOfReadFnCalledOnRerenderButHookResultUnhanged() {
      test('[verify] the read fn is called 1 time on rerender', () => {
        expect(readFn).toHaveBeenCalledTimes(1);
      });

      test('[verify] the component render is called 2 times', () => {
        expect(AComponent).toHaveBeenCalledTimes(2);
      });

      test('[verify] the hook result and its fields stay unchanged in ref and value', () => {
        expect(hookReturn2).toBe(hookReturn1);
        ownKeysOfObjectLike(hookReturn1).forEach((key) => {
          expect(hookReturn2[key]).toBe(hookReturn1[key]);
        });
        expect(hookReturn2).toStrictEqual(hookReturn1);
      });
    }

    describe('7a6562a, initially renders with a state', () => {
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
        render(<AComponent mugLike={aState} />);
        readFnParamState1 = readFn.mock.calls[0][0];
        readFnReturn1 = readFn.mock.results[0].value;
        hookReturn1 = tapHookReturn.mock.calls[0][0];
      });

      test('[verify] the read fn is called 1 time', () => {
        expect(readFn).toHaveBeenCalledTimes(1);
      });

      test('[verify] the read fn param state and its fields equal the input state and its fields in ref and value', () => {
        expect(readFnParamState1).toBe(aState);
        ownKeysOfObjectLike(aState).forEach((key) => {
          expect(aState[key]).toBe(readFnParamState1[key]);
        });
        expect(readFnParamState1).toStrictEqual(aState);
      });

      test('[verify] the component render is called 1 time', () => {
        expect(AComponent).toHaveBeenCalledTimes(1);
      });

      test('[verify] the hook return and its fields equal the read fn return and its fields in ref and value', () => {
        expect(hookReturn1).toBe(readFnReturn1);
        ownKeysOfObjectLike(readFnReturn1).forEach((key) => {
          expect(hookReturn1[key]).toBe(readFnReturn1[key]);
        });
        expect(hookReturn1).toStrictEqual(readFnReturn1);
      });
    });

    describe('2335a22, initially renders with a state, rerenders with a second state different in ref and value, [cite] .:7a6562a', () => {
      const aState1: AState = {
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

      const aState2: AState = {
        s: 'sdf',
        o: {
          s: 'sdf',
        },
        potentialMuggyObject: {
          s: 'sdf',
          o: {
            s: 'sdf',
          },
        },
      };

      test('[action]', () => {
        const { rerender } = render(<AComponent mugLike={aState1} />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        readFn.mockClear();
        rerender(<AComponent mugLike={aState2} />);
        readFnParamState2 = readFn.mock.calls[0][0];
        readFnReturn2 = readFn.mock.results[0].value;
        hookReturn2 = tapHookReturn.mock.calls[1][0];
      });

      sharedVerifyCasesOfReadFnCalledOnRerenderAndHookResultChanged();

      test('[verify] the read fn on-rerender param state and its fields equal the second input state and its fields in ref and value', () => {
        expect(readFnParamState2).toBe(aState2);
        ownKeysOfObjectLike(aState2).forEach((key) => {
          expect(readFnParamState2[key]).toBe(aState2[key]);
        });
        expect(readFnParamState2).toStrictEqual(aState2);
      });
    });

    describe('ac54a33, initially renders with a state, rerenders with a mug-nested mug-like different in evaluated value, [cite] .:7a6562a', () => {
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

      const aMugLike: PossibleMugLike<AState> = {
        s: 'sdf',
        o: {
          s: 'sdf',
        },
        potentialMuggyObject: {
          [construction]: {
            s: 'sdf',
            o: {
              s: 'sdf',
            },
          },
        },
      };

      test('[action]', () => {
        const { rerender } = render(<AComponent mugLike={aState} />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        checkedState2 = check(aMugLike);
        readFn.mockClear();
        rerender(<AComponent mugLike={aMugLike} />);
        readFnParamState2 = readFn.mock.calls[0][0];
        readFnReturn2 = readFn.mock.results[0].value;
        hookReturn2 = tapHookReturn.mock.calls[1][0];
      });

      sharedVerifyCasesOfReadFnCalledOnRerenderAndHookResultChanged();

      test('[verify] the read fn on-rerender param state and its fields equal the mug-like_s checked state and its fields in ref and value', () => {
        expect(readFnParamState2).toBe(checkedState2);
        ownKeysOfObjectLike(checkedState2).forEach((key) => {
          expect(readFnParamState2[key]).toBe(checkedState2[key]);
        });
        expect(readFnParamState2).toStrictEqual(checkedState2);
      });
    });

    describe('2836220, initially renders with a state, rerenders with a mug different in evaluated value, [cite] .:7a6562a', () => {
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

      const aMug: Mug<AState> = {
        [construction]: {
          s: 'sdf',
          o: {
            s: 'sdf',
          },
          potentialMuggyObject: {
            s: 'sdf',
            o: {
              s: 'sdf',
            },
          },
        },
      };

      test('[action]', () => {
        const { rerender } = render(<AComponent mugLike={aState} />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        checkedState2 = check(aMug);
        readFn.mockClear();
        rerender(<AComponent mugLike={aMug} />);
        readFnParamState2 = readFn.mock.calls[0][0];
        readFnReturn2 = readFn.mock.results[0].value;
        hookReturn2 = tapHookReturn.mock.calls[1][0];
      });

      sharedVerifyCasesOfReadFnCalledOnRerenderAndHookResultChanged();

      test('[verify] the read fn on-rerender param state and its fields equal the mug-like_s checked state and its fields in ref and value', () => {
        expect(readFnParamState2).toBe(checkedState2);
        ownKeysOfObjectLike(checkedState2).forEach((key) => {
          expect(readFnParamState2[key]).toBe(checkedState2[key]);
        });
        expect(readFnParamState2).toStrictEqual(checkedState2);
      });
    });

    describe('b705229, initially renders with a state, rerenders with a second state different in ref but equal in value, [cite] .:7a6562a', () => {
      const aState1: AState = {
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

      const aState2: AState = {
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
        const { rerender } = render(<AComponent mugLike={aState1} />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        readFn.mockClear();
        rerender(<AComponent mugLike={aState2} />);
        hookReturn2 = tapHookReturn.mock.calls[1][0];
      });

      sharedVerifyCasesOfReadFnNotCalledOnRerenderAndHookResultUnchanged();
    });

    describe('29c2555, initially renders with a state, rerenders with a mug-nested mug-like equal in evaluated value, [cite] .:7a6562a', () => {
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

      const aMugLike: PossibleMugLike<AState> = {
        s: 'asd',
        o: {
          s: 'asd',
        },
        potentialMuggyObject: {
          [construction]: {
            s: 'asd',
            o: {
              s: 'asd',
            },
          },
        },
      };

      test('[action]', () => {
        const { rerender } = render(<AComponent mugLike={aState} />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        readFn.mockClear();
        checkedState2 = check(aMugLike);
        rerender(<AComponent mugLike={aMugLike} />);
        readFnParamState2 = readFn.mock.calls[0][0];
        hookReturn2 = tapHookReturn.mock.calls[1][0];
      });

      sharedVerifyCasesOfReadFnCalledOnRerenderButHookResultUnhanged();

      test('[verify] the read fn_s on-rerender param state and its fields equal the mug-like_s checked state and its fields in ref and value', () => {
        expect(readFnParamState2).toBe(checkedState2);
        ownKeysOfObjectLike(checkedState2).forEach((key) => {
          expect(readFnParamState2[key]).toBe(checkedState2[key]);
        });
        expect(readFnParamState2).toStrictEqual(checkedState2);
      });
    });

    describe('b295bc3, initially renders with a state, rerenders with a mug equal in evaluated value, [cite] .:7a6562a', () => {
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
        const { rerender } = render(<AComponent mugLike={aState} />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        readFn.mockClear();
        checkedState2 = check(aMug);
        rerender(<AComponent mugLike={aMug} />);
        readFnParamState2 = readFn.mock.calls[0][0];
        readFnReturn2 = readFn.mock.results[0].value;
        hookReturn2 = tapHookReturn.mock.calls[1][0];
      });

      sharedVerifyCasesOfReadFnCalledOnRerenderButHookResultUnhanged();

      test('[verify] read fn_s on-rerender param state and its fields equal the mug_s checked state and its fields in ref and value', () => {
        expect(readFnParamState2).toBe(checkedState2);
        ownKeysOfObjectLike(checkedState2).forEach((key) => {
          expect(readFnParamState2[key]).toBe(checkedState2[key]);
        });
        expect(readFnParamState2).toStrictEqual(checkedState2);
      });
    });

    describe('0542c4e, initially renders with a state, rerenders with the same state, [cite] .:7a6562a', () => {
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
        const { rerender } = render(<AComponent mugLike={aState} />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        readFn.mockClear();
        rerender(<AComponent mugLike={aState} />);
        hookReturn2 = tapHookReturn.mock.calls[1][0];
      });

      sharedVerifyCasesOfReadFnNotCalledOnRerenderAndHookResultUnchanged();
    });

    describe('f0432c9, initially renders with a mug', () => {
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
        checkedState1 = check(aMug);
        render(<AComponent mugLike={aMug} />);
        readFnParamState1 = readFn.mock.calls[0][0];
        readFnReturn1 = readFn.mock.results[0].value;
        hookReturn1 = tapHookReturn.mock.calls[0][0];
      });

      test('[verify] the read fn is called 1 time', () => {
        expect(readFn).toHaveBeenCalledTimes(1);
      });

      test('[verify] the read fn param state and its fields equal the mug_s checked state and its fields in ref and value', () => {
        expect(readFnParamState1).toBe(checkedState1);
        ownKeysOfObjectLike(checkedState1).forEach((key) => {
          expect(checkedState1[key]).toBe(readFnParamState1[key]);
        });
        expect(readFnParamState1).toStrictEqual(checkedState1);
      });

      test('[verify] the component render is called 1 time', () => {
        expect(AComponent).toHaveBeenCalledTimes(1);
      });

      test('[verify] the hook return and its fields equal the read fn return and its fields in ref and value', () => {
        expect(hookReturn1).toBe(readFnReturn1);
        ownKeysOfObjectLike(readFnReturn1).forEach((key) => {
          expect(hookReturn1[key]).toBe(readFnReturn1[key]);
        });
        expect(hookReturn1).toStrictEqual(readFnReturn1);
      });
    });

    describe('120567d, initially renders with a mug, rerenders with a second mug different in ref and evaluated value, [cite] .:f0432c9', () => {
      const aMug1: Mug<AState> = {
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

      const aMug2: Mug<AState> = {
        [construction]: {
          s: 'sdf',
          o: {
            s: 'sdf',
          },
          potentialMuggyObject: {
            s: 'sdf',
            o: {
              s: 'sdf',
            },
          },
        },
      };

      test('[action]', () => {
        const { rerender } = render(<AComponent mugLike={aMug1} />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        checkedState2 = check(aMug2);
        readFn.mockClear();
        rerender(<AComponent mugLike={aMug2} />);
        readFnParamState2 = readFn.mock.calls[0][0];
        readFnReturn2 = readFn.mock.results[0].value;
        hookReturn2 = tapHookReturn.mock.calls[1][0];
      });

      sharedVerifyCasesOfReadFnCalledOnRerenderAndHookResultChanged();

      test('[verify] the read fn on-rerender param state and its fields equal the second mug_s checked state and its fields in ref and value', () => {
        expect(readFnParamState2).toBe(checkedState2);
        ownKeysOfObjectLike(checkedState2).forEach((key) => {
          expect(readFnParamState2[key]).toBe(checkedState2[key]);
        });
        expect(readFnParamState2).toStrictEqual(checkedState2);
      });
    });

    describe('56f04f7, initially renders with a mug, rerenders with a mug-nested mug-like different in evaluated value, [cite] .:f0432c9', () => {
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

      const aMugLike: PossibleMugLike<AState> = {
        s: 'sdf',
        o: {
          s: 'sdf',
        },
        potentialMuggyObject: {
          [construction]: {
            s: 'sdf',
            o: {
              s: 'sdf',
            },
          },
        },
      };

      test('[action]', () => {
        const { rerender } = render(<AComponent mugLike={aMug} />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        checkedState2 = check(aMugLike);
        readFn.mockClear();
        rerender(<AComponent mugLike={aMugLike} />);
        readFnParamState2 = readFn.mock.calls[0][0];
        readFnReturn2 = readFn.mock.results[0].value;
        hookReturn2 = tapHookReturn.mock.calls[1][0];
      });

      sharedVerifyCasesOfReadFnCalledOnRerenderAndHookResultChanged();

      test('[verify] the read fn on-rerender param state and its fields equal the mug-like_s checked state and its fields in ref and value', () => {
        expect(readFnParamState2).toBe(checkedState2);
        ownKeysOfObjectLike(checkedState2).forEach((key) => {
          expect(readFnParamState2[key]).toBe(checkedState2[key]);
        });
        expect(readFnParamState2).toStrictEqual(checkedState2);
      });
    });

    describe('4a88802, initially renders with a mug, rerenders with a second mug different in ref but equal in evaluated value, [cite] .:f0432c9', () => {
      const aMug1: Mug<AState> = {
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

      const aMug2: Mug<AState> = {
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
        const { rerender } = render(<AComponent mugLike={aMug1} />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        checkedState2 = check(aMug2);
        readFn.mockClear();
        rerender(<AComponent mugLike={aMug2} />);
        readFnParamState2 = readFn.mock.calls[0][0];
        hookReturn2 = tapHookReturn.mock.calls[1][0];
      });

      sharedVerifyCasesOfReadFnCalledOnRerenderButHookResultUnhanged();

      test('[verify] the read fn on-rerender param state and its fields equal the second mug_s checked state and its fields in ref and value', () => {
        expect(readFnParamState2).toBe(checkedState2);
        ownKeysOfObjectLike(checkedState2).forEach((key) => {
          expect(readFnParamState2[key]).toBe(checkedState2[key]);
        });
        expect(readFnParamState2).toStrictEqual(checkedState2);
      });
    });

    describe('0345a6a, initially renders with a mug, rerenders with a mug-nested mug-like equal in evaluated value, [cite] .:f0432c9', () => {
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

      const aMugLike: PossibleMugLike<AState> = {
        s: 'asd',
        o: {
          s: 'asd',
        },
        potentialMuggyObject: {
          [construction]: {
            s: 'asd',
            o: {
              s: 'asd',
            },
          },
        },
      };

      test('[action]', () => {
        const { rerender } = render(<AComponent mugLike={aMug} />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        readFn.mockClear();
        checkedState2 = check(aMugLike);
        rerender(<AComponent mugLike={aMugLike} />);
        readFnParamState2 = readFn.mock.calls[0][0];
        hookReturn2 = tapHookReturn.mock.calls[1][0];
      });

      sharedVerifyCasesOfReadFnCalledOnRerenderButHookResultUnhanged();

      test('[verify] read fn_s on-rerender param state and its fields equal the mug-like_s checked state and its fields in ref and value', () => {
        expect(readFnParamState2).toBe(checkedState2);
        ownKeysOfObjectLike(checkedState2).forEach((key) => {
          expect(readFnParamState2[key]).toBe(checkedState2[key]);
        });
        expect(readFnParamState2).toStrictEqual(checkedState2);
      });
    });

    describe('a684d16, initially renders with a mug, rerenders with the same mug, [cite] .:f0432c9', () => {
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
        const { rerender } = render(<AComponent mugLike={aMug} />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        readFn.mockClear();
        rerender(<AComponent mugLike={aMug} />);
        hookReturn2 = tapHookReturn.mock.calls[1][0];
      });

      sharedVerifyCasesOfReadFnNotCalledOnRerenderAndHookResultUnchanged();
    });

    describe('90dde99, initially renders with a mug-nested mug-like', () => {
      const aMugLike: PossibleMugLike<AState> = {
        s: 'asd',
        o: {
          s: 'asd',
        },
        potentialMuggyObject: {
          [construction]: {
            s: 'asd',
            o: {
              s: 'asd',
            },
          },
        },
      };

      test('[action]', () => {
        checkedState1 = check(aMugLike);
        render(<AComponent mugLike={aMugLike} />);
        readFnParamState1 = readFn.mock.calls[0][0];
        readFnReturn1 = readFn.mock.results[0].value;
        hookReturn1 = tapHookReturn.mock.calls[0][0];
      });

      test('[verify] the read fn is called 1 time', () => {
        expect(readFn).toHaveBeenCalledTimes(1);
      });

      test('[verify] the read fn param state and its fields equal the mug_s checked state and its fields in ref and value', () => {
        expect(readFnParamState1).toBe(checkedState1);
        ownKeysOfObjectLike(checkedState1).forEach((key) => {
          expect(checkedState1[key]).toBe(readFnParamState1[key]);
        });
        expect(readFnParamState1).toStrictEqual(checkedState1);
      });

      test('[verify] the component render is called 1 time', () => {
        expect(AComponent).toHaveBeenCalledTimes(1);
      });

      test('[verify] the hook return and its fields equal the read fn return and its fields in ref and value', () => {
        expect(hookReturn1).toBe(readFnReturn1);
        ownKeysOfObjectLike(readFnReturn1).forEach((key) => {
          expect(hookReturn1[key]).toBe(readFnReturn1[key]);
        });
        expect(hookReturn1).toStrictEqual(readFnReturn1);
      });
    });

    describe('352eb49, initially renders with a mug-nest mug-like, rerenders with a second mug-nested mug-like different in ref and evaluated value, [cite] .:90dde99', () => {
      const aMugLike1: PossibleMugLike<AState> = {
        s: 'asd',
        o: {
          s: 'asd',
        },
        potentialMuggyObject: {
          [construction]: {
            s: 'asd',
            o: {
              s: 'asd',
            },
          },
        },
      };

      const aMugLike2: PossibleMugLike<AState> = {
        s: 'sdf',
        o: {
          s: 'sdf',
        },
        potentialMuggyObject: {
          [construction]: {
            s: 'sdf',
            o: {
              s: 'sdf',
            },
          },
        },
      };

      test('[action]', () => {
        const { rerender } = render(<AComponent mugLike={aMugLike1} />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        checkedState2 = check(aMugLike2);
        readFn.mockClear();
        rerender(<AComponent mugLike={aMugLike2} />);
        readFnParamState2 = readFn.mock.calls[0][0];
        readFnReturn2 = readFn.mock.results[0].value;
        hookReturn2 = tapHookReturn.mock.calls[1][0];
      });

      sharedVerifyCasesOfReadFnCalledOnRerenderAndHookResultChanged();

      test('[verify] the read fn on-rerender param state and its fields equal the second mug_s checked state and its fields in ref and value', () => {
        expect(readFnParamState2).toBe(checkedState2);
        ownKeysOfObjectLike(checkedState2).forEach((key) => {
          expect(readFnParamState2[key]).toBe(checkedState2[key]);
        });
        expect(readFnParamState2).toStrictEqual(checkedState2);
      });
    });

    describe('2c5a287, initially renders with a mug-nest mug-like, rerenders with a second mug-nested mug-like different in ref but equal in evaluated value, [cite] .:90dde99', () => {
      const aMugLike1: PossibleMugLike<AState> = {
        s: 'asd',
        o: {
          s: 'asd',
        },
        potentialMuggyObject: {
          [construction]: {
            s: 'asd',
            o: {
              s: 'asd',
            },
          },
        },
      };

      const aMugLike2: PossibleMugLike<AState> = {
        s: 'asd',
        o: {
          s: 'asd',
        },
        potentialMuggyObject: {
          [construction]: {
            s: 'asd',
            o: {
              s: 'asd',
            },
          },
        },
      };

      test('[action]', () => {
        const { rerender } = render(<AComponent mugLike={aMugLike1} />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        checkedState2 = check(aMugLike2);
        readFn.mockClear();
        rerender(<AComponent mugLike={aMugLike2} />);
        readFnParamState2 = readFn.mock.calls[0][0];
        hookReturn2 = tapHookReturn.mock.calls[1][0];
      });

      sharedVerifyCasesOfReadFnCalledOnRerenderButHookResultUnhanged();

      test('[verify] the read fn on-rerender param state and its fields equal the second mug_s checked state and its fields in ref and value', () => {
        expect(readFnParamState2).toBe(checkedState2);
        ownKeysOfObjectLike(checkedState2).forEach((key) => {
          expect(readFnParamState2[key]).toBe(checkedState2[key]);
        });
        expect(readFnParamState2).toStrictEqual(checkedState2);
      });
    });

    describe('8cfdabb, initially renders with a mug-nest mug-like, rerenders with the same mug-like, [cite] .:90dde99', () => {
      const aMugLike: PossibleMugLike<AState> = {
        s: 'asd',
        o: {
          s: 'asd',
        },
        potentialMuggyObject: {
          [construction]: {
            s: 'asd',
            o: {
              s: 'asd',
            },
          },
        },
      };

      test('[action]', () => {
        const { rerender } = render(<AComponent mugLike={aMugLike} />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        readFn.mockClear();
        rerender(<AComponent mugLike={aMugLike} />);
        hookReturn2 = tapHookReturn.mock.calls[1][0];
      });

      sharedVerifyCasesOfReadFnNotCalledOnRerenderAndHookResultUnchanged();
    });
  });

  describe('adfe9bc, the rest args change', () => {
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

    const readFn = jest.fn(
      (aState: AState, extra: Pick<ObjectState, 'o'>): Pick<ObjectState, 'o'> => {
        return {
          o: {
            s: `${extra.o.s}:${aState.potentialMuggyObject.o.s}`,
          },
        };
      },
    );

    const readOp = r(readFn);

    type Props = {
      extra: Pick<ObjectState, 'o'>;
    };

    const AComponent = jest.fn(({ extra }: Props) => {
      const hookReturn = useOperator(readOp, aMug, extra);
      tapHookReturn(hookReturn);
      return <div />;
    });

    describe('3d70420, initially renders with an extra', () => {
      const extra: Pick<ObjectState, 'o'> = {
        o: {
          s: 'asd',
        },
      };

      let readFnParamExtra1: any;
      let readFnReturn1: any;
      let hookReturn1: any;

      test('[action]', () => {
        render(<AComponent extra={extra} />);
        readFnParamExtra1 = readFn.mock.calls[0][1];
        readFnReturn1 = readFn.mock.results[0].value;
        hookReturn1 = tapHookReturn.mock.calls[0][0];
      });

      test('[verify] the read fn is called 1 time', () => {
        expect(readFn).toHaveBeenCalledTimes(1);
      });

      test('[verify] the read fn param extra and its fields equal the input extra and its fields in ref and value', () => {
        expect(readFnParamExtra1).toBe(extra);
        ownKeysOfObjectLike(extra).forEach((key) => {
          expect(readFnParamExtra1[key]).toBe(extra[key]);
        });
        expect(readFnParamExtra1).toStrictEqual(extra);
      });

      test('[verify] the component render is called 1 time', () => {
        expect(AComponent).toHaveBeenCalledTimes(1);
      });

      test('[verify] the hook return and its fields equal the read fn return and its fields in ref and value', () => {
        expect(hookReturn1).toBe(readFnReturn1);
        ownKeysOfObjectLike(readFnReturn1).forEach((key) => {
          expect(readFnReturn1[key]).toBe(hookReturn1[key]);
        });
        expect(readFnReturn1).toStrictEqual(hookReturn1);
      });
    });

    describe('35013f6, initially renders with an extra, rerenders with a second extra different in ref and value, [cite] .:3d70420', () => {
      const extra1: Pick<ObjectState, 'o'> = {
        o: {
          s: 'asd',
        },
      };

      const extra2: Pick<ObjectState, 'o'> = {
        o: {
          s: 'sdf',
        },
      };

      let readFnParamExtra2: any;
      let readFnReturn2: any;
      let hookReturn1: any, hookReturn2: any;

      test('[action]', () => {
        const { rerender } = render(<AComponent extra={extra1} />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        readFn.mockClear();
        rerender(<AComponent extra={extra2} />);
        readFnParamExtra2 = readFn.mock.calls[0][1];
        readFnReturn2 = readFn.mock.results[0].value;
        hookReturn2 = tapHookReturn.mock.calls[1][0];
      });

      test('[verify] the read fn is called 1 time on rerender', () => {
        expect(readFn).toHaveBeenCalledTimes(1);
      });

      test('[verify] the component render is called 2 times', () => {
        expect(AComponent).toHaveBeenCalledTimes(2);
      });

      test('[verify] the read fn on-rerender param extra and its fields equal the second input extra and its fields in ref and value', () => {
        expect(readFnParamExtra2).toBe(extra2);
        ownKeysOfObjectLike(extra2).forEach((key) => {
          expect(readFnParamExtra2[key]).toBe(extra2[key]);
        });
        expect(readFnParamExtra2).toStrictEqual(extra2);
      });

      test('[verify] the hook result changes in ref', () => {
        expect(hookReturn2).not.toBe(hookReturn1);
      });

      test('[verify] the hook on-rerender result and its fields equal the read fn on-rerender return in ref and value', () => {
        expect(hookReturn2).toBe(readFnReturn2);
        ownKeysOfObjectLike(readFnReturn2).forEach((key) => {
          expect(hookReturn2[key]).toBe(readFnReturn2[key]);
        });
        expect(hookReturn2).toStrictEqual(readFnReturn2);
      });
    });

    describe('e56058b, initially renders with an extra, rerenders with a second extra different in ref but equal in value, [cite] .:3d70420', () => {
      const extra1: Pick<ObjectState, 'o'> = {
        o: {
          s: 'asd',
        },
      };

      const extra2: Pick<ObjectState, 'o'> = {
        o: {
          s: 'asd',
        },
      };

      let hookReturn1: any, hookReturn2: any;

      test('[action]', () => {
        const { rerender } = render(<AComponent extra={extra1} />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        readFn.mockClear();
        rerender(<AComponent extra={extra2} />);
        hookReturn2 = tapHookReturn.mock.calls[1][0];
      });

      test('[verify] the read fn is not called on rerender', () => {
        expect(readFn).not.toHaveBeenCalled();
      });

      test('[verify] the component render is called 2 times', () => {
        expect(AComponent).toHaveBeenCalledTimes(2);
      });

      test('[verify] the hook return and its fields stay unchanged in ref and value', () => {
        expect(hookReturn2).toBe(hookReturn1);
        ownKeysOfObjectLike(hookReturn1).forEach((key) => {
          expect(hookReturn2[key]).toBe(hookReturn1[key]);
        });
        expect(hookReturn2).toStrictEqual(hookReturn1);
      });
    });

    describe('c5d656a, initially renders with an extra, rerenders with the same extra, [cite] .:3d70420', () => {
      const extra: Pick<ObjectState, 'o'> = {
        o: {
          s: 'asd',
        },
      };

      let hookReturn1: any, hookReturn2: any;

      test('[action]', () => {
        const { rerender } = render(<AComponent extra={extra} />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        readFn.mockClear();
        rerender(<AComponent extra={extra} />);
        hookReturn2 = tapHookReturn.mock.calls[1][0];
      });

      test('[verify] the read fn is not called on rerender', () => {
        expect(readFn).not.toHaveBeenCalled();
      });

      test('[verify] the component render is called 2 times', () => {
        expect(AComponent).toHaveBeenCalledTimes(2);
      });

      test('[verify] the hook return and its fields stay unchanged in ref and value', () => {
        expect(hookReturn2).toBe(hookReturn1);
        ownKeysOfObjectLike(hookReturn1).forEach((key) => {
          expect(hookReturn2[key]).toBe(hookReturn1[key]);
        });
        expect(hookReturn2).toStrictEqual(hookReturn1);
      });
    });
  });
});
