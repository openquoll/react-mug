import { expectType } from 'tsd';
import { fake } from '../tests/type-utils';
import { SimplePatch } from './type-utils';

interface ObjectState {
  s: string;
  o: {
    s: string;
  };
}

type Func = (...args: boolean[]) => boolean;

describe('SimplePatch', () => {
  expectType<Func>(fake<SimplePatch<Func>>());

  expectType<ObjectState[]>(fake<SimplePatch<ObjectState[]>>());

  expectType<[ObjectState, ObjectState]>(fake<SimplePatch<[ObjectState, ObjectState]>>());

  expectType<{ s?: string; o?: { s: string } }>(fake<SimplePatch<ObjectState>>());

  type PartialObjectState = Partial<ObjectState>;
  expectType<PartialObjectState>(fake<SimplePatch<PartialObjectState>>());
});
