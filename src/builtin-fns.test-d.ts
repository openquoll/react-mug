import { expectType } from 'tsd';
import { fake } from '../tests/type-utils';
import { PossiblePatch } from './builtin-fns';
import { Mug, WithAttachments } from './mug';
import { EmptyItem } from './type-utils';

interface ObjectState {
  s: string;
  o: {
    s: string;
  };
}

type Func = (...args: boolean[]) => boolean;

test('PossiblePatch', () => {
  interface AMugLike extends ObjectState {
    f: Func;
    no?: ObjectState;
    oa: ObjectState[];
    roa: readonly ObjectState[];
    ot: [ObjectState];
    rot: readonly [ObjectState];
    muggyObject: Mug<ObjectState>;
    dirtyMuggyObject: WithAttachments<Mug<ObjectState>, { b: boolean }>;
  }

  type R314 = PossiblePatch<AMugLike>;

  expectType<{
    s?: string;
    o?: { s?: string };
    f?: Func;
    no?: ObjectState;
    oa?: ObjectState[];
    roa?: readonly ObjectState[];
    ot?: [{ s?: string; o?: { s?: string } } | EmptyItem];
    rot?: readonly [{ s?: string; o?: { s?: string } } | EmptyItem];
    muggyObject?: { s?: string; o?: { s?: string } };
    dirtyMuggyObject?: { s?: string; o?: { s?: string } };
  }>(fake<R314>());
});
