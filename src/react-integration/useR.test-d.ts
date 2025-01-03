import { expectAssignable, expectType } from 'tsd';

import { fake } from '../../tests/type-utils';
import { r as flatR, w as flatW } from '../mechanism';
import { Mug, MugLike, PossibleMug, PossibleMugLike, WithAttachments } from '../mug';
import { upon } from '../ops/special';
import { useR } from './useR';

interface ObjectState {
  s: string;
  o: {
    s: string;
  };
}

interface AState extends ObjectState {
  potentialMuggyObject: ObjectState;
}

interface BiggerState extends AState {
  n: number;
}

type AMug = Mug<AState>;

type CompositeAMug = Mug<AState, { potentialMuggyObject: Mug<ObjectState> }>;

type AMugLike = MugLike<AState, { potentialMuggyObject: Mug<ObjectState> }>;

type PossibleAMug = PossibleMug<AState>;

type PossibleAMugLike = PossibleMugLike<AState>;

type DirtyAMug = WithAttachments<
  Mug<{
    s: string;
    o: {
      s: string;
    };
    potentialMuggyObject: WithAttachments<Mug<ObjectState>, { b: boolean }>;
  }>,
  { b: boolean }
>;

test('useR', () => {
  // @ts-expect-error
  useR();

  // =-=-=

  const readf23 = flatR(<TState>(state: TState): TState => state);

  expectType<AState>(useR(readf23, fake<AState>()));
  expectType<AState>(useR(readf23, fake<AMug>()));
  expectType<AState>(useR(readf23, fake<CompositeAMug>()));
  expectType<AState>(useR(readf23, fake<AMugLike>()));

  const r711 = useR(readf23, fake<PossibleAMug>());
  expectAssignable<AState>(r711);
  expectAssignable<typeof r711>(fake<AState>());

  const r649 = useR(readf23, fake<PossibleAMugLike>());
  expectAssignable<AState>(r649);
  expectAssignable<typeof r649>(fake<AState>());

  expectType<AState>(useR(readf23, fake<DirtyAMug>()));
  expectType<BiggerState>(useR(readf23, fake<BiggerState>()));
  expectType<ObjectState>(useR(readf23, fake<ObjectState>()));

  // @ts-expect-error
  useR(readf23);

  // @ts-expect-error
  useR(readf23, fake<AState>(), fake<any>());

  // =-=-=

  const read35a = flatR(<TState>(state: TState, s: string): TState => state);

  useR(read35a, fake<AState>(), fake<string>());

  // @ts-expect-error
  useR(read35a, fake<AState>());

  // @ts-expect-error
  useR(read35a, fake<AState>(), fake<number>());

  // @ts-expect-error
  useR(read35a, fake<AState>(), fake<string>(), fake<any>());

  // =-=-=

  const read69c = flatR(<TState extends AState>(state: TState): TState => state);

  expectType<AState>(useR(read69c, fake<AState>()));

  expectType<BiggerState>(useR(read69c, fake<BiggerState>()));

  // @ts-expect-error
  useR(read69c, fake<ObjectState>());

  // =-=-=

  const read198 = flatR((state: AState) => fake<ObjectState>());

  expectType<ObjectState>(useR(read198, fake<AState>()));
  expectType<ObjectState>(useR(read198, fake<AMug>()));
  expectType<ObjectState>(useR(read198, fake<CompositeAMug>()));
  expectType<ObjectState>(useR(read198, fake<AMugLike>()));
  expectType<ObjectState>(useR(read198, fake<PossibleAMug>()));
  expectType<ObjectState>(useR(read198, fake<PossibleAMugLike>()));
  expectType<ObjectState>(useR(read198, fake<DirtyAMug>()));
  expectType<ObjectState>(useR(read198, fake<BiggerState>()));

  // @ts-expect-error
  useR(read198, fake<ObjectState>());

  // @ts-expect-error
  useR(read198);

  // @ts-expect-error
  useR(read198, fake<AState>(), fake<any>());

  // =-=-=

  const readdbb = flatR((state: AState, s: string) => fake<ObjectState>());

  useR(readdbb, fake<AState>(), fake<string>());

  // @ts-expect-error
  useR(readdbb, fake<AState>());

  // @ts-expect-error
  useR(readdbb, fake<AState>(), fake<number>());

  // @ts-expect-error
  useR(readdbb, fake<AState>(), fake<string>(), fake<any>());

  // =-=-=

  const read81f = flatR(() => fake<AState>());

  expectType<AState>(useR(read81f));
  expectType<AState>(useR(read81f, fake<unknown>()));

  // @ts-expect-error
  useR(read81f, fake<unknown>(), fake<any>());

  // =-=-=

  const { r } = upon<AState>(fake<CompositeAMug>());

  // =-=-=

  const read4be = r((state) => fake<ObjectState>());

  expectType<ObjectState>(useR(read4be));

  // @ts-expect-error
  useR(read4be, fake<any>());

  // =-=-=

  const read95a = r((state, s: string) => fake<ObjectState>());

  expectType<ObjectState>(useR(read95a, fake<string>()));

  // @ts-expect-error
  useR(read95a);

  // @ts-expect-error
  useR(read95a, fake<number>());

  // @ts-expect-error
  useR(read95a, fake<string>(), fake<any>());

  // =-=-=

  const read811 = r((state: ObjectState) => state);

  expectType<ObjectState>(useR(read811));

  // =-=-=

  // @ts-expect-error
  r((state: BiggerState) => fake<ObjectState>());

  // =-=-=

  // @ts-expect-error
  r((state: { n: number }) => fake<ObjectState>());

  // =-=-=

  const read5ce = r(<TState>(state: TState) => state);

  expectType<AState>(useR(read5ce));

  // @ts-expect-error
  useR(read5ce, fake<any>());

  // =-=-=

  const read229 = r(<TState>(state: TState, s: string) => state);

  useR(read229, fake<string>());

  // @ts-expect-error
  useR(read229);

  // @ts-expect-error
  useR(read229, fake<number>());

  // @ts-expect-error
  useR(read229, fake<string>(), fake<any>());

  // =-=-=

  const read012 = r(<TState extends AState>(state: TState): TState => state);

  expectType<AState>(useR(read012));

  // =-=-=

  const read7d1 = r(<TState extends ObjectState>(state: TState): TState => state);

  expectType<AState>(useR(read7d1));

  // =-=-=

  // @ts-expect-error
  r(<TState extends BiggerState>(state: TState): TState => state);

  // =-=-=

  const readd37 = r(() => fake<ObjectState>());

  expectType<ObjectState>(useR(readd37));

  // @ts-expect-error
  useR(readd37, fake<any>());

  // =-=-=

  const readde2 = r();

  expectType<AState>(useR(readde2));

  // @ts-expect-error
  useR(readde2, fake<any>());

  // =-=-=

  const write23e = flatW();

  write23e(fake<any>(), fake<any>());

  // @ts-expect-error
  useR(write23e, fake<any>(), fake<any>());

  // =-=-=

  const { w } = upon(fake<CompositeAMug>());

  // =-=-=

  const write7eb = w();

  write7eb(fake<any>());

  // @ts-expect-error
  useR(write7eb, fake<any>());
});
