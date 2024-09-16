import { expectAssignable, expectType } from 'tsd';

import { fake, from } from '../tests/type-utils';
import { Mug, MugLike, PossibleMugLike } from './mug';
import { r, w } from './rw';

interface ObjectState {
  s: string;
  o: {
    s: string;
  };
}

interface AState extends ObjectState {
  potentialMuggyObject: ObjectState;
}

test('r', () => {
  const readbf7 = r(<TState>(state: TState): TState => state);

  const r992 = readbf7(fake<AState>());
  expectType<AState>(r992);

  const ra9b = readbf7(fake<Mug<AState>>());
  expectType<AState>(ra9b);

  const rf2c = readbf7(fake<Mug<AState, { potentialMuggyObject: Mug<ObjectState> }>>());
  expectType<AState>(rf2c);

  const r2a1 = readbf7(fake<MugLike<AState, { potentialMuggyObject: Mug<ObjectState> }>>());
  expectType<AState>(r2a1);

  const rc79 = readbf7(fake<PossibleMugLike<AState>>());
  expectAssignable<typeof rc79>(from<AState>());
  expectAssignable<AState>(from<typeof rc79>());

  const r251 = readbf7(fake<ObjectState>());
  expectType<ObjectState>(r251);

  // @ts-expect-error
  readbf7();

  // =-=-=

  const readebe = r(<TState>(state: TState, s: string): TState => state);

  readebe(fake<AState>(), fake<string>());

  // @ts-expect-error
  readebe(fake<AState>());

  // @ts-expect-error
  readebe(fake<AState>(), fake<number>());

  // @ts-expect-error
  readebe(fake<AState>(), fake<string>(), fake<any>());

  // =-=-=

  const readc82 = r((aState: AState) => fake<ObjectState>());

  const rd57 = readc82(fake<AState>());
  expectType<ObjectState>(rd57);

  const r1b7 = readc82(fake<Mug<AState>>());
  expectType<ObjectState>(r1b7);

  const rdee = readc82(fake<Mug<AState, { potentialMuggyObject: Mug<ObjectState> }>>());
  expectType<ObjectState>(rdee);

  const rcc4 = readc82(fake<MugLike<AState, { potentialMuggyObject: Mug<ObjectState> }>>());
  expectType<ObjectState>(rcc4);

  const r65c = readc82(fake<PossibleMugLike<AState>>());
  expectType<ObjectState>(r65c);

  // @ts-expect-error
  readc82(fake<ObjectState>());

  // @ts-expect-error
  readc82();

  // =-=-=

  const read51c = r(<TState extends ObjectState>(state: TState) => fake<ObjectState>());

  const r026 = read51c(fake<AState>());
  expectType<ObjectState>(r026);

  // @ts-expect-error
  writed09(fake<{ s: string }>());

  // =-=-=

  const read23e = r((aState: AState, s: string): ObjectState => {
    return aState.potentialMuggyObject;
  });

  read23e(fake<AState>(), fake<string>());

  // @ts-expect-error
  read23e(fake<AState>());

  // @ts-expect-error
  read23e(fake<AState>(), fake<number>());

  // @ts-expect-error
  read23e(fake<AState>(), fake<string>(), fake<any>());

  // =-=-=

  const readc5d = r(() => fake<number>());
  expectType<number>(readc5d());

  // @ts-expect-error
  readc5d(fake<any>());
});

test('w', () => {
  const write73d = w(<TState>(state: TState): TState => state);

  const r022 = write73d(fake<AState>());
  expectType<AState>(r022);

  const r1aa = write73d(fake<Mug<AState>>());
  expectType<Mug<AState>>(r1aa);

  const rb36 = write73d(fake<Mug<AState, { potentialMuggyObject: Mug<ObjectState> }>>());
  expectType<Mug<AState, { potentialMuggyObject: Mug<ObjectState> }>>(rb36);

  const ra96 = write73d(fake<MugLike<AState, { potentialMuggyObject: Mug<ObjectState> }>>());
  expectType<MugLike<AState, { potentialMuggyObject: Mug<ObjectState> }>>(ra96);

  const re28 = write73d(fake<PossibleMugLike<AState>>());
  expectType<PossibleMugLike<AState>>(re28);

  const rba4 = write73d(fake<ObjectState>());
  expectType<ObjectState>(rba4);

  // @ts-expect-error
  write73d();

  // =-=-=

  const write8e6 = w(<TState>(state: TState, s: string): TState => state);

  write8e6(fake<AState>(), fake<string>());

  // @ts-expect-error
  write8e6(fake<AState>());

  // @ts-expect-error
  write8e6(fake<AState>(), fake<number>());

  // @ts-expect-error
  write8e6(fake<AState>(), fake<string>(), fake<any>());

  // =-=-=

  const writed09 = w(<TState extends ObjectState>(state: TState): TState => state);

  const rb1e = writed09(fake<AState>());
  expectType<AState>(rb1e);

  // @ts-expect-error
  writed09(fake<{ s: string }>());

  // =-=-=

  const writecdd = w((aState: AState) => aState);

  const r2cb = writecdd(fake<AState>());
  expectType<AState>(r2cb);

  const r7a2 = writecdd(fake<Mug<AState>>());
  expectType<Mug<AState>>(r7a2);

  const r62d = writecdd(fake<Mug<AState, { potentialMuggyObject: Mug<ObjectState> }>>());
  expectType<Mug<AState, { potentialMuggyObject: Mug<ObjectState> }>>(r62d);

  const r779 = writecdd(fake<MugLike<AState, { potentialMuggyObject: Mug<ObjectState> }>>());
  expectType<MugLike<AState, { potentialMuggyObject: Mug<ObjectState> }>>(r779);

  const r619 = writecdd(fake<PossibleMugLike<AState>>());
  expectType<PossibleMugLike<AState>>(r619);

  // @ts-expect-error
  writecdd(fake<ObjectState>());

  // @ts-expect-error
  writecdd();

  // =-=-=

  const write692 = w((aState: AState, s: string) => aState);

  write692(fake<AState>(), fake<string>());

  // @ts-expect-error
  write692(fake<AState>());

  // @ts-expect-error
  write692(fake<AState>(), fake<number>());

  // @ts-expect-error
  write692(fake<AState>(), fake<string>(), fake<any>());

  // =-=-=

  const write181 = w(() => fake<number>());
  expectType<number>(write181());
  expectType<number>(write181(fake<number>()));
  expectType<Mug<number>>(write181(fake<Mug<number>>()));

  // @ts-expect-error
  expectType<number>(write181(fake<string>()));

  // =-=-=

  // @ts-expect-error
  w((aState: AState) => fake<ObjectState>());
});
