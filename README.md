# React Mug

This is an incremental evolution from reducer-based state management aiming to remove conceptual burdens with compatibility.

With it, the typical reducer-based practice remains doable:

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

But a dispatch-free way can also take the place - write actions can be created from pure functions and directly called:

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

Then, the actions of both types can be easily tested in functional style:

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

Less code, same work ☕️.

# Installation

```sh
npm i react-mug
```

# Features

- [State containers creation by plain objects](#cad503d).
- [Functional state access without `dispatch`](#31e08c7).
- [Independence from React hooks](#6658073).
- [Zero setup for use in React components](#35ec17a).
- [Easy tests](#6f5a8fd).
- [State composition](#09d0796).
- [Compatibility with the typical reducer-based practice](#a6bd391).
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

For brevity, a state container is also called a mug.

In addition, a mug's state type can be either implicitly inferred as above or explicitly declared as below:

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

They can have a mug specified on creation but omitted on invocation, and be created with the helpers from calling `upon`:

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

// set({/* fields */});
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

Moreover, there is the other kind of invokables, called operations, to access states.

For short, they are also called ops.

They can have a mug specified on invocation but omitted on creation, and be created similarly but with the helpers straight from `react-mug`:

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

And by builtin, a merge-patch op and a pass-through op are provided:

```tsx
import { getIt, setIt } from 'react-mug';

// setIt(aMug, {/* fields */});

// const aState = getIt(aMug);
```

While actions suit most cases of state access, ops especially work well with dynamically created mugs.

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

For ops, they can act as pure functions when states are passed in straight:

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

Further more, React components can also be easily tested.

The builtin `setIt` can help prepare states. Then, after a test, the utility `restore` can help restore them:

```tsx
import { restore, setIt } from 'react-mug';

describe('ReactComponent', () => {
  afterEach(() => {
    restore(aMug);
  });

  test('behavior', async () => {
    setIt(aMug, {
      /* ... */
    });

    render(<ReactComponent />);

    expect(screen.getByRole('main')).toHaveTextContent('content 1');

    // If to check user events:

    await userEvent.click(screen.getByRole('button'));

    expect(screen.getByRole('main')).toHaveTextContent('content 2');
  });
});
```

## <span id="09d0796">State composition</span>

A mug can be nested in another mug to form a composed state:

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

For simpler cases, a mug can be nested in a plain object to form a state collection instead of a new state.

That plain object is called a mug-like:

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

Like on a composed mug, actions and ops can be applied similarly.

## <span id="a6bd391">Compatibility with the typical reducer-based practice</span>

## <span id="3d3b9ce">Strong support for TypeScript</span>

# Tips

# FAQs

# License

[Apache 2.0](./LICENSE).
