import { expectAssignable, expectType } from 'tsd';

import { fake, from } from '../../tests/type-utils';
import { Mug, MugLike, PossibleMugLike } from '../mug';
import { r } from '../rw';
import { useOperator } from './useOperator';

interface ObjectState {
  s: string;
  o: {
    s: string;
  };
}

interface AState extends ObjectState {
  potentialMuggyObject: ObjectState;
}

test('useOperator', () => {
  const readf23 = r(<TState>(state: TState): TState => state);

  const r5ba = useOperator(readf23, fake<AState>());
  expectType<AState>(r5ba);

  const r580 = useOperator(readf23, fake<Mug<AState>>());
  expectType<AState>(r580);

  const ra1e = useOperator(
    readf23,
    fake<Mug<AState, { potentialMuggyObject: Mug<ObjectState> }>>(),
  );
  expectType<AState>(ra1e);

  const r6d8 = useOperator(
    readf23,
    fake<MugLike<AState, { potentialMuggyObject: Mug<ObjectState> }>>(),
  );
  expectType<AState>(r6d8);

  const r649 = useOperator(readf23, fake<PossibleMugLike<AState>>());
  expectAssignable<typeof r649>(from<AState>());
  expectAssignable<AState>(from<typeof r649>());

  const r893 = useOperator(readf23, fake<ObjectState>());
  expectType<ObjectState>(r893);

  // @ts-expect-error
  useOperator(readf23);

  // =-=-=

  const read35a = r(<TState>(state: TState, s: string): TState => state);

  useOperator(read35a, fake<AState>(), fake<string>());

  // @ts-expect-error
  useOperator(read35a, fake<AState>());

  // @ts-expect-error
  useOperator(read35a, fake<AState>(), fake<number>());

  // @ts-expect-error
  useOperator(read35a, fake<AState>(), fake<string>(), fake<any>());

  // =-=-=

  const read198 = r((aState: AState): ObjectState => {
    return aState.potentialMuggyObject;
  });

  const r760 = useOperator(read198, fake<AState>());
  expectType<ObjectState>(r760);

  const r6dd = useOperator(read198, fake<Mug<AState>>());
  expectType<ObjectState>(r6dd);

  const r439 = useOperator(
    read198,
    fake<Mug<AState, { potentialMuggyObject: Mug<ObjectState> }>>(),
  );
  expectType<ObjectState>(r439);

  const ra6f = useOperator(
    read198,
    fake<MugLike<AState, { potentialMuggyObject: Mug<ObjectState> }>>(),
  );
  expectType<ObjectState>(ra6f);

  const r866 = useOperator(read198, fake<PossibleMugLike<AState>>());
  expectType<ObjectState>(r866);

  // @ts-expect-error
  useOperator(read198, fake<ObjectState>());

  // @ts-expect-error
  useOperator(read198);

  // =-=-=

  const readdbb = r((aState: AState, s: string): ObjectState => {
    return aState.potentialMuggyObject;
  });

  useOperator(readdbb, fake<AState>(), fake<string>());

  // @ts-expect-error
  useOperator(readdbb, fake<AState>());

  // @ts-expect-error
  useOperator(readdbb, fake<AState>(), fake<number>());

  // @ts-expect-error
  useOperator(readdbb, fake<AState>(), fake<string>(), fake<any>());

  // =-=-=

  const read81f = r(() => 399);
  expectType<number>(useOperator(read81f));

  // @ts-expect-error
  useOperator(read81f, fake<any>());
});
