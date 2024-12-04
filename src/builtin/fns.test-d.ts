import { expectType } from 'tsd';

import { fake } from '../../tests/type-utils';
import { Attach, Mug } from '../mug';
import { EmptyItem } from '../type-utils';
import { none, PossiblePatch } from './fns';

interface ObjectState {
  s: string;
  o: {
    s: string;
  };
}

test('PossiblePatch', () => {
  type Func = (...args: boolean[]) => boolean;

  interface AMugLike extends ObjectState {
    f: Func;
    no?: ObjectState;
    oa: ObjectState[];
    roa: readonly ObjectState[];
    ot: [ObjectState];
    rot: readonly [ObjectState];
    muggyObject: Mug<ObjectState>;
    dirtyMuggyObject: Attach<Mug<ObjectState>, { b: boolean }>;
  }

  type R314 = PossiblePatch<AMugLike>;
  expectType<{
    s?: string;
    o?: { s?: string };
    f?: Func;
    no?: ObjectState | typeof none;
    oa?: (ObjectState | EmptyItem)[];
    roa?: readonly (ObjectState | EmptyItem)[];
    ot?: [{ s?: string; o?: { s?: string } } | EmptyItem];
    rot?: readonly [{ s?: string; o?: { s?: string } } | EmptyItem];
    muggyObject?: { s?: string; o?: { s?: string } };
    dirtyMuggyObject?: { s?: string; o?: { s?: string } };
  }>(fake<R314>());
});
