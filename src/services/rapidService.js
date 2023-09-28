import { getCoins } from '../utils/rapidApi';
/***

Get coins data by token symbol, for example

getCoinsBySymbols(['BTC', 'ETH'])

***/

export const getCoinsBySymbols = (symbols) => {
  return getCoins({ symbols })
}
