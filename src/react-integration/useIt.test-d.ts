import { expectAssignable, expectType } from 'tsd';

import { fake } from '../../tests/type-utils';
import { upon } from '../actions';
import { Mug, MugLike, PossibleMug, PossibleMugLike, WithAttachments } from '../mug';
import { r as flatR, w as flatW } from '../op-mech';
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

interface SuperState extends AState {
  n: number;
}

type AMug = Mug<AState>;

type NestedAMug = Mug<AState, { potentialMuggyObject: Mug<ObjectState> }>;

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

test('useIt', () => {
  // @ts-expect-error
  useIt();

  // =-=-=

  const readf23 = flatR(<TState>(state: TState): TState => state);

  expectType<AState>(useIt(readf23, fake<AState>()));
  expectType<AState>(useIt(readf23, fake<AMug>()));
  expectType<AState>(useIt(readf23, fake<NestedAMug>()));
  expectType<AState>(useIt(readf23, fake<AMugLike>()));

  const r711 = useIt(readf23, fake<PossibleAMug>());
  expectAssignable<AState>(r711);
  expectAssignable<typeof r711>(fake<AState>());

  const r649 = useIt(readf23, fake<PossibleAMugLike>());
  expectAssignable<AState>(r649);
  expectAssignable<typeof r649>(fake<AState>());

  expectType<AState>(useIt(readf23, fake<DirtyAMug>()));
  expectType<SuperState>(useIt(readf23, fake<SuperState>()));
  expectType<ObjectState>(useIt(readf23, fake<ObjectState>()));

  // @ts-expect-error
  useIt(readf23);

  // @ts-expect-error
  useIt(readf23, fake<AState>(), fake<any>());

  // =-=-=

  const read35a = flatR(<TState>(state: TState, s: string): TState => state);

  useIt(read35a, fake<AState>(), fake<string>());

  // @ts-expect-error
  useIt(read35a, fake<AState>());

  // @ts-expect-error
  useIt(read35a, fake<AState>(), fake<number>());

  // @ts-expect-error
  useIt(read35a, fake<AState>(), fake<string>(), fake<any>());

  // =-=-=

  const read69c = flatR(<TState extends AState>(state: TState): TState => state);

  expectType<AState>(useIt(read69c, fake<AState>()));

  expectType<SuperState>(useIt(read69c, fake<SuperState>()));

  // @ts-expect-error
  useIt(read69c, fake<ObjectState>());

  // =-=-=

  const read198 = flatR((state: AState) => fake<ObjectState>());

  expectType<ObjectState>(useIt(read198, fake<AState>()));
  expectType<ObjectState>(useIt(read198, fake<AMug>()));
  expectType<ObjectState>(useIt(read198, fake<NestedAMug>()));
  expectType<ObjectState>(useIt(read198, fake<AMugLike>()));
  expectType<ObjectState>(useIt(read198, fake<PossibleAMug>()));
  expectType<ObjectState>(useIt(read198, fake<PossibleAMugLike>()));
  expectType<ObjectState>(useIt(read198, fake<DirtyAMug>()));
  expectType<ObjectState>(useIt(read198, fake<SuperState>()));

  // @ts-expect-error
  useIt(read198, fake<ObjectState>());

  // @ts-expect-error
  useIt(read198);

  // @ts-expect-error
  useIt(read198, fake<AState>(), fake<any>());

  // =-=-=

  const readdbb = flatR((state: AState, s: string) => fake<ObjectState>());

  useIt(readdbb, fake<AState>(), fake<string>());

  // @ts-expect-error
  useIt(readdbb, fake<AState>());

  // @ts-expect-error
  useIt(readdbb, fake<AState>(), fake<number>());

  // @ts-expect-error
  useIt(readdbb, fake<AState>(), fake<string>(), fake<any>());

  // =-=-=

  const read81f = flatR(() => fake<AState>());

  expectType<AState>(useIt(read81f));
  expectType<AState>(useIt(read81f, fake<unknown>()));

  // @ts-expect-error
  useIt(read81f, fake<unknown>(), fake<any>());

  // =-=-=

  const { r } = upon(fake<NestedAMug>());

  // =-=-=

  const read4be = r((state) => fake<ObjectState>());

  expectType<ObjectState>(useIt(read4be));

  // @ts-expect-error
  useIt(read4be, fake<any>());

  // =-=-=

  const read95a = r((state, s: string) => fake<ObjectState>());

  useIt(read95a, fake<string>());

  // @ts-expect-error
  useIt(read95a);

  // @ts-expect-error
  useIt(read95a, fake<number>());

  // @ts-expect-error
  useIt(read95a, fake<string>(), fake<any>());

  // =-=-=

  const read811 = r((state: ObjectState) => state);

  expectType<ObjectState>(useIt(read811));

  // =-=-=

  // @ts-expect-error
  r((state: SuperState) => fake<ObjectState>());

  // =-=-=

  // @ts-expect-error
  r((state: { n: number }) => fake<ObjectState>());

  // =-=-=

  const read5ce = r(<TState>(state: TState) => state);

  expectType<AState>(useIt(read5ce));

  // @ts-expect-error
  useIt(read5ce, fake<any>());

  // =-=-=

  const read229 = r(<TState>(state: TState, s: string) => state);

  useIt(read229, fake<string>());

  // @ts-expect-error
  useIt(read229);

  // @ts-expect-error
  useIt(read229, fake<number>());

  // @ts-expect-error
  useIt(read229, fake<string>(), fake<any>());

  // =-=-=

  const read012 = r(<TState extends AState>(state: TState): TState => state);

  expectType<AState>(useIt(read012));

  // =-=-=

  const read7d1 = r(<TState extends ObjectState>(state: TState): TState => state);

  expectType<AState>(useIt(read7d1));

  // =-=-=

  // @ts-expect-error
  r(<TState extends SuperState>(state: TState): TState => state);

  // =-=-=

  const readd37 = r(() => fake<ObjectState>());

  expectType<ObjectState>(useIt(readd37));

  // @ts-expect-error
  useIt(readd37, fake<any>());

  // =-=-=

  const readde2 = r();

  expectType<AState>(useIt(readde2));

  // @ts-expect-error
  useIt(readde2, fake<any>());

  // =-=-=

  const write23e = flatW();

  write23e(fake<any>(), fake<any>());

  // @ts-expect-error
  useIt(write23e, fake<any>(), fake<any>());

  // =-=-=

  const { w } = upon(fake<NestedAMug>());

  // =-=-=

  const write7eb = w();

  write7eb(fake<any>());

  // @ts-expect-error
  useIt(write7eb, fake<any>());
});
