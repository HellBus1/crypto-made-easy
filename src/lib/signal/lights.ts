import { SIGNAL_CONSTANTS } from './constants';
import type { LightEvaluation, SignalInput } from './types';

/**
 * Evaluates the 3 Lights (buy side and mirrored sell side) from FR-2:
 * - Light 1: Price vs MA30 / BOLL (Buy: price < MA30 or price <= bollLower; Sell: price > MA30 and/or price >= bollUpper)
 * - Light 2: RSI (Buy: RSI <= 36; Sell: RSI > 70)
 * - Light 3: Order Book Bid % (Buy: Bid % >= 40%; Sell: Bid % < 30%)
 */
export function evaluateLights(
  input: Pick<
    SignalInput,
    'currentPrice' | 'ma30' | 'bollLower' | 'bollUpper' | 'rsi' | 'bidPercent'
  >
): {
  lights: [LightEvaluation, LightEvaluation, LightEvaluation];
  buyLightsCount: number;
  sellLightsCount: number;
  askPercent: number;
} {
  const { currentPrice, ma30, bollLower, bollUpper, rsi, bidPercent } = input;
  const askPercent = Math.round((100 - bidPercent) * 100) / 100;

  // Light 1: Price vs MA30 / BOLL
  const belowMa30 = currentPrice < ma30;
  const touchingBollLower = bollLower !== undefined && currentPrice <= bollLower;
  const light1BuyOn = belowMa30 || touchingBollLower;

  const aboveMa30 = currentPrice > ma30;
  const touchingBollUpper = bollUpper !== undefined && currentPrice >= bollUpper;
  const light1SellOn = bollUpper !== undefined ? touchingBollUpper || aboveMa30 : aboveMa30;

  let light1Detail = '';
  if (light1BuyOn) {
    if (belowMa30 && touchingBollLower) {
      light1Detail = `Price (${currentPrice}) is below MA30 (${ma30}) and at/below the lower Bollinger Band (${bollLower}).`;
    } else if (belowMa30) {
      light1Detail = `Price (${currentPrice}) sits below MA30 (${ma30}), trading on discount.`;
    } else {
      light1Detail = `Price (${currentPrice}) is touching or below the lower Bollinger Band (${bollLower}).`;
    }
  } else if (touchingBollUpper) {
    light1Detail = `Price (${currentPrice}) has reached or exceeded the upper Bollinger Band (${bollUpper}).`;
  } else {
    light1Detail = `Price (${currentPrice}) is above MA30 (${ma30}); not on discount yet.`;
  }

  const light1: LightEvaluation = {
    id: 1,
    name: 'Price vs MA30 / BOLL',
    buyOn: light1BuyOn,
    sellOn: light1SellOn,
    meaning: light1BuyOn ? 'Price is on discount' : 'Price is above average baseline',
    detail: light1Detail,
  };

  // Light 2: RSI
  const light2BuyOn = rsi <= SIGNAL_CONSTANTS.BUY_RSI_MAX;
  const light2SellOn = rsi > SIGNAL_CONSTANTS.SELL_RSI_MIN;

  let light2Meaning = 'Momentum is neutral';
  let light2Detail = `RSI is ${rsi} (between ${SIGNAL_CONSTANTS.BUY_RSI_MAX} and ${SIGNAL_CONSTANTS.SELL_RSI_MIN}). Neither exhausted nor overheated.`;

  if (light2BuyOn) {
    light2Meaning = 'Sellers are running out of steam';
    light2Detail = `RSI is ${rsi} (at or below ${SIGNAL_CONSTANTS.BUY_RSI_MAX}), showing selling pressure is stretched.`;
  } else if (light2SellOn) {
    light2Meaning = 'Buyers are overheated';
    light2Detail = `RSI is ${rsi} (above ${SIGNAL_CONSTANTS.SELL_RSI_MIN}), where rallies often stall or pull back.`;
  }

  const light2: LightEvaluation = {
    id: 2,
    name: 'RSI Momentum',
    buyOn: light2BuyOn,
    sellOn: light2SellOn,
    meaning: light2Meaning,
    detail: light2Detail,
  };

  // Light 3: Order book Bid %
  const light3BuyOn = bidPercent >= SIGNAL_CONSTANTS.BUY_BID_MIN_PERCENT;
  const light3SellOn = bidPercent < SIGNAL_CONSTANTS.SELL_BID_MAX_PERCENT;

  let light3Meaning = 'Order book is balanced or thin';
  let light3Detail = `Bid is ${bidPercent}% vs Ask ${askPercent}% (below the ${SIGNAL_CONSTANTS.BUY_BID_MIN_PERCENT}% buyer-wall threshold).`;

  if (light3BuyOn) {
    light3Meaning = 'There is a wall of buyers underneath';
    light3Detail = `Bid is ${bidPercent}% vs Ask ${askPercent}% (meets the ≥ ${SIGNAL_CONSTANTS.BUY_BID_MIN_PERCENT}% Bid threshold).`;
  } else if (bidPercent >= SIGNAL_CONSTANTS.BUY_BID_BORDERLINE_PERCENT) {
    light3Meaning = 'Buyer wall is forming but below 40%';
    light3Detail = `Bid is ${bidPercent}% vs Ask ${askPercent}% (in the 35–40% watch zone; wait for ≥ 40% Bid).`;
  } else if (light3SellOn) {
    light3Meaning = 'Sellers dominate the order book';
    light3Detail = `Bid is ${bidPercent}% vs Ask ${askPercent}%. Sellers still dominate the order book.`;
  }

  const light3: LightEvaluation = {
    id: 3,
    name: 'Order Book Bid %',
    buyOn: light3BuyOn,
    sellOn: light3SellOn,
    meaning: light3Meaning,
    detail: light3Detail,
  };

  const lights: [LightEvaluation, LightEvaluation, LightEvaluation] = [light1, light2, light3];
  const buyLightsCount = lights.filter((l) => l.buyOn).length;
  const sellLightsCount = lights.filter((l) => l.sellOn).length;

  return {
    lights,
    buyLightsCount,
    sellLightsCount,
    askPercent,
  };
}

