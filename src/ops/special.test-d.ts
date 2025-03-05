import { expectType } from 'tsd';

import { fake } from '../../tests/type-utils';
import { AssignPatch, assignPatch, PassThrough, passThrough, PossiblePatch } from '../builtin-fns';
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
import { Generalness, Mug, PossibleMugLike, ReadSpecialOpMeta, WriteSpecialOpMeta } from '../mug';
import { onto, ReadGeneralOp, WriteGeneralOp } from './general';
import { ReadSpecialOp, SpecialTrait, upon, WriteSpecialOp } from './special';

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

const [r, w, s] = toolbelt;

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
      ((state: AState) => ObjectState) &
      ReadSpecialOpMeta<(state: ObjectState) => ObjectState, AState>
  >(fake<ReadSpecialOp<(state: ObjectState) => ObjectState, AState>>());

  // =-=-=

  fake<ReadSpecialOp<(state: BiggerState) => ObjectState, AState>>();

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

  fake<ReadSpecialOp<<TState extends BiggerState>(state: TState) => TState, AState>>();

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

  // @ts-expect-error
  read6a9(fake<ObjectState>());

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
      (<TState extends AState>(state: TState) => TState) &
      WriteSpecialOpMeta<(state: AState) => AState, AState>
  >(fake<Writea2e>());

  expectType<Writea2e>(fake<WriteSpecialOp<WriteProc<(state: AState) => AState>, AState>>());

  // =-=-=

  expectType<
    ((s: string) => void) &
      (<TState extends AState>(state: TState, s: string) => TState) &
      WriteSpecialOpMeta<(state: AState, s: string) => AState, AState>
  >(fake<WriteSpecialOp<(state: AState, s: string) => AState, AState>>());

  // =-=-=

  expectType<
    (() => void) &
      (<TState extends AState>(state: TState) => TState) &
      WriteSpecialOpMeta<(state: AState) => BiggerState, AState>
  >(fake<WriteSpecialOp<(state: AState) => BiggerState, AState>>());

  // =-=-=

  expectType<
    (() => void) &
      (<TState extends AState>(state: TState) => TState) &
      WriteSpecialOpMeta<(state: AState) => ObjectState, AState>
  >(fake<WriteSpecialOp<(state: AState) => ObjectState, AState>>());

  // =-=-=

  expectType<
    (() => void) &
      (<TState extends AState>(state: TState) => TState) &
      WriteSpecialOpMeta<(state: ObjectState) => AState, AState>
  >(fake<WriteSpecialOp<(state: ObjectState) => AState, AState>>());

  // =-=-=

  expectType<
    (() => void) &
      (<TState extends AState>(state: TState) => TState) &
      WriteSpecialOpMeta<(state: ObjectState) => ObjectState, AState>
  >(fake<WriteSpecialOp<(state: ObjectState) => ObjectState, AState>>());

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

  fake<WriteSpecialOp<<TState extends BiggerState>(state: TState) => TState, AState>>();

  // =-=-=

  type Write697 = WriteSpecialOp<() => AState, AState>;

  expectType<
    (() => void) &
      (<TState extends AState>(state: TState) => TState) &
      WriteSpecialOpMeta<() => AState, AState>
  >(fake<Write697>());

  expectType<Write697>(fake<WriteSpecialOp<WriteProc<() => AState>, AState>>());

  // =-=-=

  expectType<
    (() => void) &
      (<TState extends AState>(state: TState) => TState) &
      WriteSpecialOpMeta<() => BiggerState, AState>
  >(fake<WriteSpecialOp<() => BiggerState, AState>>());

  // =-=-=

  expectType<
    (() => void) &
      (<TState extends AState>(state: TState) => TState) &
      WriteSpecialOpMeta<() => ObjectState, AState>
  >(fake<WriteSpecialOp<() => ObjectState, AState>>());

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
  expectType<BiggerState>(write30d(fake<BiggerState>()));

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
  expectType<AState>(writee27(fake<AState>()));
  expectType<BiggerState>(writee27(fake<BiggerState>()));

  // @ts-expect-error
  writee27(fake<ObjectState>());

  // =-=-=

  const write72b = w((state) => fake<ObjectState>());

  expectType<void>(write72b());
  expectType<AState>(write72b(fake<AState>()));
  expectType<BiggerState>(write72b(fake<BiggerState>()));

  // @ts-expect-error
  write72b(fake<ObjectState>());

  // =-=-=

  const write8b5 = w((state: ObjectState) => fake<AState>());

  expectType<void>(write8b5());
  expectType<AState>(write8b5(fake<AState>()));
  expectType<BiggerState>(write8b5(fake<BiggerState>()));

  // @ts-expect-error
  write8b5(fake<ObjectState>());

  // =-=-=

  const write45c = w((state: ObjectState) => fake<ObjectState>());

  expectType<void>(write45c());
  expectType<AState>(write45c(fake<AState>()));
  expectType<BiggerState>(write45c(fake<BiggerState>()));

  // @ts-expect-error
  write45c(fake<ObjectState>());

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
  expectType<BiggerState>(write519(fake<BiggerState>()));

  // @ts-expect-error
  write519(fake<ObjectState>());

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
  expectType<BiggerState>(writed5e(fake<BiggerState>()));

  // @ts-expect-error
  writed5e(fake<ObjectState>());

  // @ts-expect-error
  writed5e(fake<AState>(), fake<any>());

  // =-=-=

  const write6bb = w(() => fake<BiggerState>());

  expectType<void>(write6bb());
  expectType<AState>(write6bb(fake<AState>()));
  expectType<BiggerState>(write6bb(fake<BiggerState>()));

  // @ts-expect-error
  write6bb(fake<ObjectState>());

  // @ts-expect-error
  write6bb(fake<AState>(), fake<any>());

  // =-=-=

  const write5a0 = w(() => fake<ObjectState>());

  expectType<void>(write5a0());
  expectType<AState>(write5a0(fake<AState>()));
  expectType<BiggerState>(write5a0(fake<BiggerState>()));

  // @ts-expect-error
  write5a0(fake<ObjectState>());

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

test('SpecialTrait', () => {
  type SSb54 = SpecialTrait<
    {
      read316: ReadGeneralOp<(state: ObjectState) => string, ObjectState>;
      read03d: ReadGeneralOp<<TState>(state: TState) => TState, ObjectState>;
      read25d: ReadGeneralOp<() => string, ObjectState>;
      read04e: ReadGeneralOp<GetIt, ObjectState>;

      write80e: WriteGeneralOp<(state: ObjectState) => ObjectState, ObjectState>;
      write65d: WriteGeneralOp<<TState>(state: TState) => TState, ObjectState>;
      write9fb: WriteGeneralOp<() => ObjectState, ObjectState>;
      writece8: WriteGeneralOp<SetIt, ObjectState>;

      execae7: ((mug: PossibleMugLike<ObjectState>) => Promise<void>) & Generalness<ObjectState>;

      readProc: GetIt;
      writeProc: SetIt;
      n: number;
      o: { n: number };
    },
    AState
  >;

  expectType<{
    read316: ReadSpecialOp<(state: ObjectState) => string, AState>;
    read03d: ReadSpecialOp<<TState>(state: TState) => TState, AState>;
    read25d: ReadSpecialOp<() => string, AState>;
    read04e: ReadSpecialOp<GetIt, AState>;

    write80e: WriteSpecialOp<(state: ObjectState) => ObjectState, AState>;
    write65d: WriteSpecialOp<<TState>(state: TState) => TState, AState>;
    write9fb: WriteSpecialOp<() => ObjectState, AState>;
    writece8: WriteSpecialOp<SetIt, AState>;

    execae7: () => Promise<void>;

    readProc: GetIt;
    writeProc: SetIt;
    n: number;
    o: { n: number };
  }>(fake<SSb54>());
});

test('upon#s', () => {
  expectType<typeof toolbelt.s>(s);

  // =-=-=

  const [generalR, generalW, x] = onto<ObjectState>();

  const GSM354 = {
    read3e8: generalR((state) => fake<string>()),
    read0b8: generalR(<TState>(state: TState) => state),
    read709: generalR(() => fake<string>()),
    read012: generalR(),

    writec83: generalW((state) => state),
    writea26: generalW(<TState>(state: TState) => state),
    write956: generalW(() => fake<ObjectState>()),
    writefe9: generalW(),

    exec354: x(async (mug) => {}),

    readProc: getIt,
    writeProc: setIt,
    n: fake<number>(),
    o: { n: fake<number>() },
  };

  const {
    read3e8,
    read0b8,
    read709,
    read012,

    writec83,
    writea26,
    write956,
    writefe9,

    exec354,

    readProc,
    writeProc,
    n,
    o,
  } = s(GSM354);

  // =-=-=

  expectType<ReadSpecialOp<(state: ObjectState) => string, AState>>(read3e8);

  expectType<string>(read3e8());
  expectType<string>(read3e8(fake<AState>()));
  expectType<string>(read3e8(fake<BiggerState>()));

  // @ts-expect-error
  expectType<string>(read3e8(fake<ObjectState>()));

  // @ts-expect-error
  read3e8(fake<AState>(), fake<any>());

  // =-=-=

  expectType<ReadSpecialOp<<TState>(state: TState) => TState, AState>>(read0b8);

  expectType<AState>(read0b8());
  expectType<AState>(read0b8(fake<AState>()));
  expectType<BiggerState>(read0b8(fake<BiggerState>()));

  // @ts-expect-error
  read0b8(fake<ObjectState>());

  // @ts-expect-error
  read0b8(fake<AState>(), fake<any>());

  // =-=-=

  expectType<ReadSpecialOp<() => string, AState>>(read709);

  expectType<string>(read709());
  expectType<string>(read709(fake<AState>()));
  expectType<string>(read709(fake<BiggerState>()));

  // @ts-expect-error
  read709(fake<ObjectState>());

  // @ts-expect-error
  read709(fake<AState>(), fake<any>());

  // =-=-=

  expectType<ReadSpecialOp<GetIt, AState>>(read012);

  expectType<AState>(read012());
  expectType<AState>(read012(fake<AState>()));
  expectType<BiggerState>(read012(fake<BiggerState>()));

  // @ts-expect-error
  read012(fake<ObjectState>());

  // @ts-expect-error
  read012(fake<AState>(), fake<any>());

  // =-=-=

  expectType<WriteSpecialOp<(state: ObjectState) => ObjectState, AState>>(writec83);

  expectType<void>(writec83());
  expectType<AState>(writec83(fake<AState>()));
  expectType<BiggerState>(writec83(fake<BiggerState>()));

  // @ts-expect-error
  writec83(fake<ObjectState>());

  // @ts-expect-error
  writec83(fake<AState>(), fake<any>());

  // =-=-=

  expectType<WriteSpecialOp<<TState>(state: TState) => TState, AState>>(writea26);

  expectType<void>(writea26());
  expectType<AState>(writea26(fake<AState>()));
  expectType<BiggerState>(writea26(fake<BiggerState>()));

  // @ts-expect-error
  writea26(fake<ObjectState>());

  // @ts-expect-error
  writea26(fake<AState>(), fake<any>());

  // =-=-=

  expectType<WriteSpecialOp<() => ObjectState, AState>>(write956);

  expectType<void>(write956());
  expectType<AState>(write956(fake<AState>()));
  expectType<BiggerState>(write956(fake<BiggerState>()));

  // @ts-expect-error
  write956(fake<ObjectState>());

  // @ts-expect-error
  write956(fake<AState>(), fake<any>());

  // =-=-=

  expectType<WriteSpecialOp<SetIt, AState>>(writefe9);

  const patch550 = { s: fake<string>() };

  expectType<void>(writefe9(patch550));
  expectType<AState>(writefe9(fake<AState>(), patch550));
  expectType<BiggerState>(writefe9(fake<BiggerState>(), patch550));

  // @ts-expect-error
  writefe9(fake<ObjectState>(), patch550);

  // @ts-expect-error
  writefe9();

  // @ts-expect-error
  writefe9(fake<AState>(), patch550, fake<any>());

  // =-=-=

  expectType<() => Promise<void>>(exec354);

  // =-=-=

  expectType<GetIt>(readProc);

  expectType<SetIt>(writeProc);

  expectType<number>(n);

  expectType<{ n: number }>(o);

  // =-=-=

  // @ts-expect-error
  s({ read: onto<BiggerState>().r() });

  // @ts-expect-error
  s({ write: onto<BiggerState>().w() });

  // =-=-=

  // @ts-expect-error
  s({ read: onto<{ n: number }>().r() });

  // @ts-expect-error
  s({ write: onto<{ n: number }>().w() });
});
