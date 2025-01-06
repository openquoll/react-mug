import { expectType } from 'tsd';

import { fake } from '../../tests/type-utils';
import { AssignPatch, assignPatch, PassThrough, passThrough, PossiblePatch } from '../builtin';
import {
  GetIt,
  getIt,
  r as procR,
  w as procW,
  ReadProc,
  SetIt,
  setIt,
  WriteProc,
} from '../mechanism';
import { Mug, ReadSpecialOpMeta, WriteSpecialOpMeta } from '../mug';
import { ReadSpecialOp, upon, WriteSpecialOp } from './special';

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

const toolbelt = upon<AState>(fake<Mug<AState, { potentialMuggyObject: Mug<ObjectState> }>>());

const [r, w] = toolbelt;

test('ReadSpecialOp, GetIt, PassThrough', () => {
  type Read3dd = ReadSpecialOp<(state: AState) => ObjectState, AState>;

  expectType<
    (() => ObjectState) &
      ((state: AState) => ObjectState) &
      ReadSpecialOpMeta<(state: AState) => ObjectState, AState>
  >(fake<Read3dd>());

  expectType<Read3dd>(fake<ReadSpecialOp<ReadProc<(state: AState) => ObjectState>, AState>>());

  // =-=-=

  expectType<
    ((s: string) => ObjectState) &
      ((state: AState, s: string) => ObjectState) &
      ReadSpecialOpMeta<(state: AState, s: string) => ObjectState, AState>
  >(fake<ReadSpecialOp<(state: AState, s: string) => ObjectState, AState>>());

  // =-=-=

  expectType<
    (() => ObjectState) &
      ((state: ObjectState) => ObjectState) &
      ReadSpecialOpMeta<(state: ObjectState) => ObjectState, AState>
  >(fake<ReadSpecialOp<(state: ObjectState) => ObjectState, AState>>());

  // =-=-=

  type Read68a = ReadSpecialOp<<TState>(state: TState) => TState, AState>;

  expectType<
    (() => AState) &
      (<TState extends AState>(state: TState) => TState) &
      ReadSpecialOpMeta<<TState>(state: TState) => TState, AState>
  >(fake<Read68a>());

  expectType<Read68a>(fake<ReadSpecialOp<ReadProc<<TState>(state: TState) => TState>, AState>>());

  // =-=-=

  expectType<
    (() => AState) &
      (<TState extends AState>(state: TState) => TState) &
      ReadSpecialOpMeta<<TState extends AState>(state: TState) => TState, AState>
  >(fake<ReadSpecialOp<<TState extends AState>(state: TState) => TState, AState>>());

  // =-=-=

  expectType<
    (() => AState) &
      (<TState extends AState>(state: TState) => TState) &
      ReadSpecialOpMeta<<TState extends ObjectState>(state: TState) => TState, AState>
  >(fake<ReadSpecialOp<<TState extends ObjectState>(state: TState) => TState, AState>>());

  // =-=-=

  type Readc14 = ReadSpecialOp<() => ObjectState, AState>;

  expectType<
    (() => ObjectState) &
      ((state: AState) => ObjectState) &
      ReadSpecialOpMeta<() => ObjectState, AState>
  >(fake<Readc14>());

  expectType<Readc14>(fake<ReadSpecialOp<ReadProc<() => ObjectState>, AState>>());

  // =-=-=

  type Read43e = ReadSpecialOp<GetIt, AState>;

  expectType<
    (() => AState) &
      (<TState extends AState>(state: TState) => TState) &
      ReadSpecialOpMeta<GetIt, AState>
  >(fake<Read43e>());

  expectType<Read43e>(fake<ReadSpecialOp<PassThrough, AState>>());
});

test('upon#r, getIt, passThrough', () => {
  expectType<typeof toolbelt.r>(r);

  // @ts-expect-error
  r(r());

  // @ts-expect-error
  r(w());

  // =-=-=

  const readc7e = r((state) => {
    expectType<AState>(state);
    return fake<ObjectState>();
  });

  expectType<ReadSpecialOp<(state: AState) => ObjectState, AState>>(readc7e);

  expectType<typeof readc7e>(r(procR((state: AState) => fake<ObjectState>())));

  expectType<ObjectState>(readc7e());
  expectType<ObjectState>(readc7e(fake<AState>()));
  expectType<ObjectState>(readc7e(fake<BiggerState>()));

  // @ts-expect-error
  readc7e(fake<ObjectState>());

  // @ts-expect-error
  readc7e(fake<AState>(), fake<any>());

  // =-=-=

  const read9ad = r((state, s: string) => fake<ObjectState>());

  read9ad(fake<string>());
  read9ad(fake<AState>(), fake<string>());

  // @ts-expect-error
  read9ad();
  // @ts-expect-error
  read9ad(fake<AState>());

  // @ts-expect-error
  read9ad(fake<number>());
  // @ts-expect-error
  read9ad(fake<AState>(), fake<number>());

  // @ts-expect-error
  read9ad(fake<string>(), fake<any>());
  // @ts-expect-error
  read9ad(fake<AState>(), fake<string>(), fake<any>());

  // =-=-=

  const read6a9 = r((state: ObjectState) => fake<ObjectState>());

  expectType<ObjectState>(read6a9());
  expectType<ObjectState>(read6a9(fake<AState>()));
  expectType<ObjectState>(read6a9(fake<BiggerState>()));
  expectType<ObjectState>(read6a9(fake<ObjectState>()));

  // =-=-=

  // @ts-expect-error
  r((state: BiggerState) => fake<ObjectState>());

  // =-=-=

  // @ts-expect-error
  r((state: { n: number }) => fake<ObjectState>());

  // =-=-=

  const reade33 = r(<TState>(state: TState): TState => state);

  expectType<ReadSpecialOp<<TState>(state: TState) => TState, AState>>(reade33);

  expectType<typeof reade33>(r(procR(<TState>(state: TState): TState => state)));

  expectType<AState>(reade33());
  expectType<AState>(reade33(fake<AState>()));
  expectType<BiggerState>(reade33(fake<BiggerState>()));

  // @ts-expect-error
  reade33(fake<ObjectState>());

  // @ts-expect-error
  reade33(fake<AState>(), fake<any>());

  // =-=-=

  const readf8d = r(<TState extends AState>(state: TState): TState => state);

  expectType<AState>(readf8d());
  expectType<AState>(readf8d(fake<AState>()));

  // =-=-=

  const read45f = r(<TState extends ObjectState>(state: TState): TState => state);

  expectType<AState>(read45f());
  expectType<AState>(read45f(fake<AState>()));
  expectType<BiggerState>(read45f(fake<BiggerState>()));

  // @ts-expect-error
  read45f(fake<ObjectState>());

  // =-=-=

  // @ts-expect-error
  r(<TState extends BiggerState>(state: TState): TState => state);

  // =-=-=

  const readfeb = r(() => fake<ObjectState>());

  expectType<ReadSpecialOp<() => ObjectState, AState>>(readfeb);

  expectType<typeof readfeb>(r(procR(() => fake<ObjectState>())));

  expectType<ObjectState>(readfeb());
  expectType<ObjectState>(readfeb(fake<AState>()));
  expectType<ObjectState>(readfeb(fake<BiggerState>()));

  // @ts-expect-error
  readfeb(fake<ObjectState>());

  // @ts-expect-error
  readfeb(fake<AState>(), fake<any>());

  // =-=-=

  const read776 = r();

  expectType<ReadSpecialOp<GetIt, AState>>(read776);

  expectType<typeof read776>(r(getIt));

  expectType<typeof read776>(r(passThrough));

  expectType<AState>(read776());
  expectType<AState>(read776(fake<AState>()));
  expectType<BiggerState>(read776(fake<BiggerState>()));

  // @ts-expect-error
  read776(fake<ObjectState>());

  // @ts-expect-error
  read776(fake<AState>(), fake<any>());
});

test('WriteSpecialOp, SetIt, AssignPatch', () => {
  type Writea2e = WriteSpecialOp<(state: AState) => AState, AState>;

  expectType<
    (() => void) &
      ((state: AState) => AState) &
      WriteSpecialOpMeta<(state: AState) => AState, AState>
  >(fake<Writea2e>());

  expectType<Writea2e>(fake<WriteSpecialOp<WriteProc<(state: AState) => AState>, AState>>());

  // =-=-=

  expectType<
    ((s: string) => void) &
      ((state: AState, s: string) => AState) &
      WriteSpecialOpMeta<(state: AState, s: string) => AState, AState>
  >(fake<WriteSpecialOp<(state: AState, s: string) => AState, AState>>());

  // =-=-=

  expectType<
    (() => void) &
      ((state: AState) => BiggerState) &
      WriteSpecialOpMeta<(state: AState) => BiggerState, AState>
  >(fake<WriteSpecialOp<(state: AState) => BiggerState, AState>>());

  // =-=-=

  expectType<
    (() => void) &
      ((state: ObjectState) => AState) &
      WriteSpecialOpMeta<(state: ObjectState) => AState, AState>
  >(fake<WriteSpecialOp<(state: ObjectState) => AState, AState>>());

  // =-=-=

  type Write42b = WriteSpecialOp<<TState>(state: TState) => TState, AState>;

  expectType<
    (() => void) &
      (<TState extends AState>(state: TState) => TState) &
      WriteSpecialOpMeta<<TState>(state: TState) => TState, AState>
  >(fake<Write42b>());

  expectType<Write42b>(
    fake<WriteSpecialOp<WriteProc<<TState>(state: TState) => TState>, AState>>(),
  );

  // =-=-=

  expectType<
    (() => void) &
      (<TState extends AState>(state: TState) => TState) &
      WriteSpecialOpMeta<<TState extends AState>(state: TState) => TState, AState>
  >(fake<WriteSpecialOp<<TState extends AState>(state: TState) => TState, AState>>());

  // =-=-=

  expectType<
    (() => void) &
      (<TState extends AState>(state: TState) => TState) &
      WriteSpecialOpMeta<<TState extends ObjectState>(state: TState) => TState, AState>
  >(fake<WriteSpecialOp<<TState extends ObjectState>(state: TState) => TState, AState>>());

  // =-=-=

  type Write697 = WriteSpecialOp<() => AState, AState>;

  expectType<(() => void) & ((state: AState) => AState) & WriteSpecialOpMeta<() => AState, AState>>(
    fake<Write697>(),
  );

  expectType<Write697>(fake<WriteSpecialOp<WriteProc<() => AState>, AState>>());

  // =-=-=

  expectType<
    (() => void) & ((state: AState) => BiggerState) & WriteSpecialOpMeta<() => BiggerState, AState>
  >(fake<WriteSpecialOp<() => BiggerState, AState>>());

  // =-=-=

  type Write4f8 = WriteSpecialOp<SetIt, AState>;

  expectType<
    ((patch: PossiblePatch<NoInfer<AState>>) => void) &
      (<TState extends AState>(state: TState, patch: PossiblePatch<NoInfer<TState>>) => TState) &
      WriteSpecialOpMeta<SetIt, AState>
  >(fake<Write4f8>());

  expectType<Write4f8>(fake<WriteSpecialOp<AssignPatch, AState>>());
});

test('upon#w, setIt, assignPatch', () => {
  expectType<typeof toolbelt.w>(w);

  // @ts-expect-error
  w(w());

  // @ts-expect-error
  w(r());

  // =-=-=

  const write30d = w((state) => {
    expectType<AState>(state);
    return state;
  });

  expectType<WriteSpecialOp<(state: AState) => AState, AState>>(write30d);

  expectType<typeof write30d>(w(procW((state: AState) => state)));

  expectType<void>(write30d());
  expectType<AState>(write30d(fake<AState>()));
  expectType<AState>(write30d(fake<BiggerState>()));

  // @ts-expect-error
  write30d(fake<ObjectState>());

  // @ts-expect-error
  write30d(fake<AState>(), fake<any>());

  // =-=-=

  const writebb8 = w((state, s: string) => state);

  writebb8(fake<string>());
  writebb8(fake<AState>(), fake<string>());

  // @ts-expect-error
  writebb8();
  // @ts-expect-error
  writebb8(fake<AState>());

  // @ts-expect-error
  writebb8(fake<number>());
  // @ts-expect-error
  writebb8(fake<AState>(), fake<number>());

  // @ts-expect-error
  writebb8(fake<string>(), fake<any>());
  // @ts-expect-error
  writebb8(fake<AState>(), fake<string>(), fake<any>());

  // =-=-=

  const writee27 = w((state) => fake<BiggerState>());

  expectType<void>(writee27());
  expectType<BiggerState>(writee27(fake<AState>()));

  // =-=-=

  // @ts-expect-error
  w((state) => fake<ObjectState>());

  // =-=-=

  const write8b5 = w((state: ObjectState) => fake<AState>());

  expectType<void>(write8b5());
  expectType<AState>(write8b5(fake<AState>()));
  expectType<AState>(write8b5(fake<BiggerState>()));
  expectType<AState>(write8b5(fake<ObjectState>()));

  // =-=-=

  // @ts-expect-error
  w((state: BiggerState) => fake<AState>());

  // =-=-=

  // @ts-expect-error
  w((state: { n: number }) => fake<AState>());

  // =-=-=

  // @ts-expect-error
  w((state) => fake<{ n: number }>());

  // =-=-=

  const write3f7 = w(<TState>(state: TState): TState => state);

  expectType<WriteSpecialOp<<TState>(state: TState) => TState, AState>>(write3f7);

  expectType<typeof write3f7>(w(procW(<TState>(state: TState): TState => state)));

  expectType<void>(write3f7());
  expectType<AState>(write3f7(fake<AState>()));
  expectType<BiggerState>(write3f7(fake<BiggerState>()));
  // @ts-expect-error
  write3f7(fake<ObjectState>());

  // @ts-expect-error
  write3f7(fake<AState>(), fake<any>());

  // =-=-=

  const write519 = w(<TState extends AState>(state: TState): TState => state);

  expectType<void>(write519());
  expectType<AState>(write519(fake<AState>()));

  // =-=-=

  const write4fd = w(<TState extends ObjectState>(state: TState): TState => state);

  expectType<void>(write4fd());
  expectType<AState>(write4fd(fake<AState>()));
  expectType<BiggerState>(write4fd(fake<BiggerState>()));

  // @ts-expect-error
  write4fd(fake<ObjectState>());

  // =-=-=

  // @ts-expect-error
  w(<TState extends BiggerState>(state: TState): TState => state);

  // =-=-=

  const writed5e = w(() => fake<AState>());

  expectType<WriteSpecialOp<() => AState, AState>>(writed5e);

  expectType<typeof writed5e>(w(procW(() => fake<AState>())));

  expectType<void>(writed5e());
  expectType<AState>(writed5e(fake<AState>()));
  expectType<AState>(writed5e(fake<BiggerState>()));

  // @ts-expect-error
  writed5e(fake<ObjectState>());

  // @ts-expect-error
  writed5e(fake<AState>(), fake<any>());

  // =-=-=

  const write6bb = w(() => fake<BiggerState>());

  expectType<void>(write6bb());
  expectType<BiggerState>(write6bb(fake<AState>()));

  // @ts-expect-error
  writed5e(fake<AState>(), fake<any>());

  // =-=-=

  // @ts-expect-error
  w(() => fake<ObjectState>());

  // =-=-=

  const write8db = w();

  expectType<WriteSpecialOp<SetIt, AState>>(write8db);

  expectType<typeof write8db>(w(setIt));

  expectType<typeof write8db>(w(assignPatch));

  const patch422 = { potentialMuggyObject: { o: { s: fake<string>() } } };

  expectType<void>(write8db(patch422));
  expectType<AState>(write8db(fake<AState>(), patch422));
  expectType<BiggerState>(write8db(fake<BiggerState>(), patch422));

  // @ts-expect-error
  write8db(fake<ObjectState>(), patch422);

  // @ts-expect-error
  write8db();

  // @ts-expect-error
  write8db(fake<AState>(), patch422, fake<any>());
});
