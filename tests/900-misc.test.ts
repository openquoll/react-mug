import {
  attach,
  construction,
  getIt,
  initial,
  Mug,
  MugLike,
  resetIt,
  setIt,
  WithAttachments,
} from '../src';
import { ownKeysOfObjectLike } from '../src/mug';

interface ObjectState {
  s: string;
  o: {
    s: string;
  };
}

describe('3866ec1, initial', () => {
  describe('4e2239a, calls on a plain object state', () => {
    interface AState extends ObjectState {}

    const aState: AState = {
      s: 'asd',
      o: {
        s: 'asd',
      },
    };

    test('[action, verify] the return equals the state in ref and value', () => {
      const ret = initial(aState);
      expect(ret).toBe(aState);
      expect(ret).toStrictEqual(aState);
    });
  });

  describe('d110ff8, calls on a mug-nested object mug-like before-after write', () => {
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

    const aMugLike: MugLike<AState, { muggyObject: Mug<ObjectState> }> = {
      s: 'asd',
      o: {
        s: 'asd',
      },

      muggyObject: objectMug,
    };

    let returnBefore: AState, returnAfter: AState;
    let gotStateBefore: AState, gotStateAfter: AState;

    test('[action]', () => {
      returnBefore = initial(aMugLike);
      gotStateBefore = getIt(aMugLike);

      setIt(aMugLike, { muggyObject: { s: 'sdf' } });

      returnAfter = initial(aMugLike);
      gotStateAfter = getIt(aMugLike);
    });

    test('[verify] the before-write return differs from the mug-like in ref', () => {
      expect(returnBefore).not.toBe(aMugLike);
    });

    test('[verify] the before-write return_s muggy field equals the mug-like_s counterpart field construction in ref and value', () => {
      expect(returnBefore.muggyObject).toBe(aMugLike.muggyObject[construction]);
      expect(returnBefore.muggyObject).toStrictEqual(aMugLike.muggyObject[construction]);
    });

    test('[verify] the before-write return_s non-muggy fields equal the mug-like_s counterpart fields in ref and value', () => {
      ownKeysOfObjectLike(aMugLike)
        .filter((key) => key !== 'muggyObject')
        .forEach((key) => {
          expect(returnBefore[key]).toBe(aMugLike[key]);
          expect(returnBefore[key]).toStrictEqual(aMugLike[key]);
        });
    });

    test('[verify] the return stays unchanged in ref and value', () => {
      expect(returnAfter).toBe(returnBefore);
      expect(returnAfter).toStrictEqual(returnBefore);
    });

    test('[verify] before write, the return equals the got state in value but not in ref', () => {
      expect(returnBefore).toStrictEqual(gotStateBefore);
      expect(returnBefore).not.toBe(gotStateBefore);
    });

    test('[verify] after write, the return differs from the got state in ref and value', () => {
      expect(returnAfter).not.toBe(gotStateAfter);
      expect(returnAfter).not.toStrictEqual(gotStateAfter);
    });
  });

  describe('770de59, calls on a plain object mug before-after write', () => {
    interface AState extends ObjectState {}

    const aMug: Mug<AState> = {
      [construction]: {
        s: 'asd',
        o: {
          s: 'asd',
        },
      },
    };

    let returnBefore: AState, returnAfter: AState;
    let gotStateBefore: AState, gotStateAfter: AState;

    test('[action]', () => {
      returnBefore = initial(aMug);
      gotStateBefore = getIt(aMug);

      setIt(aMug, { s: 'sdf' });

      returnAfter = initial(aMug);
      gotStateAfter = getIt(aMug);
    });

    test('[verify] the before-write return equals the mug construction in ref and value', () => {
      expect(returnBefore).toBe(aMug[construction]);
      expect(returnBefore).toStrictEqual(aMug[construction]);
    });

    test('[verify] the return stays unchanged in ref and value', () => {
      expect(returnAfter).toBe(returnBefore);
      expect(returnAfter).toStrictEqual(returnBefore);
    });

    test('[verify] before write, the return equals the got state in ref and value', () => {
      expect(returnBefore).toBe(gotStateBefore);
      expect(returnBefore).toStrictEqual(gotStateBefore);
    });

    test('[verify] after write, the return differs from the got state in ref and value', () => {
      expect(returnAfter).not.toBe(gotStateAfter);
      expect(returnAfter).not.toStrictEqual(gotStateAfter);
    });
  });
});

describe('e7adc62, resetIt, [cite] .:3866ec1', () => {
  describe('4b5086d, calls on a plain object state', () => {
    interface AState extends ObjectState {}

    const aState: AState = {
      s: 'asd',
      o: {
        s: 'asd',
      },
    };

    test('[action, verify] the return equals the state in ref and value', () => {
      const ret = resetIt(aState);
      expect(ret).toBe(aState);
      expect(ret).toStrictEqual(aState);
    });
  });

  describe('c81305e, calls on a mug-nested object mug-like before write', () => {
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

    const aMugLike: MugLike<AState, { muggyObject: Mug<ObjectState> }> = {
      s: 'asd',
      o: {
        s: 'asd',
      },

      muggyObject: objectMug,
    };

    let ret: MugLike<AState, { muggyObject: Mug<ObjectState> }>;
    let gotStateBefore: AState, gotStateAfter: AState;

    test('[action]', () => {
      gotStateBefore = getIt(aMugLike);
      ret = resetIt(aMugLike);
      gotStateAfter = getIt(aMugLike);
    });

    test('[verify] the return equals the mug-like in ref and value', () => {
      expect(ret).toBe(aMugLike);
      expect(ret).toStrictEqual(aMugLike);
    });

    test('[verify] the got state stays unchanged in ref and value', () => {
      expect(gotStateAfter).toBe(gotStateBefore);
      expect(gotStateAfter).toStrictEqual(gotStateBefore);
    });
  });

  describe('acc4f6b, calls on a mug-nested object mug-like after write', () => {
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

    const aMugLike: MugLike<AState, { muggyObject: Mug<ObjectState> }> = {
      s: 'asd',
      o: {
        s: 'asd',
      },

      muggyObject: objectMug,
    };

    let ret: MugLike<AState, { muggyObject: Mug<ObjectState> }>;
    let gotStateBefore: AState, gotStateAfter: AState;
    let initialState: AState;

    test('[action]', () => {
      setIt(aMugLike, { muggyObject: { s: 'sdf' } });

      gotStateBefore = getIt(aMugLike);
      ret = resetIt(aMugLike);
      gotStateAfter = getIt(aMugLike);

      initialState = initial(aMugLike);
    });

    test('[verify] the return equals the mug-like in ref and value', () => {
      expect(ret).toBe(aMugLike);
      expect(ret).toStrictEqual(aMugLike);
    });

    test('[verify] the got state changes in ref', () => {
      expect(gotStateAfter).not.toBe(gotStateBefore);
    });

    test('[verify] the after-call got state differs from initial(the mug-like) in ref', () => {
      expect(gotStateAfter).not.toBe(initialState);
    });

    test('[verify] the after-call got state equals initial(the mug-like) in value', () => {
      expect(gotStateAfter).toStrictEqual(initialState);
    });
  });

  describe('6f927ef, calls on a plain object mug before write', () => {
    interface AState extends ObjectState {}

    const aMug: Mug<AState> = {
      [construction]: {
        s: 'asd',
        o: {
          s: 'asd',
        },
      },
    };

    let ret: Mug<AState>;
    let gotStateBefore: AState, gotStateAfter: AState;

    test('[action]', () => {
      gotStateBefore = getIt(aMug);
      ret = resetIt(aMug);
      gotStateAfter = getIt(aMug);
    });

    test('[verify] the return equals the mug in ref and value', () => {
      expect(ret).toBe(aMug);
      expect(ret).toStrictEqual(aMug);
    });

    test('[verify] the got state stays unchanged in ref and value', () => {
      expect(gotStateAfter).toBe(gotStateBefore);
      expect(gotStateAfter).toStrictEqual(gotStateBefore);
    });
  });

  describe('7266a64, calls on a plain object mug after write', () => {
    interface AState extends ObjectState {}

    const aMug: Mug<AState> = {
      [construction]: {
        s: 'asd',
        o: {
          s: 'asd',
        },
      },
    };

    let ret: Mug<AState>;
    let gotStateBefore: AState, gotStateAfter: AState;
    let initialState: AState;

    test('[action]', () => {
      setIt(aMug, { s: 'sdf' });

      gotStateBefore = getIt(aMug);
      ret = resetIt(aMug);
      gotStateAfter = getIt(aMug);

      initialState = initial(aMug);
    });

    test('[verify] the return equals the mug in ref and value', () => {
      expect(ret).toBe(aMug);
      expect(ret).toStrictEqual(aMug);
    });

    test('[verify] the got state changes in ref', () => {
      expect(gotStateAfter).not.toBe(gotStateBefore);
    });

    test('[verify] the after-call got state equals initial(the mug) in ref and value', () => {
      expect(gotStateAfter).toBe(initialState);
      expect(gotStateAfter).toStrictEqual(initialState);
    });
  });
});

describe('fb70d22, attach', () => {
  interface AState extends ObjectState {}

  const fieldsToAttach = {
    s: 'asd',
    o: {
      s: 'asd',
    },
    f: () => false,
  };

  describe('calls on a plain object mug and fields to attach', () => {
    const paramMug: Mug<AState> = {
      [construction]: {
        s: 'asd',
        o: {
          s: 'asd',
        },
      },
    };

    let retMug: WithAttachments<Mug<AState>, typeof fieldsToAttach>;

    test('[action]', () => {
      retMug = attach(paramMug, fieldsToAttach);
    });

    test('[verify] the return mug equals the param mug in ref', () => {
      expect(retMug).toBe(paramMug);
    });

    test('[verify] the return mug_s construction equals the mug_s in ref and value', () => {
      expect(retMug[construction]).toBe(paramMug[construction]);
      expect(retMug[construction]).toStrictEqual(paramMug[construction]);
    });

    test('[verify] the return mug_s attached fields equal the fields to attach in ref and value', () => {
      ownKeysOfObjectLike(fieldsToAttach).forEach((key) => {
        expect(retMug[key]).toBe(fieldsToAttach[key]);
        expect(retMug[key]).toStrictEqual(fieldsToAttach[key]);
      });
    });
  });

  describe('reads the param and return mugs before write', () => {
    test('[action, verify] the return mug_s state equals the param mug_s in ref and value', () => {
      const paramMug: Mug<AState> = {
        [construction]: {
          s: 'asd',
          o: {
            s: 'asd',
          },
        },
      };

      const retMug = attach(paramMug, fieldsToAttach);

      const paramState = getIt(paramMug);
      const retState = getIt(retMug);

      expect(retState).toBe(paramState);
      expect(retState).toStrictEqual(paramState);
    });
  });

  describe('reads the param and return mugs after write', () => {
    test('[action, verify] the param mug_s state equals the return mug_s in ref and value', () => {
      const paramMug: Mug<AState> = {
        [construction]: {
          s: 'asd',
          o: {
            s: 'asd',
          },
        },
      };

      const retMug = attach(paramMug, fieldsToAttach);

      setIt(paramMug, { s: 'sdf' });

      const paramState = getIt(paramMug);
      const retState = getIt(retMug);

      expect(retState).toBe(paramState);
      expect(retState).toStrictEqual(paramState);
    });
  });
});
