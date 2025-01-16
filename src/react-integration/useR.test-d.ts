import { expectAssignable, expectType } from 'tsd';

import { fake } from '../../tests/type-utils';
import { r as procR, w as procW } from '../mechanism';
import { Mug, MugLike, PossibleMug, PossibleMugLike, WithAttachments } from '../mug';
import { onto, upon } from '../ops';
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

  const { r: specialOpR } = upon<AState>(fake<CompositeAMug>());

  // =-=-=

  const read4be = specialOpR((state) => fake<ObjectState>());

  expectType<ObjectState>(useR(read4be));

  // @ts-expect-error
  useR(read4be, fake<any>());

  // =-=-=

  const read95a = specialOpR((state, s: string) => fake<ObjectState>());

  expectType<ObjectState>(useR(read95a, fake<string>()));

  // @ts-expect-error
  useR(read95a);

  // @ts-expect-error
  useR(read95a, fake<number>());

  // @ts-expect-error
  useR(read95a, fake<string>(), fake<any>());

  // =-=-=

  const read811 = specialOpR((state: ObjectState) => state);

  expectType<ObjectState>(useR(read811));

  // =-=-=

  // @ts-expect-error
  specialOpR((state: BiggerState) => fake<ObjectState>());

  // =-=-=

  // @ts-expect-error
  specialOpR((state: { n: number }) => fake<ObjectState>());

  // =-=-=

  const read5ce = specialOpR(<TState>(state: TState) => state);

  expectType<AState>(useR(read5ce));

  // @ts-expect-error
  useR(read5ce, fake<any>());

  // =-=-=

  const read229 = specialOpR(<TState>(state: TState, s: string) => state);

  useR(read229, fake<string>());

  // @ts-expect-error
  useR(read229);

  // @ts-expect-error
  useR(read229, fake<number>());

  // @ts-expect-error
  useR(read229, fake<string>(), fake<any>());

  // =-=-=

  const read012 = specialOpR(<TState extends AState>(state: TState): TState => state);

  expectType<AState>(useR(read012));

  // =-=-=

  const read7d1 = specialOpR(<TState extends ObjectState>(state: TState): TState => state);

  expectType<AState>(useR(read7d1));

  // =-=-=

  // @ts-expect-error
  specialOpR(<TState extends BiggerState>(state: TState): TState => state);

  // =-=-=

  const readd37 = specialOpR(() => fake<ObjectState>());

  expectType<ObjectState>(useR(readd37));

  // @ts-expect-error
  useR(readd37, fake<any>());

  // =-=-=

  const readde2 = specialOpR();

  expectType<AState>(useR(readde2));

  // @ts-expect-error
  useR(readde2, fake<any>());

  // =-=-=

  const { r: generalR } = onto<AState>();

  // =-=-=

  const readde7 = generalR((state) => fake<ObjectState>());

  expectType<ObjectState>(useR(readde7, fake<AState>()));
  expectType<ObjectState>(useR(readde7, fake<AMug>()));
  expectType<ObjectState>(useR(readde7, fake<CompositeAMug>()));
  expectType<ObjectState>(useR(readde7, fake<AMugLike>()));
  expectType<ObjectState>(useR(readde7, fake<PossibleAMug>()));
  expectType<ObjectState>(useR(readde7, fake<PossibleAMugLike>()));
  expectType<ObjectState>(useR(readde7, fake<DirtyAMug>()));
  expectType<ObjectState>(useR(readde7, fake<BiggerState>()));

  // @ts-expect-error
  useR(readde7, fake<ObjectState>());

  // @ts-expect-error
  useR(readde7);

  // @ts-expect-error
  useR(readde7, fake<AState>(), fake<any>());

  // =-=-=

  const read43e = generalR((state, s: string) => fake<ObjectState>());

  useR(read43e, fake<AState>(), fake<string>());

  // @ts-expect-error
  useR(read43e, fake<AState>());

  // @ts-expect-error
  useR(read43e, fake<AState>(), fake<number>());

  // @ts-expect-error
  useR(read43e, fake<AState>(), fake<string>(), fake<any>());

  // =-=-=

  const read492 = generalR((state: ObjectState) => state);

  expectType<ObjectState>(useR(read492, fake<AState>()));

  // =-=-=

  // @ts-expect-error
  generalR((state: BiggerState) => fake<ObjectState>());

  // =-=-=

  // @ts-expect-error
  generalR((state: { n: number }) => fake<ObjectState>());

  // =-=-=

  const readeb1 = generalR(<TState>(state: TState) => state);

  expectType<AState>(useR(readeb1, fake<AState>()));
  expectType<AState>(useR(readeb1, fake<AMug>()));
  expectType<AState>(useR(readeb1, fake<CompositeAMug>()));
  expectType<AState>(useR(readeb1, fake<AMugLike>()));

  const redd = useR(readeb1, fake<PossibleAMug>());
  expectAssignable<AState>(redd);
  expectAssignable<typeof redd>(fake<AState>());

  const r5af = useR(readeb1, fake<PossibleAMugLike>());
  expectAssignable<AState>(r5af);
  expectAssignable<typeof r5af>(fake<AState>());

  expectType<AState>(useR(readeb1, fake<DirtyAMug>()));
  expectType<BiggerState>(useR(readeb1, fake<BiggerState>()));

  // @ts-expect-error
  useR(readeb1, fake<ObjectState>());

  // @ts-expect-error
  useR(readeb1);

  // @ts-expect-error
  useR(readeb1, fake<AState>(), fake<any>());

  // =-=-=

  const reada24 = generalR(<TState>(state: TState, s: string) => state);

  useR(reada24, fake<AState>(), fake<string>());

  // @ts-expect-error
  useR(reada24, fake<AState>());

  // @ts-expect-error
  useR(reada24, fake<AState>(), fake<number>());

  // @ts-expect-error
  useR(reada24, fake<AState>(), fake<string>(), fake<any>());

  // =-=-=

  const readb26 = generalR(<TState extends AState>(state: TState): TState => state);

  expectType<AState>(useR(readb26, fake<AState>()));

  // =-=-=

  const readd63 = generalR(<TState extends ObjectState>(state: TState): TState => state);

  expectType<AState>(useR(readd63, fake<AState>()));

  // =-=-=

  // @ts-expect-error
  generalR(<TState extends BiggerState>(state: TState): TState => state);

  // =-=-=

  const read6ea = generalR(() => fake<ObjectState>());

  expectType<ObjectState>(useR(read6ea));
  expectType<ObjectState>(useR(read6ea, fake<unknown>()));

  // @ts-expect-error
  useR(read6ea, fake<unknown>(), fake<any>());

  // =-=-=

  const readad2 = generalR();

  expectType<AState>(useR(readad2, fake<AState>()));
  expectType<AState>(useR(readad2, fake<AMug>()));
  expectType<AState>(useR(readad2, fake<CompositeAMug>()));
  expectType<AState>(useR(readad2, fake<AMugLike>()));

  const r538 = useR(readad2, fake<PossibleAMug>());
  expectAssignable<AState>(r538);
  expectAssignable<typeof r538>(fake<AState>());

  const rf21 = useR(readad2, fake<PossibleAMugLike>());
  expectAssignable<AState>(rf21);
  expectAssignable<typeof rf21>(fake<AState>());

  expectType<AState>(useR(readad2, fake<DirtyAMug>()));
  expectType<BiggerState>(useR(readad2, fake<BiggerState>()));

  // @ts-expect-error
  useR(readad2, fake<ObjectState>());

  // @ts-expect-error
  useR(readad2);

  // @ts-expect-error
  useR(readad2, fake<AState>(), fake<any>());

  // =-=-=

  const readf23 = procR(<TState>(state: TState): TState => state);

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

  const read35a = procR(<TState>(state: TState, s: string): TState => state);

  useR(read35a, fake<AState>(), fake<string>());

  // @ts-expect-error
  useR(read35a, fake<AState>());

  // @ts-expect-error
  useR(read35a, fake<AState>(), fake<number>());

  // @ts-expect-error
  useR(read35a, fake<AState>(), fake<string>(), fake<any>());

  // =-=-=

  const read69c = procR(<TState extends AState>(state: TState): TState => state);

  expectType<AState>(useR(read69c, fake<AState>()));

  expectType<BiggerState>(useR(read69c, fake<BiggerState>()));

  // @ts-expect-error
  useR(read69c, fake<ObjectState>());

  // =-=-=

  const read198 = procR((state: AState) => fake<ObjectState>());

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

  const readdbb = procR((state: AState, s: string) => fake<ObjectState>());

  useR(readdbb, fake<AState>(), fake<string>());

  // @ts-expect-error
  useR(readdbb, fake<AState>());

  // @ts-expect-error
  useR(readdbb, fake<AState>(), fake<number>());

  // @ts-expect-error
  useR(readdbb, fake<AState>(), fake<string>(), fake<any>());

  // =-=-=

  const read81f = procR(() => fake<AState>());

  expectType<AState>(useR(read81f));
  expectType<AState>(useR(read81f, fake<unknown>()));

  // @ts-expect-error
  useR(read81f, fake<unknown>(), fake<any>());

  // =-=-=

  const { w } = upon(fake<CompositeAMug>());

  // =-=-=

  const write23e = procW();

  write23e(fake<any>(), fake<any>());

  // @ts-expect-error
  useR(write23e, fake<any>(), fake<any>());

  // =-=-=

  const write7eb = w();

  write7eb(fake<any>());

  // @ts-expect-error
  useR(write7eb, fake<any>());
});
