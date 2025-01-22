# 指南 / 对大状态切片

[核心内容](#bfc7f69) &nbsp;•&nbsp; [异步通用操作](#5b70f21) &nbsp;•&nbsp; [通用操作复用](#3139a8c) &nbsp;•&nbsp; [默认通用操作](#78208bb) &nbsp;•&nbsp; [通用操作测试](#a8658c7) &nbsp;•&nbsp; [异步通用操作测试](#d83d546)。

[返回目录](./README.zh-Hans.md)。

中文 &nbsp;•&nbsp; [English](./eb8ec2b.md)。

## <span id="bfc7f69"></span>核心内容

状态越大包含的特质越多，有的特征还会在不同状态反复出现，通用的特征值得单拎出来，为此 React Mug 提供了状态切片。

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

这样代码结构更加清晰，并且方便复用：

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

## <span id="5b70f21"></span>异步通用操作

此外，以普通的异步函数，借助 `x` 把兼容的 Mug 声明为首参，随后将 Mug 传入通用操作调用，即可定义异步通用操作：

```ts
// QueryableMug.ts

...

const { r, w, x } = onto<QueryableState>();

...

export const retry = x(async (mug, act: () => Promise<void>, times: number = 3) => {
  if (isQuerying(mug)) {
    return;
  }

  startQuerying(mug);
  let error: unknown;
  for (let i = 0; i < times; i++) {
    try {
      await act();
      break;
    } catch (e) {
      const noMore = i === times - 1;
      if (noMore) {
        error = e;
      }
    }
  }
  endQuerying(mug);

  if (error) {
    throw error;
  }
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

## <span id="3139a8c"></span>通用操作复用

把状态一并传入通用操作，即可调用其纯函数形式，完成在操作内复用：

```ts
// QueryableMug.ts

...

export const toggleQueryingElaborately = w((state) =>
  isQuerying(state) ? endQuerying(state) : startQuerying(state),
);
```

## <span id="78208bb"></span>默认通用操作

无参调用 `r`、`w`，可以得到 “读取全量状态”、“合并写入状态” 的通用操作：

```ts
// QueryableMug.ts

...

export const get = r();

export const set = w();

export const retryAlternatively = x(async (mug, act: () => Promise<void>, times: number = 3) => {
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
      const noMore = i === times - 1;
      if (noMore) {
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

## <span id="a8658c7"></span>通用操作测试

以测试纯函数的方式，即可测试通用操作：

```ts
// QueryableMug.test.ts
import { startQuerying } from './QueryableMug';

describe('startQuerying', () => {
  test('sets querying to true', () => {
    expect(startQuerying({ querying: false })).toStrictEqual({ querying: true });
  });
});
```

## <span id="d83d546"></span>异步通用操作测试

以及，以 Mug 为支点，即可测试异步通用操作：

```ts
// QueryableMug.test.ts
import { getIt, Mug, resetIt, setIt } from 'react-mug';

import { QueryableState, retry } from './QueryableMug';

describe('retry', () => {
  const mug: Mug<QueryableState> = {
    [construction]: {
      querying: false,
    },
  };

  afterEach(() => resetIt(mug));

  test('act not called and state not changed if querying is true', async () => {
    const act = jest.fn();
    setIt(mug, { querying: true });

    await retry(act);

    expect(act).not.toHaveBeenCalled();
    expect(getIt(mug)).toStrictEqual({ querying: true });
  });
});
```

---

[返回目录](./README.zh-Hans.md)。
