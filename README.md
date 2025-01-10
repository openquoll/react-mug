# React Mug

![Logo of Mug](https://github.com/user-attachments/assets/f47bc69e-fc3f-4465-96af-9aaff65c79ae)

[Synopsis](#5b94f97) &nbsp;•&nbsp; [Functionalities](#cb032d8) &nbsp;•&nbsp; [Install](#f746377) &nbsp;•&nbsp; [Usage](#e4d5a54) &nbsp;•&nbsp; [Guide](#00bfdb1) &nbsp;•&nbsp; [License](#d4b3b37)

English &nbsp;•&nbsp; [中文](./README.zh-Hans.md)

## <span id="5b94f97"></span>Synopsis

Possibly the smoothest way to functionally manage states.

## <span id="cb032d8"></span>Functionalities

✦ Directly callable state operations created rapidly from pure funcitons.<br/>
✦ Zero-step integration with React.<br/>
✦ Full leverage on ES modules for code organization.<br/>
✦ State composition.<br/>
✦ State segregation.<br/>
✦ Async operations.<br/>
✦ Functionally test state operations.<br/>
✦ Easily test actual state changes.</br>
✦ Strong support for types.

## <span id="f746377"></span>Install

```sh
npm i react-mug
```

## <span id="e4d5a54"></span>Usage

Create a state and the operations:

```ts
// CountMug.ts
import { construction, upon } from 'react-mug';

const { r, w } = upon<number>({
  [construction]: 0,
});

export const get = r();

export const increase = w((n, delta: number) => n + delta);
```

Use them straight:

```tsx
// CounterDisplay.tsx
import { useR } from 'react-mug';

import { get } from './CountMug';

export function CounterDisplay() {
  const count = useR(get);
  return <>The count is {count}.</>;
}
```

```tsx
// CounterControl.tsx
import { increase } from './CountMug';

export function CounterControl() {
  return <button onClick={() => increase(1)}>Increase by 1</button>;
}
```

Enjoy the smoothness.

## <span id="00bfdb1"></span>Guide

[TODO](./docs/guide/TODO.md)

## <span id="d4b3b37"></span>License

[Apache 2.0](./LICENSE).
