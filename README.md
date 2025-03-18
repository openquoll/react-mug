# <span id="a6b2ef2"></span> React Mug

[概要](#f595ead) &nbsp;•&nbsp;
[特性](#dea3322) &nbsp;•&nbsp;
[安装](#cf6afd0) &nbsp;•&nbsp;
[指南](#be6352c) &nbsp;•&nbsp;
[API](#629f340) &nbsp;•&nbsp;
[许可](#1036c9f) &nbsp;•&nbsp;
[赞助](#8e8463c)。

中文 &nbsp;•&nbsp; [English](./README.en.md)。

## <span id="f595ead"></span> 概要

下一代 React 状态库，为极致的体验而生 —— 极致的既是用户体验，也是开发者体验。

## <span id="dea3322"></span> 特性

### 好写

秉承函数式内核，但化繁为简：

```ts
// CountState.ts
import { construction, upon } from 'react-mug';

const { r, w } = upon<number>({
  [construction]: 0,
});

export const get = r((count) => count);

export const increase = w((count, delta: number) => count + delta);
```

透传值的读操作，进一步化简：

```ts
// CountState.ts

export const get = r();
```

### 好调用

所有状态操作既可以直接调用：

```ts
const count = get();

increase(1);
```

也可以在 React 组件结合调用：

```tsx
// Count.tsx
import { useR } from 'react-mug';
import { get, increase } from './CountState';

export function Count() {
  const count = useR(get);
  return <button onClick={() => increase(1)}>Count: {count}</button>;
}
```

### 好复用

所有操作均可以借助函数态相互复用：

```ts
// CountState.ts

export const addOne = w((count) => increase(count, 1));
```

### 好读

不必深入函数体就能看明白读写范围：

```ts
// CountState.ts

export const increase = w((count, delta: number) => ...);
```

### 好测

直接以函数态轻松测试操作：

```ts
// CountState.test.ts
import { increase } from './CountState';

describe('increase', () => {
  test('adds up count and delta', () => {
    expect(increase(1, 2)).toBe(3);
  });
});
```

### 可组合

参见下方指南。

### 可分隔

参见下方指南。

### 可异步

直接以普通的异步函数定义异步操作：

```ts
// CountState.ts

export const set = w();

export const query = async () => {
  const { data: count } = await fetch('/api/count').then((res) => res.json());
  set(count);
};
```

## <span id="cf6afd0"></span> 安装

```sh
npm i react-mug
```

## <span id="be6352c"></span> 指南

[管理单个状态](./docs/guide/57934f5.md)，<br/>
[组合多个状态](./docs/guide/7f95611.md)，<br/>
[分隔通用特质](./docs/guide/eb8ec2b.md)。

## <span id="629f340"></span> API

[参见 src/index](./src/index.ts)。

## <span id="1036c9f"></span> 许可

[Apache 2.0](./LICENSE)（免费商用）。

## <span id="8e8463c"></span> 赞助

喜欢就赞助一下吧！

<a href="https://afdian.com/a/openquoll" target="_blank"><img width="50" src="https://github.com/user-attachments/assets/f0442384-463d-4f62-aa91-775bfefc20f7" alt="在 afdian.com 上赞助" /></a>（国内）
<a href='https://ko-fi.com/openquoll' target='_blank'><img width='50' src="https://github.com/user-attachments/assets/519a3a99-8eb0-4b44-bf87-4967ca0512a2" alt="在 ko-fi.com 上赞助" /></a>（海外）

---

[返回顶部](#a6b2ef2)
