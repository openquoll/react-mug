# 指南 / 对大状态切片

[核心内容](#bfc7f69) &nbsp;•&nbsp; [异步操作](#5b70f21) &nbsp;•&nbsp; [操作测试](#a8658c7)

中文 &nbsp;•&nbsp; [English](./eb8ec2b.md)

## <span id="bfc7f69"></span>核心内容

状态体量越大越难维护，状态之间还会展现共性，通用特质须要单拎出来，为此 React Mug 提供了状态切片。

例如，对于下面的计数器状态：

```ts
// CounterMug.ts
import { construction, upon } from 'react-mug';

export interface CounterState {
  querying: boolean;
  value: number;
}

export const counterMug = {
  [construction]: {
    querying: false,
    value: 0,
  },
};

const { r, w } = upon<CounterState>(counterMug);

export const isQuerying = r((state) => state.querying);

export const getValue = r((state) => {
  if (isQuerying(state)) {
    return;
  }
  return state.value;
});

export const startQuerying = w((state) => ({ ...state, querying: true }));

export const endQuerying = w((state) => ({ ...state, querying: false }));

export const increase = w((state, delta: number) => ({ ...state, value: state.value + delta }));

export const set = w();

export const queryValue = async () => {
  startQuerying();
  const value = await RestfulApi.counter.value.get();
  set({ value });
  endQuerying();
};
```

通过切片，即可将 “可查询” 的特质提炼为通用状态：

```ts
// QueryableMug.ts
import { onto } from 'react-mug';

export interface QueryableState {
  querying: boolean;
}

const { r, w } = onto<QueryableState>();

export const isQuerying = r((state) => state.querying);

export const startQuerying = w((state) => ({ ...state, querying: true }));

export const endQuerying = w((state) => ({ ...state, querying: false }));

export * as QueryableModule from './QueryableMug';
```

然后接入回计数器状态：

```ts
// CounterMug.ts
import { construction, upon } from 'react-mug';

import { QueryableModule, QueryableState } from './QueryableMug';

// 接入可查询状态
export interface CounterState extends QueryableState {
  value: number;
}

export const counterMug = {
  [construction]: {
    querying: false,
    value: 0,
  },
};

const { r, w, s } = upon<CounterState>(counterMug);

// 接入可查询状态
export const { isQuerying, startQuerying, endQuerying } = s(QueryableModule);

export const getValue = r((state) => {
  // 调用可查询操作
  if (isQuerying(state)) {
    return;
  }
  return state.value;
});

export const increase = w((state, delta: number) => ({ ...state, value: state.value + delta }));

export const set = w();

export const queryValue = async () => {
  // 调用可查询操作
  startQuerying();
  const value = await RestfulApi.counter.value.get();
  set({ value });
  // 调用可查询操作
  endQuerying();
};
```

这样代码结构清晰，并且方便随时复用：

```ts
// BriefingMug.ts
import { construction, upon } from 'react-mug';

import { QueryableModule, QueryableState } from './QueryableMug';

export interface BriefingState extends QueryableState {
  text: string;
}

export const briefingMug = {
  [construction]: {
    querying: false,
    text: '',
  },
};

const { r, w, s } = upon<BriefingState>(briefingMug);

export const { isQuerying, startQuerying, endQuerying } = s(QueryableModule);

export const getText = r((state) => {
  if (isQuerying(state)) {
    return;
  }
  return state.text;
});

export const set = w();

export const queryText = async () => {
  startQuerying();
  const text = RestfulApi.briefing.text.get();
  set({ text });
  endQuerying();
};
```

让状态有序地拆分开来。

## <span id="5b70f21"></span>异步操作

此外，以普通的异步函数结合 `x`，即可定义通用的异步操作：

```ts
// QueryableMug.ts

...

const { r, w, x } = onto<QueryableState>();

...

export const retry = x(async (mug, act: () => Promise<void>, times: number = 3) => {
  startQuerying(mug);
  for (let i = 0; i < times; i++) {
    try {
      await act();
      break;
    } catch (e) {
      const noMore = i === times - 1;
      if (noMore) {
        throw e;
      }
    }
  }
  endQuerying(mug);
});

```

```ts
// CounterMug.ts

...

export const { ..., retry } = s(QueryableModule);

...

export const queryValueFastWithRetry = async () => {
  await retry(async () => {
    const value = await RestfulApi.counter.value.get({ timeout: 1000 });
    set({ value });
  });
};
```

## <span id="a8658c7"></span>操作测试

以及，以测试纯函数的方式，即可测试通用操作：

```ts
// QueryableMug.test.ts
import { startQuerying } from './QueryableMug';

describe('startQuerying', () => {
  test('sets querying to true', () => {
    expect(startQuerying({ querying: false })).toStrictEqual({ querying: true });
  });
});
```

---

[返回指南 / 目录](./README.zh-Hans.md)。
