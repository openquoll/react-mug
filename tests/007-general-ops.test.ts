import { construction, getIt, Mug, onto, PossibleMugLike, PossiblePatch, setIt } from '../src';
import { ownKeysOfObjectLike } from '../src/mug';

jest.mock('../src/mechanism', () => {
  const m = jest.requireActual('../src/mechanism');
  const { getIt, setIt } = m;
  Object.defineProperties(jest.spyOn(m, 'getIt'), Object.getOwnPropertyDescriptors(getIt));
  Object.defineProperties(jest.spyOn(m, 'setIt'), Object.getOwnPropertyDescriptors(setIt));
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

const customFullFledgedWriteFn = jest.fn((state: AState, s: string): AState => {
  return {
    ...state,
    s,
    potentialMuggyObject: {
      ...state.potentialMuggyObject,
      s,
    },
  };
});

const customPartialWriteFn = jest.fn((state: AState, s: string) => {
  return {
    o: {
      s,
    },
  };
});

const customExec = jest.fn(
  (mug: PossibleMugLike<AState>, extra: Pick<ObjectState, 'o'>): Pick<ObjectState, 'o'> => ({
    o: {
      s: 'asd',
    },
  }),
);

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

  const customFullFledgedWriteGeneralOp = w(customFullFledgedWriteFn);

  const customPartialWriteGeneralOp = w(customPartialWriteFn);

  const customExecWG = x(customExec);

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
    let readOpReturn: AState;
    let getItParamMug: AMug, getItReturn: AState;

    test('[action]', () => {
      readOpReturn = defaultReadGeneralOp(aMug);
      getItParamMug = jest.mocked(getIt).mock.calls[0][0] as AMug;
      getItReturn = jest.mocked(getIt).mock.results[0].value;
    });

    test('[verify] "getIt" is called 1 time', () => {
      expect(getIt).toHaveBeenCalledTimes(1);
    });

    test('[verify] "getIt" param mug equals the read op param mug in ref and value', () => {
      expect(getItParamMug).toBe(aMug);
      expect(getItParamMug).toStrictEqual(aMug);
    });

    test('[verify] the read op return equals "getIt" return in ref and value', () => {
      expect(readOpReturn).toBe(getItReturn);
      expect(readOpReturn).toStrictEqual(getItReturn);
    });
  });

  describe('60c20e0, reads by the custom read general-op', () => {
    const readOpParamExtra: Pick<ObjectState, 'o'> = { o: { s: '8ec' } };
    let readOpReturn: Pick<ObjectState, 'o'>;
    let gotAState: AState;
    let readFnParamState: AState, readFnParamExtra: Pick<ObjectState, 'o'>;
    let readFnReturn: Pick<ObjectState, 'o'>;

    test('[action]', () => {
      gotAState = getIt(aMug);
      readOpReturn = customReadGeneralOp(aMug, readOpParamExtra);
      readFnParamState = customReadFn.mock.calls[0][0];
      readFnParamExtra = customReadFn.mock.calls[0][1];
      readFnReturn = customReadFn.mock.results[0].value;
    });

    test('[verify] the read fn is called 1 time', () => {
      expect(customReadFn).toHaveBeenCalledTimes(1);
    });

    test('[verify] the read fn param state equals the read op mug_s got state in ref and value', () => {
      expect(readFnParamState).toBe(gotAState);
      expect(readFnParamState).toStrictEqual(gotAState);
    });

    test('[verify] the read fn param extra equals the read op param extra in ref and value', () => {
      expect(readFnParamExtra).toBe(readOpParamExtra);
      expect(readFnParamExtra).toStrictEqual(readOpParamExtra);
    });

    test('[verify] the read op return equals the read fn return in ref and value', () => {
      expect(readOpReturn).toBe(readFnReturn);
      expect(readOpReturn).toStrictEqual(readFnReturn);
    });
  });

  describe('8640830, writes by the default write general-op', () => {
    const writeOpParamPatch: PossiblePatch<AMug> = { s: '44e' };
    let writeOpReturn: AMug;
    let setItParamMug: AMug, setItParamPatch: PossiblePatch<AMug>;
    let setItReturn: AMug;

    test('[action]', () => {
      writeOpReturn = defaultWriteGeneralOp(aMug, writeOpParamPatch);
      setItParamMug = jest.mocked(setIt).mock.calls[0][0] as AMug;
      setItParamPatch = jest.mocked(setIt).mock.calls[0][1] as PossiblePatch<AState>;
      setItReturn = jest.mocked(setIt).mock.results[0].value;
    });

    test('[verify] "setIt" is called 1 time', () => {
      expect(setIt).toHaveBeenCalledTimes(1);
    });

    test('[verify] "setIt" param mug equals the write op mug in ref and value', () => {
      expect(setItParamMug).toBe(aMug);
      expect(setItParamMug).toStrictEqual(aMug);
    });

    test('[verify] "setIt" param patch equals the write op param patch in ref and value', () => {
      expect(setItParamPatch).toBe(writeOpParamPatch);
      expect(setItParamPatch).toStrictEqual(writeOpParamPatch);
    });

    test('[verify] the write op return equals "setIt" return in ref and value', () => {
      expect(writeOpReturn).toBe(setItReturn);
      expect(writeOpReturn).toStrictEqual(setItReturn);
    });
  });

  describe('67567ee, writes by the custom full-fledged write general-op', () => {
    const writeOpParamS = '5c9';
    let gotAStateBefore: AState, gotAStateAfter: AState;
    let writeFnParamState: AState, writeFnParamS: string, writeFnReturn: AState;

    test('[action]', () => {
      gotAStateBefore = getIt(aMug);

      customFullFledgedWriteGeneralOp(aMug, writeOpParamS);
      writeFnParamState = customFullFledgedWriteFn.mock.calls[0][0];
      writeFnParamS = customFullFledgedWriteFn.mock.calls[0][1];
      writeFnReturn = customFullFledgedWriteFn.mock.results[0].value;

      gotAStateAfter = getIt(aMug);
    });

    test('[verify] the write fn is called 1 time', () => {
      expect(customFullFledgedWriteFn).toHaveBeenCalledTimes(1);
    });

    test('[verify] the write fn param state equals the write op mug_s before-write got state in ref and value', () => {
      expect(writeFnParamState).toBe(gotAStateBefore);
      expect(writeFnParamState).toStrictEqual(gotAStateBefore);
    });

    test('[verify] the write fn param string equals the write op param string in value', () => {
      expect(writeFnParamS).toBe(writeOpParamS);
    });

    test('[verify] the write op mug_s after-write got state equals the write fn return in ref and value', () => {
      expect(gotAStateAfter).toBe(writeFnReturn);
      expect(gotAStateAfter).toStrictEqual(writeFnReturn);
    });
  });

  describe('67567ee, writes by the custom partial write general-op', () => {
    const writeOpParamS = 'd32';
    let gotAStateBefore: AState, gotAStateAfter: AState;
    let writeFnParamState: AState, writeFnParamS: string, writeFnReturn: AState;

    test('[action]', () => {
      gotAStateBefore = getIt(aMug);

      customPartialWriteGeneralOp(aMug, writeOpParamS);
      writeFnParamState = customPartialWriteFn.mock.calls[0][0];
      writeFnParamS = customPartialWriteFn.mock.calls[0][1];
      writeFnReturn = customPartialWriteFn.mock.results[0].value;

      gotAStateAfter = getIt(aMug);
    });

    test('[verify] the write fn is called 1 time', () => {
      expect(customPartialWriteFn).toHaveBeenCalledTimes(1);
    });

    test('[verify] the write fn param state equals the write op mug_s before-write got state in ref and value', () => {
      expect(writeFnParamState).toBe(gotAStateBefore);
      expect(writeFnParamState).toStrictEqual(gotAStateBefore);
    });

    test('[verify] the write fn param string equals the write op param string in value', () => {
      expect(writeFnParamS).toBe(writeOpParamS);
    });

    test('[verify] the write op mug_s after-write got state differs from the write fn return in ref and value', () => {
      expect(gotAStateAfter).not.toBe(writeFnReturn);
      expect(gotAStateAfter).not.toStrictEqual(writeFnReturn);
    });

    test('[verify] the write op mug_s after-write got state_s matching fields equals the write fn return_s in ref and value', () => {
      ownKeysOfObjectLike(writeFnReturn).forEach((key) => {
        expect(gotAStateAfter[key]).toBe(writeFnReturn[key]);
        expect(gotAStateAfter[key]).toStrictEqual(writeFnReturn[key]);
      });
    });

    test('[verify] the write op mug_s after-write got state_s unmatching fields stay unchanged in ref and value', () => {
      ownKeysOfObjectLike(gotAStateBefore)
        .filter((key) => !writeFnReturn.hasOwnProperty(key))
        .forEach((key) => {
          expect(gotAStateAfter[key]).toBe(gotAStateBefore[key]);
          expect(gotAStateAfter[key]).toStrictEqual(gotAStateBefore[key]);
        });
    });

    test('[verify] the contextual mug_s got state and its matching fields change in ref and value', () => {
      expect(gotAStateAfter).not.toBe(gotAStateBefore);
      expect(gotAStateAfter).not.toStrictEqual(gotAStateBefore);
      ownKeysOfObjectLike(gotAStateBefore)
        .filter((key) => writeFnReturn.hasOwnProperty(key))
        .forEach((key) => {
          expect(gotAStateAfter[key]).not.toBe(gotAStateBefore[key]);
          expect(gotAStateAfter[key]).not.toStrictEqual(gotAStateBefore[key]);
        });
    });
  });

  describe('74f4af2, executes by the custom exec w/ generalness', () => {
    const execWGParamMug = aMug;
    const execWGParamExtra: Pick<ObjectState, 'o'> = { o: { s: '79f' } };
    let execWGReturn: Pick<ObjectState, 'o'>;

    let execParamMug: PossibleMugLike<AState>, execParamExtra: Pick<ObjectState, 'o'>;
    let execReturn: Pick<ObjectState, 'o'>;

    test('[action]', () => {
      execWGReturn = customExecWG(execWGParamMug, execWGParamExtra);

      execParamMug = customExec.mock.calls[0][0];
      execParamExtra = customExec.mock.calls[0][1];
      execReturn = customExec.mock.results[0].value;
    });

    test('[verify] the exec is called 1 time', () => {
      expect(customExec).toHaveBeenCalledTimes(1);
    });

    test('[verify] the exec param mug equals the exec w/ g param mug in ref and value', () => {
      expect(execParamMug).toBe(execWGParamMug);
      expect(execParamMug).toStrictEqual(execWGParamMug);
    });

    test('[verify] the exec param extra equals the exec w/ g param extra in ref and value', () => {
      expect(execParamExtra).toBe(execWGParamExtra);
      expect(execParamExtra).toStrictEqual(execWGParamExtra);
    });

    test('[verify] the exec w/ g return equals the exec return in ref and value', () => {
      expect(execWGReturn).toBe(execReturn);
      expect(execWGReturn).toStrictEqual(execReturn);
    });
  });
});
