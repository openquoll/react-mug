# <span id="c92c394"></span> 指南 / 分隔通用特质

[核心内容](#bfc7f69) &nbsp;•&nbsp;
[异步通用操作](#5b70f21) &nbsp;•&nbsp;
[通用操作复用](#3139a8c) &nbsp;•&nbsp;
[默认通用操作](#78208bb) &nbsp;•&nbsp;
[通用操作测试](#a8658c7) &nbsp;•&nbsp;
[异步通用操作测试](#d83d546)。

[返回目录](./README.md)。

中文 &nbsp;•&nbsp; [English](./eb8ec2b.en.md)。

## <span id="bfc7f69"></span> 核心内容

单个状态的体量越大，其包含的特质就越多。有的特质还会在不同的状态中反复出现，这些便是值得单拎出来的通用特质。为此 React Mug 提供了状态分隔机制。

例如，对于以下可查询值的计数器状态：

```ts
// CounterState.ts
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

export const startQuerying = w(() => ({ querying: true }));

export const endQuerying = w(() => ({ querying: false }));

export const increase = w((state, delta: number) => ({ value: state.value + delta }));

export const set = w();

export const queryValue = async () => {
  startQuerying();
  const { data: value } = await fetch('/api/counter/value').then((res) => res.json());
  set({ value });
  endQuerying();
};
```

通过分隔，可以将 “可查询” 特质提炼成一个通用状态：

```ts
// QueryableState.ts
import { onto } from 'react-mug';

export interface QueryableState {
  querying: boolean;
}

const { r, w } = onto<QueryableState>();

// 通用读操作
export const isQuerying = r((state) => state.querying);

// 通用写操作
export const startQuerying = w(() => ({ querying: true }));

export const endQuerying = w(() => ({ querying: false }));

// 通用操作的名字空间
export * as queryableOps from './QueryableState';
```

然后再接入回计数器状态：

```ts
// CounterState.ts
import { construction, upon } from 'react-mug';
import { queryableOps, QueryableState } from './QueryableState';

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
export const { isQuerying, startQuerying, endQuerying } = s(queryableOps);

export const getValue = r((state) => {
  // 复用可查询操作
  if (isQuerying(state)) {
    return;
  }
  return state.value;
});

export const increase = w((state, delta: number) => ({ value: state.value + delta }));

export const set = w();

export const queryValue = async () => {
  // 调用可查询操作
  startQuerying();
  const { data: value } = await fetch('/api/counter/value').then((res) => res.json());
  set({ value });
  // 调用可查询操作
  endQuerying();
};
```

这样代码保持等价，但是结构更加清晰，而且方便后续复用：

```ts
// BriefingState.ts
import { construction, upon } from 'react-mug';
import { queryableOps, QueryableState } from './QueryableState';

export interface BriefingState extends QueryableState {
  content: string;
}

export const briefingMug = {
  [construction]: {
    querying: false,
    content: '',
  },
};

const { r, w, s } = upon<BriefingState>(briefingMug);

export const { isQuerying, startQuerying, endQuerying } = s(queryableOps);

export const getContent = r((state) => {
  if (isQuerying(state)) {
    return;
  }
  return state.content;
});

export const set = w();

export const queryContent = async () => {
  startQuerying();
  const { data: content } = await fetch('/api/briefing/content').then((res) => res.json());
  set({ content });
  endQuerying();
};
```

从而让状态有序地拆隔开来。

## <span id="5b70f21"></span> 异步通用操作

进一步地，向 `x` 方法传入异步函数并在其中调用通用操作即可创建异步通用操作：

```ts
// QueryableState.ts

const { ..., x } = onto<QueryableState>();

export const queryWithTimeout = x(async (mug, act: () => Promise<void>, ms: number = 3000) => {
  if (isQuerying(mug)) {
    return;
  }

  try {
    startQuerying(mug);
    const timer = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), ms));
    const actor = act();
    await Promise.race([timer, actor]);
  } finally {
    endQuerying(mug);
  }
});
```

```ts
// CounterState.ts

export const { ..., queryWithTimeout } = s(queryableOps);

export const queryValueWithTimeout = async () => {
  await queryWithTimeout(async () => {
    const { data: value } = await fetch('/api/counter/value').then((res) => res.json());
    set({ value });
  });
};
```

## <span id="3139a8c"></span> 通用操作复用

将状态一并传入通用操作，即可调起函数态进行操作间复用：

```ts
// QueryableState.ts

export const toggleQueryingVerbosely = w((state) =>
  isQuerying(state) ? endQuerying(state) : startQuerying(state),
);
```

## <span id="78208bb"></span> 默认通用操作

无参调用 `r`、`w`，即可得到 “读取全量状态”、“合并写入状态” 的通用操作：

```ts
// QueryableState.ts

export const get = r();

export const set = w();

export const queryWithRetry = x(async (mug, act: () => Promise<void>, times: number = 3) => {
  if (get(mug).querying) {
    return;
  }

  set(mug, { querying: true });
  let error: unknown;
  for (let i = 0; i < times; i++) {
    try {
      await act();
      break;
    } catch (e) {
      const noMoreTime = i === times - 1;
      if (noMoreTime) {
        error = e;
      }
    }
  }
  set(mug, { querying: false });

  if (error) {
    throw error;
  }
});
```

## <span id="a8658c7"></span> 通用操作测试

以测试纯函数的方式，可轻松测试通用操作：

```ts
// QueryableState.test.ts
import { startQuerying } from './QueryableState';

describe('startQuerying', () => {
  test('sets querying to true', () => {
    expect(startQuerying({ querying: false })).toStrictEqual({ querying: true });
  });
});
```

## <span id="d83d546"></span> 异步通用操作测试

以及，以 Mug 为支点，可轻松测试异步通用操作：

```ts
// QueryableState.test.ts
import { construction, getIt, Mug, resetIt, setIt } from 'react-mug';
import { QueryableState, queryWithTimeout } from './QueryableState';

describe('queryWithTimeout', () => {
  const mug: Mug<QueryableState> = {
    [construction]: {
      querying: false,
    },
  };

  afterEach(() => resetIt(mug));

  test('act not called and state not changed if still querying', async () => {
    const act = jest.fn();
    setIt(mug, { querying: true });

    await queryWithTimeout(mug, act);

    expect(act).not.toHaveBeenCalled();
    expect(getIt(mug)).toStrictEqual({ querying: true });
  });
});
```

---

[返回顶部](#c92c394) &nbsp;•&nbsp;
[返回目录](./README.md)。
