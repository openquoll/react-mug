import { construction, flat, getIt, Mug, PossiblePatch, pure, setIt, upon } from '../src';

jest.mock('../src/op-mech', () => {
  const m = jest.requireActual('../src/op-mech');
  jest.spyOn(m, 'r');
  jest.spyOn(m, 'w');
  return m;
});

jest.mock('../src/builtin-ops', () => {
  const m = jest.requireActual('../src/builtin-ops');
  const { getIt, setIt } = m;
  Object.assign(jest.spyOn(m, 'getIt'), getIt);
  Object.assign(jest.spyOn(m, 'setIt'), setIt);
  return m;
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

const customReadFn = jest.fn(
  (state: AState, extra: Pick<ObjectState, 'o'>): Pick<ObjectState, 'o'> => {
    return {
      o: {
        s: `${extra.o.s}:${state.potentialMuggyObject.o.s}`,
      },
    };
  },
);

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

describe('0ab2ffa, actions straightforwardly, [cite] 003, 004', () => {
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

  const uponA = upon(aMug);

  const [r, w] = uponA;

  const getA = r();

  const customReadAction = r(customReadFn);

  const setA = w();

  const customWriteAction = w(customWriteFn);

  describe('1696308, checks the action toolbelt_s fields', () => {
    test('[action, verify] the "r" field equals the index-0 item in ref', () => {
      expect(r).toBe(uponA.r);
    });

    test('[action, verify] the "w" field equals the index-1 item in ref', () => {
      expect(w).toBe(uponA.w);
    });
  });

  describe('a0ba1e5, reads by the default read action', () => {
    let readActionReturn: AState;
    let getItParamMug: AMug, getItReturn: AState;

    test('[action]', () => {
      readActionReturn = getA();
      getItParamMug = jest.mocked(getIt).mock.calls[0][0] as AMug;
      getItReturn = jest.mocked(getIt).mock.results[0].value;
    });

    test('[verify] "getIt" is called 1 time', () => {
      expect(getIt).toHaveBeenCalledTimes(1);
    });

    test('[verify] "getIt" param mug equals the contextual mug in ref and value', () => {
      expect(getItParamMug).toBe(aMug);
      expect(getItParamMug).toStrictEqual(aMug);
    });

    test('[verify] the read action return equals "getIt" return in ref and value', () => {
      expect(readActionReturn).toBe(getItReturn);
      expect(readActionReturn).toStrictEqual(getItReturn);
    });
  });

  describe('1d42439, calls "flat" with the default read action', () => {
    test('[action, verify] the return equals "getIt" in ref', () => {
      expect(flat(getA)).toBe(getIt);
    });
  });

  describe('640f3ad, reads by the custom read action', () => {
    const readActionParamExtra: Pick<ObjectState, 'o'> = { o: { s: '3cd' } };
    let readActionReturn: Pick<ObjectState, 'o'>;
    let gotAState: AState;
    let readFnParamState: AState, readFnParamExtra: Pick<ObjectState, 'o'>;
    let readFnReturn: Pick<ObjectState, 'o'>;

    test('[action]', () => {
      gotAState = getIt(aMug);
      readActionReturn = customReadAction(readActionParamExtra);
      readFnParamState = customReadFn.mock.calls[0][0];
      readFnParamExtra = customReadFn.mock.calls[0][1];
      readFnReturn = customReadFn.mock.results[0].value;
    });

    test('[verify] the read fn is called 1 time', () => {
      expect(customReadFn).toHaveBeenCalledTimes(1);
    });

    test('[verify] the read fn param state equals the contextual mug_s got state in ref and value', () => {
      expect(readFnParamState).toBe(gotAState);
      expect(readFnParamState).toStrictEqual(gotAState);
    });

    test('[verify] the read fn param extra equals the read action param extra in ref and value', () => {
      expect(readFnParamExtra).toBe(readActionParamExtra);
      expect(readFnParamExtra).toStrictEqual(readActionParamExtra);
    });

    test('[verify] the read action return equals the read fn return in ref and value', () => {
      expect(readActionReturn).toBe(readFnReturn);
      expect(readActionReturn).toStrictEqual(readFnReturn);
    });
  });

  describe('6813464, calls "pure" with the custom read action', () => {
    test('[action, verify] the return equals the custom read fn in ref', () => {
      expect(pure(customReadAction)).toBe(customReadFn);
    });
  });

  describe('976ac2c, writes by the default write action', () => {
    const writeActionParamPatch: PossiblePatch<AMug> = { s: '716' };
    let setItParamMug: AMug, setItParamPatch: PossiblePatch<AMug>;

    test('[action]', () => {
      setA(writeActionParamPatch);
      setItParamMug = jest.mocked(setIt).mock.calls[0][0] as AMug;
      setItParamPatch = jest.mocked(setIt).mock.calls[0][1] as PossiblePatch<AMug>;
    });

    test('[verify] "setIt" is called 1 time', () => {
      expect(setIt).toHaveBeenCalledTimes(1);
    });

    test('[verify] "setIt" param mug equals the contextual mug in ref and value', () => {
      expect(setItParamMug).toBe(aMug);
      expect(setItParamMug).toStrictEqual(aMug);
    });

    test('[verify] "setIt" param patch equals the write action param patch in ref and value', () => {
      expect(setItParamPatch).toBe(writeActionParamPatch);
      expect(setItParamPatch).toStrictEqual(writeActionParamPatch);
    });
  });

  describe('781d2c6, calls "flat" with the default write action', () => {
    test('[action, verify] the return equals "setIt" in ref', () => {
      expect(flat(setA)).toBe(setIt);
    });
  });

  describe('4653a7e, writes by the custom write action', () => {
    const writeActionParamS = '420';
    let gotAStateBefore: AState, gotAStateAfter: AState;
    let writeFnParamState: AState, writeFnParamS: string, writeFnReturn: AState;

    test('[action]', () => {
      gotAStateBefore = getIt(aMug);

      customWriteAction(writeActionParamS);
      writeFnParamState = customWriteFn.mock.calls[0][0];
      writeFnParamS = customWriteFn.mock.calls[0][1];
      writeFnReturn = customWriteFn.mock.results[0].value;

      gotAStateAfter = getIt(aMug);
    });

    test('[verify] the write fn is called 1 time', () => {
      expect(customWriteFn).toHaveBeenCalledTimes(1);
    });

    test('[verify] the write fn param state equals the contextual mug_s before-write got state in ref and value', () => {
      expect(writeFnParamState).toBe(gotAStateBefore);
      expect(writeFnParamState).toStrictEqual(gotAStateBefore);
    });

    test('[verify] the write fn param string equals the write action param string in value', () => {
      expect(writeFnParamS).toBe(writeActionParamS);
    });

    test('[verify] the contextual mug_s after-write got state equals the write fn return in ref and value', () => {
      expect(gotAStateAfter).toBe(writeFnReturn);
      expect(gotAStateAfter).toStrictEqual(writeFnReturn);
    });
  });

  describe('a0dda55, calls "pure" with the custom write action', () => {
    test('[action, verify] the return equals the custom write fn in ref', () => {
      expect(pure(customWriteAction)).toBe(customWriteFn);
    });
  });
});

describe('0cedec5, actions in OOP, [cite] .:0ab2ffa', () => {
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

    get = this._.r();

    customReadAction = this._.r(customReadFn);

    set = this._.w();

    customWriteAction = this._.w(customWriteFn);
  }

  const aMug = new AMug();

  describe('e891110, reads by the default read action', () => {
    let readActionReturn: AState;
    let getItParamMug: AMug, getItReturn: AState;

    test('[action]', () => {
      readActionReturn = aMug.get();
      getItParamMug = jest.mocked(getIt).mock.calls[0][0] as AMug;
      getItReturn = jest.mocked(getIt).mock.results[0].value;
    });

    test('[verify] "getIt" is called 1 time', () => {
      expect(getIt).toHaveBeenCalledTimes(1);
    });

    test('[verify] "getIt" param mug equals the mug instance in ref and value', () => {
      expect(getItParamMug).toBe(aMug);
      expect(getItParamMug).toStrictEqual(aMug);
    });

    test('[verify] the read action return equals "getIt" return in ref and value', () => {
      expect(readActionReturn).toBe(getItReturn);
      expect(readActionReturn).toStrictEqual(getItReturn);
    });
  });

  describe('b523102, calls "flat" with the default read action', () => {
    test('[action, verify] the return equals "getIt" in ref', () => {
      expect(flat(aMug.get)).toBe(getIt);
    });
  });

  describe('45344e5, reads by the custom read action', () => {
    const readActionParamExtra: Pick<ObjectState, 'o'> = { o: { s: '3cd' } };
    let readActionReturn: Pick<ObjectState, 'o'>;
    let gotAState: AState;
    let readFnParamState: AState, readFnParamExtra: Pick<ObjectState, 'o'>;
    let readFnReturn: Pick<ObjectState, 'o'>;

    test('[action]', () => {
      gotAState = getIt(aMug);
      readActionReturn = aMug.customReadAction(readActionParamExtra);
      readFnParamState = customReadFn.mock.calls[0][0];
      readFnParamExtra = customReadFn.mock.calls[0][1];
      readFnReturn = customReadFn.mock.results[0].value;
    });

    test('[verify] the read fn is called 1 time', () => {
      expect(customReadFn).toHaveBeenCalledTimes(1);
    });

    test('[verify] the read fn param state equals the mug instance_s got state in ref and value', () => {
      expect(readFnParamState).toBe(gotAState);
      expect(readFnParamState).toStrictEqual(gotAState);
    });

    test('[verify] the read fn param extra equals the read action param extra in ref and value', () => {
      expect(readFnParamExtra).toBe(readActionParamExtra);
      expect(readFnParamExtra).toStrictEqual(readActionParamExtra);
    });

    test('[verify] the read action return equals the read fn return in ref and value', () => {
      expect(readActionReturn).toBe(readFnReturn);
      expect(readActionReturn).toStrictEqual(readFnReturn);
    });
  });

  describe('91c6286, calls "pure" with the custom read action', () => {
    test('[action, verify] the return equals the custom read fn in ref', () => {
      expect(pure(aMug.customReadAction)).toBe(customReadFn);
    });
  });

  describe('a590ccd, writes by the default write action', () => {
    const writeActionParamPatch: PossiblePatch<AMug> = { s: '716' };
    let setItParamMug: AMug, setItParamPatch: PossiblePatch<AMug>;

    test('[action]', () => {
      aMug.set(writeActionParamPatch);
      setItParamMug = jest.mocked(setIt).mock.calls[0][0] as AMug;
      setItParamPatch = jest.mocked(setIt).mock.calls[0][1] as PossiblePatch<AMug>;
    });

    test('[verify] "setIt" is called 1 time', () => {
      expect(setIt).toHaveBeenCalledTimes(1);
    });

    test('[verify] "setIt" param mug equals the mug instance in ref and value', () => {
      expect(setItParamMug).toBe(aMug);
      expect(setItParamMug).toStrictEqual(aMug);
    });

    test('[verify] "setIt" param patch equals the write action param patch in ref and value', () => {
      expect(setItParamPatch).toBe(writeActionParamPatch);
      expect(setItParamPatch).toStrictEqual(writeActionParamPatch);
    });
  });

  describe('df3fa36, calls "flat" with the default write action', () => {
    test('[action, verify] the return equals "setIt" in ref', () => {
      expect(flat(aMug.set)).toBe(setIt);
    });
  });

  describe('0b61740, writes by the custom write action', () => {
    const writeActionParamS = '420';
    let gotAStateBefore: AState, gotAStateAfter: AState;
    let writeFnParamState: AState, writeFnParamS: string, writeFnReturn: AState;

    test('[action]', () => {
      gotAStateBefore = getIt(aMug);

      aMug.customWriteAction(writeActionParamS);
      writeFnParamState = customWriteFn.mock.calls[0][0];
      writeFnParamS = customWriteFn.mock.calls[0][1];
      writeFnReturn = customWriteFn.mock.results[0].value;

      gotAStateAfter = getIt(aMug);
    });

    test('[verify] the write fn is called 1 time', () => {
      expect(customWriteFn).toHaveBeenCalledTimes(1);
    });

    test('[verify] the write fn param state equals the mug instance_s before-write got state in ref and value', () => {
      expect(writeFnParamState).toBe(gotAStateBefore);
      expect(writeFnParamState).toStrictEqual(gotAStateBefore);
    });

    test('[verify] the write fn param string equals the write action param string in value', () => {
      expect(writeFnParamS).toBe(writeActionParamS);
    });

    test('[verify] the mug instance_s after-write got state equals the write fn return in ref and value', () => {
      expect(gotAStateAfter).toBe(writeFnReturn);
      expect(gotAStateAfter).toStrictEqual(writeFnReturn);
    });
  });

  describe('15f3fb1, calls "pure" with the custom write action', () => {
    test('[action, verify] the return equals the custom write fn in ref', () => {
      expect(pure(aMug.customWriteAction)).toBe(customWriteFn);
    });
  });
});
