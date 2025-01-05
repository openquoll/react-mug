import { construction, getIt, Mug, PossiblePatch, setIt, upon } from '../src';

jest.mock('../src/mechanism', () => {
  const m = jest.requireActual('../src/mechanism');
  const { getIt, setIt } = m;
  jest.spyOn(m, 'r');
  jest.spyOn(m, 'w');
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

describe('0ab2ffa, special-ops straightforwardly, [cite] 003, 004', () => {
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

  const toolbelt = upon<AState>(aMug);

  const [r, w] = toolbelt;

  const defaultReadSpecialOp = r();

  const customReadSpecialOp = r(customReadFn);

  const defaultWriteSpecialOp = w();

  const customWriteSpecialOp = w(customWriteFn);

  describe('1696308, checks the special-op toolbelt_s fields', () => {
    test('[verify] the "r" field equals the index-0 item in ref', () => {
      expect(toolbelt.r).toBe(r);
    });

    test('[verify] the "w" field equals the index-1 item in ref', () => {
      expect(toolbelt.w).toBe(w);
    });
  });

  describe('a0ba1e5, reads by the default read special-op', () => {
    let readSpecialOpReturn: AState;
    let getItParamMug: AMug, getItReturn: AState;

    test('[action]', () => {
      readSpecialOpReturn = defaultReadSpecialOp();
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

    test('[verify] the read special-op return equals "getIt" return in ref and value', () => {
      expect(readSpecialOpReturn).toBe(getItReturn);
      expect(readSpecialOpReturn).toStrictEqual(getItReturn);
    });
  });

  describe('640f3ad, reads by the custom read special-op', () => {
    const readSpecialOpParamExtra: Pick<ObjectState, 'o'> = { o: { s: '3cd' } };
    let readSpecialOpReturn: Pick<ObjectState, 'o'>;
    let gotAState: AState;
    let readFnParamState: AState, readFnParamExtra: Pick<ObjectState, 'o'>;
    let readFnReturn: Pick<ObjectState, 'o'>;

    test('[action]', () => {
      gotAState = getIt(aMug);
      readSpecialOpReturn = customReadSpecialOp(readSpecialOpParamExtra);
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

    test('[verify] the read fn param extra equals the read special-op param extra in ref and value', () => {
      expect(readFnParamExtra).toBe(readSpecialOpParamExtra);
      expect(readFnParamExtra).toStrictEqual(readSpecialOpParamExtra);
    });

    test('[verify] the read special-op return equals the read fn return in ref and value', () => {
      expect(readSpecialOpReturn).toBe(readFnReturn);
      expect(readSpecialOpReturn).toStrictEqual(readFnReturn);
    });
  });

  describe('976ac2c, writes by the default write special-op', () => {
    const writeSpecialOpParamPatch: PossiblePatch<AMug> = { s: '716' };
    let setItParamMug: AMug, setItParamPatch: PossiblePatch<AMug>;

    test('[action]', () => {
      defaultWriteSpecialOp(writeSpecialOpParamPatch);
      setItParamMug = jest.mocked(setIt).mock.calls[0][0] as AMug;
      setItParamPatch = jest.mocked(setIt).mock.calls[0][1] as PossiblePatch<AState>;
    });

    test('[verify] "setIt" is called 1 time', () => {
      expect(setIt).toHaveBeenCalledTimes(1);
    });

    test('[verify] "setIt" param mug equals the contextual mug in ref and value', () => {
      expect(setItParamMug).toBe(aMug);
      expect(setItParamMug).toStrictEqual(aMug);
    });

    test('[verify] "setIt" param patch equals the write special-op param patch in ref and value', () => {
      expect(setItParamPatch).toBe(writeSpecialOpParamPatch);
      expect(setItParamPatch).toStrictEqual(writeSpecialOpParamPatch);
    });
  });

  describe('4653a7e, writes by the custom write special-op', () => {
    const writeSpecialOpParamS = '420';
    let gotAStateBefore: AState, gotAStateAfter: AState;
    let writeFnParamState: AState, writeFnParamS: string, writeFnReturn: AState;

    test('[action]', () => {
      gotAStateBefore = getIt(aMug);

      customWriteSpecialOp(writeSpecialOpParamS);
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

    test('[verify] the write fn param string equals the write special-op param string in value', () => {
      expect(writeFnParamS).toBe(writeSpecialOpParamS);
    });

    test('[verify] the contextual mug_s after-write got state equals the write fn return in ref and value', () => {
      expect(gotAStateAfter).toBe(writeFnReturn);
      expect(gotAStateAfter).toStrictEqual(writeFnReturn);
    });
  });
});

describe('0cedec5, special-ops in OOP, [cite] .:0ab2ffa', () => {
  class AMug {
    _ = upon<AState>(this);

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

    customReadSpecialOp = this._.r(customReadFn);

    set = this._.w();

    customWriteSpecialOp = this._.w(customWriteFn);
  }

  const aMug = new AMug();

  describe('e891110, reads by the default read special-op', () => {
    let readSpecialOpReturn: AState;
    let getItParamMug: AMug, getItReturn: AState;

    test('[action]', () => {
      readSpecialOpReturn = aMug.get();
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

    test('[verify] the read special-op return equals "getIt" return in ref and value', () => {
      expect(readSpecialOpReturn).toBe(getItReturn);
      expect(readSpecialOpReturn).toStrictEqual(getItReturn);
    });
  });

  describe('45344e5, reads by the custom read special-op', () => {
    const readSpecialOpParamExtra: Pick<ObjectState, 'o'> = { o: { s: '3cd' } };
    let readSpecialOpReturn: Pick<ObjectState, 'o'>;
    let gotAState: AState;
    let readFnParamState: AState, readFnParamExtra: Pick<ObjectState, 'o'>;
    let readFnReturn: Pick<ObjectState, 'o'>;

    test('[action]', () => {
      gotAState = getIt(aMug);
      readSpecialOpReturn = aMug.customReadSpecialOp(readSpecialOpParamExtra);
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

    test('[verify] the read fn param extra equals the read special-op param extra in ref and value', () => {
      expect(readFnParamExtra).toBe(readSpecialOpParamExtra);
      expect(readFnParamExtra).toStrictEqual(readSpecialOpParamExtra);
    });

    test('[verify] the read special-op return equals the read fn return in ref and value', () => {
      expect(readSpecialOpReturn).toBe(readFnReturn);
      expect(readSpecialOpReturn).toStrictEqual(readFnReturn);
    });
  });

  describe('a590ccd, writes by the default write special-op', () => {
    const writeSpecialOpParamPatch: PossiblePatch<AMug> = { s: '716' };
    let setItParamMug: AMug, setItParamPatch: PossiblePatch<AMug>;

    test('[action]', () => {
      aMug.set(writeSpecialOpParamPatch);
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

    test('[verify] "setIt" param patch equals the write special-op param patch in ref and value', () => {
      expect(setItParamPatch).toBe(writeSpecialOpParamPatch);
      expect(setItParamPatch).toStrictEqual(writeSpecialOpParamPatch);
    });
  });

  describe('0b61740, writes by the custom write special-op', () => {
    const writeSpecialOpParamS = '420';
    let gotAStateBefore: AState, gotAStateAfter: AState;
    let writeFnParamState: AState, writeFnParamS: string, writeFnReturn: AState;

    test('[action]', () => {
      gotAStateBefore = getIt(aMug);

      aMug.customWriteSpecialOp(writeSpecialOpParamS);
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

    test('[verify] the write fn param string equals the write special-op param string in value', () => {
      expect(writeFnParamS).toBe(writeSpecialOpParamS);
    });

    test('[verify] the mug instance_s after-write got state equals the write fn return in ref and value', () => {
      expect(gotAStateAfter).toBe(writeFnReturn);
      expect(gotAStateAfter).toStrictEqual(writeFnReturn);
    });
  });
});
