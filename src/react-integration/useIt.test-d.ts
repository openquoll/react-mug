import { expectAssignable, expectType } from 'tsd';

import { fake, from } from '../../tests/type-utils';
import { upon } from '../actions';
import { _readFn, _readOp, construction, Mug, MugLike, PossibleMug, PossibleMugLike } from '../mug';
import { r, w } from '../op-mech';
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

interface DirtyAMug {
  [construction]: {
    s: string;
    o: {
      s: string;
    };
    potentialMuggyObject: {
      [construction]: ObjectState;
      b: boolean;
    };
  };
  b: boolean;
}

test('useIt', () => {
  const readf23 = r(<TState>(state: TState): TState => state);

  expectType<AState>(useIt(readf23, fake<AState>()));
  expectType<AState>(useIt(readf23, fake<AMug>()));
  expectType<AState>(useIt(readf23, fake<NestedAMug>()));
  expectType<AState>(useIt(readf23, fake<AMugLike>()));

  const r711 = useIt(readf23, fake<PossibleAMug>());
  expectAssignable<AState>(r711);
  expectAssignable<typeof r711>(from<AState>());

  const r649 = useIt(readf23, fake<PossibleAMugLike>());
  expectAssignable<AState>(r649);
  expectAssignable<typeof r649>(from<AState>());

  expectType<AState>(useIt(readf23, fake<DirtyAMug>()));
  expectType<ObjectState>(useIt(readf23, fake<ObjectState>()));
  expectType<SuperState>(useIt(readf23, fake<SuperState>()));

  // @ts-expect-error
  useIt(readf23);

  // @ts-expect-error
  useIt();

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

  const read69c = r(<TState extends AState>(state: TState): TState => state);

  expectType<AState>(useIt(read69c, fake<AState>()));

  expectType<SuperState>(useIt(read69c, fake<SuperState>()));

  // @ts-expect-error
  useIt(read69c, fake<ObjectState>());

  // =-=-=

  const read81f = r(() => fake<AState>());

  expectType<AState>(useIt(read81f));
  expectType<AState>(useIt(read81f, fake<unknown>()));

  // =-=-=

  const [_r] = upon(fake<NestedAMug>());

  // =-=-=

  const readde2 = _r();

  expectType<AState>(useIt(readde2));

  // =-=-=

  const read4be = _r((state) => fake<ObjectState>());

  expectType<ObjectState>(useIt(read4be));

  // =-=-=

  const read95a = _r((state, s: string) => fake<ObjectState>());

  useIt(read95a, fake<string>());

  // @ts-expect-error
  useIt(read95a);

  // @ts-expect-error
  useIt(read95a, fake<number>());

  // @ts-expect-error
  useIt(read95a, fake<string>(), fake<any>());

  // =-=-=

  const write23e = w((state: AState) => state);

  // @ts-expect-error
  useIt(write23e, fake<AState>());

  // =-=-=

  const [, _w] = upon(fake<NestedAMug>());

  // =-=-=

  const write7eb = _w();

  // @ts-expect-error
  useIt(write7eb);
});
