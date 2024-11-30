# React Mug

Hi, there! This is an evolvement in the reducer-based state management towards simplicity that removes `dispatch` and many burdens.

With it, write actions can be easily created with pure functions:

```tsx
// CounterMug.ts
import { construction, upon } from 'react-mug';

export const counterMug = {
  [construction]: { value: 0 },
};

const { w } = upon(counterMug);

export const increment = w((state, step: number) => ({ value: state.value + step }));

export const reset = w(() => counterMug[construction]);
```

and called directly:

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

Meanwhile, read actions can be created similarly:

```diff
// CounterMug.ts

...

-const { w } = upon(counterMug);
+const { w, r } = upon(counterMug);

...

+export const getValue = r((state) => state.value);
```

and hooked into React components with zero setup:

```tsx
// CounterDisplay.tsx
import { useIt } from 'react-mug';

import { getValue } from './CounterMug';

export function CounterDisplay() {
  const value = useIt(getValue);
  return <p>Value: {value}</p>;
}
```

Moreoever, the actions of both types can be tested straightforwardly:

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

And if preferred, the typical reducer-based practice can be applied in the place of write actions:

```ts
// CounterReducer.ts
import { construction, upon } from 'react-mug';

export const counterMug = {
  [construction]: { value: 0 },
};

const { w } = upon(counterMug);

export const INCREMENT = 'INCREMENT';

export const RESET = 'RESET';

export type CounterAction = { type: typeof INCREMENT; step: number } | { type: typeof RESET };

export const dispatch = w((state, action: CounterAction) => {
  switch (action.type) {
    case INCREMENT:
      return { value: state.value + action.step };
    case RESET:
      return counterMug[construction];
    default:
      return state;
  }
});

// <button onClick={() => dispatch({ type: INCREMENT, step: 1 })}>Increment 1</button>
```

These mug cups with handles will always serve the hot-coffee-like states properly.

![Photo by Annie Spratt](https://github.com/user-attachments/assets/3639be26-bbd1-4653-9c93-b891b44025d6)

# Installation

```sh
npm i react-mug
```

# Features

- State containers creation by plain objects.
- Functional state access without `dispatch`.
- Independence from React hooks.
- Use in React components with zero setup.
- Flexible state composition.
- Compatibility with the typical reducer-based practice.
- Strong support for TypeScript.
