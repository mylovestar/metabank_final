import { serializeTokens } from './tokens'
import { SerializedFarmConfig } from './types'
import { CHAIN_ID } from './networks'

const serializedTokens = serializeTokens()

const farms: SerializedFarmConfig[] = [
  {
    pid: 0,
    lpSymbol: 'HODLX-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xe253B0F3b8B7526314831f3ABF6fEdd9A44A185b',
    },
    isTokenOnly: false,
    token: serializedTokens.hodlx,
    quoteToken: serializedTokens.wbnb,
  },
  {
    pid: 1,
    lpSymbol: 'HODL-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x0bd7F4AEBed7b748E4743A8C544B7C5450dD7EBa',
    },
    isTokenOnly: false,
    token: serializedTokens.wbnb,
    quoteToken: serializedTokens.hodl,
  },
  // {
  //   pid: 6,
  //   lpSymbol: 'HODLX-BUSD LP',
  //   lpAddresses: {
  //     97: '',
  //     56: '0xBba8Fc4bcDC48d59aEd704907be6C084E5cAc3B2',
  //   },
  //   isTokenOnly: false,
  //   token: serializedTokens.hodlx,
  //   quoteToken: serializedTokens.busd,
  //   isCommunity: true
  // },
  {
    pid: 7,
    lpSymbol: 'HODLX-HODL LP',
    lpAddresses: {
      97: '',
      56: '0x1CEccDaD9C5a5C86F508cba9C8bDc79DcaF67074',
    },
    isTokenOnly: false,
    token: serializedTokens.hodlx,
    quoteToken: serializedTokens.hodl,
  },
  // {
  //   pid: 5,
  //   lpSymbol: 'SOKU-BNB LP',
  //   lpAddresses: {
  //     97: '',
  //     56: '0x62939BA5A90848B119D5845006870fF2C16D1514',
  //   },
  //   isTokenOnly: false,
  //   token: serializedTokens.soku,
  //   quoteToken: serializedTokens.wbnb,
  //   isCommunity: true
  // },
  {
    pid: 2,
    lpSymbol: 'BUSD-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x03ba231d702eF03cF8e9F7c60404893cCA64c341',
    },
    isTokenOnly: false,
    token: serializedTokens.busd,
    quoteToken: serializedTokens.wbnb,
    isCommunity: true
  },
  {
    pid: 3,
    lpSymbol: 'HODLX',
    lpAddresses: {
      97: '',
      56: '0xe253B0F3b8B7526314831f3ABF6fEdd9A44A185b',
    },
    isTokenOnly: true,
    token: serializedTokens.hodlx,
    quoteToken: serializedTokens.wbnb,
  },
  {
    pid: 4,
    lpSymbol: 'HODL',
    lpAddresses: {
      97: '',
      56: '0x0bd7F4AEBed7b748E4743A8C544B7C5450dD7EBa',
    },
    isTokenOnly: true,
    token: serializedTokens.hodl,
    quoteToken: serializedTokens.wbnb,
  },
].filter((f) => !!f.lpAddresses[CHAIN_ID])

export default farms
