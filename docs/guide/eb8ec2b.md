# Guide / Segregate General Traits

[Key Content](#256ed49) &nbsp;•&nbsp; [Async General Ops](#18fab2d) &nbsp;•&nbsp; [General Op Reuse](#1c5618e) &nbsp;•&nbsp; [Default General Ops](#f8f326d) &nbsp;•&nbsp; [General Op Testing](#0535cd6) &nbsp;•&nbsp; [Async General Op Testing](#ae966ca).

[Back to ToC](./README.md).

English &nbsp;•&nbsp; [中文](./eb8ec2b.zh-Hans.md).

## <span id="256ed49"></span>Key Content

The bigger a state, the more traits there are. Some traits can reappear in different states. General traits are worth setting apart. Thus, React Mug provides trait segregation.

For example, regarding a counter state as follows:

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

By segregation, the "queryable" trait gets extracted as a general state:

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

It, then, gets plugged back into the counter state:

```ts
// CounterMug.ts
import { construction, upon } from 'react-mug';

import { QueryableModule, QueryableState } from './QueryableMug';

// Plug in queryable state
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

// Plug in queryable state
export const { isQuerying, startQuerying, endQuerying } = s(QueryableModule);

export const getValue = r((state) => {
  // Call queryable ops
  if (isQuerying(state)) {
    return;
  }
  return state.value;
});

export const increase = w((state, delta: number) => ({ ...state, value: state.value + delta }));

export const set = w();

export const queryValue = async () => {
  // Call queryable ops
  startQuerying();
  const value = await RestfulApi.counter.value.get();
  set({ value });
  // Call queryable ops
  endQuerying();
};
```

As such, a clearer code structure is achieved, and reuse becomes convenient:

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
  const text = await RestfulApi.briefing.text.get();
  set({ text });
  endQuerying();
};
```

States are divided in an orderly manner.

## <span id="18fab2d"></span>Async General Ops

In addition, with plain async functions, specifying the first param as compatible mugs utilizing `x`, then calling general ops with the mug param defines async general ops:

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

...
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

## <span id="1c5618e"></span>General Op Reuse

Passing states into general ops all at once activates functional mode, which enables in-op reuse:

```ts
// QueryableMug.ts

...

export const toggleQueryingElaborately = w((state) =>
  isQuerying(state) ? endQuerying(state) : startQuerying(state),
);

...
```

## <span id="f8f326d"></span>Default General Ops

Calling `r`, `w` without params creates "Read by all", "Write by merge" general ops:

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

...
```

## <span id="0535cd6"></span>General Op Testing

The approach to testing pure functions applies to general ops:

```ts
// QueryableMug.test.ts
import { startQuerying } from './QueryableMug';

describe('startQuerying', () => {
  test('sets querying to true', () => {
    expect(startQuerying({ querying: false })).toStrictEqual({ querying: true });
  });
});
```

## <span id="ae966ca"></span>Async General Op Testing

Also, mugs as fulcrums boost testing async general ops:

```ts
// QueryableMug.test.ts
import { getIt, Mug, resetIt, setIt } from 'react-mug';

import { ..., QueryableState, retry } from './QueryableMug';

...

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

    await retry(mug, act);

    expect(act).not.toHaveBeenCalled();
    expect(getIt(mug)).toStrictEqual({ querying: true });
  });
});
```

---

[Back to ToC](./README.md).
