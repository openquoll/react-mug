import {
  construction,
  flat,
  check as flatCheck,
  r as flatR,
  swirl as flatSwirl,
  w as flatW,
  Mug,
  upon,
} from '../src';
import { ImperativeToolbelt, internalOp, ReadAction, WriteAction } from '../src/sugar';

jest.mock('../src/rw', () => {
  const rw = jest.requireActual('../src/rw');
  return {
    ...rw,
    w: jest.fn((...args) => jest.fn(rw.w(...args))),
    r: jest.fn((...args) => jest.fn(rw.r(...args))),
  };
});

jest.mock('../src/builtin-ops', () => {
  const builtinOps = jest.requireActual('../src/builtin-ops');
  jest.spyOn(builtinOps, 'swirl');
  jest.spyOn(builtinOps, 'check');
  return builtinOps;
});

interface ObjectState {
  s: string;
  o: {
    s: string;
  };
}

interface AState extends ObjectState {
  potentialMuggyObject: ObjectState;
}

function customReadAFn(aState: AState, extra: Pick<ObjectState, 'o'>): Pick<ObjectState, 'o'> {
  return {
    o: {
      s: `${extra.o.s}:${aState.potentialMuggyObject.o.s}`,
    },
  };
}

function customWriteAFn(state: AState, s: string): AState {
  return {
    ...state,
    s,
    potentialMuggyObject: {
      ...state.potentialMuggyObject,
      s,
    },
  };
}

describe('e6c3c16, imperative directly', () => {
  type AMug = Mug<AState>;

  const aMug: AMug = {
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

  describe('4047f9f, creates an imperative toolbelt', () => {
    let uponA: ImperativeToolbelt<AMug>;

    test('[action, verify]', () => {
      uponA = upon(aMug);
    });

    test('[verify] the tuple items equal the counterpart fields', () => {
      const [w, r, swirlA, checkA] = uponA;
      expect(w).toBe(uponA.w);
      expect(r).toBe(uponA.r);
      expect(swirlA).toBe(uponA.swirl);
      expect(checkA).toBe(uponA.check);
    });

    test('[verify] the "check" action_s internal op equals the flat "check"', () => {
      expect(uponA.check[internalOp]).toBe(flatCheck);
    });

    test('[verify] the "flat" call on the "check" action call returns its internal op', () => {
      expect(flat(uponA.check)).toBe(uponA.check[internalOp]);
    });

    test('[verify] the "swirl" action_s internal op equals the flat "swirl"', () => {
      expect(uponA.swirl[internalOp]).toBe(flatSwirl);
    });

    test('[verify] the "flat" call on the "swirl" action returns its internal op', () => {
      expect(flat(uponA.swirl)).toBe(uponA.swirl[internalOp]);
    });
  });

  describe('92bb0b0, creates a custom read action', () => {
    let customReadA: ReadAction<AMug, typeof customReadAFn>;

    test('[action]', () => {
      customReadA = upon(aMug).r(customReadAFn);
    });

    test('[verify] the flat "r" is called 1 time with the read fn and returns the internal op', () => {
      expect(flatR).toHaveBeenCalledTimes(1);
      expect(flatR).toHaveBeenCalledWith(customReadAFn);
      expect(flatR).toHaveReturnedWith(customReadA[internalOp]);
    });

    test('[verify] the "flat" call on the custom read action returns its internal op', () => {
      expect(flat(customReadA)).toBe(customReadA[internalOp]);
    });
  });

  describe('e9c7b4c, creates a custom write action', () => {
    let customWriteA: WriteAction<AMug, typeof customWriteAFn>;

    test('[action]', () => {
      customWriteA = upon(aMug).w(customWriteAFn);
    });

    test('[verify] the flat "w" is called 1 time with the write fn and returns the internal op', () => {
      expect(flatW).toHaveBeenCalledTimes(1);
      expect(flatW).toHaveBeenCalledWith(customWriteAFn);
      expect(flatW).toHaveReturnedWith(customWriteA[internalOp]);
    });

    test('[verify] the "flat" call on the custom write action returns its internal op', () => {
      expect(flat(customWriteA)).toBe(customWriteA[internalOp]);
    });
  });

  describe('c94e796, reads by the "check" action', () => {
    const checkA = upon(aMug).check;

    let actionReturn: AState, opReturn: AState;

    test('[action]', () => {
      actionReturn = checkA();
      opReturn = jest.mocked(checkA[internalOp]).mock.results[0].value;
    });

    test('[verify] the flat "check" is called 1 time with the mug', () => {
      expect(checkA[internalOp]).toHaveBeenCalledTimes(1);
      expect(checkA[internalOp]).toHaveBeenCalledWith(aMug);
    });

    test('[verify] the action return equals the flat "check" return in ref and value', () => {
      expect(actionReturn).toBe(opReturn);
      expect(actionReturn).toStrictEqual(opReturn);
    });
  });

  describe('35e49e6, writes by the "swirl" action', () => {
    const swirlA = upon(aMug).swirl;

    const patch = { s: '35e' };

    let actionReturn: AMug, opReturn: AMug;

    test('[action]', () => {
      actionReturn = swirlA(patch);
      opReturn = jest.mocked(swirlA[internalOp]).mock.results[0].value;
    });

    test('[verify] the internal op is called 1 time with the mug and the params', () => {
      expect(swirlA[internalOp]).toHaveBeenCalledTimes(1);
      expect(swirlA[internalOp]).toHaveBeenCalledWith(aMug, patch);
    });

    test('[verify] the action return equals the flat "swirl" return in ref and value', () => {
      expect(actionReturn).toBe(opReturn);
      expect(actionReturn).toStrictEqual(opReturn);
    });
  });

  describe('a961fd4, reads by the custom read action', () => {
    const customReadA = upon(aMug).r(customReadAFn);

    const extra = { o: { s: 'd4e' } };

    let actionReturn: Pick<ObjectState, 'o'>, opReturn: Pick<ObjectState, 'o'>;

    test('[action]', () => {
      actionReturn = customReadA(extra);
      opReturn = jest.mocked(customReadA[internalOp]).mock.results[0].value;
    });

    test('[verify] the internal op is called 1 time with the mug and the params', () => {
      expect(customReadA[internalOp]).toHaveBeenCalledTimes(1);
      expect(customReadA[internalOp]).toHaveBeenCalledWith(aMug, extra);
    });

    test('[verify] the action return equals the internal op return in ref and value', () => {
      expect(actionReturn).toBe(opReturn);
      expect(actionReturn).toStrictEqual(opReturn);
    });
  });

  describe('f0ca807, writes by the custom write action', () => {
    const customWriteA = upon(aMug).w(customWriteAFn);

    const s = '2c0';

    let actionReturn: AMug, opReturn: AMug;

    test('[action]', () => {
      actionReturn = customWriteA(s);
      opReturn = jest.mocked(customWriteA[internalOp]).mock.results[0].value;
    });

    test('[verify] the internal op is called 1 time with the mug and the params', () => {
      expect(customWriteA[internalOp]).toHaveBeenCalledTimes(1);
      expect(customWriteA[internalOp]).toHaveBeenCalledWith(aMug, s);
    });

    test('[verify] the action return equals the internal op return in ref and value', () => {
      expect(actionReturn).toBe(opReturn);
      expect(actionReturn).toStrictEqual(opReturn);
    });
  });
});

describe('fbe36d4, imperative with classes, [cite] .:e6c3c16', () => {
  class AMug {
    _ = upon<Mug<AState>>(this);

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

    check = this._.check;

    swirl = this._.swirl;

    customRead = this._.r(customReadAFn);

    customWrite = this._.w(customWriteAFn);
  }

  describe('a660339, instantiate a class equipped with an imperative toolbelt and custom actions', () => {
    let a: AMug;

    test('[action]', () => {
      a = new AMug();
    });

    test('[verify] the "check" action_s internal op equals the flat "check"', () => {
      expect(a.check[internalOp]).toBe(flatCheck);
    });

    test('[verify] the "swirl" action_s internal op equals the flat "swirl"', () => {
      expect(a.swirl[internalOp]).toBe(flatSwirl);
    });

    test('[verify] the flat "r" is called 1 time with the read fn and returns the custom read action_s internal op', () => {
      expect(flatR).toHaveBeenCalledTimes(1);
      expect(flatR).toHaveBeenCalledWith(customReadAFn);
      expect(flatR).toHaveReturnedWith(a.customRead[internalOp]);
    });

    test('[verify] the flat "w" is called 1 time with the write fn and returns the custom write action_s internal op', () => {
      expect(flatW).toHaveBeenCalledTimes(1);
      expect(flatW).toHaveBeenCalledWith(customWriteAFn);
      expect(flatW).toHaveReturnedWith(a.customWrite[internalOp]);
    });
  });
});
