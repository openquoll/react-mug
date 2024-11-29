# React Mug

中文 | [English](./README.md)

# 安装

```sh
npm i react-mug
```

# 使用

```tsx
import { construction, Mug, upon, useIt } from 'react-mug';

interface CounterState {
  value: number;
}

const counterMug: Mug<CounterState> = {
  [construction]: {
    value: 0,
  },
};

const [r, w] = upon(counterMug);

const getMagnifiedValue = r((state, factor: number) => state.value * factor);

const increment = w((state, step: number) => ({ value: state.value + step }));

const reset = w(() => counterMug[construction]);

function Display() {
  const magnifiedValue = useIt(getMagnifiedValue, 3);
  return <div>Magnified Value: {magnifiedValue}</div>;
}

function Control() {
  return (
    <>
      <button onClick={() => increment(1)}>Increment 1</button>
      <button onClick={() => increment(5)}>Increment 5</button>
      <button onClick={reset}>Reset</button>
    </>
  );
}

export function App() {
  return (
    <>
      <Display />
      <Control />
    </>
  );
}
```
