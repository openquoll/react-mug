import { act, render } from '@testing-library/react';

import { construction, getIt, Mug, Muggify, r, setIt, tuple, upon, useIt } from '../src';
import { ownKeysOfObjectLike } from '../src/mug';

describe('be37cdc, react renders on state changes, [cite] 001, 002, 101', () => {
  interface ObjectState {
    s: string;
    o: {
      s: string;
    };
  }

  const tapHookReturn = jest.fn();

  describe('8577c9b, upon a read op and a plain object mug', () => {
    interface AState extends ObjectState {}

    const aMug: Mug<AState> = {
      [construction]: {
        s: 'asd',
        o: {
          s: 'asd',
        },
      },
    };

    const readFn = jest.fn((state: AState): AState => ({ ...state }));

    const readOp = r(readFn);

    const AComponent = jest.fn(() => {
      const hookReturn = useIt(readOp, aMug);
      tapHookReturn(hookReturn);
      return <div />;
    });

    let gotAStateAfter: AState;
    let readFnParamStateLatest: AState;
    let readFnReturnLatest: AState;
    let hookReturn1: AState, hookReturn2: AState;

    /**
     * Required variables: gotAStateAfter, readFnParamStateLatest, readFnReturnLatest, hookReturn1, hookReturn2,
     */
    function sharedVerifyCasesOf_read_fn_called_on_write() {
      test('[verify] the (latest) read fn param state and its fields equal the after-write got state and its fields in ref and value', () => {
        expect(readFnParamStateLatest).toBe(gotAStateAfter);
        ownKeysOfObjectLike(gotAStateAfter).forEach((key) => {
          expect(readFnParamStateLatest[key]).toBe(gotAStateAfter[key]);
        });
        expect(readFnParamStateLatest).toStrictEqual(gotAStateAfter);
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
        setIt(aMug, { s: 'f33' });
        const gotAStateBefore = getIt(aMug);
        expect(gotAStateBefore).toMatchObject({ s: 'f33' });

        render(<AComponent />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        jest.clearAllMocks();
        await act(async () => {
          setIt(aMug, { s: '370' });
          gotAStateAfter = getIt(aMug);
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

      sharedVerifyCasesOf_read_fn_called_on_write();
    });

    describe('2ede0c2, batch writes the string field with different values', () => {
      test('[action]', async () => {
        setIt(aMug, { s: '7c5' });
        const gotAStateBefore = getIt(aMug);
        expect(gotAStateBefore).toMatchObject({ s: '7c5' });

        render(<AComponent />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        jest.clearAllMocks();
        await act(async () => {
          setIt(aMug, { s: '8e9' });
          setIt(aMug, { s: '335' });
          gotAStateAfter = getIt(aMug);
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

      sharedVerifyCasesOf_read_fn_called_on_write();
    });

    describe('900bc99, writes the string field with a same value', () => {
      test('[action]', async () => {
        setIt(aMug, { s: '76b' });
        const gotAStateBefore = getIt(aMug);
        expect(gotAStateBefore).toMatchObject({ s: '76b' });

        render(<AComponent />);

        jest.clearAllMocks();
        await act(async () => {
          setIt(aMug, { s: '76b' });
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

  describe('3c20440, upon a read op and a mug-nested object mug', () => {
    interface AState extends ObjectState {
      muggyObject: ObjectState;
    }

    const objectMug: Mug<ObjectState> = {
      [construction]: {
        s: 'asd',
        o: {
          s: 'asd',
        },
      },
    };

    const aMug: Mug<Muggify<AState, { muggyObject: Mug<ObjectState> }>> = {
      [construction]: {
        s: 'asd',
        o: {
          s: 'asd',
        },
        muggyObject: objectMug,
      },
    };

    const readFn = jest.fn((state: AState): AState => ({ ...state }));

    const readOp = r(readFn);

    const AComponent = jest.fn(() => {
      const hookReturn = useIt(readOp, aMug);
      tapHookReturn(hookReturn);
      return <div />;
    });

    let gotAStateAfter: AState;
    let readFnParamStateLatest: AState;
    let readFnReturnLatest: AState;
    let hookReturn1: AState, hookReturn2: AState;

    /**
     * Required variables: gotAStateAfter, readFnParamStateLatest, readFnReturnLatest, hookReturn1, hookReturn2,
     */
    function sharedVerifyCasesOf_read_fn_called_on_write() {
      test('[verify] the (latest) read fn param state and its fields equal the after-write got state and its fields in ref and value', () => {
        expect(readFnParamStateLatest).toBe(gotAStateAfter);
        ownKeysOfObjectLike(gotAStateAfter).forEach((key) => {
          expect(readFnParamStateLatest[key]).toBe(gotAStateAfter[key]);
        });
        expect(readFnParamStateLatest).toStrictEqual(gotAStateAfter);
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
        setIt(aMug, { s: '02f' });
        const gotAStateBefore = getIt(aMug);
        expect(gotAStateBefore).toMatchObject({ s: '02f' });

        render(<AComponent />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        jest.clearAllMocks();
        await act(async () => {
          setIt(aMug, { s: 'd4e' });
          gotAStateAfter = getIt(aMug);
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

      sharedVerifyCasesOf_read_fn_called_on_write();
    });

    describe('e961946, batch writes the string field with different values', () => {
      test('[action]', async () => {
        setIt(aMug, { s: 'b27' });
        const gotAStateBefore = getIt(aMug);
        expect(gotAStateBefore).toMatchObject({ s: 'b27' });

        render(<AComponent />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        jest.clearAllMocks();
        await act(async () => {
          setIt(setIt(aMug, { s: '3cc' }), { s: 'edf' });
          gotAStateAfter = getIt(aMug);
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

      sharedVerifyCasesOf_read_fn_called_on_write();
    });

    describe('76b5dcc, writes the string field with a same value', () => {
      test('[action]', async () => {
        setIt(aMug, { s: '030' });
        const gotAStateBefore = getIt(aMug);
        expect(gotAStateBefore).toMatchObject({ s: '030' });

        render(<AComponent />);

        jest.clearAllMocks();
        await act(async () => {
          setIt(aMug, { s: '030' });
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
        setIt(aMug, { muggyObject: { s: 'e52' } });
        const gotAStateBefore = getIt(aMug);
        expect(gotAStateBefore).toMatchObject({ muggyObject: { s: 'e52' } });

        render(<AComponent />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        jest.clearAllMocks();
        await act(async () => {
          setIt(aMug, { muggyObject: { s: '7c1' } });
          gotAStateAfter = getIt(aMug);
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

      sharedVerifyCasesOf_read_fn_called_on_write();
    });

    describe('fa2c073, batch writes the muggy object field_s string field with different values', () => {
      test('[action]', async () => {
        setIt(aMug, { muggyObject: { s: '071' } });
        const gotAStateBefore = getIt(aMug);
        expect(gotAStateBefore).toMatchObject({ muggyObject: { s: '071' } });

        render(<AComponent />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        jest.clearAllMocks();
        await act(async () => {
          setIt(setIt(aMug, { muggyObject: { s: '7a3' } }), {
            muggyObject: { s: 'b35' },
          });
          gotAStateAfter = getIt(aMug);
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

      sharedVerifyCasesOf_read_fn_called_on_write();
    });

    describe('4394fb9, writes the muggy object field_s string field with a same value', () => {
      test('[action]', async () => {
        setIt(aMug, { muggyObject: { s: '5da' } });
        const gotAStateBefore = getIt(aMug);
        expect(gotAStateBefore).toMatchObject({ muggyObject: { s: '5da' } });

        render(<AComponent />);

        jest.clearAllMocks();
        await act(async () => {
          setIt(aMug, { muggyObject: { s: '5da' } });
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
        setIt(objectMug, { s: '303' });
        const gotObjectStateBefore = getIt(objectMug);
        expect(gotObjectStateBefore).toMatchObject({ s: '303' });

        render(<AComponent />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        jest.clearAllMocks();
        await act(async () => {
          setIt(objectMug, { s: '7f4' });
          gotAStateAfter = getIt(aMug);
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

      sharedVerifyCasesOf_read_fn_called_on_write();
    });

    describe('ba25504, batch writes the object mug_s string field with different values', () => {
      test('[action]', async () => {
        setIt(objectMug, { s: 'c31' });
        const gotObjectStateBefore = getIt(objectMug);
        expect(gotObjectStateBefore).toMatchObject({ s: 'c31' });

        render(<AComponent />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        jest.clearAllMocks();
        await act(async () => {
          setIt(setIt(objectMug, { s: 'b5b' }), { s: '660' });
          gotAStateAfter = getIt(aMug);
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

      sharedVerifyCasesOf_read_fn_called_on_write();
    });

    describe('29eb09d, writes the object mug_s string field with a same value', () => {
      test('[action]', async () => {
        setIt(objectMug, { s: '39e' });
        const gotObjectStateBefore = getIt(objectMug);
        expect(gotObjectStateBefore).toMatchObject({ s: '39e' });

        render(<AComponent />);

        jest.clearAllMocks();
        await act(async () => {
          setIt(objectMug, { s: '39e' });
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
        setIt(aMug, { s: '690', muggyObject: { s: '5ab' } });
        const gotAStateBefore = getIt(aMug);
        expect(gotAStateBefore).toMatchObject({ s: '690', muggyObject: { s: '5ab' } });

        render(<AComponent />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        jest.clearAllMocks();
        await act(async () => {
          setIt(aMug, { s: '74e', muggyObject: { s: 'd83' } });
          gotAStateAfter = getIt(aMug);
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

      sharedVerifyCasesOf_read_fn_called_on_write();
    });

    describe('dc3b350, simultaneously batch writes the string field and the muggy object field_s string field with different values', () => {
      test('[action]', async () => {
        setIt(aMug, { s: '749', muggyObject: { s: 'b05' } });
        const gotAStateBefore = getIt(aMug);
        expect(gotAStateBefore).toMatchObject({ s: '749', muggyObject: { s: 'b05' } });

        render(<AComponent />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        jest.clearAllMocks();
        await act(async () => {
          setIt(setIt(aMug, { s: 'dee', muggyObject: { s: '48b' } }), {
            s: '94c',
            muggyObject: { s: '70f' },
          });
          gotAStateAfter = getIt(aMug);
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

      sharedVerifyCasesOf_read_fn_called_on_write();
    });

    describe('e009621, simultaneously writes the string field and the muggy object field_s string field with a same value', () => {
      test('[action]', async () => {
        setIt(aMug, { s: '4a4', muggyObject: { s: '91b' } });
        const gotAStateBefore = getIt(aMug);
        expect(gotAStateBefore).toMatchObject({ s: '4a4', muggyObject: { s: '91b' } });

        render(<AComponent />);

        jest.clearAllMocks();
        await act(async () => {
          setIt(aMug, { s: '4a4', muggyObject: { s: '91b' } });
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

  describe('2c62e81, upon a read op and a constant mug-nested tuple mug-like', () => {
    type AState = [ObjectState, ObjectState];

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

    const readFn = jest.fn((state: AState): AState => [...state]);

    const readOp = r(readFn);

    const AComponent = jest.fn(() => {
      const hookReturn = useIt(readOp, aMugLike);
      tapHookReturn(hookReturn);
      return <div />;
    });

    let gotAStateAfter: AState;
    let readFnParamStateLatest: AState;
    let readFnReturnLatest: AState;
    let hookReturn1: AState, hookReturn2: AState;

    /**
     * Required variables: gotAStateAfter, readFnParamStateLatest, readFnReturnLatest, hookReturn1, hookReturn2,
     */
    function sharedVerifyCasesOf_read_fn_called_on_write() {
      test('[verify] the (latest) read fn param state and its items equal the after-write got state and its items in ref and value', () => {
        expect(readFnParamStateLatest).toBe(gotAStateAfter);
        gotAStateAfter.forEach((item, i) => {
          expect(readFnParamStateLatest[i]).toBe(item);
        });
        expect(readFnParamStateLatest).toStrictEqual(gotAStateAfter);
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
        setIt(aMugLike, [{ s: 'ded' }, ,]);
        const gotAStateBefore = getIt(aMugLike);
        expect(gotAStateBefore).toMatchObject([{ s: 'ded' }, {}]);

        render(<AComponent />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        jest.clearAllMocks();
        await act(async () => {
          setIt(aMugLike, [{ s: 'ab8' }, ,]);
          gotAStateAfter = getIt(aMugLike);
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

      sharedVerifyCasesOf_read_fn_called_on_write();
    });

    describe('a16daf5, batch writes with sparse tuples of partial object index-0 items that have different string field values', () => {
      test('[action]', async () => {
        setIt(aMugLike, [{ s: 'c5d' }, ,]);
        const gotAStateBefore = getIt(aMugLike);
        expect(gotAStateBefore).toMatchObject([{ s: 'c5d' }, {}]);

        render(<AComponent />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        jest.clearAllMocks();
        await act(async () => {
          setIt(setIt(aMugLike, [{ s: '6ea' }, ,]), [{ s: 'f99' }, ,]);
          gotAStateAfter = getIt(aMugLike);
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

      sharedVerifyCasesOf_read_fn_called_on_write();
    });

    describe('8746c70, writes with a sparse tuple of a partial object index-0 item that has a same string field value', () => {
      test('[action]', async () => {
        setIt(aMugLike, [{ s: '8e2' }, ,]);
        const gotAStateBefore = getIt(aMugLike);
        expect(gotAStateBefore).toMatchObject([{ s: '8e2' }, {}]);

        render(<AComponent />);

        jest.clearAllMocks();
        await act(async () => {
          setIt(aMugLike, [{ s: '8e2' }, ,]);
          gotAStateAfter = getIt(aMugLike);
        });
      });

      test('[verify] the component render is not called on write', () => {
        expect(AComponent).not.toHaveBeenCalled();
      });

      test('[verify] the read fn is not called on write', () => {
        expect(readFn).not.toHaveBeenCalled();
      });
    });

    describe('1ab46c8, writes the index-0 object mug_s string field with a different value', () => {
      test('[action]', async () => {
        setIt(objectMug1, { s: '90e' });
        const gotObjectState1Before = getIt(objectMug1);
        expect(gotObjectState1Before).toMatchObject({ s: '90e' });

        render(<AComponent />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        jest.clearAllMocks();
        await act(async () => {
          setIt(objectMug1, { s: 'b01' });
          gotAStateAfter = getIt(aMugLike);
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

      sharedVerifyCasesOf_read_fn_called_on_write();
    });

    describe('c94ec9b, batch writes the index-0 object mug_s string field with different values', () => {
      test('[action]', async () => {
        setIt(objectMug1, { s: '210' });
        const gotAStateBefore = getIt(aMugLike);
        const gotObjectState1Before = getIt(objectMug1);
        expect(gotAStateBefore).toMatchObject([{ s: '210' }, {}]);
        expect(gotObjectState1Before).toMatchObject({ s: '210' });

        render(<AComponent />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        jest.clearAllMocks();
        await act(async () => {
          setIt(setIt(objectMug1, { s: 'ee8' }), { s: '0d3' });
          gotAStateAfter = getIt(aMugLike);
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

      sharedVerifyCasesOf_read_fn_called_on_write();
    });

    describe('c56dfe8, writes the index-0 object mug_s string field with a same value', () => {
      test('[action]', async () => {
        setIt(objectMug1, { s: '1cc' });
        const gotObjectState1Before = getIt(objectMug1);
        expect(gotObjectState1Before).toMatchObject({ s: '1cc' });

        render(<AComponent />);

        jest.clearAllMocks();
        await act(async () => {
          setIt(objectMug1, { s: '1cc' });
          gotAStateAfter = getIt(aMugLike);
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
        setIt(aMugLike, [{ s: 'e91' }, { s: 'e91' }]);
        const gotAStateBefore = getIt(aMugLike);
        expect(gotAStateBefore).toMatchObject([{ s: 'e91' }, { s: 'e91' }]);

        render(<AComponent />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        jest.clearAllMocks();
        await act(async () => {
          setIt(aMugLike, [{ s: 'eb7' }, { s: '8d6' }]);
          gotAStateAfter = getIt(aMugLike);
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

      sharedVerifyCasesOf_read_fn_called_on_write();
    });

    describe('ec1fc89, batch writes with a dense tuple of partial object items that have different string field values', () => {
      test('[action]', async () => {
        setIt(aMugLike, [{ s: 'ce0' }, { s: 'ce0' }]);
        const gotAStateBefore = getIt(aMugLike);
        expect(gotAStateBefore).toMatchObject([{ s: 'ce0' }, { s: 'ce0' }]);

        render(<AComponent />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        jest.clearAllMocks();
        await act(async () => {
          setIt(setIt(aMugLike, [{ s: '3f2' }, { s: '9ca' }]), [{ s: 'eaa' }, { s: '0e8' }]);
          gotAStateAfter = getIt(aMugLike);
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

      sharedVerifyCasesOf_read_fn_called_on_write();
    });

    describe('514231d, writes with a dense tuple of partial object items that have a same string field value', () => {
      test('[action]', async () => {
        setIt(aMugLike, [{ s: '8dc' }, { s: '8dc' }]);
        const gotAStateBefore = getIt(aMugLike);
        expect(gotAStateBefore).toMatchObject([{ s: '8dc' }, { s: '8dc' }]);

        render(<AComponent />);

        jest.clearAllMocks();
        await act(async () => {
          setIt(aMugLike, [{ s: '8dc' }, { s: '8dc' }]);
          gotAStateAfter = getIt(aMugLike);
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

  describe('bba3052, upon a read op and same-structure temporary mug-nested tuple mug-like', () => {
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

    const readFn = jest.fn((state: [ObjectState, ObjectState]): [ObjectState, ObjectState] =>
      tuple(...state),
    );

    const readOp = r(readFn);

    const AComponent = jest.fn(() => {
      const hookReturn = useIt(readOp, tuple(objectMug1, objectMug2));
      tapHookReturn(hookReturn);
      return <div />;
    });

    let gotAStateAfter: [ObjectState, ObjectState];
    let readFnParamStateLatest: [ObjectState, ObjectState];
    let readFnReturnLatest: [ObjectState, ObjectState];
    let hookReturn1: [ObjectState, ObjectState], hookReturn2: [ObjectState, ObjectState];

    /**
     * Required variables: gotAStateAfter, readFnParamStateLatest, readFnReturnLatest, hookReturn1, hookReturn2,
     */
    function sharedVerifyCasesOf_read_fn_called_on_write() {
      test('[verify] the (latest) read fn param state_s items equal the after-write got state_s items in ref and value', () => {
        gotAStateAfter.forEach((item, i) => {
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

    describe('4e15c75, writes the index-0 object mug_s string field with a different value', () => {
      test('[action]', async () => {
        setIt(objectMug1, { s: '649' });
        const gotObjectState1Before = getIt(objectMug1);
        expect(gotObjectState1Before).toMatchObject({ s: '649' });

        render(<AComponent />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        jest.clearAllMocks();
        await act(async () => {
          setIt(objectMug1, { s: 'b01' });
          gotAStateAfter = getIt(tuple(objectMug1, objectMug2));
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

      sharedVerifyCasesOf_read_fn_called_on_write();
    });

    describe('1fb2671, batch writes the index-0 object mug_s string field with different values', () => {
      test('[action]', async () => {
        setIt(objectMug1, { s: '157' });
        const gotObjectState1Before = getIt(objectMug1);
        expect(gotObjectState1Before).toMatchObject({ s: '157' });

        render(<AComponent />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        jest.clearAllMocks();
        await act(async () => {
          setIt(setIt(objectMug1, { s: '66a' }), { s: '2b2' });
          gotAStateAfter = getIt(tuple(objectMug1, objectMug2));
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

      sharedVerifyCasesOf_read_fn_called_on_write();
    });

    describe('0c06d13, writes the index-0 object mug_s string field with a same value', () => {
      test('[action]', async () => {
        setIt(objectMug1, { s: 'd26' });
        const gotObjectState1Before = getIt(objectMug1);
        expect(gotObjectState1Before).toMatchObject({ s: 'd26' });

        render(<AComponent />);

        jest.clearAllMocks();
        await act(async () => {
          setIt(objectMug1, { s: 'd26' });
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

  describe('50fdf5e, upon a read action and a plain object mug, [cite] .:8577c9b', () => {
    interface AState extends ObjectState {}

    const aMug: Mug<AState> = {
      [construction]: {
        s: 'asd',
        o: {
          s: 'asd',
        },
      },
    };

    const [r] = upon(aMug);

    const readFn = jest.fn((state: AState): AState => ({ ...state }));

    const readAction = r(readFn);

    const AComponent = jest.fn(() => {
      const hookReturn = useIt(readAction);
      tapHookReturn(hookReturn);
      return <div />;
    });

    let gotAStateAfter: AState;
    let readFnParamStateLatest: AState;
    let readFnReturnLatest: AState;
    let hookReturn1: AState, hookReturn2: AState;

    /**
     * Required variables: gotAStateAfter, readFnParamStateLatest, readFnReturnLatest, hookReturn1, hookReturn2,
     */
    function sharedVerifyCasesOf_read_fn_called_on_write() {
      test('[verify] the (latest) read fn param state and its fields equal the after-write got state and its fields in ref and value', () => {
        expect(readFnParamStateLatest).toBe(gotAStateAfter);
        ownKeysOfObjectLike(gotAStateAfter).forEach((key) => {
          expect(readFnParamStateLatest[key]).toBe(gotAStateAfter[key]);
        });
        expect(readFnParamStateLatest).toStrictEqual(gotAStateAfter);
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

    describe('0cb1cf5, writes the string field with a different value', () => {
      test('[action]', async () => {
        setIt(aMug, { s: 'f33' });
        const gotAStateBefore = getIt(aMug);
        expect(gotAStateBefore).toMatchObject({ s: 'f33' });

        render(<AComponent />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        jest.clearAllMocks();
        await act(async () => {
          setIt(aMug, { s: '370' });
          gotAStateAfter = getIt(aMug);
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

      sharedVerifyCasesOf_read_fn_called_on_write();
    });

    describe('c59bfb2, batch writes the string field with different values', () => {
      test('[action]', async () => {
        setIt(aMug, { s: '7c5' });
        const gotAStateBefore = getIt(aMug);
        expect(gotAStateBefore).toMatchObject({ s: '7c5' });

        render(<AComponent />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        jest.clearAllMocks();
        await act(async () => {
          setIt(aMug, { s: '8e9' });
          setIt(aMug, { s: '335' });
          gotAStateAfter = getIt(aMug);
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

      sharedVerifyCasesOf_read_fn_called_on_write();
    });

    describe('e6c9cfb, writes the string field with a same value', () => {
      test('[action]', async () => {
        setIt(aMug, { s: '76b' });
        const gotAStateBefore = getIt(aMug);
        expect(gotAStateBefore).toMatchObject({ s: '76b' });

        render(<AComponent />);

        jest.clearAllMocks();
        await act(async () => {
          setIt(aMug, { s: '76b' });
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

  describe('a846b98, upon a read action and a mug-nested object mug, [cite] .:3c20440', () => {
    interface AState extends ObjectState {
      muggyObject: ObjectState;
    }

    const objectMug: Mug<ObjectState> = {
      [construction]: {
        s: 'asd',
        o: {
          s: 'asd',
        },
      },
    };

    const aMug: Mug<Muggify<AState, { muggyObject: Mug<ObjectState> }>> = {
      [construction]: {
        s: 'asd',
        o: {
          s: 'asd',
        },
        muggyObject: objectMug,
      },
    };

    const [r] = upon(aMug);

    const readFn = jest.fn((state: AState): AState => ({ ...state }));

    const readAction = r(readFn);

    const AComponent = jest.fn(() => {
      const hookReturn = useIt(readAction);
      tapHookReturn(hookReturn);
      return <div />;
    });

    let gotAStateAfter: AState;
    let readFnParamStateLatest: AState;
    let readFnReturnLatest: AState;
    let hookReturn1: AState, hookReturn2: AState;

    /**
     * Required variables: gotAStateAfter, readFnParamStateLatest, readFnReturnLatest, hookReturn1, hookReturn2,
     */
    function sharedVerifyCasesOf_read_fn_called_on_write() {
      test('[verify] the (latest) read fn param state and its fields equal the after-write got state and its fields in ref and value', () => {
        expect(readFnParamStateLatest).toBe(gotAStateAfter);
        ownKeysOfObjectLike(gotAStateAfter).forEach((key) => {
          expect(readFnParamStateLatest[key]).toBe(gotAStateAfter[key]);
        });
        expect(readFnParamStateLatest).toStrictEqual(gotAStateAfter);
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

    describe('75c60bb, writes the string field with a different value', () => {
      test('[action]', async () => {
        setIt(aMug, { s: '02f' });
        const gotAStateBefore = getIt(aMug);
        expect(gotAStateBefore).toMatchObject({ s: '02f' });

        render(<AComponent />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        jest.clearAllMocks();
        await act(async () => {
          setIt(aMug, { s: 'd4e' });
          gotAStateAfter = getIt(aMug);
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

      sharedVerifyCasesOf_read_fn_called_on_write();
    });

    describe('9765ec0, batch writes the string field with different values', () => {
      test('[action]', async () => {
        setIt(aMug, { s: 'b27' });
        const gotAStateBefore = getIt(aMug);
        expect(gotAStateBefore).toMatchObject({ s: 'b27' });

        render(<AComponent />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        jest.clearAllMocks();
        await act(async () => {
          setIt(setIt(aMug, { s: '3cc' }), { s: 'edf' });
          gotAStateAfter = getIt(aMug);
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

      sharedVerifyCasesOf_read_fn_called_on_write();
    });

    describe('6cf3064, writes the string field with a same value', () => {
      test('[action]', async () => {
        setIt(aMug, { s: '030' });
        const gotAStateBefore = getIt(aMug);
        expect(gotAStateBefore).toMatchObject({ s: '030' });

        render(<AComponent />);

        jest.clearAllMocks();
        await act(async () => {
          setIt(aMug, { s: '030' });
        });
      });

      test('[verify] the component render is not called on write', () => {
        expect(AComponent).not.toHaveBeenCalled();
      });

      test('[verify] the read fn is not called on write', () => {
        expect(readFn).not.toHaveBeenCalled();
      });
    });

    describe('b62a223, writes the muggy object field_s string field with a different value', () => {
      test('[action]', async () => {
        setIt(aMug, { muggyObject: { s: 'e52' } });
        const gotAStateBefore = getIt(aMug);
        expect(gotAStateBefore).toMatchObject({ muggyObject: { s: 'e52' } });

        render(<AComponent />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        jest.clearAllMocks();
        await act(async () => {
          setIt(aMug, { muggyObject: { s: '7c1' } });
          gotAStateAfter = getIt(aMug);
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

      sharedVerifyCasesOf_read_fn_called_on_write();
    });

    describe('3267854, batch writes the muggy object field_s string field with different values', () => {
      test('[action]', async () => {
        setIt(aMug, { muggyObject: { s: '071' } });
        const gotAStateBefore = getIt(aMug);
        expect(gotAStateBefore).toMatchObject({ muggyObject: { s: '071' } });

        render(<AComponent />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        jest.clearAllMocks();
        await act(async () => {
          setIt(setIt(aMug, { muggyObject: { s: '7a3' } }), {
            muggyObject: { s: 'b35' },
          });
          gotAStateAfter = getIt(aMug);
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

      sharedVerifyCasesOf_read_fn_called_on_write();
    });

    describe('1e50f5d, writes the muggy object field_s string field with a same value', () => {
      test('[action]', async () => {
        setIt(aMug, { muggyObject: { s: '5da' } });
        const gotAStateBefore = getIt(aMug);
        expect(gotAStateBefore).toMatchObject({ muggyObject: { s: '5da' } });

        render(<AComponent />);

        jest.clearAllMocks();
        await act(async () => {
          setIt(aMug, { muggyObject: { s: '5da' } });
        });
      });

      test('[verify] the component render is not called on write', () => {
        expect(AComponent).not.toHaveBeenCalled();
      });

      test('[verify] the read fn is not called on write', () => {
        expect(readFn).not.toHaveBeenCalled();
      });
    });

    describe('59a2048, writes the object mug_s string field with a different value', () => {
      test('[action]', async () => {
        setIt(objectMug, { s: '303' });
        const gotObjectStateBefore = getIt(objectMug);
        expect(gotObjectStateBefore).toMatchObject({ s: '303' });

        render(<AComponent />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        jest.clearAllMocks();
        await act(async () => {
          setIt(objectMug, { s: '7f4' });
          gotAStateAfter = getIt(aMug);
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

      sharedVerifyCasesOf_read_fn_called_on_write();
    });

    describe('6c870e2, batch writes the object mug_s string field with different values', () => {
      test('[action]', async () => {
        setIt(objectMug, { s: 'c31' });
        const gotObjectStateBefore = getIt(objectMug);
        expect(gotObjectStateBefore).toMatchObject({ s: 'c31' });

        render(<AComponent />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        jest.clearAllMocks();
        await act(async () => {
          setIt(setIt(objectMug, { s: 'b5b' }), { s: '660' });
          gotAStateAfter = getIt(aMug);
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

      sharedVerifyCasesOf_read_fn_called_on_write();
    });

    describe('1a0ed6c, writes the object mug_s string field with a same value', () => {
      test('[action]', async () => {
        setIt(objectMug, { s: '39e' });
        const gotObjectStateBefore = getIt(objectMug);
        expect(gotObjectStateBefore).toMatchObject({ s: '39e' });

        render(<AComponent />);

        jest.clearAllMocks();
        await act(async () => {
          setIt(objectMug, { s: '39e' });
        });
      });

      test('[verify] the component render is not called on write', () => {
        expect(AComponent).not.toHaveBeenCalled();
      });

      test('[verify] the read fn is not called on write', () => {
        expect(readFn).not.toHaveBeenCalled();
      });
    });

    describe('b50de24, simultaneously writes the string field and the muggy object field_s string field with different values', () => {
      test('[action]', async () => {
        setIt(aMug, { s: '690', muggyObject: { s: '5ab' } });
        const gotAStateBefore = getIt(aMug);
        expect(gotAStateBefore).toMatchObject({ s: '690', muggyObject: { s: '5ab' } });

        render(<AComponent />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        jest.clearAllMocks();
        await act(async () => {
          setIt(aMug, { s: '74e', muggyObject: { s: 'd83' } });
          gotAStateAfter = getIt(aMug);
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

      sharedVerifyCasesOf_read_fn_called_on_write();
    });

    describe('fd5e0a3, simultaneously batch writes the string field and the muggy object field_s string field with different values', () => {
      test('[action]', async () => {
        setIt(aMug, { s: '749', muggyObject: { s: 'b05' } });
        const gotAStateBefore = getIt(aMug);
        expect(gotAStateBefore).toMatchObject({ s: '749', muggyObject: { s: 'b05' } });

        render(<AComponent />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        jest.clearAllMocks();
        await act(async () => {
          setIt(setIt(aMug, { s: 'dee', muggyObject: { s: '48b' } }), {
            s: '94c',
            muggyObject: { s: '70f' },
          });
          gotAStateAfter = getIt(aMug);
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

      sharedVerifyCasesOf_read_fn_called_on_write();
    });

    describe('7a7d972, simultaneously writes the string field and the muggy object field_s string field with a same value', () => {
      test('[action]', async () => {
        setIt(aMug, { s: '4a4', muggyObject: { s: '91b' } });
        const gotAStateBefore = getIt(aMug);
        expect(gotAStateBefore).toMatchObject({ s: '4a4', muggyObject: { s: '91b' } });

        render(<AComponent />);

        jest.clearAllMocks();
        await act(async () => {
          setIt(aMug, { s: '4a4', muggyObject: { s: '91b' } });
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

  describe('31ee94b, upon a read action and a mug-nested tuple mug-like, [cite] .:2c62e81', () => {
    type AState = [ObjectState, ObjectState];

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

    const [r] = upon(aMugLike);

    const readFn = jest.fn((state: AState): AState => [...state]);

    const readAction = r(readFn);

    const AComponent = jest.fn(() => {
      const hookReturn = useIt(readAction);
      tapHookReturn(hookReturn);
      return <div />;
    });

    let gotAStateAfter: AState;
    let readFnParamStateLatest: AState;
    let readFnReturnLatest: AState;
    let hookReturn1: AState, hookReturn2: AState;

    /**
     * Required variables: gotAStateAfter, readFnParamStateLatest, readFnReturnLatest, hookReturn1, hookReturn2,
     */
    function sharedVerifyCasesOf_read_fn_called_on_write() {
      test('[verify] the (latest) read fn param state and its items equal the after-write got state and its items in ref and value', () => {
        expect(readFnParamStateLatest).toBe(gotAStateAfter);
        gotAStateAfter.forEach((item, i) => {
          expect(readFnParamStateLatest[i]).toBe(item);
        });
        expect(readFnParamStateLatest).toStrictEqual(gotAStateAfter);
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

    describe('7de9d60, writes with a sparse tuple of a partial object index-0 item that has a different string field value', () => {
      test('[action]', async () => {
        setIt(aMugLike, [{ s: 'ded' }, ,]);
        const gotAStateBefore = getIt(aMugLike);
        expect(gotAStateBefore).toMatchObject([{ s: 'ded' }, {}]);

        render(<AComponent />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        jest.clearAllMocks();
        await act(async () => {
          setIt(aMugLike, [{ s: 'ab8' }, ,]);
          gotAStateAfter = getIt(aMugLike);
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

      sharedVerifyCasesOf_read_fn_called_on_write();
    });

    describe('8545da3, batch writes with sparse tuples of partial object index-0 items that have different string field values', () => {
      test('[action]', async () => {
        setIt(aMugLike, [{ s: 'c5d' }, ,]);
        const gotAStateBefore = getIt(aMugLike);
        expect(gotAStateBefore).toMatchObject([{ s: 'c5d' }, {}]);

        render(<AComponent />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        jest.clearAllMocks();
        await act(async () => {
          setIt(setIt(aMugLike, [{ s: '6ea' }, ,]), [{ s: 'f99' }, ,]);
          gotAStateAfter = getIt(aMugLike);
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

      sharedVerifyCasesOf_read_fn_called_on_write();
    });

    describe('add7263, writes with a sparse tuple of a partial object index-0 item that has a same string field value', () => {
      test('[action]', async () => {
        setIt(aMugLike, [{ s: '8e2' }, ,]);
        const gotAStateBefore = getIt(aMugLike);
        expect(gotAStateBefore).toMatchObject([{ s: '8e2' }, {}]);

        render(<AComponent />);

        jest.clearAllMocks();
        await act(async () => {
          setIt(aMugLike, [{ s: '8e2' }, ,]);
          gotAStateAfter = getIt(aMugLike);
        });
      });

      test('[verify] the component render is not called on write', () => {
        expect(AComponent).not.toHaveBeenCalled();
      });

      test('[verify] the read fn is not called on write', () => {
        expect(readFn).not.toHaveBeenCalled();
      });
    });

    describe('6ee8785, writes the index-0 object mug_s string field with a different value', () => {
      test('[action]', async () => {
        setIt(objectMug1, { s: '90e' });
        const gotObjectState1Before = getIt(objectMug1);
        expect(gotObjectState1Before).toMatchObject({ s: '90e' });

        render(<AComponent />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        jest.clearAllMocks();
        await act(async () => {
          setIt(objectMug1, { s: 'b01' });
          gotAStateAfter = getIt(aMugLike);
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

      sharedVerifyCasesOf_read_fn_called_on_write();
    });

    describe('40cd5b7, batch writes the index-0 object mug_s string field with different values', () => {
      test('[action]', async () => {
        setIt(objectMug1, { s: '210' });
        const gotAStateBefore = getIt(aMugLike);
        const gotObjectState1Before = getIt(objectMug1);
        expect(gotAStateBefore).toMatchObject([{ s: '210' }, {}]);
        expect(gotObjectState1Before).toMatchObject({ s: '210' });

        render(<AComponent />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        jest.clearAllMocks();
        await act(async () => {
          setIt(setIt(objectMug1, { s: 'ee8' }), { s: '0d3' });
          gotAStateAfter = getIt(aMugLike);
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

      sharedVerifyCasesOf_read_fn_called_on_write();
    });

    describe('5319167, writes the index-0 object mug_s string field with a same value', () => {
      test('[action]', async () => {
        setIt(objectMug1, { s: '1cc' });
        const gotObjectState1Before = getIt(objectMug1);
        expect(gotObjectState1Before).toMatchObject({ s: '1cc' });

        render(<AComponent />);

        jest.clearAllMocks();
        await act(async () => {
          setIt(objectMug1, { s: '1cc' });
          gotAStateAfter = getIt(aMugLike);
        });
      });

      test('[verify] the component render is not called on write', () => {
        expect(AComponent).not.toHaveBeenCalled();
      });

      test('[verify] the read fn is not called on write', () => {
        expect(readFn).not.toHaveBeenCalled();
      });
    });

    describe('8c88d3c, writes with a dense tuple of partial object items that have different string field values', () => {
      test('[action]', async () => {
        setIt(aMugLike, [{ s: 'e91' }, { s: 'e91' }]);
        const gotAStateBefore = getIt(aMugLike);
        expect(gotAStateBefore).toMatchObject([{ s: 'e91' }, { s: 'e91' }]);

        render(<AComponent />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        jest.clearAllMocks();
        await act(async () => {
          setIt(aMugLike, [{ s: 'eb7' }, { s: '8d6' }]);
          gotAStateAfter = getIt(aMugLike);
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

      sharedVerifyCasesOf_read_fn_called_on_write();
    });

    describe('ffe65c4, batch writes with a dense tuple of partial object items that have different string field values', () => {
      test('[action]', async () => {
        setIt(aMugLike, [{ s: 'ce0' }, { s: 'ce0' }]);
        const gotAStateBefore = getIt(aMugLike);
        expect(gotAStateBefore).toMatchObject([{ s: 'ce0' }, { s: 'ce0' }]);

        render(<AComponent />);
        hookReturn1 = tapHookReturn.mock.calls[0][0];

        jest.clearAllMocks();
        await act(async () => {
          setIt(setIt(aMugLike, [{ s: '3f2' }, { s: '9ca' }]), [{ s: 'eaa' }, { s: '0e8' }]);
          gotAStateAfter = getIt(aMugLike);
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

      sharedVerifyCasesOf_read_fn_called_on_write();
    });

    describe('be25bb2, writes with a dense tuple of partial object items that have a same string field value', () => {
      test('[action]', async () => {
        setIt(aMugLike, [{ s: '8dc' }, { s: '8dc' }]);
        const gotAStateBefore = getIt(aMugLike);
        expect(gotAStateBefore).toMatchObject([{ s: '8dc' }, { s: '8dc' }]);

        render(<AComponent />);

        jest.clearAllMocks();
        await act(async () => {
          setIt(aMugLike, [{ s: '8dc' }, { s: '8dc' }]);
          gotAStateAfter = getIt(aMugLike);
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
