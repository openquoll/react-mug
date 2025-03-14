# <span id="06c8bd8"></span>Guide / Segregate General Traits

[Key Content](#256ed49) &nbsp;•&nbsp;
[Async General Ops](#18fab2d) &nbsp;•&nbsp;
[General Op Reuse](#1c5618e) &nbsp;•&nbsp;
[Default General Ops](#f8f326d) &nbsp;•&nbsp;
[General Op Testing](#0535cd6) &nbsp;•&nbsp;
[Async General Op Testing](#ae966ca).

[Back to ToC](./README.en.md).

English &nbsp;•&nbsp; [中文](./eb8ec2b.md).

## <span id="256ed49"></span>Key Content

The bigger scale a state is, the more traits it contains. Some traits can reappear across different states, which makes them worth setting apart. Thus, React Mug provides trait segregation mechanism.

For example, regarding a value-queryable counter state as follows:

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

By segregation, the "queryable" trait can be extracted as a general state:

```ts
// QueryableState.ts
import { onto } from 'react-mug';

export interface QueryableState {
  querying: boolean;
}

const { r, w } = onto<QueryableState>();

// General read ops
export const isQuerying = r((state) => state.querying);

// General write ops
export const startQuerying = w(() => ({ querying: true }));

export const endQuerying = w(() => ({ querying: false }));

// Namespace of general ops
export * as queryableOps from './QueryableState';
```

Then it gets inserted back to the counter state:

```ts
// CounterState.ts
import { construction, upon } from 'react-mug';
import { queryableOps, QueryableState } from './QueryableState';

// Insert back queryable state
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

// Insert back queryable state
export const { isQuerying, startQuerying, endQuerying } = s(queryableOps);

export const getValue = r((state) => {
  // Reuse queryable ops
  if (isQuerying(state)) {
    return;
  }
  return state.value;
});

export const increase = w((state, delta: number) => ({ value: state.value + delta }));

export const set = w();

export const queryValue = async () => {
  // Invoke queryable ops
  startQuerying();
  const { data: value } = await fetch('/api/counter/value').then((res) => res.json());
  set({ value });
  // Invoke queryable ops
  endQuerying();
};
```

As such, the code is kept equivalent, but the structure gets clearer, and later reuse becomes possible:

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

So that states are divided down in an orderly manner.

## <span id="18fab2d"></span>Async General Ops

Further more, passing async functions into the method `x` and invoking general ops inside create async general ops:

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

## <span id="1c5618e"></span>General Op Reuse

Passing states all at once into general ops activates functional mode for inter-op reuse:

```ts
// QueryableState.ts

export const toggleQueryingVerbosely = w((state) =>
  isQuerying(state) ? endQuerying(state) : startQuerying(state),
);
```

## <span id="f8f326d"></span>Default General Ops

Empty-param calls to `r`, `w` create "Read by all", "Write by merge" general ops:

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

## <span id="0535cd6"></span>General Op Testing

The easy approach to testing pure functions applies the same to general ops:

```ts
// QueryableState.test.ts
import { startQuerying } from './QueryableState';

describe('startQuerying', () => {
  test('sets querying to true', () => {
    expect(startQuerying({ querying: false })).toStrictEqual({ querying: true });
  });
});
```

## <span id="ae966ca"></span>Async General Op Testing

Also, mugs as fulcrums boost up testing async general ops:

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

[Back to Top](#06c8bd8) &nbsp;•&nbsp;
[Back to ToC](./README.en.md).
