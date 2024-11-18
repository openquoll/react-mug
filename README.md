# React Mug

English | [中文](./README.zh-Hans.md)

## Usage

Install with a package manager, e.g. npm:

```sh
npm i react-mug
```

Implement a counter:

```tsx
import { create, initial } from 'react-mug';

const countMug = create(0).attach(({ r, w, mug }) => ({
  get: r(),
  increment: w((count) => count + 1),
  reset: w(() => initial(mug)),
}));
```

```tsx
import { useIt } from 'react-mug';

function Display() {
  const count = useIt(countMug.get);
  return <div>Count: {count}</div>;
}

function Control() {
  return (
    <>
      <button onClick={countMug.increment}>Increment</button>
      <button onClick={countMug.reset}>Reset</button>
    </>
  );
}
```
