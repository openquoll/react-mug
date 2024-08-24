import { cleanup } from '@testing-library/react';

beforeEach(() => {
  const fullTestName = expect.getState().currentTestName ?? '';
  if (['[action]', '[action,'].some((s) => fullTestName.includes(s))) {
    cleanup();
    jest.clearAllMocks();
  }
});
