import { produce } from 'immer';
import { construction, getIt, Mug, upon, w } from '../src';

interface ObjectState {
  s: string;
  o: {
    s: string;
  };
}

interface AState extends ObjectState {
  potentialMuggyObject: ObjectState;
}

describe('4496a38, writes by a custom write proc using immer', () => {
  const customWriteProc = w((state: AState, s: string) =>
    produce(state, (draft) => {
      draft.s = s;
      draft.potentialMuggyObject.s = s;
    }),
  );

  const aMug: Mug<AState> = {
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

  const procParamS = '98c';
  let gotAStateBefore: AState, gotAStateAfter: AState;

  test('[action]', () => {
    gotAStateBefore = getIt(aMug);
    customWriteProc(aMug, procParamS);
    gotAStateAfter = getIt(aMug);
  });

  test('[verify] the got state changes in ref and value', () => {
    expect(gotAStateAfter).not.toBe(gotAStateBefore);
    expect(gotAStateAfter).toStrictEqual({
      s: procParamS,
      o: {
        s: 'asd',
      },
      potentialMuggyObject: {
        s: procParamS,
        o: {
          s: 'asd',
        },
      },
    });
  });
});

describe('eb74997, writes by a custom write special-op using immer', () => {
  const aMug = {
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

  const [, w] = upon<AState>(aMug);

  const customWriteSpecialOp = w((state, s: string) =>
    produce(state, (draft) => {
      draft.s = s;
      draft.potentialMuggyObject.s = s;
    }),
  );

  const specialOpParamS = '7db';
  let gotAStateBefore: AState, gotAStateAfter: AState;

  test('[action]', () => {
    gotAStateBefore = getIt(aMug);
    customWriteSpecialOp(specialOpParamS);
    gotAStateAfter = getIt(aMug);
  });

  test('[verify] the got state changes in ref and value', () => {
    expect(gotAStateAfter).not.toBe(gotAStateBefore);
    expect(gotAStateAfter).toStrictEqual({
      s: specialOpParamS,
      o: {
        s: 'asd',
      },
      potentialMuggyObject: {
        s: specialOpParamS,
        o: {
          s: 'asd',
        },
      },
    });
  });
});
