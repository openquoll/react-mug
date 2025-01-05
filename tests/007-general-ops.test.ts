import { construction, getIt, Mug, onto, PossiblePatch, setIt } from '../src';

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

const customExec = jest.fn();

describe('451202d, general-ops straightforwardly, [cite] 006', () => {
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

  const toolbelt = onto<AState>();

  const [r, w, x] = toolbelt;

  const defaultReadGeneralOp = r();

  const customReadGeneralOp = r(customReadFn);

  const defaultWriteGeneralOp = w();

  const customWriteGeneralOp = w(customWriteFn);

  describe('863185a, checks the general-op toolbelt_s fields', () => {
    test('[verify] the "r" field equals the index-0 item in ref', () => {
      expect(toolbelt.r).toBe(r);
    });

    test('[verify] the "w" field equals the index-1 item in ref', () => {
      expect(toolbelt.w).toBe(w);
    });

    test('[verify] the "x" field equals the index-2 item in ref', () => {
      expect(toolbelt.x).toBe(x);
    });
  });

  describe('49ec173, reads by the default read general-op', () => {
    let readGeneralOpReturn: AState;
    let getItParamMug: AMug, getItReturn: AState;

    test('[action]', () => {
      readGeneralOpReturn = defaultReadGeneralOp(aMug);
      getItParamMug = jest.mocked(getIt).mock.calls[0][0] as AMug;
      getItReturn = jest.mocked(getIt).mock.results[0].value;
    });

    test('[verify] "getIt" is called 1 time', () => {
      expect(getIt).toHaveBeenCalledTimes(1);
    });

    test('[verify] "getIt" param mug equals the read general-op param mug in ref and value', () => {
      expect(getItParamMug).toBe(aMug);
      expect(getItParamMug).toStrictEqual(aMug);
    });

    test('[verify] the read general-op return equals "getIt" return in ref and value', () => {
      expect(readGeneralOpReturn).toBe(getItReturn);
      expect(readGeneralOpReturn).toStrictEqual(getItReturn);
    });
  });

  describe('60c20e0, reads by the custom read general-op', () => {
    const readGeneralOpParamExtra: Pick<ObjectState, 'o'> = { o: { s: '8ec' } };
    let readGeneralOpReturn: Pick<ObjectState, 'o'>;
    let gotAState: AState;
    let readFnParamState: AState, readFnParamExtra: Pick<ObjectState, 'o'>;
    let readFnReturn: Pick<ObjectState, 'o'>;

    test('[action]', () => {
      gotAState = getIt(aMug);
      readGeneralOpReturn = customReadGeneralOp(aMug, readGeneralOpParamExtra);
      readFnParamState = customReadFn.mock.calls[0][0];
      readFnParamExtra = customReadFn.mock.calls[0][1];
      readFnReturn = customReadFn.mock.results[0].value;
    });

    test('[verify] the read fn is called 1 time', () => {
      expect(customReadFn).toHaveBeenCalledTimes(1);
    });

    test('[verify] the read fn param state equals the read general-op mug_s got state in ref and value', () => {
      expect(readFnParamState).toBe(gotAState);
      expect(readFnParamState).toStrictEqual(gotAState);
    });

    test('[verify] the read fn param extra equals the read general-op param extra in ref and value', () => {
      expect(readFnParamExtra).toBe(readGeneralOpParamExtra);
      expect(readFnParamExtra).toStrictEqual(readGeneralOpParamExtra);
    });

    test('[verify] the read general-op return equals the read fn return in ref and value', () => {
      expect(readGeneralOpReturn).toBe(readFnReturn);
      expect(readGeneralOpReturn).toStrictEqual(readFnReturn);
    });
  });

  describe('8640830, writes by the default write general-op', () => {
    const writeGeneralOpParamPatch: PossiblePatch<AMug> = { s: '44e' };
    let setItParamMug: AMug, setItParamPatch: PossiblePatch<AMug>;

    test('[action]', () => {
      defaultWriteGeneralOp(aMug, writeGeneralOpParamPatch);
      setItParamMug = jest.mocked(setIt).mock.calls[0][0] as AMug;
      setItParamPatch = jest.mocked(setIt).mock.calls[0][1] as PossiblePatch<AState>;
    });

    test('[verify] "setIt" is called 1 time', () => {
      expect(setIt).toHaveBeenCalledTimes(1);
    });

    test('[verify] "setIt" param mug equals the write general-op mug in ref and value', () => {
      expect(setItParamMug).toBe(aMug);
      expect(setItParamMug).toStrictEqual(aMug);
    });

    test('[verify] "setIt" param patch equals the write general-op param patch in ref and value', () => {
      expect(setItParamPatch).toBe(writeGeneralOpParamPatch);
      expect(setItParamPatch).toStrictEqual(writeGeneralOpParamPatch);
    });
  });

  describe('67567ee, writes by the custom write general-op', () => {
    const writeGeneralOpParamS = '5c9';
    let gotAStateBefore: AState, gotAStateAfter: AState;
    let writeFnParamState: AState, writeFnParamS: string, writeFnReturn: AState;

    test('[action]', () => {
      gotAStateBefore = getIt(aMug);

      customWriteGeneralOp(aMug, writeGeneralOpParamS);
      writeFnParamState = customWriteFn.mock.calls[0][0];
      writeFnParamS = customWriteFn.mock.calls[0][1];
      writeFnReturn = customWriteFn.mock.results[0].value;

      gotAStateAfter = getIt(aMug);
    });

    test('[verify] the write fn is called 1 time', () => {
      expect(customWriteFn).toHaveBeenCalledTimes(1);
    });

    test('[verify] the write fn param state equals the write general-op mug_s before-write got state in ref and value', () => {
      expect(writeFnParamState).toBe(gotAStateBefore);
      expect(writeFnParamState).toStrictEqual(gotAStateBefore);
    });

    test('[verify] the write fn param string equals the write general-op param string in value', () => {
      expect(writeFnParamS).toBe(writeGeneralOpParamS);
    });

    test('[verify] the contextual mug_s after-write got state equals the write fn return in ref and value', () => {
      expect(gotAStateAfter).toBe(writeFnReturn);
      expect(gotAStateAfter).toStrictEqual(writeFnReturn);
    });
  });
});
