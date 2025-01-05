# React Mug

![Logo of Mug](https://github.com/user-attachments/assets/f47bc69e-fc3f-4465-96af-9aaff65c79ae)

[概要](#f595ead) &nbsp;•&nbsp; [功能](#dea3322) &nbsp;•&nbsp; [安装](#cf6afd0) &nbsp;•&nbsp; [用法](#9f9b12f) &nbsp;•&nbsp; [许可](#1036c9f)

中文 &nbsp;•&nbsp; [English](./README.md)

## <span id="f595ead"></span>概要

可能是最好用的函数式状态库。

## <span id="dea3322"></span>功能

✦ 以纯函数快速创建可直接调用的状态操作，<br/>
✦ 零步骤与 React 集成，<br/>
✦ 善用 ES Modules 标准组织代码，<br/>
✦ 状态组合，<br/>
✦ 状态分隔，<br/>
✦ 异步操作，<br/>
✦ 函数式地测试状态操作，<br/>
✦ 轻松测试实际状态变化，<br/>
✦ 强支持类型。

## <span id="cf6afd0"></span>安装

```sh
npm i react-mug
```

## <span id="9f9b12f"></span>用法

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

## <span id="1036c9f"></span>许可

[Apache 2.0](./LICENSE)。
