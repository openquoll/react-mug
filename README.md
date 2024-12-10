# React Mug

![](https://github.com/user-attachments/assets/f47bc69e-fc3f-4465-96af-9aaff65c79ae)

_[Intro](#2e62a5f) &nbsp;•&nbsp; [Installation](#18d3c22) &nbsp;•&nbsp; [Features](#e7571e4) &nbsp;•&nbsp; [Tips](#2d0bd16) &nbsp;•&nbsp; [FAQs](#2d56cc3) &nbsp;•&nbsp; [License](#b0280eb)_

# <span id="2e62a5f">Intro</span>

This library provides an incremental evolution from reducer-based state management aiming to minimize conceptual burdens with full compatibility.

With it, the typical reducer-based practice remains doable(. See also [the app-level practice](#a6bd391)):

```ts
// CounterReducer.ts
import { construction, Mug, upon } from 'react-mug';

export interface CounterState {
  value: number;
}

export const INCREMENT = 'Counter/Increment';

export const RESET = 'Counter/Reset';

export type CounterAction = { type: typeof INCREMENT; step: number } | { type: typeof RESET };

export const initialCounterState: CounterState = {
  value: 0,
};

export function counterReducer(state: CounterState, action: CounterAction): CounterState {
  switch (action.type) {
    case INCREMENT:
      return { value: state.value + action.step };
    case RESET:
      return initialCounterState;
    default:
      return state;
  }
}

const counterMug = { [construction]: initialCounterState };

const { w } = upon(counterMug);

export const dispatch = w(counterReducer);

// <button onClick={() => dispatch({ type: INCREMENT, step: 1 })}>Increment 1</button>
```

But a dispatch-free way can take place - write actions can be created from pure functions and directly called:

```tsx
// CounterMug.ts
import { construction, upon } from 'react-mug';

export interface CounterState {
  value: number;
}

export const counterMug: Mug<CounterState> = {
  [construction]: {
    value: 0,
  },
};

const { w } = upon(counterMug);

export const increment = w((state, step: number) => ({ value: state.value + step }));

export const reset = w(() => counterMug[construction]);
```

```tsx
// CounterControl.tsx
import { increment, reset } from './CounterMug';

function CounterControl() {
  return (
    <>
      <button onClick={() => increment(1)}>Increment 1</button>
      <button onClick={() => increment(5)}>Increment 5</button>
      <button onClick={reset}>Reset</button>
    </>
  );
}
```

Plus, read actions can be created similarly and hooked into React components with zero setup:

```diff
// CounterMug.ts

...

-const { w } = upon(counterMug);
+const [r, w] = upon(counterMug);
+
+export const getValue = r((state) => state.value);

...
```

```tsx
// CounterDisplay.tsx
import { useIt } from 'react-mug';

import { getValue } from './CounterMug';

export function CounterDisplay() {
  const value = useIt(getValue);
  return <p>Value: {value}</p>;
}
```

Meanwhile, the actions of both types can be easily tested in functional style:

```tsx
// CounterMug.test.ts
import { pure } from 'react-mug';

import { getValue, increment } from './CounterMug ';

describe('increment', () => {
  test('changes value by step', () => {
    expect(pure(increment)({ value: 1 }, 2)).toStrictEqual({ value: 2 });
  });
});

describe('getValue', () => {
  test('returns value', () => {
    expect(pure(getValue)({ value: 1 })).toBe(1);
  });
});
```

Still pure, less code ☕️.

# <span id="18d3c22">Installation</span>

```sh
npm i react-mug
```

# <span id="e7571e4">Features</span>

- [State containers creation by plain objects](#cad503d).
- [Functional state access without `dispatch`](#31e08c7).
- [Independence from React hooks](#6658073).
- [Zero setup for use in React components](#35ec17a).
- [Easy tests](#6f5a8fd).
- [State composition](#09d0796).
- [Full compatibility with the typical reducer-based practice](#a6bd391).
- [Strong support for TypeScript](#3d3b9ce).

## <span id="cad503d">State containers creation by plain objects</span>

A state container is simply a plain object with a conventional name suffix `Mug` denoting its purpose and a top-level field `construction` referencing its initial value:

```tsx
import { construction } from 'react-mug';

const aMug = {
  [construction]: {
    /* fields */
  },
};
```

For brevity, a state container is called a mug.

A mug's state type can be either implicitly inferred as above or explicitly declared as below:

```tsx
import { construction, Mug } from 'react-mug';

interface AState {
  /* fields */
}

const aMug: Mug<AState> = {
  [construction]: {
    /* fields */
  },
};
```

## <span id="31e08c7">Functional state access without `dispatch`</span>

Actions can be created from pure functions as invokables to access states by being directly called rather than dispatched.

They can be created with the helpers from calling `upon`:

```tsx
import { upon } from 'react-mug';

const [r, w] = upon(aMug);
```

```tsx
// If only to create write actions:
const { w } = upon(aMug);

// If only to create read actions:
const { r } = upon(aMug);
```

`w` can create write actions from a pure function that takes the mug's current state, optionally along with additional parameters, and produces the mug's next state:

```tsx
const write = w((state, param1: string, param2: string) => ({
  ...state,
  /* fields to write */
}));

// write('param1', 'param2');
```

And if called without pure functions, it can create a merge-patch write action:

```tsx
const set = w();

// set({/* patch fields */});
```

`r` creates read actions from a pure function that takes the mug's current state, optionally along with additional parameters, and produces a result value:

```tsx
const read = r((state, param1: string, param2: string) => 'readResult');

// const readResult = read('param1', 'param2');
```

And if called without pure functions, it can create a pass-through read action:

```tsx
const get = r();

// const aState = get();
```

Further more, to have mugs specified on invocation instead of on creation, there comes the other kind of invokables, called operations or ops for short.

They are created similarly but with the helpers straight from `react-mug`:

```tsx
import { r, w } from 'react-mug';

const writeIt = w((state: AState, param1: string, param2: string) => ({
  ...state,
  /* fields to write */
}));

// writeIt(aMug, 'param1', 'param2');

const readIt = r((state: AState, param1: string, param2: string) => 'readItResult');

// const readItResult = readIt(aMug, 'param1', 'param2');
```

And by builtin, a merge-patch write op and a pass-through read op are provided:

```tsx
import { getIt, setIt } from 'react-mug';

// setIt(aMug, {/* patch fields */});

// const aState = getIt(aMug);
```

While actions can suit regular cases, ops can work quite well with dynamically created mugs.

## <span id="6658073">Independence from React hooks</span>

Mugs and actions can be created and used anywhere:

```tsx
write('param1', 'param2');

const readResult = read('param1', 'param2');

writeIt(aMug, 'param1', 'param2');

const readItResult = readIt(aMug, 'param1', 'param2');
```

Integration with React hooks is optional but easy.

## <span id="35ec17a">Zero setup for use in React components</span>

Calling `useIt` with read actions is the only step needed to read states that are responsive to changes in React components:

```tsx
import { useIt } from 'react-mug';

function ReactComponent() {
  const readResult = useIt(read, 'param1', 'param2');
  const readItResult = useIt(readIt, aMug, 'param1', 'param2');
  return (
    <>
      <p>Read Result: {readResult}</p>
      <p>Read-It Result: {readItResult}</p>
    </>
  );
}
```

No React providers are required.

## <span id="6f5a8fd">Easy tests</span>

Actions and ops can be easily tested in functional style.

For actions, the utility `pure` can help expose their internal pure functions:

```tsx
import { pure } from 'react-mug';

describe('write', () => {
  test('behavior', () => {
    const currentState: AState = {
      /* fields */
    };

    const nextState: AState = {
      /* fields */
    };

    expect(pure(write)(currentState, 'param1', 'param2')).toStrictEqual(nextState);
  });
});

describe('read', () => {
  test('behavior', () => {
    const currentState: AState = {
      /* fields */
    };

    expect(pure(read)(currentState, 'param1', 'param2')).toStrictEqual('readResult');
  });
});
```

For ops, they act as pure functions when states are passed in straight:

```tsx
describe('writeIt', () => {
  test('behavior', () => {
    const currentState: AState = {
      /* fields */
    };

    const nextState: AState = {
      /* fields */
    };

    expect(writeIt(currentState, 'param1', 'param2')).toStrictEqual(nextState);
  });
});

describe('readIt', () => {
  test('behavior', () => {
    const currentState: AState = {
      /* fields */
    };

    expect(readIt(currentState, 'param1', 'param2')).toStrictEqual('readItResult');
  });
});
```

What's more, React components can be easily tested, too.

The builtin `setIt` can help prepare states beforehand, then the utility `restore` can help restore them afterward:

```tsx
import { restore, setIt } from 'react-mug';

describe('ReactComponent', () => {
  afterEach(() => {
    restore(aMug);
  });

  test('behavior', async () => {
    setIt(aMug, {
      /* patch fields */
    });

    render(<ReactComponent />);

    expect(screen.getByRole('main')).toHaveTextContent('foo');

    // If to check user events:

    await userEvent.click(screen.getByRole('button'));

    expect(screen.getByRole('main')).toHaveTextContent('bar');
  });
});
```

## <span id="09d0796">State composition</span>

Mugs can be nested in another mug to form a composite mug for a composite state:

```tsx
import { construction, Mug } from 'react-mug';

interface AnotherState {
  a: AState;
  /* rest fields */
}

const anotherMug: Mug<SuperState, { a: Mug<AState> }> = {
  [construction]: {
    a: aMug,
    /* rest fields */
  },
};
```

On that, actions and ops can be applied, optionally reusing child mugs' invokables. The current state taken by the pure functions is composed of the current child states. The next state produced by the pure functions is decomposed for the next child states:

```tsx
import { pure, upon } from 'react-mug';

const [r, w] = upon(anotherMug);

const anotherWrite = w((state, param1: string, param2: string) => ({
  ...state,
  a: pure(write)(state.a, param1, param2),
  /* fields to write */
}));

// anotherWrite('param1', 'param2');

const anotherRead = r(
  (state, param1: string, param2: string) => `another ${pure(read)(state.a, param1, param2)}`,
);

// const anotherReadResult = anotherRead('param1', 'param2');
```

```tsx
import { r, w } from 'react-mug';

const anotherWriteIt = w((state: AnotherState, param1: string, param2: string) => ({
  ...state,
  a: writeIt(state.a, param1, param2),
  /* fields to write */
}));

// anotherWriteIt(anotherMug, 'param1', 'param2');

const anotherReadIt = r(
  (state: AnotherState, param1: string, param2: string) =>
    `another ${readIt(state.a, param1, param2)}`,
);

// const anotherReadItResult = anotherReadIt(anotherMug, 'param1', 'param2');
```

And in simpler cases, mugs can just be nested in a plain object instead to form a state collection container called a mug-like:

```tsx
import { tuple } from 'react-mug';

// For: { a: AState, another: AnotherState }
const fooMugLike = {
  a: aMug,
  another: anotherMug,
};

// For: [AState, AnotherState]
const barMugLike = tuple(aMug, anotherMug);
```

Like on a composite mug, actions and ops can be applied on a mug-like, too.

## <span id="a6bd391">Full compatibility with the typical reducer-based practice</span>

Full compatibility is provided for the typical reducer-based practice. The practice in Intro can be easily expanded to an app level:

```tsx
// CounterReducer.ts
import { construction, upon } from 'react-mug';

import type { AppAction, AppState } from './AppReducer';

export interface CounterState {
  value: number;
}

export const INCREMENT = 'Counter/Increment';

export const RESET = 'Counter/Reset';

export type CounterAction = { type: typeof INCREMENT; step: number } | { type: typeof RESET };

export const initialCounterState: CounterState = {
  value: 0,
};

export function counterReducer(state: CounterState, action: AppAction): CounterState {
  switch (action.type) {
    case INCREMENT:
      return { value: state.value + action.step };
    case RESET:
      return initialCounterState;
    default:
      return state;
  }
}

export function selectValue(appState: AppState) {
  return appState.counter.value;
}
```

```tsx
// AppReducer.ts
import { construction, upon, useIt } from 'react-mug';

import { CounterAction, counterReducer, CounterState, initialCounterState } from './CounterReducer';

export interface AppState {
  counter: CounterState;
}

export const initialAppState: AppState = {
  counter: initialCounterState,
};

export type AppAction = CounterAction;

export function appReducer(state: AppState, action: AppAction): AppState {
  return {
    counter: counterReducer(state.counter, action),
  };
}

const appMug = { [construction]: initialAppState };

const [r, w] = upon(appMug);

export const getAppState = r();

export const dispatch = w(appReducer);

export function useAppSelector<TSelector extends (appState: AppState) => any>(
  select: TSelector,
): ReturnType<TSelector> {
  const appState = useIt(getAppState);
  return useMemo(() => select(appState), [appState]);
}
```

```tsx
// CounterControl.tsx
import { dispatch } from './AppReducer';
import { INCREMENT, RESET } from './CounterReducer';

function CounterControl() {
  return (
    <>
      <button onClick={() => dispatch({ type: INCREMENT, step: 1 })}>Increment 1</button>
      <button onClick={() => dispatch({ type: INCREMENT, step: 5 })}>Increment 5</button>
      <button onClick={() => dispatch({ type: RESET })}>Reset</button>
    </>
  );
}
```

```tsx
// CounterDisplay.tsx
import { useAppSelector } from './AppReducer';
import { selectValue } from './CounterReducer';

export function CounterDisplay() {
  const value = useAppSelector(selectValue);
  return <p>Value: {value}</p>;
}
```

This serves as both a proper playground for the typical and a safe starting point for the evolution.

## <span id="3d3b9ce">Strong support for TypeScript</span>

Types, including implicit inference and explicit declaration, are designed as a part of APIs with a holistic mindset.

As seen in the snippets, types can work naturally, requiring nearly no extra effort.

# <span id="2d0bd16">Tips</span>

- [Best practice to organize states](#0e67afa).
- [Data flow](#85b87d9).
- [Mug-state continuums](#1bccb53).
- [All conversions among actions, ops, and pure functions](#652002e).
- [Referencing actions and ops](#b23ecc8).
- [Merge-patch's patches](#7265ffc).
- [Type checkers](#c27629b).
- [Array literal helpers](#4a1a881).
- [Mugs with attachments](#7c4ab1e).

## <span id="0e67afa">Best practice to organize states</span>

It would make the most sense to group everything related to "one state per file".

For regular cases:

```tsx
// AMug.ts
import { construction, upon } from 'react-mug';

export interface AState {
  /* fields */
}

export const aMug: Mug<AState> = {
  [construction]: {
    /* fields */
  },
};

const [r, w] = upon(aMug);

export const get = r();

export const read = r((state, param1: string, param2: string) => 'readResult');

export const set = w();

export const write = w((state, param1: string, param2: string) => ({
  ...state,
  /* fields to write */
}));
```

For dynamically created mugs:

```tsx
// AMug.ts
import { construction, r, w } from 'react-mug';

export interface AState {
  /* fields */
}

export function createAMug(): Mug<AState> {
  return {
    [construction]: {
      /* fields */
    },
  };
}

export const readIt = r((state: AState, param1: string, param2: string) => 'readItResult');

export const writeIt = w((state: AState, param1: string, param2: string) => ({
  ...state,
  /* fields to write */
}));
```

## <span id="85b87d9">Data flow</span>

The data flow is compact, depicted below:

```txt
▶︎ Write Params ┳▶︎ Write Action/Op ▶︎ Next State ┳▶︎ Read Action/Op ▶︎ Read Result ▶︎
               ┃                               ┃
 Current State ┛                   Read Params ┛
```

## <span id="1bccb53">Mug-state continuums</span>

On a state type, a mug-state continuum gets formed by all the possible mugs, mug-likes, and states, sharing the characteristic of 'mugginess' to varying degrees.

The more `construction` fields exist at higher levels in a value, the muggier the value becomes:

- The muggiest values are mugs, which have `construction` fields at the top level.
- The least muggy values are states, which have no `construction` field.
- Between mugs and states are mug-likes, which have zero or more `construction` fields. That is, a mug-like can be a mug, a state, or neither so denote everything in a mug-state continuum.

To help evaluate the initial value of a mug-like regardless of mugginess, the utility `initial` is available:

```tsx
import { initial } from 'react-mug';

const initialAState = initial(aMugLike);
```

In addition, a mug-state continuum can become concise if the continuous nesting of `construction` fields is all excluded, which, precisely defines the scope for an op's first parameter.

To help formulate possible types in that, the utility `PossibleMugLike` is available:

```tsx
import { PossibleMugLike } from 'react-mug';

type PossibleAMugLike = PossibleMugLike<AState>;
```

And to further narrow down those to possible mug types, the other utility `PossibleMug` is available:

```tsx
import { PossibleMug } from 'react-mug';

type PossibleAMug = PossibleMug<AState>;
```

On the other hand, to help extend a state type into a mug-like one, `MugLike` is available:

```tsx
import { Mug, MugLike } from 'react-mug';

type AnotherMugLike = MugLike<AnotherState, { a: Mug<AState> }>;
```

And to evaluate a state type reversely, `State` is available:

```tsx
import { State } from 'react-mug';

type AnotherStateAsBefore = State<AnotherMugLike>;
```

## <span id="652002e">All conversions among actions, ops, and pure functions</span>

Not only can actions be created from pure functions, but they can also be created from ops:

```tsx
import { getIt, setIt, upon } from 'react-mug';

const [r, w] = upon(aMug);

const get = r(getIt);

const set = w(setIt);
```

All feasible conversions among the three can be diagrammed as follows:

```txt
Actions ◀︎━{`upon#r`, `upon#w`}━┓
▲ ┃                            ┃
┃ ┗━━━━━━━{`pure`}━━━━━━━━━━━┓ ┃
┃                            ┃ ┃
{`upon#r`, `upon#w`}         ┃ ┃
┃                            ┃ ┃
┃ ┌┅┅┅┅┅┅┅{'if states'}┅┅┅┅┐ ┃ ┃
┃ ┇                        ▼ ▼ ┃
Ops ◀︎━━━━━{`r`, `w`}━━━━━━ Pure Functions
```

Conceptually, actions are [curried](https://stackoverflow.com/questions/36314/what-is-currying) ops, and ops are muggy-flavored semi-pure functions.

## <span id="b23ecc8">Referencing actions and ops</span>

The utilities `ReadAction` and `WriteAction` can help declare action types, using pure function types, enabling type-safe references elsewhere:

```tsx
import { ReadAction, upon, WriteAction } from 'react-mug';

const [r, w] = upon(aMug);

const read = r((state, param1: string, param2: string) => 'readResult');

const write = w((state, param1: string, param2: string) => ({
  ...state,
  /* fields to write */
}));

// ...

const readToo: ReadAction<(state: AState, param1: string, param2: string) => string> = read;

const writeToo: WriteAction<(state: AState, param1: string, param2: string) => AState> = write;
```

Likewise, `ReadOp` and `WriteOp` can help declare op types:

```tsx
import { r, ReadOp, w, WriteOp } from 'react-mug';

const readIt = r((state: AState, param1: string, param2: string) => 'readItResult');

const writeIt = w((state: AState, param1: string, param2: string) => ({
  ...state,
  /* fields to write */
}));

// ...

const readItToo: ReadOp<(state: AState, param1: string, param2: string) => string> = readIt;

const writeItToo: WriteOp<(state: AState, param1: string, param2: string) => AState> = writeIt;
```

## <span id="7265ffc">Merge-patch's patches</span>

A patch value that a merge-patch action or op can take generally conforms to the recursive partial type of the state in question. And to handle edge cases well, nuances are collected below:

- For all fields, a patch value of `undefined` has no effect, preventing the clearance of non-nullable fields.
- For a field that can be `undefined`, its patch type is the original, `undefined`, or `none` from `react-mug`, preventing the assignment of a partial value when empty but enabling the clearance.
- For a field that can be `null`, its patch type is the original or `undefined`, preventing the assignment of a partial value when empty.
- For an array field, its patch length has effect, enabling the addition and removal of items.
- For an item of an array field, its patch type is the original, preventing the addition of a partial item.
- For a tuple field, its patch length is fixed, preventing the addition and removal of a item.
- For an item of a tuple field, its patch type is the recursive partial of the original with the nuances here or `undefined`.
- For a plain object field, its patch type is the recursive partial of the original with the nuances here or `undefined`.
- For a primitive field, its patch type is the original or `undefined`.

As a side note, by JavaScript syntax, an item can be omitted as `undefined` in a tuple like a field in a plain object:

```tsx
setIt(aMug, { tuple: [, 1, , 3, ,] });
```

## <span id="c27629b">Type checkers</span>

Type checkers are provided for mugs, actions, and ops:

```tsx
import { isAction, isMug, isOp, isReadAction, isReadOp, isWriteAction, isWriteOp } from 'react-mug';

isMug(aMug);

isAction(read);
isAction(write);
isReadAction(read);
isWriteAction(write);

isOp(readIt);
isOp(writeIt);
isReadOp(readIt);
isWriteOp(writeIt);
```

## <span id="4a1a881">Array literal helpers</span>

Arrays in TypeScript can be readonly or not, tuple or not, but only the most basic kind has literals:

```tsx
const someArray = [0, false, '']; // Type: (number|boolean|string)[]
```

Therefore, the literal helpers for the rest kinds are provided:

```tsx
import { readonlyArray, readonlyTuple, tuple } from 'react-mug';

const someReadonlyArray = readonlyArray(0, false, ''); // Type: readonly (number|boolean|string)[]
const someTuple = tuple(0, false, ''); // Type: [number, boolean, string]
const someReadonlyTuple = readonlyTuple(0, false, ''); // Type: readonly [number, boolean, string]
```

## <span id="7c4ab1e">Mugs with attachments</span>

In a mug, the fields adjacent to the `construction` field are called attachments. They don't affect state logic but can help organize it in object-oriented flavor.

Specially, the utility `attach` can help pack a mug and its actions into one bundle.

```tsx
// AMug.ts
import { attach, construction, Mug, upon } from 'react-mug';

interface AState {
  /* fields */
}

function createAMug() {
  const mug: Mug<AState> = {
    [construction]: {
      /* fields */
    },
  };

  const [r, w] = upon(mug);

  const read = r((state, param1: string, param2: string) => 'readResult');

  const write = w((state, param1: string, param2: string) => ({
    ...state,
    /* fields to write */
  }));

  return attach(mug, { read, write });
}

// const aMug = createAMug();
//
// const readResult = aMug.read('param1', 'param2');
//
// aMug.write('param1', 'param2');
```

# <span id="2d56cc3">FAQs</span>

- [Why the field key `construction` is a symbol but not a string?](#c518968)

## <span id="#c518968">Why the field key `construction` is a symbol but not a string?</span>

Using a symbol as a field key thoroughly eliminates potential key conflicts, enabling a state to safely have any field key that is not exactly that symbol:

```tsx
import { construction } from 'react-mug';

const bazMug = {
  [construction]: {
    construction: 0,
  },
};
```

# <span id="b0280eb">License</span>

[Apache 2.0](./LICENSE).
