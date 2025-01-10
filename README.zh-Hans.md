# React Mug

![Logo of Mug](https://github.com/user-attachments/assets/f47bc69e-fc3f-4465-96af-9aaff65c79ae)

[概要](#f595ead) &nbsp;•&nbsp; [功能](#dea3322) &nbsp;•&nbsp; [安装](#cf6afd0) &nbsp;•&nbsp; [用法](#9f9b12f) &nbsp;•&nbsp; [指南](#be6352c) &nbsp;•&nbsp; [许可](#1036c9f)

中文 &nbsp;•&nbsp; [English](./README.md)

## <span id="f595ead"></span>概要

可能是最丝滑的函数式状态库。

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

创建状态及其操作：

```ts
// CountMug.ts
import { construction, upon } from 'react-mug';

const { r, w } = upon<number>({
  [construction]: 0,
});

export const get = r();

export const increase = w((n, delta: number) => n + delta);
```

然后直接使用：

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

即可纵享丝滑。

## <span id="be6352c"></span>指南

[TODO](./docs/guide/TODO.zh-Hans.md)

## <span id="1036c9f"></span>许可

[Apache 2.0](./LICENSE)。
