import { apiRequest } from "../utils/axios";
import { RAPID_API_KEY, RAPID_API_URL } from "../config";

export const getCoin = () => {}

export const getCoins = async (payload) => {
  const options = {
    method: 'GET',
    url: `https://${RAPID_API_URL}/coins`,
    params: {
      referenceCurrencyUuid: 'yhjMzLPhuIDl',
      timePeriod: '24h',
      'tiers[0]': '1',
      orderBy: 'marketCap',
      orderDirection: 'desc',
      limit: '50',
      offset: '0',
      ...payload,
    },
    headers: {
      'X-RapidAPI-Key': RAPID_API_KEY,
      'X-RapidAPI-HOST': RAPID_API_URL,
    }
  };
  // await setupAxios()
  return await apiRequest(options)
}

export const getCoinPrice = async () => {}

export const getCoinPriceHistory = async () => {}

export const getLastTransactions = (token, limit) => {}

export const getBalance = (market, wallet, currency) => {}
