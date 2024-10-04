# React Mug

中文 | [English](./README.md)

## 用法

用喜欢的包管理器安装，比如 npm：

```sh
npm i react-mug
```

实现一个计数器：

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
