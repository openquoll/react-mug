import { construction, getIt, initial, Mug, Muggify, setIt } from '../src';
import { ownKeysOfObjectLike } from '../src/mug';

describe('initial', () => {
  interface ObjectState {
    s: string;
    o: {
      s: string;
    };
  }

  describe('calls on a plain object state', () => {
    const aState = {
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

  describe('calls on a mug-nested object mug-like before-after write', () => {
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

    const aMugLike: Muggify<AState, { muggyObject: Mug<ObjectState> }> = {
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

  describe('calls on a plain object mug before-after write', () => {
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
