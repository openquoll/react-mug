# React Mug

![Logo of Mug](https://github.com/user-attachments/assets/f47bc69e-fc3f-4465-96af-9aaff65c79ae)

[Synopsis](#5b94f97) &nbsp;•&nbsp; [Functionalities](#cb032d8) &nbsp;•&nbsp; [Install](#f746377) &nbsp;•&nbsp; [Usage](#e4d5a54) &nbsp;•&nbsp; [License](#d4b3b37)

English &nbsp;•&nbsp; [中文](./README.zh-Hans.md)

## <span id="5b94f97"></span>Synopsis

Possibly the optimal way to functionally manage states.

## <span id="cb032d8"></span>Functionalities

⯌ Rapid creation from pure funcitons for directly callable state operations.<br/>
⯌ Zero-step integration with React.<br/>
⯌ Full leverage on ES modules for code organization.<br/>
⯌ State composition.<br/>
⯌ State segregation.<br/>
⯌ Async operations.<br/>
⯌ Functionally test state operations.<br/>
⯌ Easily test actual state changes.</br>
⯌ Strong support for types.

## <span id="f746377"></span>Install

```sh
npm i react-mug
```

## <span id="e4d5a54"></span>Usage

```tsx
// CounterMug.ts
import { construction, upon } from 'react-mug';

export interface CounterState {
  value: number;
}

const { r, w } = upon<CounterState>({
  [construction]: {
    value: 0,
  },
});

export const getValue = r((state) => state.value);

export const increase = w((state, delta: number) => ({ ...state, value: state.value + delta }));
```

```tsx
// CounterDisplay.tsx
import { useR } from 'react-mug';

import { getValue } from './CounterMug';

export function CounterDisplay() {
  const value = useR(getValue);
  return <div>Value: {value}</div>;
}
```

```tsx
// CounterControl.tsx
import { increase } from './CounterMug';

export function CounterControl() {
  return (
    <div>
      <button onClick={() => increase(1)}>Increase by 1</button>
      <button onClick={() => increase(5)}>Increase by 5</button>
    </div>
  );
}
```

## <span id="d4b3b37"></span>License

[Apache 2.0](./LICENSE).
