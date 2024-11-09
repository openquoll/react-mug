import { construction, create, creator, tuple, upon } from '../src';
import { ActionToolbelt, ReadActionOnGetIt, WriteActionOnSetIt } from '../src/actions';
import {
  CreatedMug,
  CreationToolbelt,
  FurtherCreatedMug,
  MugCreator,
  MugWithAttributesValue,
} from '../src/creation';
import { ownKeysOfObjectLike } from '../src/mug';
import { Param0 } from '../src/type-utils';

jest.mock('../src/actions', () => {
  const m = jest.requireActual('../src/actions');
  jest.spyOn(m, 'upon');
  return m;
});

jest.mock('../src/creation/create', () => {
  const m = jest.requireActual('../src/creation/create');

  const _create = m.create;
  const create = jest.fn((...args: any) => {
    const mug = _create(...args);
    jest.spyOn(mug, 'attach');
    return mug;
  });
  m.create = create;

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

type AActionsFunction = (creationToolbelt: CreationToolbelt<MugWithAttributesValue<AState>>) => {
  get: ReadActionOnGetIt<MugWithAttributesValue<AState>>;
  set: WriteActionOnSetIt<MugWithAttributesValue<AState>>;
};

const aActionsFunction = jest.fn(({ r, w }: Param0<AActionsFunction>) => ({
  get: r(),
  set: w(),
}));

describe('cdfd9c9, mug creation by "create"', () => {
  const aAttributesValue = {
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

  describe('8ae85d2, creates a phase-1 mug', () => {
    let aMug: CreatedMug<AState>;

    test('[action]', () => {
      aMug = create<AState>(aAttributesValue);
    });

    test('[verify] the mug_s construction equals the attributes value in ref and value', () => {
      expect(aMug[construction]).toBe(aAttributesValue);
      expect(aMug[construction]).toStrictEqual(aAttributesValue);
    });

    test('[verify] the attributes value_s fields equal the mug_s counterpart fields in ref and value', () => {
      ownKeysOfObjectLike(aAttributesValue).forEach((key) => {
        expect(aMug[key]).toBe(aAttributesValue[key]);
        expect(aMug[key]).toStrictEqual(aAttributesValue[key]);
      });
    });

    test('[verify] the mug has an "attach" method', () => {
      expect(typeof aMug.attach).toBe('function');
    });
  });

  describe('40a8503, creates a phase-2 mug', () => {
    let aMugPhase1: CreatedMug<AState>;
    let aMug: FurtherCreatedMug<AState, typeof aActionsValue>;

    let aCreationToolbelt: Param0<AActionsFunction>;
    let aActionsValue: ReturnType<AActionsFunction>;

    let uponParamMug: MugWithAttributesValue<AState>;
    let uponReturn: ActionToolbelt<typeof uponParamMug>;

    test('[action]', () => {
      aMugPhase1 = create<AState>(aAttributesValue);
      aMug = aMugPhase1.attach(aActionsFunction);

      aCreationToolbelt = aActionsFunction.mock.calls[0][0];
      aActionsValue = aActionsFunction.mock.results[0].value;

      uponParamMug = jest.mocked(upon<typeof aMug>).mock.calls[0][0];
      uponReturn = jest.mocked(upon).mock.results[0].value;
    });

    test('[verify] the mug_s construction equals the attributes value in ref and value', () => {
      expect(aMug[construction]).toBe(aAttributesValue);
      expect(aMug[construction]).toStrictEqual(aAttributesValue);
    });

    test('[verify] the attributes value_s fields equal the mug_s counterpart fields in ref and value', () => {
      ownKeysOfObjectLike(aAttributesValue).forEach((key) => {
        expect(aAttributesValue[key]).toBe(aMug[key]);
        expect(aAttributesValue[key]).toStrictEqual(aMug[key]);
      });
    });

    test('[verify] the mug equals its phase-1 in ref', () => {
      expect(aMug).toBe(aMugPhase1);
    });

    test('[verify] the actions function is called 1 time', () => {
      expect(aActionsFunction).toHaveBeenCalledTimes(1);
    });

    test('[verify] "upon" is called 1 time', () => {
      expect(upon).toHaveBeenCalledTimes(1);
    });

    test('[verify] "upon" param mug equals the mug in ref', () => {
      expect(uponParamMug).toBe(aMug);
    });

    test('[verify] "upon" return equals the creation toolbelt in ref', () => {
      expect(uponReturn).toBe(aCreationToolbelt);
    });

    test('[verify] the creation toolbelt_s "r" and "w" fields equal "upon" return_s counterpart fields in ref', () => {
      expect(aCreationToolbelt.r).toBe(uponReturn.r);
      expect(aCreationToolbelt.w).toBe(uponReturn.w);
    });

    test('[verify] the creation toolbelt_s "mug" field equals the mug in ref', () => {
      expect(aCreationToolbelt.mug).toBe(aMug);
    });

    test('[verify] the creation toolbelt_s "r" "w" and "mug" fields equal its index-0 index-1 and index-2 items in ref', () => {
      expect(aCreationToolbelt.r).toBe(aCreationToolbelt[0]);
      expect(aCreationToolbelt.w).toBe(aCreationToolbelt[1]);
      expect(aCreationToolbelt.mug).toBe(aCreationToolbelt[2]);
    });

    test('[verify] the actions value_s fields equal the mug_s counterpart fields in ref', () => {
      ownKeysOfObjectLike(aActionsValue).forEach((key) => {
        expect(aActionsValue[key]).toBe(aMug[key]);
      });
    });
  });

  describe('b91eca1, read/writes a phase-1 mug_s string field by detached default actions', () => {
    let gotAStateBefore: AState, gotAStateAfter: AState;

    test('[action]', () => {
      const aMug = create<AState>(aAttributesValue);
      const [r, w] = upon(aMug);
      const getA = r();
      const setA = w();

      gotAStateBefore = getA();
      setA({ s: 'sdf' });
      gotAStateAfter = getA();
    });

    test('[verify] the state changes in ref', () => {
      expect(gotAStateAfter).not.toBe(gotAStateBefore);
    });

    test('[verify] the string field changes in value', () => {
      expect(gotAStateAfter.s).not.toBe(gotAStateBefore.s);
    });

    test('[verify] the rest fields stay unchanged in ref and value', () => {
      ownKeysOfObjectLike(gotAStateBefore)
        .filter((key) => key !== 's')
        .forEach((key) => {
          expect(gotAStateAfter[key]).toBe(gotAStateBefore[key]);
          expect(gotAStateAfter[key]).toStrictEqual(gotAStateBefore[key]);
        });
    });
  });

  describe('f574167, read/writes a phase-2 mug_s string field by attached default actions', () => {
    let gotAStateBefore: AState, gotAStateAfter: AState;

    test('[action]', () => {
      const aMug = create<AState>(aAttributesValue).attach(({ r, w }) => ({ get: r(), set: w() }));

      gotAStateBefore = aMug.get();
      aMug.set({ s: 'sdf' });
      gotAStateAfter = aMug.get();
    });

    test('[verify] the state changes in ref', () => {
      expect(gotAStateAfter).not.toBe(gotAStateBefore);
    });

    test('[verify] the field changes in value', () => {
      expect(gotAStateAfter.s).not.toBe(gotAStateBefore.s);
    });

    test('[verify] the rest fields stay unchanged in ref and value', () => {
      ownKeysOfObjectLike(gotAStateBefore)
        .filter((key) => key !== 's')
        .forEach((key) => {
          expect(gotAStateAfter[key]).toBe(gotAStateBefore[key]);
          expect(gotAStateAfter[key]).toStrictEqual(gotAStateBefore[key]);
        });
    });
  });
});

describe('1253d7d, mug creation by "creator", [cite] cdfd9c9', () => {
  const aAttributesFunction = jest.fn((o: { s: string }) => {
    return {
      s: 'asd',
      o,
      potentialMuggyObject: {
        s: 'asd',
        o: {
          s: 'asd',
        },
      },
    };
  });

  const aAttributesArgs = tuple({ s: 'sdf' });

  describe('6751348, creates a phase-1 mug creator', () => {
    let createAMug: MugCreator<(o: { s: string }) => AState>;

    test('[action]', () => {
      createAMug = creator<(o: { s: string }) => AState>(aAttributesFunction);
    });

    test('[verify] "create" is not called', () => {
      expect(create).not.toHaveBeenCalled();
    });

    test('[verify] the attributes function is not called', () => {
      expect(aAttributesFunction).not.toHaveBeenCalled();
    });

    test('[verify] the creator has an "attach" method', () => {
      expect(typeof createAMug.attach).toBe('function');
    });
  });

  describe('b9f66bf, creates a phase-1 mug with a phase-1 mug creator', () => {
    let aMug: CreatedMug<AState>;
    let aAttributesFunctionParams: Parameters<typeof aAttributesFunction>;
    let aAttributesValue: AState;
    let createParam0: AState, createReturn: CreatedMug<AState>;

    test('[action]', () => {
      const createAMug = creator<(o: { s: string }) => AState>(aAttributesFunction);
      aMug = createAMug(...aAttributesArgs);
      aAttributesFunctionParams = aAttributesFunction.mock.calls[0];
      aAttributesValue = aAttributesFunction.mock.results[0].value;
      createParam0 = jest.mocked(create<AState>).mock.calls[0][0];
      createReturn = jest.mocked(create<AState>).mock.results[0].value;
    });

    test('[verify] the attributes function is called 1 time', () => {
      expect(aAttributesFunction).toHaveBeenCalledTimes(1);
    });

    test('[verify] the attributes function params equal the attributes args in ref and value', () => {
      aAttributesArgs.forEach((arg, i) => {
        expect(aAttributesFunctionParams[i]).toBe(arg);
        expect(aAttributesFunctionParams[i]).toStrictEqual(arg);
      });
    });

    test('[verify] "create" is called 1 time', () => {
      expect(create).toHaveBeenCalledTimes(1);
    });

    test('[verify] "create" param-0 equals the attributes value in ref and value', () => {
      expect(createParam0).toBe(aAttributesValue);
      expect(createParam0).toStrictEqual(aAttributesValue);
    });

    test('[verify] the mug equals "create" return in ref and value', () => {
      expect(aMug).toBe(createReturn);
      expect(aMug).toStrictEqual(createReturn);
    });
  });

  describe('e5c27c3, creates two phase-1 mugs with the same phase-1 mug creator and attributes args', () => {
    let aMug1: CreatedMug<AState>, aMug2: CreatedMug<AState>;
    let attributesValue: AState;

    test('[action]', () => {
      const createAMug = creator<(o: { s: string }) => AState>(aAttributesFunction);
      aMug1 = createAMug(...aAttributesArgs);
      aMug2 = createAMug(...aAttributesArgs);
      attributesValue = aAttributesFunction.mock.results[0].value;
    });

    test('[verify] the mugs differ in ref', () => {
      expect(aMug1).not.toBe(aMug2);
    });

    test('[verify] the mugs_ attributes value fields equal in value', () => {
      ownKeysOfObjectLike(attributesValue).forEach((key) => {
        expect(aMug1[key]).toStrictEqual(aMug2[key]);
      });
    });

    test('[verify] the mugs_ constructions equal in value but not in ref', () => {
      expect(aMug1[construction]).toStrictEqual(aMug2[construction]);
      expect(aMug1[construction]).not.toBe(aMug2[construction]);
    });
  });

  describe('f22d916, creates a phase-2 mug creator', () => {
    test('[action]', () => {
      const createAMug = creator(aAttributesFunction).attach(aActionsFunction);
    });

    test('[verify] the attributes function is not called', () => {
      expect(aAttributesFunction).not.toHaveBeenCalled();
    });

    test('[verify] the actions function is not called', () => {
      expect(aActionsFunction).not.toHaveBeenCalled();
    });
  });

  describe('9f39c52, creates a phase-2 mug with a phase-2 mug creator', () => {
    let aMug: FurtherCreatedMug<AState, ReturnType<AActionsFunction>>;
    let aAttributesFunctionParams: Parameters<typeof aAttributesFunction>;
    let aAttributesValue: AState;
    let createParam0: AState, createReturn: CreatedMug<AState>;
    let createReturnAttachParam0: AActionsFunction;
    let createReturnAttachReturn: FurtherCreatedMug<AState, ReturnType<AActionsFunction>>;

    test('[action]', () => {
      const createAMug = creator(aAttributesFunction).attach(aActionsFunction);
      aMug = createAMug(...aAttributesArgs);
      aAttributesFunctionParams = aAttributesFunction.mock.calls[0];
      aAttributesValue = aAttributesFunction.mock.results[0].value;
      createParam0 = jest.mocked(create<AState>).mock.calls[0][0];
      createReturn = jest.mocked(create<AState>).mock.results[0].value;
      createReturnAttachParam0 = jest.mocked(createReturn.attach<AActionsFunction>).mock
        .calls[0][0];
      createReturnAttachReturn = jest.mocked(createReturn.attach<AActionsFunction>).mock.results[0]
        .value;
    });

    test('[verify] the attributes function is called 1 time', () => {
      expect(aAttributesFunction).toHaveBeenCalledTimes(1);
    });

    test('[verify] the attributes function params equal the attributes args in ref and value', () => {
      aAttributesArgs.forEach((arg, i) => {
        expect(aAttributesFunctionParams[i]).toBe(arg);
        expect(aAttributesFunctionParams[i]).toStrictEqual(arg);
      });
    });

    test('[verify] "create" is called 1 time', () => {
      expect(create).toHaveBeenCalledTimes(1);
    });

    test('[verify] "create" param-0 equals the attributes value in ref and value', () => {
      expect(createParam0).toBe(aAttributesValue);
      expect(createParam0).toStrictEqual(aAttributesValue);
    });

    test('[verify] "create" return_s "attach" method is called 1 time', () => {
      expect(createReturn.attach).toHaveBeenCalledTimes(1);
    });

    test('[verify] "create" return_s "attach" param-0 equals the actions function in ref', () => {
      expect(createReturnAttachParam0).toBe(aActionsFunction);
    });

    test('[verify] the mug equals "create" return_s "attach" return in ref and value', () => {
      expect(aMug).toBe(createReturnAttachReturn);
      expect(aMug).toStrictEqual(createReturnAttachReturn);
    });
  });

  describe('dad182c, creates two phase-2 mugs with the same phase-2 mug creator and attributes args', () => {
    let aMug1: FurtherCreatedMug<AState, ReturnType<AActionsFunction>>;
    let aMug2: FurtherCreatedMug<AState, ReturnType<AActionsFunction>>;
    let aAttributesValue: AState;

    test('[action]', () => {
      const createAMug =
        creator<(o: { s: string }) => AState>(aAttributesFunction).attach(aActionsFunction);
      aMug1 = createAMug(...aAttributesArgs);
      aMug2 = createAMug(...aAttributesArgs);
      aAttributesValue = aAttributesFunction.mock.results[0].value;
    });

    test('[verify] the mugs differ in ref', () => {
      expect(aMug1).not.toBe(aMug2);
    });

    test('[verify] the mugs_ attributes value fields equal in value', () => {
      ownKeysOfObjectLike(aAttributesValue).forEach((key) => {
        expect(aMug1[key]).toStrictEqual(aMug2[key]);
      });
    });

    test('[verify] the mugs_ constructions equal in value but not in ref', () => {
      expect(aMug1[construction]).toStrictEqual(aMug2[construction]);
      expect(aMug1[construction]).not.toBe(aMug2[construction]);
    });
  });
});
