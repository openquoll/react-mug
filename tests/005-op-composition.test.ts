import { check, construction, Mug, r, swirl, w } from '../src';

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
    const sellingRabbitCount = check(cageMug).rabbitCount;
    const chickenUnitValue = check(marketMug).chickenUnitValue;

    const rabbitValue = getRabbitValueOp(marketMug, sellingRabbitCount);
    const buyingChickenCount = Math.floor(rabbitValue / chickenUnitValue);

    buyChickensOp(
      sellRabbitsOp([marketMug, cageMug, walletMug], sellingRabbitCount),
      buyingChickenCount,
    );
  }

  describe('c6e13d1, calls getCageValueOp', () => {
    let checkedMarketState: any, checkedCageState: any;
    let getCageValueOpReturn: any;

    test('[action]', () => {
      checkedMarketState = check(marketMug);
      checkedCageState = check(cageMug);
      getCageValueOpReturn = getCageValueOp([marketMug, cageMug]);
    });

    test('[verify] getCageValueFn is called 1 time', () => {
      expect(getCageValueFn).toHaveBeenCalledTimes(1);
    });

    test('[verify] getCageValueFn param state_s items equal the checked market and cage states in ref and value', () => {
      const items = getCageValueFn.mock.calls[0][0];
      expect(items[0]).toBe(checkedMarketState);
      expect(items[0]).toStrictEqual(checkedMarketState);
      expect(items[1]).toBe(checkedCageState);
      expect(items[1]).toStrictEqual(checkedCageState);
    });

    test('[verify] getChickenValueFn is called 1 time', () => {
      expect(getChickenValueFn).toHaveBeenCalledTimes(1);
    });

    test('[verify] getChickenValueFn param state equals the checked market state in ref and value', () => {
      const state = getChickenValueFn.mock.calls[0][0];
      expect(state).toBe(checkedMarketState);
      expect(state).toStrictEqual(checkedMarketState);
    });

    test('[verify] getChickenValueFn param chickenCount equals the checked cage state_s chickenCount in value', () => {
      const chickenCount = getChickenValueFn.mock.calls[0][1];
      expect(chickenCount).toBe(checkedCageState.chickenCount);
    });

    test('[verify] getRabbitValueFn is called 1 time', () => {
      expect(getRabbitValueFn).toHaveBeenCalledTimes(1);
    });

    test('[verify] getRabbitValueFn param state equals the checked market state in ref and value', () => {
      const state = getRabbitValueFn.mock.calls[0][0];
      expect(state).toBe(checkedMarketState);
      expect(state).toStrictEqual(checkedMarketState);
    });

    test('[verify] getRabbitValueFn param rabbitCount equals the checked cage state_s rabbitCount in value', () => {
      const rabbitCount = getChickenValueFn.mock.calls[0][1];
      expect(rabbitCount).toBe(checkedCageState.rabbitCount);
    });

    test('[verify] getCageValueOp return equals "5 * 5 + 8 * 5"', () => {
      expect(getCageValueOpReturn).toBe(5 * 5 + 8 * 5);
    });
  });

  describe('75168d5, calls tradeChickensForRabbitsOp', () => {
    let checkedMarketStateBefore: any, checkedMarketStateAfter: any;
    let checkedCageStateBefore: any, checkedCageStateAfter: any;
    let checkedWalletStateBefore: any, checkedWalletStateAfter: any;
    let tradeChickensForRabbitsOpReturn: any;

    test('[action]', () => {
      swirl(marketMug, marketMug[construction]);
      swirl(cageMug, cageMug[construction]);
      swirl(walletMug, walletMug[construction]);

      jest.clearAllMocks();

      checkedMarketStateBefore = check(marketMug);
      checkedCageStateBefore = check(cageMug);
      checkedWalletStateBefore = check(walletMug);
      tradeChickensForRabbitsOpReturn = tradeChickensForRabbitsOp([marketMug, cageMug, walletMug]);
      checkedMarketStateAfter = check(marketMug);
      checkedCageStateAfter = check(cageMug);
      checkedWalletStateAfter = check(walletMug);
    });

    test('[verify] tradeChickensForRabbitsFn is called 1 time', () => {
      expect(tradeChickensForRabbitsFn).toHaveBeenCalledTimes(1);
    });

    test('[verify] tradeChickensForRabbitsFn param state_s items equal the before-write checked market, cage, and wallet states in ref and value', () => {
      const items = tradeChickensForRabbitsFn.mock.calls[0][0];
      expect(items[0]).toBe(checkedMarketStateBefore);
      expect(items[0]).toStrictEqual(checkedMarketStateBefore);
      expect(items[1]).toBe(checkedCageStateBefore);
      expect(items[1]).toStrictEqual(checkedCageStateBefore);
      expect(items[2]).toBe(checkedWalletStateBefore);
      expect(items[2]).toStrictEqual(checkedWalletStateBefore);
    });

    test('[verify] getChickenValueFn is called 2 times', () => {
      expect(getChickenValueFn).toHaveBeenCalledTimes(2);
    });

    test('[verify] getChickenValueFn param state keeps equal to the before-write checked market state in ref and value', () => {
      const state1 = getChickenValueFn.mock.calls[0][0];
      expect(state1).toBe(checkedMarketStateBefore);
      expect(state1).toStrictEqual(checkedMarketStateBefore);

      const state2 = getChickenValueFn.mock.calls[1][0];
      expect(state2).toBe(checkedMarketStateBefore);
      expect(state2).toStrictEqual(checkedMarketStateBefore);
    });

    test('[verify] getChickenValueFn param chickenCount keeps equal to the before-write checked cage state_s chickenCount in value', () => {
      const chickenCount1 = getChickenValueFn.mock.calls[0][1];
      expect(chickenCount1).toBe(checkedCageStateBefore.chickenCount);

      const chickenCount2 = getChickenValueFn.mock.calls[1][1];
      expect(chickenCount2).toBe(checkedCageStateBefore.chickenCount);
    });

    test('[verify] sellChickensFn is called 1 time', () => {
      expect(sellChickensFn).toHaveBeenCalledTimes(1);
    });

    test('[verify] sellChickensFn param state_s items equal the before-write checked market, cage, and wallet states in ref and value', () => {
      const items = sellChickensFn.mock.calls[0][0];
      expect(items[0]).toBe(checkedMarketStateBefore);
      expect(items[0]).toStrictEqual(checkedMarketStateBefore);
      expect(items[1]).toBe(checkedCageStateBefore);
      expect(items[1]).toStrictEqual(checkedCageStateBefore);
      expect(items[2]).toBe(checkedWalletStateBefore);
      expect(items[2]).toStrictEqual(checkedWalletStateBefore);
    });

    test('[verify] sellChickensFn param chickenCount equals the before-write checked cage state_s chickenCount in value', () => {
      const chickenCount = sellChickensFn.mock.calls[0][1];
      expect(chickenCount).toBe(checkedCageStateBefore.chickenCount);
    });

    test('[verify] buyRabbitsFn is called 1 time', () => {
      expect(buyRabbitsFn).toHaveBeenCalledTimes(1);
    });

    test('[verify] buyRabbitsFn param state and its items equal sellChickensFn return and its items in ref and value', () => {
      const buyRabbitsFnParamState = buyRabbitsFn.mock.calls[0][0];
      const sellChickensFnReturn = sellChickensFn.mock.results[0].value;
      expect(buyRabbitsFnParamState).toBe(sellChickensFnReturn);
      sellChickensFnReturn.forEach((item: any, i: number) => {
        expect(buyRabbitsFnParamState[i]).toBe(item);
      });
      expect(buyRabbitsFnParamState).toStrictEqual(sellChickensFnReturn);
    });

    test('[verify] the after-write checked market, cage, and wallet states equal buyRabbitsFn return_s items in ref and value', () => {
      const items = buyRabbitsFn.mock.results[0].value;
      expect(checkedMarketStateAfter).toBe(items[0]);
      expect(checkedMarketStateAfter).toStrictEqual(items[0]);
      expect(checkedCageStateAfter).toBe(items[1]);
      expect(checkedCageStateAfter).toStrictEqual(items[1]);
      expect(checkedWalletStateAfter).toBe(items[2]);
      expect(checkedWalletStateAfter).toStrictEqual(items[2]);
    });

    test('[verify] the checked market state stays unchanged in ref and value', () => {
      expect(checkedMarketStateAfter).toBe(checkedMarketStateBefore);
      expect(checkedMarketStateAfter).toStrictEqual(checkedMarketStateBefore);
    });

    test('[verify] the after-write checked cage state has chickenCount as "0" and rabbitCount as "8"', () => {
      expect(checkedCageStateAfter).toStrictEqual({
        chickenCount: 0,
        rabbitCount: 8,
      });
    });

    test('[verify] the after-write checked wallet state has balance as "101"', () => {
      expect(checkedWalletStateAfter).toStrictEqual({
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
    let checkedMarketStateBefore: any, checkedMarketStateAfter: any;
    let checkedCageStateBefore: any, checkedCageStateAfter: any;
    let checkedWalletStateBefore: any, checkedWalletStateAfter: any;

    test('[action]', () => {
      swirl(marketMug, marketMug[construction]);
      swirl(cageMug, cageMug[construction]);
      swirl(walletMug, walletMug[construction]);

      jest.clearAllMocks();

      checkedMarketStateBefore = check(marketMug);
      checkedCageStateBefore = check(cageMug);
      checkedWalletStateBefore = check(walletMug);
      tradeRabbitsForChickensProcedure();
      checkedMarketStateAfter = check(marketMug);
      checkedCageStateAfter = check(cageMug);
      checkedWalletStateAfter = check(walletMug);
    });

    test('[verify] getRabbitValueFn is called 2 times', () => {
      expect(getRabbitValueFn).toHaveBeenCalledTimes(2);
    });

    test('[verify] getRabbitValueFn param state keeps equal to the before-write checked market state in ref and value', () => {
      const state1 = getRabbitValueFn.mock.calls[0][0];
      expect(state1).toBe(checkedMarketStateBefore);
      expect(state1).toStrictEqual(checkedMarketStateBefore);

      const state2 = getRabbitValueFn.mock.calls[1][0];
      expect(state2).toBe(checkedMarketStateBefore);
      expect(state2).toStrictEqual(checkedMarketStateBefore);
    });

    test('[verify] getRabbitValueFn param rabbitCount keeps equal to the before-write checked cage state_s rabbitCount in value', () => {
      const rabbitCount1 = getRabbitValueFn.mock.calls[0][1];
      expect(rabbitCount1).toBe(checkedCageStateBefore.rabbitCount);

      const rabbitCount2 = getRabbitValueFn.mock.calls[1][1];
      expect(rabbitCount2).toBe(checkedCageStateBefore.rabbitCount);
    });

    test('[verify] sellRabbitsFn is called 1 time', () => {
      expect(sellRabbitsFn).toHaveBeenCalledTimes(1);
    });

    test('[verify] sellRabbitsFn param state_s items equal the before-write checked market, cage, and wallet states in ref and value', () => {
      const items = sellRabbitsFn.mock.calls[0][0];
      expect(items[0]).toBe(checkedMarketStateBefore);
      expect(items[0]).toStrictEqual(checkedMarketStateBefore);
      expect(items[1]).toBe(checkedCageStateBefore);
      expect(items[1]).toStrictEqual(checkedCageStateBefore);
      expect(items[2]).toBe(checkedWalletStateBefore);
      expect(items[2]).toStrictEqual(checkedWalletStateBefore);
    });

    test('[verify] sellRabbitsFn param rabbitCount equals the before-write checked cage state_s rabbitCount in value', () => {
      const rabbitCount = sellRabbitsFn.mock.calls[0][1];
      expect(rabbitCount).toBe(checkedCageStateBefore.rabbitCount);
    });

    test('[verify] buyChickensFn is called 1 time', () => {
      expect(buyChickensFn).toHaveBeenCalledTimes(1);
    });

    test('[verify] buyChickensFn param state differs from sellRabbitsFn return in ref', () => {
      const buyChickensFnParamState = buyChickensFn.mock.calls[0][0];
      const sellRabbitsFnReturn = sellRabbitsFn.mock.results[0].value;
      expect(buyChickensFnParamState).not.toBe(sellRabbitsFnReturn);
    });

    test('[verify] buyChickensFn param state_s items equal sellRabbitsFn return_s items in ref and value', () => {
      const buyChickensFnParamState = buyChickensFn.mock.calls[0][0];
      const sellRabbitsFnReturn = sellRabbitsFn.mock.results[0].value;
      sellRabbitsFnReturn.forEach((item: any, i: number) => {
        expect(buyChickensFnParamState[i]).toBe(item);
        expect(buyChickensFnParamState[i]).toStrictEqual(item);
      });
    });

    test('[verify] the after-write checked market, cage, and wallet states equal buyChickensFn return_s items in ref and value', () => {
      const items = buyChickensFn.mock.results[0].value;
      expect(checkedMarketStateAfter).toBe(items[0]);
      expect(checkedMarketStateAfter).toStrictEqual(items[0]);
      expect(checkedCageStateAfter).toBe(items[1]);
      expect(checkedCageStateAfter).toStrictEqual(items[1]);
      expect(checkedWalletStateAfter).toBe(items[2]);
      expect(checkedWalletStateAfter).toStrictEqual(items[2]);
    });

    test('[verify] the checked market state stays unchanged in ref and value', () => {
      expect(checkedMarketStateAfter).toBe(checkedMarketStateBefore);
      expect(checkedMarketStateAfter).toStrictEqual(checkedMarketStateBefore);
    });

    test('[verify] the after-write checked cage state has chickenCount as "13" and rabbitCount as "0"', () => {
      expect(checkedCageStateAfter).toStrictEqual({
        chickenCount: 13,
        rabbitCount: 0,
      });
    });

    test('[verify] the after-write checked wallet state has balance as "100"', () => {
      expect(checkedWalletStateAfter).toStrictEqual({
        balance: 100,
      });
    });
  });
});
