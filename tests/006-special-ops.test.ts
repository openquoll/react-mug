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
import { ownKeysOfObjectLike } from '../src/mug';

jest.mock('../src/mechanism', () => {
  const m = jest.requireActual('../src/mechanism');
  const { getIt, setIt } = m;
  Object.defineProperties(jest.spyOn(m, 'getIt'), Object.getOwnPropertyDescriptors(getIt));
  Object.defineProperties(jest.spyOn(m, 'setIt'), Object.getOwnPropertyDescriptors(setIt));
  return m;
});

jest.mock('../src/builtin-fns', () => {
  const m = jest.requireActual('../src/builtin-fns');
  const { passThrough, assignPatch } = m;
  jest.spyOn(m, 'passThrough');
  Object.defineProperties(m.passThrough, Object.getOwnPropertyDescriptors(passThrough));
  jest.spyOn(m, 'assignPatch');
  Object.defineProperties(m.assignPatch, Object.getOwnPropertyDescriptors(assignPatch));
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

const customEmptyParamReadFn = jest.fn((): Pick<ObjectState, 'o'> => {
  return {
    o: {
      s: 'ea2',
    },
  };
});

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

const customEmptyParamWriteFn = jest.fn((): AState => {
  return {
    s: '4c8',
    o: {
      s: '4c8',
    },
    potentialMuggyObject: {
      s: '4c8',
      o: {
        s: '4c8',
      },
    },
  };
});

const customExec = jest.fn(
  (mug: PossibleMugLike<AState>, extra: Pick<ObjectState, 'o'>): Pick<ObjectState, 'o'> => ({
    o: {
      s: 'b74',
    },
  }),
);

const customNullProtoObjectField: Pick<ObjectState, 'o'> = Object.assign(Object.create(null), {
  o: {
    s: '867',
  },
});

describe('0ab2ffa, special-ops straightforwardly, [cite] 003, 004, 007', () => {
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

  const customEmptyParamReadSpecialOp = r(customEmptyParamReadFn);

  const defaultWriteSpecialOp = w();

  const customFullFledgedWriteSpecialOp = w(customFullFledgedWriteFn);

  const customPartialWriteSpecialOp = w(customPartialWriteFn);

  const customEmptyParamWriteSpecialOp = w(customEmptyParamWriteFn);

  const [generalR, generalW, x] = onto<AState>();

  const GeneralModule = {
    defaultReadOp: generalR(),
    customReadOp: generalR(customReadFn),
    defaultWriteOp: generalW(),
    customFullFledgedWriteOp: generalW(customFullFledgedWriteFn),
    customPartialWriteOp: generalW(customPartialWriteFn),
    customExec: x(customExec),
    customNullProtoObjectField,
  };

  const specialTrait = s(GeneralModule);

  let readOpParamState: AState, readOpParamExtra: Pick<ObjectState, 'o'>;
  let defaultReadOpReturn: AState;
  let customReadOpReturn: Pick<ObjectState, 'o'>;

  let readFnParamState: AState, readFnParamExtra: Pick<ObjectState, 'o'>;
  let customReadFnReturn: Pick<ObjectState, 'o'>;

  let getItParamMug: AMug, getItReturn: AState;
  let passThroughParamState: AState, passThroughReturn: AState;

  let gotAState: AState;

  let writeOpParamState: AState, writeOpParamPatch: PossiblePatch<AMug>, writeOpParamS: string;
  let writeOpReturn: AState;

  let writeFnParamState: AState, writeFnParamS: string;
  let writeFnReturn: AState;

  let setItParamMug: AMug, setItParamPatch: PossiblePatch<AMug>;
  let assignPatchParamState: AState, assignPatchParamPatch: PossiblePatch<AState>;
  let assignPatchReturn: AState;

  let gotAStateBefore: AState, gotAStateAfter: AState;

  /**
   * Required variables: readOpReturn, getItParamMug, getItReturn
   */
  function sharedVerifyCasesOf_default_read_op_in_imperative_mode() {
    test('[verify] "getIt" is called 1 time', () => {
      expect(getIt).toHaveBeenCalledTimes(1);
    });

    test('[verify] "getIt" param mug equals the contextual mug in ref and value', () => {
      expect(getItParamMug).toBe(aMug);
      expect(getItParamMug).toStrictEqual(aMug);
    });

    test('[verify] the read op return equals "getIt" return in ref and value', () => {
      expect(defaultReadOpReturn).toBe(getItReturn);
      expect(defaultReadOpReturn).toStrictEqual(getItReturn);
    });
  }

  /**
   * Required variables: readOpParamState, readOpReturn, passThroughParamState, passThroughReturn
   */
  function sharedVerifyCasesOf_default_read_op_in_functional_mode() {
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
      expect(defaultReadOpReturn).toBe(passThroughReturn);
      expect(defaultReadOpReturn).toStrictEqual(passThroughReturn);
    });
  }

  /**
   * Required variables: readOpParamExtra, customReadOpReturn, readFnParamState, customReadFnReturn, gotAState
   */
  function sharedVerifyCasesOf_custom_read_op_in_imperative_mode() {
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
      expect(customReadOpReturn).toBe(customReadFnReturn);
      expect(customReadOpReturn).toStrictEqual(customReadFnReturn);
    });
  }

  /**
   * Required variables: readOpParamState, readOpParamExtra, customReadOpReturn, readFnParamState, customReadFnReturn
   */
  function sharedVerifyCasesOf_custom_read_op_in_functional_mode() {
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
      expect(customReadOpReturn).toBe(customReadFnReturn);
      expect(customReadOpReturn).toStrictEqual(customReadFnReturn);
    });
  }

  /**
   * Required variables: writeOpParamPatch, setItParamMug, setItParamPatch
   */
  function sharedVerifyCasesOf_default_write_op_in_imperative_mode() {
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
  }

  /**
   * Required variables: writeOpParamState, writeOpParamPatch, writeOpReturn, assignPatchParamState, assignPatchReturn, gotAStateBefore, gotAStateAfter
   */
  function sharedVerifyCasesOf_default_write_op_in_functional_mode() {
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
  }

  /**
   * Required variables: writeOpParamS, writeFnParamState, writeFnParamS, writeFnReturn, gotAStateBefore, gotAStateAfter
   */
  function sharedVerifyCasesOf_custom_full_fledged_write_op_in_imperative_mode() {
    test('[verify] the write fn is called 1 time', () => {
      expect(customFullFledgedWriteFn).toHaveBeenCalledTimes(1);
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

    test('[verify] the contextual mug_s got state changes in ref and value', () => {
      expect(gotAStateAfter).not.toBe(gotAStateBefore);
      expect(gotAStateAfter).not.toStrictEqual(gotAStateBefore);
    });
  }

  /**
   * Required variables: writeOpParamState, writeOpParamS, writeOpReturn, writeFnParamState, writeFnParamS, writeFnReturn, gotAStateBefore, gotAStateAfter
   */
  function sharedVerifyCasesOf_custom_full_fledged_write_op_in_functional_mode() {
    test('[verify] the write fn is called 1 time', () => {
      expect(customFullFledgedWriteFn).toHaveBeenCalledTimes(1);
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
  }

  /**
   * Required variables: writeOpParamS, writeFnParamState, writeFnParamS, writeFnReturn, gotAStateBefore, gotAStateAfter
   */
  function sharedVerifyCasesOf_custom_partial_write_op_in_imperative_mode() {
    test('[verify] the write fn is called 1 time', () => {
      expect(customPartialWriteFn).toHaveBeenCalledTimes(1);
    });

    test('[verify] the write fn param state equals the contextual mug_s before-write got state in ref and value', () => {
      expect(writeFnParamState).toBe(gotAStateBefore);
      expect(writeFnParamState).toStrictEqual(gotAStateBefore);
    });

    test('[verify] the write fn param string equals the write op param string in value', () => {
      expect(writeFnParamS).toBe(writeOpParamS);
    });

    test('[verify] the contextual mug_s after-write got state differs from the write fn return in ref and value', () => {
      expect(gotAStateAfter).not.toBe(writeFnReturn);
      expect(gotAStateAfter).not.toStrictEqual(writeFnReturn);
    });

    test('[verify] the contextual mug_s after-write got state_s matching fields equals the write fn return_s in ref and value', () => {
      ownKeysOfObjectLike(writeFnReturn).forEach((key) => {
        expect(gotAStateAfter[key]).toBe(writeFnReturn[key]);
        expect(gotAStateAfter[key]).toStrictEqual(writeFnReturn[key]);
      });
    });

    test('[verify] the contextual mug_s after-write got state_s unmatching fields stay unchanged in ref and value', () => {
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
  }

  /**
   * Required variables: writeOpParamState, writeOpParamS, writeOpReturn, writeFnParamState, writeFnParamS, writeFnReturn, gotAStateBefore, gotAStateAfter
   */
  function sharedVerifyCasesOf_custom_partial_write_op_in_functional_mode() {
    test('[verify] the write fn is called 1 time', () => {
      expect(customPartialWriteFn).toHaveBeenCalledTimes(1);
    });

    test('[verify] the write fn param state equals the write op param state in ref and value', () => {
      expect(writeFnParamState).toBe(writeOpParamState);
      expect(writeFnParamState).toStrictEqual(writeOpParamState);
    });

    test('[verify] the write fn param string equals the write op param string in value', () => {
      expect(writeFnParamS).toBe(writeOpParamS);
    });

    test('[verify] the write op return differs from the write fn return in ref and value', () => {
      expect(writeOpReturn).not.toBe(writeFnReturn);
      expect(writeOpReturn).not.toStrictEqual(writeFnReturn);
    });

    test('[verify] the write op return_s matching fields equal the write fn return_s in ref and value', () => {
      ownKeysOfObjectLike(writeFnReturn).forEach((key) => {
        expect(writeOpReturn[key]).toBe(writeFnReturn[key]);
        expect(writeOpReturn[key]).toStrictEqual(writeFnReturn[key]);
      });
    });

    test('[verify] the contextual mug_s got state stays unchanged in ref and value', () => {
      expect(gotAStateAfter).toBe(gotAStateBefore);
      expect(gotAStateAfter).toStrictEqual(gotAStateBefore);
    });
  }

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
    test('[action]', () => {
      defaultReadOpReturn = defaultReadSpecialOp();
      getItParamMug = jest.mocked(getIt).mock.calls[0][0] as AMug;
      getItReturn = jest.mocked(getIt).mock.results[0].value;
    });

    sharedVerifyCasesOf_default_read_op_in_imperative_mode();
  });

  describe('2f3db67, reads by the default read special-op in functional mode', () => {
    readOpParamState = {
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
      defaultReadOpReturn = defaultReadSpecialOp(readOpParamState);
      passThroughParamState = jest.mocked(passThrough).mock.calls[0][0] as AState;
      passThroughReturn = jest.mocked(passThrough).mock.results[0].value as AState;
    });

    sharedVerifyCasesOf_default_read_op_in_functional_mode();
  });

  describe('640f3ad, reads by the custom read special-op in imperative mode', () => {
    readOpParamExtra = { o: { s: '26d' } };

    test('[action]', () => {
      gotAState = getIt(aMug);
      customReadOpReturn = customReadSpecialOp(readOpParamExtra);
      readFnParamState = customReadFn.mock.calls[0][0];
      readFnParamExtra = customReadFn.mock.calls[0][1];
      customReadFnReturn = customReadFn.mock.results[0].value;
    });

    sharedVerifyCasesOf_custom_read_op_in_imperative_mode();
  });

  describe('ac023b6, reads by the custom read special-op in functional mode', () => {
    readOpParamState = {
      s: 'da8',
      o: {
        s: 'da8',
      },
      potentialMuggyObject: {
        s: 'da8',
        o: {
          s: 'da8',
        },
      },
    };
    readOpParamExtra = { o: { s: '3cd' } };

    test('[action]', () => {
      customReadOpReturn = customReadSpecialOp(readOpParamState, readOpParamExtra);
      readFnParamState = customReadFn.mock.calls[0][0];
      readFnParamExtra = customReadFn.mock.calls[0][1];
      customReadFnReturn = customReadFn.mock.results[0].value;
    });

    sharedVerifyCasesOf_custom_read_op_in_functional_mode();
  });

  describe('bc8966b, reads by the custom empty-param read special-op in imperative mode', () => {
    let readOpReturn: Pick<ObjectState, 'o'>;
    let gotAState: AState;
    let readFnParamState: AState;
    let readFnReturn: Pick<ObjectState, 'o'>;

    test('[action]', () => {
      gotAState = getIt(aMug);
      readOpReturn = customEmptyParamReadSpecialOp();
      readFnParamState = (customEmptyParamReadFn.mock.calls[0] as unknown as [AState])[0];
      readFnReturn = customEmptyParamReadFn.mock.results[0].value;
    });

    test('[verify] the read fn is called 1 time', () => {
      expect(customEmptyParamReadFn).toHaveBeenCalledTimes(1);
    });

    test('[verify] the read fn param state equals the contextual mug_s got state in ref and value', () => {
      expect(readFnParamState).toBe(gotAState);
      expect(readFnParamState).toStrictEqual(gotAState);
    });

    test('[verify] the read op return equals the read fn return in ref and value', () => {
      expect(readOpReturn).toBe(readFnReturn);
      expect(readOpReturn).toStrictEqual(readFnReturn);
    });
  });

  describe('ec21354, reads by the custom empty-param read special-op in functional mode', () => {
    const readOpParamState: AState = {
      s: '073',
      o: {
        s: '073',
      },
      potentialMuggyObject: {
        s: '073',
        o: {
          s: '073',
        },
      },
    };
    let readOpReturn: Pick<ObjectState, 'o'>;
    let readFnParamState: AState;
    let readFnReturn: Pick<ObjectState, 'o'>;

    test('[action]', () => {
      readOpReturn = customEmptyParamReadSpecialOp(readOpParamState);
      readFnParamState = (customEmptyParamReadFn.mock.calls[0] as unknown as [AState])[0];
      readFnReturn = customEmptyParamReadFn.mock.results[0].value;
    });

    test('[verify] the read fn is called 1 time', () => {
      expect(customEmptyParamReadFn).toHaveBeenCalledTimes(1);
    });

    test('[verify] the read fn param state equals the read op param state in ref and value', () => {
      expect(readFnParamState).toBe(readOpParamState);
      expect(readFnParamState).toStrictEqual(readOpParamState);
    });

    test('[verify] the read op return equals the read fn return in ref and value', () => {
      expect(readOpReturn).toBe(readFnReturn);
      expect(readOpReturn).toStrictEqual(readFnReturn);
    });
  });

  describe('976ac2c, writes by the default write special-op in imperative mode', () => {
    writeOpParamPatch = { s: '716' };

    test('[action]', () => {
      defaultWriteSpecialOp(writeOpParamPatch);
      setItParamMug = jest.mocked(setIt).mock.calls[0][0] as AMug;
      setItParamPatch = jest.mocked(setIt).mock.calls[0][1] as PossiblePatch<AState>;
    });

    sharedVerifyCasesOf_default_write_op_in_imperative_mode();
  });

  describe('89f5b15, writes by the default write special-op in functional mode', () => {
    writeOpParamState = {
      s: '888',
      o: {
        s: '888',
      },
      potentialMuggyObject: {
        s: '888',
        o: {
          s: '888',
        },
      },
    };
    writeOpParamPatch = { s: '501' };

    test('[action]', () => {
      gotAStateBefore = getIt(aMug);

      writeOpReturn = defaultWriteSpecialOp(writeOpParamState, writeOpParamPatch);
      assignPatchParamState = jest.mocked(assignPatch).mock.calls[0][0] as AState;
      assignPatchParamPatch = jest.mocked(assignPatch).mock.calls[0][1] as PossiblePatch<AState>;
      assignPatchReturn = jest.mocked(assignPatch).mock.results[0].value;

      gotAStateAfter = getIt(aMug);
    });

    sharedVerifyCasesOf_default_write_op_in_functional_mode();
  });

  describe('4653a7e, writes by the custom full-fledged write special-op in imperative mode', () => {
    writeOpParamS = '420';

    test('[action]', () => {
      gotAStateBefore = getIt(aMug);

      customFullFledgedWriteSpecialOp(writeOpParamS);
      writeFnParamState = customFullFledgedWriteFn.mock.calls[0][0];
      writeFnParamS = customFullFledgedWriteFn.mock.calls[0][1];
      writeFnReturn = customFullFledgedWriteFn.mock.results[0].value;

      gotAStateAfter = getIt(aMug);
    });

    sharedVerifyCasesOf_custom_full_fledged_write_op_in_imperative_mode();
  });

  describe('7b3a110, writes by the custom full-fledged write special-op in functional mode', () => {
    writeOpParamState = {
      s: '0aa',
      o: {
        s: '0aa',
      },
      potentialMuggyObject: {
        s: '0aa',
        o: {
          s: '0aa',
        },
      },
    };
    writeOpParamS = 'df7';

    test('[action]', () => {
      gotAStateBefore = getIt(aMug);

      writeOpReturn = customFullFledgedWriteSpecialOp(writeOpParamState, writeOpParamS);
      writeFnParamState = customFullFledgedWriteFn.mock.calls[0][0];
      writeFnParamS = customFullFledgedWriteFn.mock.calls[0][1];
      writeFnReturn = customFullFledgedWriteFn.mock.results[0].value;

      gotAStateAfter = getIt(aMug);
    });

    sharedVerifyCasesOf_custom_full_fledged_write_op_in_functional_mode();
  });

  describe('240a836, writes by the custom partial write special-op in imperative mode', () => {
    writeOpParamS = '5f2';

    test('[action]', () => {
      gotAStateBefore = getIt(aMug);

      customPartialWriteSpecialOp(writeOpParamS);
      writeFnParamState = customPartialWriteFn.mock.calls[0][0];
      writeFnParamS = customPartialWriteFn.mock.calls[0][1];
      writeFnReturn = customPartialWriteFn.mock.results[0].value;

      gotAStateAfter = getIt(aMug);
    });

    sharedVerifyCasesOf_custom_partial_write_op_in_imperative_mode();
  });

  describe('d59a9b6, writes by the custom partial write special-op in functional mode', () => {
    writeOpParamState = {
      s: 'f1b',
      o: {
        s: 'f1b',
      },
      potentialMuggyObject: {
        s: 'f1b',
        o: {
          s: 'f1b',
        },
      },
    };
    writeOpParamS = '4df';

    test('[action]', () => {
      gotAStateBefore = getIt(aMug);

      writeOpReturn = customPartialWriteSpecialOp(writeOpParamState, writeOpParamS);
      writeFnParamState = customPartialWriteFn.mock.calls[0][0];
      writeFnParamS = customPartialWriteFn.mock.calls[0][1];
      writeFnReturn = customPartialWriteFn.mock.results[0].value;

      gotAStateAfter = getIt(aMug);
    });

    sharedVerifyCasesOf_custom_partial_write_op_in_functional_mode();
  });

  describe('a8f8a36, writes by the custom empty-param write special-op in imperative mode', () => {
    let gotAStateBefore: AState, gotAStateAfter: AState;
    let writeFnParamState: AState, writeFnReturn: AState;

    test('[action]', () => {
      gotAStateBefore = getIt(aMug);

      customEmptyParamWriteSpecialOp();
      writeFnParamState = (customEmptyParamWriteFn.mock.calls[0] as unknown as [AState])[0];
      writeFnReturn = customEmptyParamWriteFn.mock.results[0].value;

      gotAStateAfter = getIt(aMug);
    });

    test('[verify] the reset fn is called 1 time', () => {
      expect(customEmptyParamWriteFn).toHaveBeenCalledTimes(1);
    });

    test('[verify] the write fn param state equals the contextual mug_s before-write got state in ref and value', () => {
      expect(writeFnParamState).toBe(gotAStateBefore);
      expect(writeFnParamState).toStrictEqual(gotAStateBefore);
    });

    test('[verify] the contextual mug_s after-write got state equals the write fn return in ref and value', () => {
      expect(gotAStateAfter).toBe(writeFnReturn);
      expect(gotAStateAfter).toStrictEqual(writeFnReturn);
    });

    test('[verify] the contextual mug_s got state changes in ref and value', () => {
      expect(gotAStateAfter).not.toBe(gotAStateBefore);
      expect(gotAStateAfter).not.toStrictEqual(gotAStateBefore);
    });
  });

  describe('6ba6cf6, writes by the custom empty-param write special-op in functional mode', () => {
    const writeOpParamState: AState = {
      s: '674',
      o: {
        s: '674',
      },
      potentialMuggyObject: {
        s: '674',
        o: {
          s: '674',
        },
      },
    };
    let writeOpReturn: AState;
    let writeFnParamState: AState, writeFnReturn: AState;
    let gotAStateBefore: AState, gotAStateAfter: AState;

    test('[action]', () => {
      gotAStateBefore = getIt(aMug);

      writeOpReturn = customEmptyParamWriteSpecialOp(writeOpParamState);
      writeFnParamState = (customEmptyParamWriteFn.mock.calls[0] as unknown as [AState])[0];
      writeFnReturn = customEmptyParamWriteFn.mock.results[0].value;

      gotAStateAfter = getIt(aMug);
    });

    test('[verify] the write fn is called 1 time', () => {
      expect(customEmptyParamWriteFn).toHaveBeenCalledTimes(1);
    });

    test('[verify] the write fn param state equals the write op param state in ref and value', () => {
      expect(writeFnParamState).toBe(writeOpParamState);
      expect(writeFnParamState).toStrictEqual(writeOpParamState);
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

  describe('dddb2f7, reads by the default read special-trait op in imperative mode', () => {
    test('[action]', () => {
      defaultReadOpReturn = specialTrait.defaultReadOp();
      getItParamMug = jest.mocked(getIt).mock.calls[0][0] as AMug;
      getItReturn = jest.mocked(getIt).mock.results[0].value;
    });

    sharedVerifyCasesOf_default_read_op_in_imperative_mode();
  });

  describe('9418420, reads by the default read special-trait op in functional mode', () => {
    readOpParamState = {
      s: '677',
      o: {
        s: '677',
      },
      potentialMuggyObject: {
        s: '677',
        o: {
          s: '677',
        },
      },
    };

    test('[action]', () => {
      defaultReadOpReturn = specialTrait.defaultReadOp(readOpParamState);
      passThroughParamState = jest.mocked(passThrough).mock.calls[0][0] as AState;
      passThroughReturn = jest.mocked(passThrough).mock.results[0].value as AState;
    });

    sharedVerifyCasesOf_default_read_op_in_functional_mode();
  });

  describe('021ef7c, reads by the custom read special-trait op in imperative mode', () => {
    readOpParamExtra = { o: { s: '168' } };

    test('[action]', () => {
      gotAState = getIt(aMug);
      customReadOpReturn = specialTrait.customReadOp(readOpParamExtra);
      readFnParamState = customReadFn.mock.calls[0][0];
      readFnParamExtra = customReadFn.mock.calls[0][1];
      customReadFnReturn = customReadFn.mock.results[0].value;
    });

    sharedVerifyCasesOf_custom_read_op_in_imperative_mode();
  });

  describe('8f5a2c1, reads by the custom read special-trait op in functional mode', () => {
    readOpParamState = {
      s: '830',
      o: {
        s: '830',
      },
      potentialMuggyObject: {
        s: '830',
        o: {
          s: '830',
        },
      },
    };
    readOpParamExtra = { o: { s: '0ab' } };

    test('[action]', () => {
      customReadOpReturn = specialTrait.customReadOp(readOpParamState, readOpParamExtra);
      readFnParamState = customReadFn.mock.calls[0][0];
      readFnParamExtra = customReadFn.mock.calls[0][1];
      customReadFnReturn = customReadFn.mock.results[0].value;
    });

    sharedVerifyCasesOf_custom_read_op_in_functional_mode();
  });

  describe('d31947a, writes by the default write special-trait op in imperative mode', () => {
    const writeOpParamPatch: PossiblePatch<AMug> = { s: '09a' };
    let setItParamMug: AMug, setItParamPatch: PossiblePatch<AMug>;

    test('[action]', () => {
      specialTrait.defaultWriteOp(writeOpParamPatch);
      setItParamMug = jest.mocked(setIt).mock.calls[0][0] as AMug;
      setItParamPatch = jest.mocked(setIt).mock.calls[0][1] as PossiblePatch<AState>;
    });

    sharedVerifyCasesOf_default_write_op_in_imperative_mode();
  });

  describe('5f63c1e, writes by the default write special-trait op in functional mode', () => {
    writeOpParamState = {
      s: 'abf',
      o: {
        s: 'abf',
      },
      potentialMuggyObject: {
        s: 'abf',
        o: {
          s: 'abf',
        },
      },
    };
    writeOpParamPatch = { s: '3ed' };

    test('[action]', () => {
      gotAStateBefore = getIt(aMug);

      writeOpReturn = specialTrait.defaultWriteOp(writeOpParamState, writeOpParamPatch);
      assignPatchParamState = jest.mocked(assignPatch).mock.calls[0][0] as AState;
      assignPatchParamPatch = jest.mocked(assignPatch).mock.calls[0][1] as PossiblePatch<AState>;
      assignPatchReturn = jest.mocked(assignPatch).mock.results[0].value;

      gotAStateAfter = getIt(aMug);
    });

    sharedVerifyCasesOf_default_write_op_in_functional_mode();
  });

  describe('74c677d, writes by the custom full-fledged write special-trait op in imperative mode', () => {
    writeOpParamS = '9f7';

    test('[action]', () => {
      gotAStateBefore = getIt(aMug);

      specialTrait.customFullFledgedWriteOp(writeOpParamS);
      writeFnParamState = customFullFledgedWriteFn.mock.calls[0][0];
      writeFnParamS = customFullFledgedWriteFn.mock.calls[0][1];
      writeFnReturn = customFullFledgedWriteFn.mock.results[0].value;

      gotAStateAfter = getIt(aMug);
    });

    sharedVerifyCasesOf_custom_full_fledged_write_op_in_imperative_mode();
  });

  describe('f3b06d1, writes by the custom full-fledged write special-trait op in functional mode', () => {
    writeOpParamState = {
      s: '210',
      o: {
        s: '210',
      },
      potentialMuggyObject: {
        s: '210',
        o: {
          s: '210',
        },
      },
    };
    writeOpParamS = 'b3a';

    test('[action]', () => {
      gotAStateBefore = getIt(aMug);

      writeOpReturn = specialTrait.customFullFledgedWriteOp(writeOpParamState, writeOpParamS);
      writeFnParamState = customFullFledgedWriteFn.mock.calls[0][0];
      writeFnParamS = customFullFledgedWriteFn.mock.calls[0][1];
      writeFnReturn = customFullFledgedWriteFn.mock.results[0].value;

      gotAStateAfter = getIt(aMug);
    });

    sharedVerifyCasesOf_custom_full_fledged_write_op_in_functional_mode();
  });

  describe('b0a1a1e, writes by the custom partial write special-trait op in imperative mode', () => {
    writeOpParamS = 'cbe';

    test('[action]', () => {
      gotAStateBefore = getIt(aMug);

      specialTrait.customPartialWriteOp(writeOpParamS);
      writeFnParamState = customPartialWriteFn.mock.calls[0][0];
      writeFnParamS = customPartialWriteFn.mock.calls[0][1];
      writeFnReturn = customPartialWriteFn.mock.results[0].value;

      gotAStateAfter = getIt(aMug);
    });

    sharedVerifyCasesOf_custom_partial_write_op_in_imperative_mode();
  });

  describe('59bef03, writes by the custom partial write special-trait op in functional mode', () => {
    writeOpParamState = {
      s: 'db0',
      o: {
        s: 'db0',
      },
      potentialMuggyObject: {
        s: 'db0',
        o: {
          s: 'db0',
        },
      },
    };
    writeOpParamS = 'a32';

    test('[action]', () => {
      gotAStateBefore = getIt(aMug);

      writeOpReturn = specialTrait.customPartialWriteOp(writeOpParamState, writeOpParamS);
      writeFnParamState = customPartialWriteFn.mock.calls[0][0];
      writeFnParamS = customPartialWriteFn.mock.calls[0][1];
      writeFnReturn = customPartialWriteFn.mock.results[0].value;

      gotAStateAfter = getIt(aMug);
    });

    sharedVerifyCasesOf_custom_partial_write_op_in_functional_mode();
  });

  describe('9471df9, executes by the custom special-trait exec', () => {
    const specialTraitExecParamExtra: Pick<ObjectState, 'o'> = { o: { s: '05a' } };
    let specialTraitExecReturn: Pick<ObjectState, 'o'>;

    let execParamMug: PossibleMugLike<AState>, execParamExtra: Pick<ObjectState, 'o'>;
    let execReturn: Pick<ObjectState, 'o'>;

    test('[action]', () => {
      specialTraitExecReturn = specialTrait.customExec(specialTraitExecParamExtra);

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

    test('[verify] the original exec param extra equals the special-trait exec param extra in ref and value', () => {
      expect(execParamExtra).toBe(specialTraitExecParamExtra);
      expect(execParamExtra).toStrictEqual(specialTraitExecParamExtra);
    });

    test('[verify] the special-trait exec return equals the original exec return in ref and value', () => {
      expect(specialTraitExecReturn).toBe(execReturn);
      expect(specialTraitExecReturn).toStrictEqual(execReturn);
    });
  });

  describe('c22a20d, checks the custom null-proto object special-trait field', () => {
    test('[action, verify] the special-trait field equals the original field in ref and value', () => {
      expect(specialTrait.customNullProtoObjectField).toBe(customNullProtoObjectField);
      expect(specialTrait.customNullProtoObjectField).toStrictEqual(customNullProtoObjectField);
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

    customWriteFullFledgedSpecialOp = this._.w(customFullFledgedWriteFn);
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

  describe('0b61740, writes by the custom full-fledged write special-op', () => {
    const writeOpParamS = '420';
    let gotAStateBefore: AState, gotAStateAfter: AState;
    let writeFnParamState: AState, writeFnParamS: string, writeFnReturn: AState;

    test('[action]', () => {
      gotAStateBefore = getIt(aMug);

      aMug.customWriteFullFledgedSpecialOp(writeOpParamS);
      writeFnParamState = customFullFledgedWriteFn.mock.calls[0][0];
      writeFnParamS = customFullFledgedWriteFn.mock.calls[0][1];
      writeFnReturn = customFullFledgedWriteFn.mock.results[0].value;

      gotAStateAfter = getIt(aMug);
    });

    test('[verify] the write fn is called 1 time', () => {
      expect(customFullFledgedWriteFn).toHaveBeenCalledTimes(1);
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
