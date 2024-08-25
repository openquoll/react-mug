import { act, render } from '@testing-library/react';

import { check, construction, Mug, PossibleMug, r, swirl, tuple, useOperator } from '../src';
import { ownKeysOfObjectLike } from '../src/mug';

describe('be37cdc, react renders on state changes, [cite] 001, 002, 101', () => {
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

  const readFn = jest.fn((aState: AState): AState => {
    return { ...aState };
  });

  const readOp = r(readFn);

  let checkedAStateAfter: any;
  let readFnParamStateLatest: any;
  let readFnReturnLatest: any;
  let hookReturn1: any, hookReturn2: any;

  describe('8577c9b, a plain object mug_s state changes', () => {
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

    const AComponent = jest.fn(() => {
      const hookReturn = useOperator(readOp, aMug);
      tapHookReturn(hookReturn);
      return <div />;
    });

    /**
     * Required variables: checkedAStateAfter, readFnParamStateLatest, readFnReturnLatest, hookReturn1, hookReturn2,
     */
    function sharedVerifyCasesOfReadFnCalledOnWrite() {
      test('[verify] the (latest) read fn param state and its fields equal the after-write checked state and its fields in ref and value', () => {
        expect(readFnParamStateLatest).toBe(checkedAStateAfter);
        ownKeysOfObjectLike(checkedAStateAfter).forEach((key) => {
          expect(readFnParamStateLatest[key]).toBe(checkedAStateAfter[key]);
        });
        expect(readFnParamStateLatest).toStrictEqual(checkedAStateAfter);
      });

      test('[verify] the hook return changes in ref and value', () => {
        expect(hookReturn2).not.toBe(hookReturn1);
        expect(hookReturn2).not.toStrictEqual(hookReturn1);
      });

      test('[verify] the hook on-write return and its fields equal the (latest) read fn return and its fields in ref and value', () => {
        expect(hookReturn2).toBe(readFnReturnLatest);
        ownKeysOfObjectLike(readFnReturnLatest).forEach((key) => {
          expect(hookReturn2[key]).toBe(readFnReturnLatest[key]);
        });
        expect(hookReturn2).toStrictEqual(readFnReturnLatest);
      });
    }

    describe('54bdb0c, writes the string field with a different value', () => {
      test('[action]', async () => {
        swirl(aMug, { s: 'f33' });
        const checkedAStateBefore = check(aMug);
        expect(checkedAStateBefore).toMatchObject({ s: 'f33' });

        render(<AComponent />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        jest.clearAllMocks();
        await act(async () => {
          swirl(aMug, { s: '370' });
          checkedAStateAfter = check(aMug);
        });
        readFnParamStateLatest = readFn.mock.calls[0][0];
        readFnReturnLatest = readFn.mock.results[0].value;
        hookReturn2 = tapHookReturn.mock.calls[0][0];
      });

      test('[verify] the component render is called 1 time on write', () => {
        expect(AComponent).toHaveBeenCalledTimes(1);
      });

      test('[verify] the read fn is called 1 time on write', () => {
        expect(readFn).toHaveBeenCalledTimes(1);
      });

      sharedVerifyCasesOfReadFnCalledOnWrite();
    });

    describe('2ede0c2, batch writes the string field with different values', () => {
      test('[action]', async () => {
        swirl(aMug, { s: '7c5' });
        const checkedAStateBefore = check(aMug);
        expect(checkedAStateBefore).toMatchObject({ s: '7c5' });

        render(<AComponent />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        jest.clearAllMocks();
        await act(async () => {
          swirl(aMug, { s: '8e9' });
          swirl(aMug, { s: '335' });
          checkedAStateAfter = check(aMug);
        });
        readFnParamStateLatest = readFn.mock.calls[1][0];
        readFnReturnLatest = readFn.mock.results[1].value;
        hookReturn2 = tapHookReturn.mock.calls[0][0];
      });

      test('[verify] the component render is called 1 time on write', () => {
        expect(AComponent).toHaveBeenCalledTimes(1);
      });

      test('[verify] the read fn is called 2 times on write', () => {
        expect(readFn).toHaveBeenCalledTimes(2);
      });

      sharedVerifyCasesOfReadFnCalledOnWrite();
    });

    describe('900bc99, writes the string field with a same value', () => {
      test('[action]', async () => {
        swirl(aMug, { s: '76b' });
        const checkedAStateBefore = check(aMug);
        expect(checkedAStateBefore).toMatchObject({ s: '76b' });

        render(<AComponent />);

        jest.clearAllMocks();
        await act(async () => {
          swirl(aMug, { s: '76b' });
        });
      });

      test('[verify] the component render is not called on write', () => {
        expect(AComponent).not.toHaveBeenCalled();
      });

      test('[verify] the read fn is not called on write', () => {
        expect(readFn).not.toHaveBeenCalled();
      });
    });
  });

  describe('3c20440, a mug-nested object mug_s state changes', () => {
    const objectMug: Mug<ObjectState> = {
      [construction]: {
        s: 'asd',
        o: {
          s: 'asd',
        },
      },
    };

    const aMug: PossibleMug<AState> = {
      [construction]: {
        s: 'asd',
        o: {
          s: 'asd',
        },
        potentialMuggyObject: objectMug,
      },
    };

    const AComponent = jest.fn(() => {
      const hookReturn = useOperator(readOp, aMug);
      tapHookReturn(hookReturn);
      return <div />;
    });

    /**
     * Required variables: checkedAStateAfter, readFnParamStateLatest, readFnReturnLatest, hookReturn1, hookReturn2,
     */
    function sharedVerifyCasesOfReadFnCalledOnWrite() {
      test('[verify] the (latest) read fn param state and its fields equal the after-write checked state and its fields in ref and value', () => {
        expect(readFnParamStateLatest).toBe(checkedAStateAfter);
        ownKeysOfObjectLike(checkedAStateAfter).forEach((key) => {
          expect(readFnParamStateLatest[key]).toBe(checkedAStateAfter[key]);
        });
        expect(readFnParamStateLatest).toStrictEqual(checkedAStateAfter);
      });

      test('[verify] the hook return changes in ref and value', () => {
        expect(hookReturn2).not.toBe(hookReturn1);
        expect(hookReturn2).not.toStrictEqual(hookReturn1);
      });

      test('[verify] the hook on-write return and its fields equal the (latest) read fn return and its fields in ref and value', () => {
        expect(hookReturn2).toBe(readFnReturnLatest);
        ownKeysOfObjectLike(readFnReturnLatest).forEach((key) => {
          expect(hookReturn2[key]).toBe(readFnReturnLatest[key]);
        });
        expect(hookReturn2).toStrictEqual(readFnReturnLatest);
      });
    }

    describe('5f73493, writes the string field with a different value', () => {
      test('[action]', async () => {
        swirl(aMug, { s: '02f' });
        const checkedAStateBefore = check(aMug);
        expect(checkedAStateBefore).toMatchObject({ s: '02f' });

        render(<AComponent />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        jest.clearAllMocks();
        await act(async () => {
          swirl(aMug, { s: 'd4e' });
          checkedAStateAfter = check(aMug);
        });
        readFnParamStateLatest = readFn.mock.calls[0][0];
        readFnReturnLatest = readFn.mock.results[0].value;
        hookReturn2 = tapHookReturn.mock.calls[0][0];
      });

      test('[verify] the component render is called 1 time on write', () => {
        expect(AComponent).toHaveBeenCalledTimes(1);
      });

      test('[verify] the read fn is called 1 time on write', () => {
        expect(readFn).toHaveBeenCalledTimes(1);
      });

      sharedVerifyCasesOfReadFnCalledOnWrite();
    });

    describe('e961946, batch writes the string field with different values', () => {
      test('[action]', async () => {
        swirl(aMug, { s: 'b27' });
        const checkedAStateBefore = check(aMug);
        expect(checkedAStateBefore).toMatchObject({ s: 'b27' });

        render(<AComponent />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        jest.clearAllMocks();
        await act(async () => {
          swirl(aMug, { s: '3cc' });
          swirl(aMug, { s: 'edf' });
          checkedAStateAfter = check(aMug);
        });
        readFnParamStateLatest = readFn.mock.calls[1][0];
        readFnReturnLatest = readFn.mock.results[1].value;
        hookReturn2 = tapHookReturn.mock.calls[0][0];
      });

      test('[verify] the component render is called 1 time on write', () => {
        expect(AComponent).toHaveBeenCalledTimes(1);
      });

      test('[verify] the read fn is called 2 times on write', () => {
        expect(readFn).toHaveBeenCalledTimes(2);
      });

      sharedVerifyCasesOfReadFnCalledOnWrite();
    });

    describe('76b5dcc, writes the string field with a same value', () => {
      test('[action]', async () => {
        swirl(aMug, { s: '030' });
        const checkedAStateBefore = check(aMug);
        expect(checkedAStateBefore).toMatchObject({ s: '030' });

        render(<AComponent />);

        jest.clearAllMocks();
        await act(async () => {
          swirl(aMug, { s: '030' });
        });
      });

      test('[verify] the component render is not called on write', () => {
        expect(AComponent).not.toHaveBeenCalled();
      });

      test('[verify] the read fn is not called on write', () => {
        expect(readFn).not.toHaveBeenCalled();
      });
    });

    describe('9740a8d, writes the muggy object field_s string field with a different value', () => {
      test('[action]', async () => {
        swirl(aMug, { potentialMuggyObject: { s: 'e52' } });
        const checkedAStateBefore = check(aMug);
        expect(checkedAStateBefore).toMatchObject({ potentialMuggyObject: { s: 'e52' } });

        render(<AComponent />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        jest.clearAllMocks();
        await act(async () => {
          swirl(aMug, { potentialMuggyObject: { s: '7c1' } });
          checkedAStateAfter = check(aMug);
        });
        readFnParamStateLatest = readFn.mock.calls[0][0];
        readFnReturnLatest = readFn.mock.results[0].value;
        hookReturn2 = tapHookReturn.mock.calls[0][0];
      });

      test('[verify] the component render is called 1 time on write', () => {
        expect(AComponent).toHaveBeenCalledTimes(1);
      });

      test('[verify] the read fn is called 1 time on write', () => {
        expect(readFn).toHaveBeenCalledTimes(1);
      });

      sharedVerifyCasesOfReadFnCalledOnWrite();
    });

    describe('fa2c073, batch writes the muggy object field_s string field with different values', () => {
      test('[action]', async () => {
        swirl(aMug, { potentialMuggyObject: { s: '071' } });
        const checkedAStateBefore = check(aMug);
        expect(checkedAStateBefore).toMatchObject({ potentialMuggyObject: { s: '071' } });

        render(<AComponent />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        jest.clearAllMocks();
        await act(async () => {
          swirl(aMug, { potentialMuggyObject: { s: '7a3' } });
          swirl(aMug, { potentialMuggyObject: { s: 'b35' } });
          checkedAStateAfter = check(aMug);
        });
        readFnParamStateLatest = readFn.mock.calls[1][0];
        readFnReturnLatest = readFn.mock.results[1].value;
        hookReturn2 = tapHookReturn.mock.calls[0][0];
      });

      test('[verify] the component render is called 1 time on write', () => {
        expect(AComponent).toHaveBeenCalledTimes(1);
      });

      test('[verify] the read fn is called 2 times on write', () => {
        expect(readFn).toHaveBeenCalledTimes(2);
      });

      sharedVerifyCasesOfReadFnCalledOnWrite();
    });

    describe('4394fb9, writes the muggy object field_s string field with a same value', () => {
      test('[action]', async () => {
        swirl(aMug, { potentialMuggyObject: { s: '5da' } });
        const checkedAStateBefore = check(aMug);
        expect(checkedAStateBefore).toMatchObject({ potentialMuggyObject: { s: '5da' } });

        render(<AComponent />);

        jest.clearAllMocks();
        await act(async () => {
          swirl(aMug, { potentialMuggyObject: { s: '5da' } });
        });
      });

      test('[verify] the component render is not called on write', () => {
        expect(AComponent).not.toHaveBeenCalled();
      });

      test('[verify] the read fn is not called on write', () => {
        expect(readFn).not.toHaveBeenCalled();
      });
    });

    describe('3f68aa4, writes the object mug_s string field with a different value', () => {
      test('[action]', async () => {
        swirl(objectMug, { s: '303' });
        const checkedObjectStateBefore = check(objectMug);
        expect(checkedObjectStateBefore).toMatchObject({ s: '303' });

        render(<AComponent />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        jest.clearAllMocks();
        await act(async () => {
          swirl(objectMug, { s: '7f4' });
          checkedAStateAfter = check(aMug);
        });
        readFnParamStateLatest = readFn.mock.calls[0][0];
        readFnReturnLatest = readFn.mock.results[0].value;
        hookReturn2 = tapHookReturn.mock.calls[0][0];
      });

      test('[verify] the component render is called 1 time on write', () => {
        expect(AComponent).toHaveBeenCalledTimes(1);
      });

      test('[verify] the read fn is called 1 time on write', () => {
        expect(readFn).toHaveBeenCalledTimes(1);
      });

      sharedVerifyCasesOfReadFnCalledOnWrite();
    });

    describe('ba25504, batch writes the object mug_s string field with different values', () => {
      test('[action]', async () => {
        swirl(objectMug, { s: 'c31' });
        const checkedObjectStateBefore = check(objectMug);
        expect(checkedObjectStateBefore).toMatchObject({ s: 'c31' });

        render(<AComponent />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        jest.clearAllMocks();
        await act(async () => {
          swirl(objectMug, { s: 'b5b' });
          swirl(objectMug, { s: '660' });
          checkedAStateAfter = check(aMug);
        });
        readFnParamStateLatest = readFn.mock.calls[1][0];
        readFnReturnLatest = readFn.mock.results[1].value;
        hookReturn2 = tapHookReturn.mock.calls[0][0];
      });

      test('[verify] the component render is called 1 time on write', () => {
        expect(AComponent).toHaveBeenCalledTimes(1);
      });

      test('[verify] the read fn is called 2 times on write', () => {
        expect(readFn).toHaveBeenCalledTimes(2);
      });

      sharedVerifyCasesOfReadFnCalledOnWrite();
    });

    describe('29eb09d, writes the object mug_s string field with a same value', () => {
      test('[action]', async () => {
        swirl(objectMug, { s: '39e' });
        const checkedObjectStateBefore = check(objectMug);
        expect(checkedObjectStateBefore).toMatchObject({ s: '39e' });

        render(<AComponent />);

        jest.clearAllMocks();
        await act(async () => {
          swirl(objectMug, { s: '39e' });
        });
      });

      test('[verify] the component render is not called on write', () => {
        expect(AComponent).not.toHaveBeenCalled();
      });

      test('[verify] the read fn is not called on write', () => {
        expect(readFn).not.toHaveBeenCalled();
      });
    });

    describe('7fffdd2, simultaneously writes the string field and the muggy object field_s string field with different values', () => {
      test('[action]', async () => {
        swirl(aMug, { s: '690', potentialMuggyObject: { s: '5ab' } });
        const checkedAStateBefore = check(aMug);
        expect(checkedAStateBefore).toMatchObject({ s: '690', potentialMuggyObject: { s: '5ab' } });

        render(<AComponent />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        jest.clearAllMocks();
        await act(async () => {
          swirl(aMug, { s: '74e', potentialMuggyObject: { s: 'd83' } });
          checkedAStateAfter = check(aMug);
        });
        readFnParamStateLatest = readFn.mock.calls[1][0];
        readFnReturnLatest = readFn.mock.results[1].value;
        hookReturn2 = tapHookReturn.mock.calls[0][0];
      });

      test('[verify] the component render is called 1 time on write', () => {
        expect(AComponent).toHaveBeenCalledTimes(1);
      });

      test('[verify] the read fn is called 2 times on write', () => {
        expect(readFn).toHaveBeenCalledTimes(2);
      });

      sharedVerifyCasesOfReadFnCalledOnWrite();
    });

    describe('dc3b350, simultaneously batch writes the string field and the muggy object field_s string field with different values', () => {
      test('[action]', async () => {
        swirl(aMug, { s: '749', potentialMuggyObject: { s: 'b05' } });
        const checkedAStateBefore = check(aMug);
        expect(checkedAStateBefore).toMatchObject({ s: '749', potentialMuggyObject: { s: 'b05' } });

        render(<AComponent />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        jest.clearAllMocks();
        await act(async () => {
          swirl(aMug, { s: 'dee', potentialMuggyObject: { s: '48b' } });
          swirl(aMug, { s: '94c', potentialMuggyObject: { s: '70f' } });
          checkedAStateAfter = check(aMug);
        });
        readFnParamStateLatest = readFn.mock.calls[3][0];
        readFnReturnLatest = readFn.mock.results[3].value;
        hookReturn2 = tapHookReturn.mock.calls[0][0];
      });

      test('[verify] the component render is called 1 time on write', () => {
        expect(AComponent).toHaveBeenCalledTimes(1);
      });

      test('[verify] the read fn is called 4 times on write', () => {
        expect(readFn).toHaveBeenCalledTimes(4);
      });

      sharedVerifyCasesOfReadFnCalledOnWrite();
    });

    describe('e009621, simultaneously writes the string field and the muggy object field_s string field with a same value', () => {
      test('[action]', async () => {
        swirl(aMug, { s: '4a4', potentialMuggyObject: { s: '91b' } });
        const checkedAStateBefore = check(aMug);
        expect(checkedAStateBefore).toMatchObject({ s: '4a4', potentialMuggyObject: { s: '91b' } });

        render(<AComponent />);

        jest.clearAllMocks();
        await act(async () => {
          swirl(aMug, { s: '4a4', potentialMuggyObject: { s: '91b' } });
        });
      });

      test('[verify] the component render is not called on write', () => {
        expect(AComponent).not.toHaveBeenCalled();
      });

      test('[verify] the read fn is not called on write', () => {
        expect(readFn).not.toHaveBeenCalled();
      });
    });
  });

  describe('2c62e81, a constant mug-nested tuple mug-like_s state changes', () => {
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

    const aMugLike = tuple(objectMug1, objectMug2);

    const AComponent = jest.fn(() => {
      const hookReturn = useOperator(readOp, aMugLike);
      tapHookReturn(hookReturn);
      return <div />;
    });

    /**
     * Required variables: checkedObjectState1After, readFnParamStateLatest, readFnReturnLatest, hookReturn1, hookReturn2,
     */
    function sharedVerifyCasesOfReadFnCalledOnWrite() {
      test('[verify] the (latest) read fn param state and its items equal the after-write checked state and its items in ref and value', () => {
        expect(readFnParamStateLatest).toBe(checkedAStateAfter);
        checkedAStateAfter.forEach((item: any, i: number) => {
          expect(readFnParamStateLatest[i]).toBe(item);
        });
        expect(readFnParamStateLatest).toStrictEqual(checkedAStateAfter);
      });

      test('[verify] the hook return changes in ref and value', () => {
        expect(hookReturn2).not.toBe(hookReturn1);
        expect(hookReturn2).not.toStrictEqual(hookReturn1);
      });

      test('[verify] the hook on-write return and its fields equal the (latest) read fn return and its fields in ref and value', () => {
        expect(hookReturn2).toBe(readFnReturnLatest);
        ownKeysOfObjectLike(readFnReturnLatest).forEach((key) => {
          expect(hookReturn2[key]).toBe(readFnReturnLatest[key]);
        });
        expect(hookReturn2).toStrictEqual(readFnReturnLatest);
      });
    }

    describe('d9d8b0e, writes with a sparse tuple of a partial object index-0 item that has a different string field value', () => {
      test('[action]', async () => {
        swirl(aMugLike, [{ s: 'ded' }, ,]);
        const checkedAStateBefore = check(aMugLike);
        expect(checkedAStateBefore).toMatchObject([{ s: 'ded' }, {}]);

        render(<AComponent />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        jest.clearAllMocks();
        await act(async () => {
          swirl(aMugLike, [{ s: 'ab8' }, ,]);
          checkedAStateAfter = check(aMugLike);
        });
        readFnParamStateLatest = readFn.mock.calls[0][0];
        readFnReturnLatest = readFn.mock.results[0].value;
        hookReturn2 = tapHookReturn.mock.calls[0][0];
      });

      test('[verify] the component render is called 1 time on write', () => {
        expect(AComponent).toHaveBeenCalledTimes(1);
      });

      test('[verify] the read fn is called 1 time on write', () => {
        expect(readFn).toHaveBeenCalledTimes(1);
      });

      sharedVerifyCasesOfReadFnCalledOnWrite();
    });

    describe('a16daf5, batch writes with sparse tuples of partial object index-0 items that have different string field values', () => {
      test('[action]', async () => {
        swirl(aMugLike, [{ s: 'c5d' }, ,]);
        const checkedAStateBefore = check(aMugLike);
        expect(checkedAStateBefore).toMatchObject([{ s: 'c5d' }, {}]);

        render(<AComponent />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        jest.clearAllMocks();
        await act(async () => {
          swirl(aMugLike, [{ s: '6ea' }, ,]);
          swirl(aMugLike, [{ s: 'f99' }, ,]);
          checkedAStateAfter = check(aMugLike);
        });
        readFnParamStateLatest = readFn.mock.calls[1][0];
        readFnReturnLatest = readFn.mock.results[1].value;
        hookReturn2 = tapHookReturn.mock.calls[0][0];
      });

      test('[verify] the component render is called 1 time on write', () => {
        expect(AComponent).toHaveBeenCalledTimes(1);
      });

      test('[verify] the read fn is called 2 times on write', () => {
        expect(readFn).toHaveBeenCalledTimes(2);
      });

      sharedVerifyCasesOfReadFnCalledOnWrite();
    });

    describe('8746c70, writes with a sparse tuple of a partial object index-0 item that has a same string field value', () => {
      test('[action]', async () => {
        swirl(aMugLike, [{ s: '8e2' }, ,]);
        const checkedAStateBefore = check(aMugLike);
        expect(checkedAStateBefore).toMatchObject([{ s: '8e2' }, {}]);

        render(<AComponent />);

        jest.clearAllMocks();
        await act(async () => {
          swirl(aMugLike, [{ s: '8e2' }, ,]);
          checkedAStateAfter = check(aMugLike);
        });
      });

      test('[verify] the component render is not called on write', () => {
        expect(AComponent).not.toHaveBeenCalled();
      });

      test('[verify] the read fn is not called on write', () => {
        expect(readFn).not.toHaveBeenCalled();
      });
    });

    describe('1ab46c8, writes the index-0_s object mug_s string field with a different value', () => {
      test('[action]', async () => {
        swirl(objectMug1, { s: '90e' });
        const checkedObjectState1Before = check(objectMug1);
        expect(checkedObjectState1Before).toMatchObject({ s: '90e' });

        render(<AComponent />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        jest.clearAllMocks();
        await act(async () => {
          swirl(objectMug1, { s: 'b01' });
          checkedAStateAfter = check(aMugLike);
        });
        readFnParamStateLatest = readFn.mock.calls[0][0];
        readFnReturnLatest = readFn.mock.results[0].value;
        hookReturn2 = tapHookReturn.mock.calls[0][0];
      });

      test('[verify] the component render is called 1 time on write', () => {
        expect(AComponent).toHaveBeenCalledTimes(1);
      });

      test('[verify] the read fn is called 1 time on write', () => {
        expect(readFn).toHaveBeenCalledTimes(1);
      });

      sharedVerifyCasesOfReadFnCalledOnWrite();
    });

    describe('c94ec9b, batch writes the index-0_s object mug_s string field with different values', () => {
      test('[action]', async () => {
        swirl(objectMug1, { s: '210' });
        const checkedAStateBefore = check(aMugLike);
        const checkedObjectState1Before = check(objectMug1);
        expect(checkedAStateBefore).toMatchObject([{ s: '210' }, {}]);
        expect(checkedObjectState1Before).toMatchObject({ s: '210' });

        render(<AComponent />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        jest.clearAllMocks();
        await act(async () => {
          swirl(objectMug1, { s: 'ee8' });
          swirl(objectMug1, { s: '0d3' });
          checkedAStateAfter = check(aMugLike);
        });
        readFnParamStateLatest = readFn.mock.calls[1][0];
        readFnReturnLatest = readFn.mock.results[1].value;
        hookReturn2 = tapHookReturn.mock.calls[0][0];
      });

      test('[verify] the component render is called 1 time on write', () => {
        expect(AComponent).toHaveBeenCalledTimes(1);
      });

      test('[verify] the read fn is called 2 times on write', () => {
        expect(readFn).toHaveBeenCalledTimes(2);
      });

      sharedVerifyCasesOfReadFnCalledOnWrite();
    });

    describe('c56dfe8, writes the index-0_s object mug_s string field with a same value', () => {
      test('[action]', async () => {
        swirl(objectMug1, { s: '1cc' });
        const checkedObjectState1Before = check(objectMug1);
        expect(checkedObjectState1Before).toMatchObject({ s: '1cc' });

        render(<AComponent />);

        jest.clearAllMocks();
        await act(async () => {
          swirl(objectMug1, { s: '1cc' });
          checkedAStateAfter = check(aMugLike);
        });
      });

      test('[verify] the component render is not called on write', () => {
        expect(AComponent).not.toHaveBeenCalled();
      });

      test('[verify] the read fn is not called on write', () => {
        expect(readFn).not.toHaveBeenCalled();
      });
    });

    describe('1502a9a, writes with a dense tuple of partial object items that have different string field values', () => {
      test('[action]', async () => {
        swirl(aMugLike, [{ s: 'e91' }, { s: 'e91' }]);
        const checkedAStateBefore = check(aMugLike);
        expect(checkedAStateBefore).toMatchObject([{ s: 'e91' }, { s: 'e91' }]);

        render(<AComponent />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        jest.clearAllMocks();
        await act(async () => {
          swirl(aMugLike, [{ s: 'eb7' }, { s: '8d6' }]);
          checkedAStateAfter = check(aMugLike);
        });
        readFnParamStateLatest = readFn.mock.calls[1][0];
        readFnReturnLatest = readFn.mock.results[1].value;
        hookReturn2 = tapHookReturn.mock.calls[0][0];
      });

      test('[verify] the component render is called 1 time on write', () => {
        expect(AComponent).toHaveBeenCalledTimes(1);
      });

      test('[verify] the read fn is called 2 times on write', () => {
        expect(readFn).toHaveBeenCalledTimes(2);
      });

      sharedVerifyCasesOfReadFnCalledOnWrite();
    });

    describe('ec1fc89, batch writes with a dense tuple of partial object items that have different string field values', () => {
      test('[action]', async () => {
        swirl(aMugLike, [{ s: 'ce0' }, { s: 'ce0' }]);
        const checkedAStateBefore = check(aMugLike);
        expect(checkedAStateBefore).toMatchObject([{ s: 'ce0' }, { s: 'ce0' }]);

        render(<AComponent />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        jest.clearAllMocks();
        await act(async () => {
          swirl(aMugLike, [{ s: '3f2' }, { s: '9ca' }]);
          swirl(aMugLike, [{ s: 'eaa' }, { s: '0e8' }]);
          checkedAStateAfter = check(aMugLike);
        });
        readFnParamStateLatest = readFn.mock.calls[3][0];
        readFnReturnLatest = readFn.mock.results[3].value;
        hookReturn2 = tapHookReturn.mock.calls[0][0];
      });

      test('[verify] the component render is called 1 time on write', () => {
        expect(AComponent).toHaveBeenCalledTimes(1);
      });

      test('[verify] the read fn is called 4 times on write', () => {
        expect(readFn).toHaveBeenCalledTimes(4);
      });

      sharedVerifyCasesOfReadFnCalledOnWrite();
    });

    describe('514231d, writes with a dense tuple of partial object items that have a same string field value', () => {
      test('[action]', async () => {
        swirl(aMugLike, [{ s: '8dc' }, { s: '8dc' }]);
        const checkedAStateBefore = check(aMugLike);
        expect(checkedAStateBefore).toMatchObject([{ s: '8dc' }, { s: '8dc' }]);

        render(<AComponent />);

        jest.clearAllMocks();
        await act(async () => {
          swirl(aMugLike, [{ s: '8dc' }, { s: '8dc' }]);
          checkedAStateAfter = check(aMugLike);
        });
      });

      test('[verify] the component render is not called on write', () => {
        expect(AComponent).not.toHaveBeenCalled();
      });

      test('[verify] the read fn is not called on write', () => {
        expect(readFn).not.toHaveBeenCalled();
      });
    });
  });

  describe('bba3052, same-structure temporary mug-nested tuple mug-likes_ states change', () => {
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

    const AComponent = jest.fn(() => {
      const hookReturn = useOperator(readOp, tuple(objectMug1, objectMug2));
      tapHookReturn(hookReturn);
      return <div />;
    });

    /**
     * Required variables: checkedObjectState1After, readFnParamStateLatest, readFnReturnLatest, hookReturn1, hookReturn2,
     */
    function sharedVerifyCasesOfReadFnCalledOnWrite() {
      test('[verify] the (latest) read fn param state_s items equal the after-write checked state_s items in ref and value', () => {
        checkedAStateAfter.forEach((item: any, i: number) => {
          expect(readFnParamStateLatest[i]).toBe(item);
          expect(readFnParamStateLatest[i]).toStrictEqual(item);
        });
      });

      test('[verify] the hook return changes in ref and value', () => {
        expect(hookReturn2).not.toBe(hookReturn1);
        expect(hookReturn2).not.toStrictEqual(hookReturn1);
      });

      test('[verify] the hook on-write return and its fields equal the (latest) read fn return and its fields in ref and value', () => {
        expect(hookReturn2).toBe(readFnReturnLatest);
        ownKeysOfObjectLike(readFnReturnLatest).forEach((key) => {
          expect(hookReturn2[key]).toBe(readFnReturnLatest[key]);
        });
        expect(hookReturn2).toStrictEqual(readFnReturnLatest);
      });
    }

    describe('4e15c75, writes the index-0_s object mug_s string field with a different value', () => {
      test('[action]', async () => {
        swirl(objectMug1, { s: '649' });
        const checkedObjectState1Before = check(objectMug1);
        expect(checkedObjectState1Before).toMatchObject({ s: '649' });

        render(<AComponent />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        jest.clearAllMocks();
        await act(async () => {
          swirl(objectMug1, { s: 'b01' });
          checkedAStateAfter = check(tuple(objectMug1, objectMug2));
        });
        readFnParamStateLatest = readFn.mock.calls[0][0];
        readFnReturnLatest = readFn.mock.results[0].value;
        hookReturn2 = tapHookReturn.mock.calls[0][0];
      });

      test('[verify] the component render is called 1 time on write', () => {
        expect(AComponent).toHaveBeenCalledTimes(1);
      });

      test('[verify] the read fn is called 1 time on write', () => {
        expect(readFn).toHaveBeenCalledTimes(1);
      });

      sharedVerifyCasesOfReadFnCalledOnWrite();
    });

    describe('1fb2671, batch writes the index-0_s object mug_s string field with different values', () => {
      test('[action]', async () => {
        swirl(objectMug1, { s: '157' });
        const checkedObjectState1Before = check(objectMug1);
        expect(checkedObjectState1Before).toMatchObject({ s: '157' });

        render(<AComponent />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        jest.clearAllMocks();
        await act(async () => {
          swirl(objectMug1, { s: '66a' });
          swirl(objectMug1, { s: '2b2' });
          checkedAStateAfter = check(tuple(objectMug1, objectMug2));
        });
        readFnParamStateLatest = readFn.mock.calls[1][0];
        readFnReturnLatest = readFn.mock.results[1].value;
        hookReturn2 = tapHookReturn.mock.calls[0][0];
      });

      test('[verify] the component render is called 1 time on write', () => {
        expect(AComponent).toHaveBeenCalledTimes(1);
      });

      test('[verify] the read fn is called 2 times on write', () => {
        expect(readFn).toHaveBeenCalledTimes(2);
      });

      sharedVerifyCasesOfReadFnCalledOnWrite();
    });

    describe('0c06d13, batch writes the index-0_s object mug_s string field with a same value', () => {
      test('[action]', async () => {
        swirl(objectMug1, { s: 'd26' });
        const checkedObjectState1Before = check(objectMug1);
        expect(checkedObjectState1Before).toMatchObject({ s: 'd26' });

        render(<AComponent />);

        jest.clearAllMocks();
        await act(async () => {
          swirl(objectMug1, { s: 'd26' });
        });
      });

      test('[verify] the component render is not called on write', () => {
        expect(AComponent).not.toHaveBeenCalled();
      });

      test('[verify] the read fn is not called on write', () => {
        expect(readFn).not.toHaveBeenCalled();
      });
    });
  });
});
