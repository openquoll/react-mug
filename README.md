# React Mug

English | [中文](./README.zh-Hans.md)

## Usage

Install with a package manager you like, e.g. npm:

```sh
npm i react-mug
```

Implement a counter:

```tsx
import { construction, upon, useIt } from 'react-mug';

const countMug = { [construction]: 0 };

const [r, w] = upon(countMug);

const getCount = r();
const setCount = w();

const increment = w((n) => n + 1);
const decrement = w((n) => n - 1);

function Counter() {
  const count = useIt(getCount);
  return <div>{count}</div>;
}

function Actions() {
  return (
    <>
      <button onClick={increment}>+1</button>
      <button onClick={decrement}>-1</button>
      <button onClick={() => setCount(0)}>To 0</button>
    </>
  );
}
```
