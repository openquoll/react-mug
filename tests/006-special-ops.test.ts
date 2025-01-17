import {
  assignPatch,
  construction,
  getIt,
  Mug,
  onto,
  passThrough,
  PossibleMugLike,
  PossiblePatch,
  setIt,
  upon,
} from '../src';

jest.mock('../src/mechanism', () => {
  const m = jest.requireActual('../src/mechanism');
  const { getIt, setIt } = m;
  Object.assign(jest.spyOn(m, 'getIt'), getIt);
  Object.assign(jest.spyOn(m, 'setIt'), setIt);
  return m;
});

jest.mock('../src/builtin/fns', () => {
  const m = jest.requireActual('../src/builtin/fns');
  const { passThrough, assignPatch } = m;
  jest.spyOn(m, 'passThrough');
  Object.assign(m.passThrough, passThrough);
  Object.defineProperty(m.passThrough, 'length', {
    value: passThrough.length,
  });
  jest.spyOn(m, 'assignPatch');
  Object.assign(m.assignPatch, assignPatch);
  Object.defineProperty(m.assignPatch, 'length', {
    value: assignPatch.length,
  });
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

const customExec = jest.fn(
  (mug: PossibleMugLike<AState>, extra: Pick<ObjectState, 'o'>): Pick<ObjectState, 'o'> => ({
    o: {
      s: 'asd',
    },
  }),
);

const customNullProtoObjectField: Pick<ObjectState, 'o'> = Object.assign(Object.create(null), {
  o: {
    s: 'asd',
  },
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

  const [r, w, s] = toolbelt;

  const defaultReadSpecialOp = r();

  const customReadSpecialOp = r(customReadFn);

  const defaultWriteSpecialOp = w();

  const customWriteSpecialOp = w(customWriteFn);

  const [generalR, generalW, x] = onto<AState>();

  const GeneralModule = {
    defaultReadOp: generalR(),
    customReadOp: generalR(customReadFn),
    defaultWriteOp: generalW(),
    customWriteOp: generalW(customWriteFn),
    customExec: x(customExec),
    customNullProtoObjectField,
  };

  const specialSlice = s(GeneralModule);

  describe('1696308, checks the special-op toolbelt_s fields', () => {
    test('[verify] the "r" field equals the index-0 item in ref', () => {
      expect(toolbelt.r).toBe(r);
    });

    test('[verify] the "w" field equals the index-1 item in ref', () => {
      expect(toolbelt.w).toBe(w);
    });

    test('[verify] the "s" field equals the index-2 item in ref', () => {
      expect(toolbelt.s).toBe(s);
    });
  });

  describe('a0ba1e5, reads by the default read special-op in imperative mode', () => {
    let readOpReturn: AState;
    let getItParamMug: AMug, getItReturn: AState;

    test('[action]', () => {
      readOpReturn = defaultReadSpecialOp();
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

    test('[verify] the read op return equals "getIt" return in ref and value', () => {
      expect(readOpReturn).toBe(getItReturn);
      expect(readOpReturn).toStrictEqual(getItReturn);
    });
  });

  describe('2f3db67, reads by the default read special-op in functional mode', () => {
    const readOpParamState: AState = {
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
    let readOpReturn: AState;
    let passThroughParamState: AState;
    let passThroughReturn: AState;

    test('[action]', () => {
      readOpReturn = defaultReadSpecialOp(readOpParamState);
      passThroughParamState = jest.mocked(passThrough).mock.calls[0][0] as AState;
      passThroughReturn = jest.mocked(passThrough).mock.results[0].value as AState;
    });

    test('[verify] "getIt" is not called', () => {
      expect(getIt).not.toHaveBeenCalled();
    });

    test('[verify] "passThrough" is called 1 time', () => {
      expect(passThrough).toHaveBeenCalledTimes(1);
    });

    test('[verify] "passThrough" param state equals the read op param state in ref and value', () => {
      expect(passThroughParamState).toBe(readOpParamState);
      expect(passThroughParamState).toStrictEqual(readOpParamState);
    });

    test('[verify] the read op return equals "passThrough" return in ref and value', () => {
      expect(readOpReturn).toBe(passThroughReturn);
      expect(readOpReturn).toStrictEqual(passThroughReturn);
    });
  });

  describe('640f3ad, reads by the custom read special-op in imperative mode', () => {
    const readOpParamExtra: Pick<ObjectState, 'o'> = { o: { s: '26d' } };
    let readOpReturn: Pick<ObjectState, 'o'>;
    let gotAState: AState;
    let readFnParamState: AState, readFnParamExtra: Pick<ObjectState, 'o'>;
    let readFnReturn: Pick<ObjectState, 'o'>;

    test('[action]', () => {
      gotAState = getIt(aMug);
      readOpReturn = customReadSpecialOp(readOpParamExtra);
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

    test('[verify] the read fn param extra equals the read op param extra in ref and value', () => {
      expect(readFnParamExtra).toBe(readOpParamExtra);
      expect(readFnParamExtra).toStrictEqual(readOpParamExtra);
    });

    test('[verify] the read op return equals the read fn return in ref and value', () => {
      expect(readOpReturn).toBe(readFnReturn);
      expect(readOpReturn).toStrictEqual(readFnReturn);
    });
  });

  describe('ac023b6, reads by the custom read special-op in functional mode', () => {
    const readOpParamState: AState = {
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
    const readOpParamExtra: Pick<ObjectState, 'o'> = { o: { s: '3cd' } };
    let readOpReturn: Pick<ObjectState, 'o'>;
    let readFnParamState: AState, readFnParamExtra: Pick<ObjectState, 'o'>;
    let readFnReturn: Pick<ObjectState, 'o'>;

    test('[action]', () => {
      readOpReturn = customReadSpecialOp(readOpParamState, readOpParamExtra);
      readFnParamState = customReadFn.mock.calls[0][0];
      readFnParamExtra = customReadFn.mock.calls[0][1];
      readFnReturn = customReadFn.mock.results[0].value;
    });

    test('[verify] the read fn is called 1 time', () => {
      expect(customReadFn).toHaveBeenCalledTimes(1);
    });

    test('[verify] the read fn param state equals the read op param state in ref and value', () => {
      expect(readFnParamState).toBe(readOpParamState);
      expect(readFnParamState).toStrictEqual(readOpParamState);
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

  describe('976ac2c, writes by the default write special-op in imperative mode', () => {
    const writeOpParamPatch: PossiblePatch<AMug> = { s: '716' };
    let setItParamMug: AMug, setItParamPatch: PossiblePatch<AMug>;

    test('[action]', () => {
      defaultWriteSpecialOp(writeOpParamPatch);
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

    test('[verify] "setIt" param patch equals the write op param patch in ref and value', () => {
      expect(setItParamPatch).toBe(writeOpParamPatch);
      expect(setItParamPatch).toStrictEqual(writeOpParamPatch);
    });
  });

  describe('89f5b15, writes by the default write special-op in functional mode', () => {
    const writeOpParamState: AState = {
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
    const writeOpParamPatch: PossiblePatch<AState> = { s: '501' };
    let writeOpReturn: AState;
    let assignPatchParamState: AState, assignPatchParamPatch: PossiblePatch<AState>;
    let assignPatchReturn: AState;
    let gotAStateBefore: AState, gotAStateAfter: AState;

    test('[action]', () => {
      gotAStateBefore = getIt(aMug);

      writeOpReturn = defaultWriteSpecialOp(writeOpParamState, writeOpParamPatch);
      assignPatchParamState = jest.mocked(assignPatch).mock.calls[0][0] as AState;
      assignPatchParamPatch = jest.mocked(assignPatch).mock.calls[0][1] as PossiblePatch<AState>;
      assignPatchReturn = jest.mocked(assignPatch).mock.results[0].value;

      gotAStateAfter = getIt(aMug);
    });

    test('[verify] "setIt" is not called', () => {
      expect(setIt).not.toHaveBeenCalled();
    });

    test('[verify] "assignPatch" is called 1 time', () => {
      expect(assignPatch).toHaveBeenCalledTimes(1);
    });

    test('[verify] "assignPatch" param state equals the write op param state in ref and value', () => {
      expect(assignPatchParamState).toBe(writeOpParamState);
      expect(assignPatchParamState).toStrictEqual(writeOpParamState);
    });

    test('[verify] "assignPatch" param patch equals the write op param patch in ref and value', () => {
      expect(assignPatchParamPatch).toBe(writeOpParamPatch);
      expect(assignPatchParamPatch).toStrictEqual(writeOpParamPatch);
    });

    test('[verify] the write op return equals "assignPatch" return in ref and value', () => {
      expect(writeOpReturn).toBe(assignPatchReturn);
      expect(writeOpReturn).toStrictEqual(assignPatchReturn);
    });

    test('[verify] the contextual mug_s got state stays unchanged in ref and value', () => {
      expect(gotAStateAfter).toBe(gotAStateBefore);
      expect(gotAStateAfter).toStrictEqual(gotAStateBefore);
    });
  });

  describe('4653a7e, writes by the custom write special-op in imperative mode', () => {
    const writeOpParamS = '420';
    let gotAStateBefore: AState, gotAStateAfter: AState;
    let writeFnParamState: AState, writeFnParamS: string, writeFnReturn: AState;

    test('[action]', () => {
      gotAStateBefore = getIt(aMug);

      customWriteSpecialOp(writeOpParamS);
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

    test('[verify] the write fn param string equals the write op param string in value', () => {
      expect(writeFnParamS).toBe(writeOpParamS);
    });

    test('[verify] the contextual mug_s after-write got state equals the write fn return in ref and value', () => {
      expect(gotAStateAfter).toBe(writeFnReturn);
      expect(gotAStateAfter).toStrictEqual(writeFnReturn);
    });
  });

  describe('7b3a110, writes by the custom write special-op in functional mode', () => {
    const writeOpParamState: AState = {
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
    const writeOpParamS = 'df7';
    let writeOpReturn: AState;
    let writeFnParamState: AState, writeFnParamS: string, writeFnReturn: AState;
    let gotAStateBefore: AState, gotAStateAfter: AState;

    test('[action]', () => {
      gotAStateBefore = getIt(aMug);

      writeOpReturn = customWriteSpecialOp(writeOpParamState, writeOpParamS);
      writeFnParamState = customWriteFn.mock.calls[0][0];
      writeFnParamS = customWriteFn.mock.calls[0][1];
      writeFnReturn = customWriteFn.mock.results[0].value;

      gotAStateAfter = getIt(aMug);
    });

    test('[verify] the write fn is called 1 time', () => {
      expect(customWriteFn).toHaveBeenCalledTimes(1);
    });

    test('[verify] the write fn param state equals the write op param state in ref and value', () => {
      expect(writeFnParamState).toBe(writeOpParamState);
      expect(writeFnParamState).toStrictEqual(writeOpParamState);
    });

    test('[verify] the write fn param string equals the write op param string in value', () => {
      expect(writeFnParamS).toBe(writeOpParamS);
    });

    test('[verify] the write op return equals the write fn return in ref and value', () => {
      expect(writeOpReturn).toBe(writeFnReturn);
      expect(writeOpReturn).toStrictEqual(writeFnReturn);
    });

    test('[verify] the contextual mug_s got state stays unchanged in ref and value', () => {
      expect(gotAStateAfter).toBe(gotAStateBefore);
      expect(gotAStateAfter).toStrictEqual(gotAStateBefore);
    });
  });

  describe('dddb2f7, reads by the default read special-slice op in imperative mode', () => {
    let readOpReturn: AState;
    let getItParamMug: AMug, getItReturn: AState;

    test('[action]', () => {
      readOpReturn = specialSlice.defaultReadOp();
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

    test('[verify] the read op return equals "getIt" return in ref and value', () => {
      expect(readOpReturn).toBe(getItReturn);
      expect(readOpReturn).toStrictEqual(getItReturn);
    });
  });

  describe('9418420, reads by the default read special-slice op in functional mode', () => {
    const readOpParamState: AState = {
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
    let readOpReturn: AState;
    let passThroughParamState: AState;
    let passThroughReturn: AState;

    test('[action]', () => {
      readOpReturn = specialSlice.defaultReadOp(readOpParamState);
      passThroughParamState = jest.mocked(passThrough).mock.calls[0][0] as AState;
      passThroughReturn = jest.mocked(passThrough).mock.results[0].value as AState;
    });

    test('[verify] "getIt" is not called', () => {
      expect(getIt).not.toHaveBeenCalled();
    });

    test('[verify] "passThrough" is called 1 time', () => {
      expect(passThrough).toHaveBeenCalledTimes(1);
    });

    test('[verify] "passThrough" param state equals the read op param state in ref and value', () => {
      expect(passThroughParamState).toBe(readOpParamState);
      expect(passThroughParamState).toStrictEqual(readOpParamState);
    });

    test('[verify] the read op return equals "passThrough" return in ref and value', () => {
      expect(readOpReturn).toBe(passThroughReturn);
      expect(readOpReturn).toStrictEqual(passThroughReturn);
    });
  });

  describe('021ef7c, reads by the custom read special-slice op in imperative mode', () => {
    const readOpParamExtra: Pick<ObjectState, 'o'> = { o: { s: '168' } };
    let readOpReturn: Pick<ObjectState, 'o'>;
    let gotAState: AState;
    let readFnParamState: AState, readFnParamExtra: Pick<ObjectState, 'o'>;
    let readFnReturn: Pick<ObjectState, 'o'>;

    test('[action]', () => {
      gotAState = getIt(aMug);
      readOpReturn = specialSlice.customReadOp(readOpParamExtra);
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

    test('[verify] the read fn param extra equals the read op param extra in ref and value', () => {
      expect(readFnParamExtra).toBe(readOpParamExtra);
      expect(readFnParamExtra).toStrictEqual(readOpParamExtra);
    });

    test('[verify] the read op return equals the read fn return in ref and value', () => {
      expect(readOpReturn).toBe(readFnReturn);
      expect(readOpReturn).toStrictEqual(readFnReturn);
    });
  });

  describe('8f5a2c1, reads by the custom read special-slice op in functional mode', () => {
    const readOpParamState: AState = {
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
    const readOpParamExtra: Pick<ObjectState, 'o'> = { o: { s: '5c8' } };
    let readOpReturn: Pick<ObjectState, 'o'>;
    let readFnParamState: AState, readFnParamExtra: Pick<ObjectState, 'o'>;
    let readFnReturn: Pick<ObjectState, 'o'>;

    test('[action]', () => {
      readOpReturn = specialSlice.customReadOp(readOpParamState, readOpParamExtra);
      readFnParamState = customReadFn.mock.calls[0][0];
      readFnParamExtra = customReadFn.mock.calls[0][1];
      readFnReturn = customReadFn.mock.results[0].value;
    });

    test('[verify] the read fn is called 1 time', () => {
      expect(customReadFn).toHaveBeenCalledTimes(1);
    });

    test('[verify] the read fn param state equals the read op param state in ref and value', () => {
      expect(readFnParamState).toBe(readOpParamState);
      expect(readFnParamState).toStrictEqual(readOpParamState);
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

  describe('d31947a, writes by the default write special-slice op in imperative mode', () => {
    const writeOpParamPatch: PossiblePatch<AMug> = { s: '09a' };
    let setItParamMug: AMug, setItParamPatch: PossiblePatch<AMug>;

    test('[action]', () => {
      specialSlice.defaultWriteOp(writeOpParamPatch);
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

    test('[verify] "setIt" param patch equals the write op param patch in ref and value', () => {
      expect(setItParamPatch).toBe(writeOpParamPatch);
      expect(setItParamPatch).toStrictEqual(writeOpParamPatch);
    });
  });

  describe('5f63c1e, writes by the default write special-slice op in functional mode', () => {
    const writeOpParamState: AState = {
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
    const writeOpParamPatch: PossiblePatch<AState> = { s: '3ed' };
    let writeOpReturn: AState;
    let assignPatchParamState: AState, assignPatchParamPatch: PossiblePatch<AState>;
    let assignPatchReturn: AState;
    let gotAStateBefore: AState, gotAStateAfter: AState;

    test('[action]', () => {
      gotAStateBefore = getIt(aMug);

      writeOpReturn = specialSlice.defaultWriteOp(writeOpParamState, writeOpParamPatch);
      assignPatchParamState = jest.mocked(assignPatch).mock.calls[0][0] as AState;
      assignPatchParamPatch = jest.mocked(assignPatch).mock.calls[0][1] as PossiblePatch<AState>;
      assignPatchReturn = jest.mocked(assignPatch).mock.results[0].value;

      gotAStateAfter = getIt(aMug);
    });

    test('[verify] "setIt" is not called', () => {
      expect(setIt).not.toHaveBeenCalled();
    });

    test('[verify] "assignPatch" is called 1 time', () => {
      expect(assignPatch).toHaveBeenCalledTimes(1);
    });

    test('[verify] "assignPatch" param state equals the write op param state in ref and value', () => {
      expect(assignPatchParamState).toBe(writeOpParamState);
      expect(assignPatchParamState).toStrictEqual(writeOpParamState);
    });

    test('[verify] "assignPatch" param patch equals the write op param patch in ref and value', () => {
      expect(assignPatchParamPatch).toBe(writeOpParamPatch);
      expect(assignPatchParamPatch).toStrictEqual(writeOpParamPatch);
    });

    test('[verify] the write op return equals "assignPatch" return in ref and value', () => {
      expect(writeOpReturn).toBe(assignPatchReturn);
      expect(writeOpReturn).toStrictEqual(assignPatchReturn);
    });

    test('[verify] the contextual mug_s got state stays unchanged in ref and value', () => {
      expect(gotAStateAfter).toBe(gotAStateBefore);
      expect(gotAStateAfter).toStrictEqual(gotAStateBefore);
    });
  });

  describe('74c677d, writes by the custom write special-slice op in imperative mode', () => {
    const writeOpParamS = '9f7';
    let gotAStateBefore: AState, gotAStateAfter: AState;
    let writeFnParamState: AState, writeFnParamS: string, writeFnReturn: AState;

    test('[action]', () => {
      gotAStateBefore = getIt(aMug);

      specialSlice.customWriteOp(writeOpParamS);
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

    test('[verify] the write fn param string equals the write op param string in value', () => {
      expect(writeFnParamS).toBe(writeOpParamS);
    });

    test('[verify] the contextual mug_s after-write got state equals the write fn return in ref and value', () => {
      expect(gotAStateAfter).toBe(writeFnReturn);
      expect(gotAStateAfter).toStrictEqual(writeFnReturn);
    });
  });

  describe('f3b06d1, writes by the custom write special-slice op in functional mode', () => {
    const writeOpParamState: AState = {
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
    const writeOpParamS = 'b3a';
    let writeOpReturn: AState;
    let writeFnParamState: AState, writeFnParamS: string, writeFnReturn: AState;
    let gotAStateBefore: AState, gotAStateAfter: AState;

    test('[action]', () => {
      gotAStateBefore = getIt(aMug);

      writeOpReturn = specialSlice.customWriteOp(writeOpParamState, writeOpParamS);
      writeFnParamState = customWriteFn.mock.calls[0][0];
      writeFnParamS = customWriteFn.mock.calls[0][1];
      writeFnReturn = customWriteFn.mock.results[0].value;

      gotAStateAfter = getIt(aMug);
    });

    test('[verify] the write fn is called 1 time', () => {
      expect(customWriteFn).toHaveBeenCalledTimes(1);
    });

    test('[verify] the write fn param state equals the write op param state in ref and value', () => {
      expect(writeFnParamState).toBe(writeOpParamState);
      expect(writeFnParamState).toStrictEqual(writeOpParamState);
    });

    test('[verify] the write fn param string equals the write op param string in value', () => {
      expect(writeFnParamS).toBe(writeOpParamS);
    });

    test('[verify] the write op return equals the write fn return in ref and value', () => {
      expect(writeOpReturn).toBe(writeFnReturn);
      expect(writeOpReturn).toStrictEqual(writeFnReturn);
    });

    test('[verify] the contextual mug_s got state stays unchanged in ref and value', () => {
      expect(gotAStateAfter).toBe(gotAStateBefore);
      expect(gotAStateAfter).toStrictEqual(gotAStateBefore);
    });
  });

  describe('9471df9, executes by the custom special-slice exec', () => {
    const specialSliceExecParamExtra: Pick<ObjectState, 'o'> = { o: { s: '05a' } };
    let specialSliceExecReturn: Pick<ObjectState, 'o'>;

    let execParamMug: PossibleMugLike<AState>, execParamExtra: Pick<ObjectState, 'o'>;
    let execReturn: Pick<ObjectState, 'o'>;

    test('[action]', () => {
      specialSliceExecReturn = specialSlice.customExec(specialSliceExecParamExtra);

      execParamMug = customExec.mock.calls[0][0];
      execParamExtra = customExec.mock.calls[0][1];
      execReturn = customExec.mock.results[0].value;
    });

    test('[verify] the original exec is called 1 time', () => {
      expect(customExec).toHaveBeenCalledTimes(1);
    });

    test('[verify] the original exec param mug equals the contextual mug in ref and value', () => {
      expect(execParamMug).toBe(aMug);
      expect(execParamMug).toStrictEqual(aMug);
    });

    test('[verify] the original exec param extra equals the special-slice exec param extra in ref and value', () => {
      expect(execParamExtra).toBe(specialSliceExecParamExtra);
      expect(execParamExtra).toStrictEqual(specialSliceExecParamExtra);
    });

    test('[verify] the special-slice exec return equals the original exec return in ref and value', () => {
      expect(specialSliceExecReturn).toBe(execReturn);
      expect(specialSliceExecReturn).toStrictEqual(execReturn);
    });
  });

  describe('c22a20d, checks the custom null-proto object special-slice field', () => {
    test('[action, verify] the special-slice field equals the original field in ref and value', () => {
      expect(specialSlice.customNullProtoObjectField).toBe(customNullProtoObjectField);
      expect(specialSlice.customNullProtoObjectField).toStrictEqual(customNullProtoObjectField);
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
    let readOpReturn: AState;
    let getItParamMug: AMug, getItReturn: AState;

    test('[action]', () => {
      readOpReturn = aMug.get();
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
      expect(readOpReturn).toBe(getItReturn);
      expect(readOpReturn).toStrictEqual(getItReturn);
    });
  });

  describe('45344e5, reads by the custom read special-op', () => {
    const readOpParamExtra: Pick<ObjectState, 'o'> = { o: { s: '110' } };
    let readOpReturn: Pick<ObjectState, 'o'>;
    let gotAState: AState;
    let readFnParamState: AState, readFnParamExtra: Pick<ObjectState, 'o'>;
    let readFnReturn: Pick<ObjectState, 'o'>;

    test('[action]', () => {
      gotAState = getIt(aMug);
      readOpReturn = aMug.customReadSpecialOp(readOpParamExtra);
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
      expect(readFnParamExtra).toBe(readOpParamExtra);
      expect(readFnParamExtra).toStrictEqual(readOpParamExtra);
    });

    test('[verify] the read special-op return equals the read fn return in ref and value', () => {
      expect(readOpReturn).toBe(readFnReturn);
      expect(readOpReturn).toStrictEqual(readFnReturn);
    });
  });

  describe('a590ccd, writes by the default write special-op', () => {
    const writeOpParamPatch: PossiblePatch<AMug> = { s: '716' };
    let setItParamMug: AMug, setItParamPatch: PossiblePatch<AMug>;

    test('[action]', () => {
      aMug.set(writeOpParamPatch);
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
      expect(setItParamPatch).toBe(writeOpParamPatch);
      expect(setItParamPatch).toStrictEqual(writeOpParamPatch);
    });
  });

  describe('0b61740, writes by the custom write special-op', () => {
    const writeOpParamS = '420';
    let gotAStateBefore: AState, gotAStateAfter: AState;
    let writeFnParamState: AState, writeFnParamS: string, writeFnReturn: AState;

    test('[action]', () => {
      gotAStateBefore = getIt(aMug);

      aMug.customWriteSpecialOp(writeOpParamS);
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
      expect(writeFnParamS).toBe(writeOpParamS);
    });

    test('[verify] the mug instance_s after-write got state equals the write fn return in ref and value', () => {
      expect(gotAStateAfter).toBe(writeFnReturn);
      expect(gotAStateAfter).toStrictEqual(writeFnReturn);
    });
  });
});
