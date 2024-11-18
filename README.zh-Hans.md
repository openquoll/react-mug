# React Mug

中文 | [English](./README.md)

## 用法

用包管理器安装，比如 npm：

```sh
npm i react-mug
```

实现一个计数器：

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
