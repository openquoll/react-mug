# <span id="b66bc7f"></span>React Mug

[Synopsis](#5b94f97) &nbsp;•&nbsp;
[Features](#dea3322) &nbsp;•&nbsp;
[Install](#f746377) &nbsp;•&nbsp;
[Guide](#00bfdb1) &nbsp;•&nbsp;
[API](#bf85749) &nbsp;•&nbsp;
[License](#d4b3b37) &nbsp;•&nbsp;
[Sponsor](#982e917).

English &nbsp;•&nbsp; [中文](./README.md).

## <span id="5b94f97"></span>Synopsis

Next-generation React state lib, born for optimal experience -- optimal in not only user experience, but also developer experience.

## <span id="dea3322"></span>Features

### Writable

Functional kernel inherited, but complex things made simple:

```ts
// CountState.ts
import { construction, upon } from 'react-mug';

const { r, w } = upon<number>({
  [construction]: 0,
});

export const get = r((count) => count);

export const increase = w((count, delta: number) => count + delta);
```

and further done for a pass-through read op(eration):

```ts
// CountState.ts

export const get = r();
```

### Invokable

All state ops are invokable both directly:

```ts
const count = get();

increase(1);
```

and combinedly in React components:

```tsx
// Count.tsx
import { useR } from 'react-mug';
import { get, increase } from './CountState';

export function Count() {
  const count = useR(get);
  return <button onClick={() => increase(1)}>Count: {count}</button>;
}
```

### Reusable

All ops can reuse each other through functional mode:

```ts
// CountState.ts

export const addOne = w((count) => increase(count, 1));
```

### Readable

No more dig into function bodies for read-write scopes:

```ts
// CountState.ts

export const increase = w((count, delta: number) => ...);
```

### Testable

Directly and easily test ops by functional mode:

```ts
// CountState.test.ts
import { increase } from './CountState';

describe('increase', () => {
  test('adds up count and delta', () => {
    expect(increase(1, 2)).toBe(3);
  });
});
```

### Composable

See also Guide below.

### Segregatable

See also Guide below.

### Asyncable

Directly define async ops by plain async functions:

```ts
// CountState.ts

export const set = w();

export const query = async () => {
  const { data: count } = await fetch('/api/count').then((res) => res.json());
  set(count);
};
```

## <span id="f746377"></span>Install

```sh
npm i react-mug
```

## <span id="00bfdb1"></span>Guide

[Manage One State](./docs/guide/57934f5.en.md).<br/>
[Compose Multiple States](./docs/guide/7f95611.en.md).<br/>
[Segregate General Traits](./docs/guide/eb8ec2b.en.md).

## <span id="bf85749"></span>API

[See also src/index](./src/index.ts).

## <span id="d4b3b37"></span>License

[Apache 2.0](./LICENSE) (Free for commercial use).

## <span id="982e917"></span>Sponsor

Like it? Then sponsor it!

<a href="https://afdian.com/a/openquoll" target="_blank"><img width="50" src="https://github.com/user-attachments/assets/f0442384-463d-4f62-aa91-775bfefc20f7" alt="Sponsor at afdian.com" /></a> (China)
<a href='https://ko-fi.com/openquoll' target='_blank'><img width='50' src="https://github.com/user-attachments/assets/519a3a99-8eb0-4b44-bf87-4967ca0512a2" alt="Sponsor at ko-fi.com" /></a> (Outside China)

---

[Back to Top](#b66bc7f)
