import { construction, getIt, Mug, r, setIt, w } from '../src';

describe('3b2660f, composites ops to model a farmer_s chicken rabbit cage on a market, [cite] 003, 004', () => {
  interface MarketState {
    chickenUnitValue: number;
    rabbitUnitValue: number;
  }

  const marketMug: Mug<MarketState> = {
    [construction]: {
      chickenUnitValue: 5,
      rabbitUnitValue: 8,
    },
  };

  interface WalletState {
    balance: number;
  }

  const walletMug: Mug<WalletState> = {
    [construction]: {
      balance: 100,
    },
  };

  interface CageState {
    chickenCount: number;
    rabbitCount: number;
  }

  const cageMug: Mug<CageState> = {
    [construction]: {
      chickenCount: 5,
      rabbitCount: 5,
    },
  };

  const getChickenValueFn = jest.fn((marketState: MarketState, chickenCount: number): number => {
    return marketState.chickenUnitValue * chickenCount;
  });
  const getChickenValueOp = r(getChickenValueFn);

  const getRabbitValueFn = jest.fn((marketState: MarketState, rabbitCount: number): number => {
    return marketState.rabbitUnitValue * rabbitCount;
  });
  const getRabbitValueOp = r(getRabbitValueFn);

  const getCageValueFn = jest.fn(([marketState, cageState]: [MarketState, CageState]): number => {
    return (
      getChickenValueOp(marketState, cageState.chickenCount) +
      getRabbitValueOp(marketState, cageState.rabbitCount)
    );
  });
  const getCageValueOp = r(getCageValueFn);

  const buyChickensFn = jest.fn(
    (
      [marketState, cageState, walletState]: [MarketState, CageState, WalletState],
      count: number,
    ): [MarketState, CageState, WalletState] => {
      const outcome = getChickenValueOp(marketState, count);
      return [
        marketState,
        { ...cageState, chickenCount: cageState.chickenCount + count },
        { ...walletState, balance: walletState.balance - outcome },
      ];
    },
  );
  const buyChickensOp = w(buyChickensFn);

  const sellChickensFn = jest.fn(
    (
      [marketState, cageState, walletState]: [MarketState, CageState, WalletState],
      count: number,
    ): [MarketState, CageState, WalletState] => {
      const income = getChickenValueOp(marketState, count);
      return [
        marketState,
        { ...cageState, chickenCount: cageState.chickenCount - count },
        { ...walletState, balance: walletState.balance + income },
      ];
    },
  );
  const sellChickensOp = w(sellChickensFn);

  const buyRabbitsFn = jest.fn(
    (
      [marketState, cageState, walletState]: [MarketState, CageState, WalletState],
      count: number,
    ): [MarketState, CageState, WalletState] => {
      const outcome = getRabbitValueOp(marketState, count);
      return [
        marketState,
        { ...cageState, rabbitCount: cageState.rabbitCount + count },
        { ...walletState, balance: walletState.balance - outcome },
      ];
    },
  );
  const buyRabbitsOp = w(buyRabbitsFn);

  const sellRabbitsFn = jest.fn(
    (
      [marketState, cageState, walletState]: [MarketState, CageState, WalletState],
      count: number,
    ): [MarketState, CageState, WalletState] => {
      const income = getRabbitValueOp(marketState, count);
      return [
        marketState,
        { ...cageState, rabbitCount: cageState.rabbitCount - count },
        { ...walletState, balance: walletState.balance + income },
      ];
    },
  );
  const sellRabbitsOp = w(sellRabbitsFn);

  const tradeChickensForRabbitsFn = jest.fn(
    ([marketState, cageState, walletState]: [MarketState, CageState, WalletState]): [
      MarketState,
      CageState,
      WalletState,
    ] => {
      const sellingChickenCount = cageState.chickenCount;
      const chickenValue = getChickenValueOp(marketState, sellingChickenCount);
      const buyingRabbitCount = Math.floor(chickenValue / marketState.rabbitUnitValue);

      return buyRabbitsOp(
        sellChickensOp([marketState, cageState, walletState], sellingChickenCount),
        buyingRabbitCount,
      );
    },
  );
  const tradeChickensForRabbitsOp = w(tradeChickensForRabbitsFn);

  function tradeRabbitsForChickensProcedure() {
    const sellingRabbitCount = getIt(cageMug).rabbitCount;
    const chickenUnitValue = getIt(marketMug).chickenUnitValue;

    const rabbitValue = getRabbitValueOp(marketMug, sellingRabbitCount);
    const buyingChickenCount = Math.floor(rabbitValue / chickenUnitValue);

    buyChickensOp(
      sellRabbitsOp([marketMug, cageMug, walletMug], sellingRabbitCount),
      buyingChickenCount,
    );
  }

  describe('c6e13d1, calls getCageValueOp', () => {
    let gotMarketState: MarketState, gotCageState: CageState;
    let getCageValueOpReturn: number;

    test('[action]', () => {
      gotMarketState = getIt(marketMug);
      gotCageState = getIt(cageMug);
      getCageValueOpReturn = getCageValueOp([marketMug, cageMug]);
    });

    test('[verify] getCageValueFn is called 1 time', () => {
      expect(getCageValueFn).toHaveBeenCalledTimes(1);
    });

    test('[verify] getCageValueFn param state_s items equal the got market and cage states in ref and value', () => {
      const items: [MarketState, CageState] = getCageValueFn.mock.calls[0][0];
      expect(items[0]).toBe(gotMarketState);
      expect(items[0]).toStrictEqual(gotMarketState);
      expect(items[1]).toBe(gotCageState);
      expect(items[1]).toStrictEqual(gotCageState);
    });

    test('[verify] getChickenValueFn is called 1 time', () => {
      expect(getChickenValueFn).toHaveBeenCalledTimes(1);
    });

    test('[verify] getChickenValueFn param state equals the got market state in ref and value', () => {
      const state: MarketState = getChickenValueFn.mock.calls[0][0];
      expect(state).toBe(gotMarketState);
      expect(state).toStrictEqual(gotMarketState);
    });

    test('[verify] getChickenValueFn param chickenCount equals the got cage state_s chickenCount in value', () => {
      const chickenCount: number = getChickenValueFn.mock.calls[0][1];
      expect(chickenCount).toBe(gotCageState.chickenCount);
    });

    test('[verify] getRabbitValueFn is called 1 time', () => {
      expect(getRabbitValueFn).toHaveBeenCalledTimes(1);
    });

    test('[verify] getRabbitValueFn param state equals the got market state in ref and value', () => {
      const state: MarketState = getRabbitValueFn.mock.calls[0][0];
      expect(state).toBe(gotMarketState);
      expect(state).toStrictEqual(gotMarketState);
    });

    test('[verify] getRabbitValueFn param rabbitCount equals the got cage state_s rabbitCount in value', () => {
      const rabbitCount = getChickenValueFn.mock.calls[0][1];
      expect(rabbitCount).toBe(gotCageState.rabbitCount);
    });

    test('[verify] getCageValueOp return equals "5 * 5 + 8 * 5"', () => {
      expect(getCageValueOpReturn).toBe(5 * 5 + 8 * 5);
    });
  });

  describe('75168d5, calls tradeChickensForRabbitsOp', () => {
    let gotMarketStateBefore: MarketState, gotMarketStateAfter: MarketState;
    let gotCageStateBefore: CageState, gotCageStateAfter: CageState;
    let gotWalletStateBefore: WalletState, gotWalletStateAfter: WalletState;
    let tradeChickensForRabbitsOpReturn: [Mug<MarketState>, Mug<CageState>, Mug<WalletState>];

    test('[action]', () => {
      setIt(marketMug, marketMug[construction]);
      setIt(cageMug, cageMug[construction]);
      setIt(walletMug, walletMug[construction]);

      jest.clearAllMocks();

      gotMarketStateBefore = getIt(marketMug);
      gotCageStateBefore = getIt(cageMug);
      gotWalletStateBefore = getIt(walletMug);
      tradeChickensForRabbitsOpReturn = tradeChickensForRabbitsOp([marketMug, cageMug, walletMug]);
      gotMarketStateAfter = getIt(marketMug);
      gotCageStateAfter = getIt(cageMug);
      gotWalletStateAfter = getIt(walletMug);
    });

    test('[verify] tradeChickensForRabbitsFn is called 1 time', () => {
      expect(tradeChickensForRabbitsFn).toHaveBeenCalledTimes(1);
    });

    test('[verify] tradeChickensForRabbitsFn param state_s items equal the before-write got market, cage, and wallet states in ref and value', () => {
      const items: [MarketState, CageState, WalletState] =
        tradeChickensForRabbitsFn.mock.calls[0][0];
      expect(items[0]).toBe(gotMarketStateBefore);
      expect(items[0]).toStrictEqual(gotMarketStateBefore);
      expect(items[1]).toBe(gotCageStateBefore);
      expect(items[1]).toStrictEqual(gotCageStateBefore);
      expect(items[2]).toBe(gotWalletStateBefore);
      expect(items[2]).toStrictEqual(gotWalletStateBefore);
    });

    test('[verify] getChickenValueFn is called 2 times', () => {
      expect(getChickenValueFn).toHaveBeenCalledTimes(2);
    });

    test('[verify] getChickenValueFn param state keeps equal to the before-write got market state in ref and value', () => {
      const state1 = getChickenValueFn.mock.calls[0][0];
      expect(state1).toBe(gotMarketStateBefore);
      expect(state1).toStrictEqual(gotMarketStateBefore);

      const state2 = getChickenValueFn.mock.calls[1][0];
      expect(state2).toBe(gotMarketStateBefore);
      expect(state2).toStrictEqual(gotMarketStateBefore);
    });

    test('[verify] getChickenValueFn param chickenCount keeps equal to the before-write got cage state_s chickenCount in value', () => {
      const chickenCount1 = getChickenValueFn.mock.calls[0][1];
      expect(chickenCount1).toBe(gotCageStateBefore.chickenCount);

      const chickenCount2 = getChickenValueFn.mock.calls[1][1];
      expect(chickenCount2).toBe(gotCageStateBefore.chickenCount);
    });

    test('[verify] sellChickensFn is called 1 time', () => {
      expect(sellChickensFn).toHaveBeenCalledTimes(1);
    });

    test('[verify] sellChickensFn param state_s items equal the before-write got market, cage, and wallet states in ref and value', () => {
      const items: [MarketState, CageState, WalletState] = sellChickensFn.mock.calls[0][0];
      expect(items[0]).toBe(gotMarketStateBefore);
      expect(items[0]).toStrictEqual(gotMarketStateBefore);
      expect(items[1]).toBe(gotCageStateBefore);
      expect(items[1]).toStrictEqual(gotCageStateBefore);
      expect(items[2]).toBe(gotWalletStateBefore);
      expect(items[2]).toStrictEqual(gotWalletStateBefore);
    });

    test('[verify] sellChickensFn param chickenCount equals the before-write got cage state_s chickenCount in value', () => {
      const chickenCount: number = sellChickensFn.mock.calls[0][1];
      expect(chickenCount).toBe(gotCageStateBefore.chickenCount);
    });

    test('[verify] buyRabbitsFn is called 1 time', () => {
      expect(buyRabbitsFn).toHaveBeenCalledTimes(1);
    });

    test('[verify] buyRabbitsFn param state and its items equal sellChickensFn return and its items in ref and value', () => {
      const buyRabbitsFnParamState: [MarketState, CageState, WalletState] =
        buyRabbitsFn.mock.calls[0][0];
      const sellChickensFnReturn: [MarketState, CageState, WalletState] =
        sellChickensFn.mock.results[0].value;
      expect(buyRabbitsFnParamState).toBe(sellChickensFnReturn);
      sellChickensFnReturn.forEach((item, i) => {
        expect(buyRabbitsFnParamState[i]).toBe(item);
      });
      expect(buyRabbitsFnParamState).toStrictEqual(sellChickensFnReturn);
    });

    test('[verify] the after-write got market, cage, and wallet states equal buyRabbitsFn return_s items in ref and value', () => {
      const items: [MarketState, CageState, WalletState] = buyRabbitsFn.mock.results[0].value;
      expect(gotMarketStateAfter).toBe(items[0]);
      expect(gotMarketStateAfter).toStrictEqual(items[0]);
      expect(gotCageStateAfter).toBe(items[1]);
      expect(gotCageStateAfter).toStrictEqual(items[1]);
      expect(gotWalletStateAfter).toBe(items[2]);
      expect(gotWalletStateAfter).toStrictEqual(items[2]);
    });

    test('[verify] the got market state stays unchanged in ref and value', () => {
      expect(gotMarketStateAfter).toBe(gotMarketStateBefore);
      expect(gotMarketStateAfter).toStrictEqual(gotMarketStateBefore);
    });

    test('[verify] the after-write got cage state has chickenCount as "0" and rabbitCount as "8"', () => {
      expect(gotCageStateAfter).toStrictEqual({
        chickenCount: 0,
        rabbitCount: 8,
      });
    });

    test('[verify] the after-write got wallet state has balance as "101"', () => {
      expect(gotWalletStateAfter).toStrictEqual({
        balance: 101,
      });
    });

    test('[verify] tradeChickensForRabbitsOp return_s items equal the market mug, the cage mug, and the wallet mug in ref and value', () => {
      expect(tradeChickensForRabbitsOpReturn[0]).toBe(marketMug);
      expect(tradeChickensForRabbitsOpReturn[0]).toStrictEqual(marketMug);
      expect(tradeChickensForRabbitsOpReturn[1]).toBe(cageMug);
      expect(tradeChickensForRabbitsOpReturn[1]).toStrictEqual(cageMug);
      expect(tradeChickensForRabbitsOpReturn[2]).toBe(walletMug);
      expect(tradeChickensForRabbitsOpReturn[2]).toStrictEqual(walletMug);
    });
  });

  describe('27703c0, calls tradeRabbitsForChickensProcedure', () => {
    let gotMarketStateBefore: MarketState, gotMarketStateAfter: MarketState;
    let gotCageStateBefore: CageState, gotCageStateAfter: CageState;
    let gotWalletStateBefore: WalletState, gotWalletStateAfter: WalletState;

    test('[action]', () => {
      setIt(marketMug, marketMug[construction]);
      setIt(cageMug, cageMug[construction]);
      setIt(walletMug, walletMug[construction]);

      jest.clearAllMocks();

      gotMarketStateBefore = getIt(marketMug);
      gotCageStateBefore = getIt(cageMug);
      gotWalletStateBefore = getIt(walletMug);
      tradeRabbitsForChickensProcedure();
      gotMarketStateAfter = getIt(marketMug);
      gotCageStateAfter = getIt(cageMug);
      gotWalletStateAfter = getIt(walletMug);
    });

    test('[verify] getRabbitValueFn is called 2 times', () => {
      expect(getRabbitValueFn).toHaveBeenCalledTimes(2);
    });

    test('[verify] getRabbitValueFn param state keeps equal to the before-write got market state in ref and value', () => {
      const state1: MarketState = getRabbitValueFn.mock.calls[0][0];
      expect(state1).toBe(gotMarketStateBefore);
      expect(state1).toStrictEqual(gotMarketStateBefore);

      const state2: MarketState = getRabbitValueFn.mock.calls[1][0];
      expect(state2).toBe(gotMarketStateBefore);
      expect(state2).toStrictEqual(gotMarketStateBefore);
    });

    test('[verify] getRabbitValueFn param rabbitCount keeps equal to the before-write got cage state_s rabbitCount in value', () => {
      const rabbitCount1: number = getRabbitValueFn.mock.calls[0][1];
      expect(rabbitCount1).toBe(gotCageStateBefore.rabbitCount);

      const rabbitCount2: number = getRabbitValueFn.mock.calls[1][1];
      expect(rabbitCount2).toBe(gotCageStateBefore.rabbitCount);
    });

    test('[verify] sellRabbitsFn is called 1 time', () => {
      expect(sellRabbitsFn).toHaveBeenCalledTimes(1);
    });

    test('[verify] sellRabbitsFn param state_s items equal the before-write got market, cage, and wallet states in ref and value', () => {
      const items: [MarketState, CageState, WalletState] = sellRabbitsFn.mock.calls[0][0];
      expect(items[0]).toBe(gotMarketStateBefore);
      expect(items[0]).toStrictEqual(gotMarketStateBefore);
      expect(items[1]).toBe(gotCageStateBefore);
      expect(items[1]).toStrictEqual(gotCageStateBefore);
      expect(items[2]).toBe(gotWalletStateBefore);
      expect(items[2]).toStrictEqual(gotWalletStateBefore);
    });

    test('[verify] sellRabbitsFn param rabbitCount equals the before-write got cage state_s rabbitCount in value', () => {
      const rabbitCount: number = sellRabbitsFn.mock.calls[0][1];
      expect(rabbitCount).toBe(gotCageStateBefore.rabbitCount);
    });

    test('[verify] buyChickensFn is called 1 time', () => {
      expect(buyChickensFn).toHaveBeenCalledTimes(1);
    });

    test('[verify] buyChickensFn param state differs from sellRabbitsFn return in ref', () => {
      const buyChickensFnParamState: [MarketState, CageState, WalletState] =
        buyChickensFn.mock.calls[0][0];
      const sellRabbitsFnReturn: [MarketState, CageState, WalletState] =
        sellRabbitsFn.mock.results[0].value;
      expect(buyChickensFnParamState).not.toBe(sellRabbitsFnReturn);
    });

    test('[verify] buyChickensFn param state_s items equal sellRabbitsFn return_s items in ref and value', () => {
      const buyChickensFnParamState: [MarketState, CageState, WalletState] =
        buyChickensFn.mock.calls[0][0];
      const sellRabbitsFnReturn: [MarketState, CageState, WalletState] =
        sellRabbitsFn.mock.results[0].value;
      sellRabbitsFnReturn.forEach((item, i) => {
        expect(buyChickensFnParamState[i]).toBe(item);
        expect(buyChickensFnParamState[i]).toStrictEqual(item);
      });
    });

    test('[verify] the after-write got market, cage, and wallet states equal buyChickensFn return_s items in ref and value', () => {
      const items: [MarketState, CageState, WalletState] = buyChickensFn.mock.results[0].value;
      expect(gotMarketStateAfter).toBe(items[0]);
      expect(gotMarketStateAfter).toStrictEqual(items[0]);
      expect(gotCageStateAfter).toBe(items[1]);
      expect(gotCageStateAfter).toStrictEqual(items[1]);
      expect(gotWalletStateAfter).toBe(items[2]);
      expect(gotWalletStateAfter).toStrictEqual(items[2]);
    });

    test('[verify] the got market state stays unchanged in ref and value', () => {
      expect(gotMarketStateAfter).toBe(gotMarketStateBefore);
      expect(gotMarketStateAfter).toStrictEqual(gotMarketStateBefore);
    });

    test('[verify] the after-write got cage state has chickenCount as "13" and rabbitCount as "0"', () => {
      expect(gotCageStateAfter).toStrictEqual({
        chickenCount: 13,
        rabbitCount: 0,
      });
    });

    test('[verify] the after-write got wallet state has balance as "100"', () => {
      expect(gotWalletStateAfter).toStrictEqual({
        balance: 100,
      });
    });
  });
});
