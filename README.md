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

But a dispatch-free way can take the place - directly callable write actions can be created from pure functions:

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
import { getValue, increment } from 'CounterMug';
import { pure } from 'react-mug';

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

These mug cups with handles will constantly serve those hot-coffee-like states properly ☕️.

# Installation

```sh
npm i react-mug
```

# Features

- [State containers creation by plain objects](#cad503d).
- [Functional state access without `dispatch`](#31e08c7).
- [Zero setup for use in React components](#35ec17a).
- [Independence from React hooks](#6658073).
- [Easy tests in functional style](#6f5a8fd).
- [State composition](#09d0796).
- [Compatibility with the typical reducer-based practice](#a6bd391).
- [Strong support for TypeScript](#3d3b9ce).

## <span id="cad503d">State containers creation by plain objects</span>

A state container gets created simply with a name suffix `Mug` and a top-level field `construction` pointing at an initial value:

```tsx
import { construction } from 'react-mug';

const aMug = {
  [construction]: {
    /* initial value */
  },
};
```

A state container is also called a Mug. The field key `construction` is a symbol primitive.

In addition, a state type can be either implicitly inferred as above or explicitly declared as below:

```tsx
import { construction, Mug } from 'react-mug';

interface AState {
  /* state fields */
}

const aMug: Mug<AState> = {
  [construction]: {
    /* initial value */
  },
};
```

## <span id="31e08c7">Functional state access without `dispatch`</span>

## <span id="35ec17a">Zero setup for use in React components</span>

## <span id="6658073">Independence from React hooks</span>

## <span id="6f5a8fd">Easy tests in functional style</span>

## <span id="09d0796">State composition</span>

## <span id="a6bd391">Compatibility with the typical reducer-based practice</span>

## <span id="3d3b9ce">Strong support for TypeScript</span>

# Tips

# FAQs

# License

[Apache 2.0](./LICENSE).
