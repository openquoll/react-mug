import { expectAssignable, expectType } from 'tsd';

import { fake, from } from '../../tests/type-utils';
import { Mug, MugLike, PossibleMugLike } from '../mug';
import { r } from '../rw';
import { upon } from '../sugar';
import { useIt } from './useIt';

interface ObjectState {
  s: string;
  o: {
    s: string;
  };
}

interface AState extends ObjectState {
  potentialMuggyObject: ObjectState;
}

test('useIt', () => {
  const readf23 = r(<TState>(state: TState): TState => state);

  const r5ba = useIt(readf23, fake<AState>());
  expectType<AState>(r5ba);

  const r580 = useIt(readf23, fake<Mug<AState>>());
  expectType<AState>(r580);

  const ra1e = useIt(readf23, fake<Mug<AState, { potentialMuggyObject: Mug<ObjectState> }>>());
  expectType<AState>(ra1e);

  const r6d8 = useIt(readf23, fake<MugLike<AState, { potentialMuggyObject: Mug<ObjectState> }>>());
  expectType<AState>(r6d8);

  const r649 = useIt(readf23, fake<PossibleMugLike<AState>>());
  expectAssignable<typeof r649>(from<AState>());
  expectAssignable<AState>(from<typeof r649>());

  const r893 = useIt(readf23, fake<ObjectState>());
  expectType<ObjectState>(r893);

  // @ts-expect-error
  useIt(readf23);

  // =-=-=

  const read35a = r(<TState>(state: TState, s: string): TState => state);

  useIt(read35a, fake<AState>(), fake<string>());

  // @ts-expect-error
  useIt(read35a, fake<AState>());

  // @ts-expect-error
  useIt(read35a, fake<AState>(), fake<number>());

  // @ts-expect-error
  useIt(read35a, fake<AState>(), fake<string>(), fake<any>());

  // =-=-=

  const read198 = r((state: AState) => fake<ObjectState>());

  const r760 = useIt(read198, fake<AState>());
  expectType<ObjectState>(r760);

  const r6dd = useIt(read198, fake<Mug<AState>>());
  expectType<ObjectState>(r6dd);

  const r439 = useIt(read198, fake<Mug<AState, { potentialMuggyObject: Mug<ObjectState> }>>());
  expectType<ObjectState>(r439);

  const ra6f = useIt(read198, fake<MugLike<AState, { potentialMuggyObject: Mug<ObjectState> }>>());
  expectType<ObjectState>(ra6f);

  const r866 = useIt(read198, fake<PossibleMugLike<AState>>());
  expectType<ObjectState>(r866);

  // @ts-expect-error
  useIt(read198, fake<ObjectState>());

  // @ts-expect-error
  useIt(read198);

  // =-=-=

  const readdbb = r((state: AState, s: string) => fake<ObjectState>());

  useIt(readdbb, fake<AState>(), fake<string>());

  // @ts-expect-error
  useIt(readdbb, fake<AState>());

  // @ts-expect-error
  useIt(readdbb, fake<AState>(), fake<number>());

  // @ts-expect-error
  useIt(readdbb, fake<AState>(), fake<string>(), fake<any>());

  // =-=-=

  const read81f = r(() => fake<number>());
  expectType<number>(useIt(read81f));

  // @ts-expect-error
  useIt(read81f, fake<any>());

  // =-=-=

  const uponA = upon(fake<Mug<AState, { potentialMuggyObject: Mug<ObjectState> }>>());

  const read4be = uponA.r((state, s: string) => fake<ObjectState>());

  const rd12 = useIt(read4be, fake<string>());
  expectType<ObjectState>(rd12);

  // @ts-expect-error
  useIt(read4be);

  // @ts-expect-error
  useIt(read4be, fake<number>());

  // @ts-expect-error
  useIt(read4be, fake<string>(), fake<any>());
});
