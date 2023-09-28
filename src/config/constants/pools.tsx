import Trans from 'components/Trans'
import { VaultKey } from 'state/types'
import { CHAIN_ID } from './networks'
import tokens, { serializeTokens } from './tokens'
import { SerializedPoolConfig, PoolCategory } from './types'

const serializedTokens = serializeTokens()

export const vaultPoolConfig = {
  [VaultKey.CakeVault]: {
    name: <Trans>Auto HODLX</Trans>,
    description: <Trans>Automatic restaking</Trans>,
    autoCompoundFrequency: 5000,
    gasLimit: 380000,
    tokenImage: {
      primarySrc: `/images/tokens/${tokens.cake.address}.svg`,
      secondarySrc: '/images/tokens/autorenew.svg',
    },
  },
  [VaultKey.IfoPool]: {
    name: 'IFO HODLX',
    description: <Trans>Stake HODLX to participate in IFOs</Trans>,
    autoCompoundFrequency: 1,
    gasLimit: 500000,
    tokenImage: {
      primarySrc: `/images/tokens/${tokens.cake.address}.svg`,
      secondarySrc: `/images/tokens/ifo-pool-icon.svg`,
    },
  },
} as const

const pools: SerializedPoolConfig[] = [
  {
    sousId: 0, // don't chain ID
    stakingToken: serializedTokens.hodlx,
    earningToken: serializedTokens.hh,
    contractAddress: {
      97: '',
      56: '0x0Dd56F569aC71b9A9bF81b36d087c9347220c1D5',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '1200000',
    sortOrder: 999,
    isNft: false,
    isBuyNFT: true,
  },
  {
    sousId: 1,
    stakingToken: serializedTokens.hodlx,
    earningToken: serializedTokens.hodl,
    contractAddress: {
      97: '',
      56: '0xf7064d872dc5e30f2cfd785fa25e2f206ecfb106',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '1200000',
    sortOrder: 999,
    isNft: false,
  },
  {
    sousId: 2,
    stakingToken: serializedTokens.hodlx,
    earningToken: serializedTokens.hodl,
    contractAddress: {
      97: '',
      56: '0x328934EC1EB4658e15e0A7A35935FAE6dB4071Eb',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '937500',
    sortOrder: 999,
    isNft: false,
  },
  {
    sousId: 3,
    stakingToken: serializedTokens.hh,
    earningToken: serializedTokens.hodlx,
    contractAddress: {
      97: '',
      56: '0xcca29261de7fb35fc4165a30c565afbbe5399cc4',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '225',
    sortOrder: 999,
    isNft: true,
  },
  {
    sousId: 4,
    stakingToken: serializedTokens.hh,
    earningToken: serializedTokens.hodl,
    contractAddress: {
      97: '',
      56: '0x7A0B7b18fBc189cdA566B0C8a2A060407668a75F',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '972222',
    sortOrder: 999,
    isNft: true,
  },
  {
    sousId: 5,
    stakingToken: serializedTokens.hodlx,
    earningToken: serializedTokens.hh,
    contractAddress: {
      97: '',
      56: '0x4CEf204dDEdC3933d7165d7056761249F0d60Ec1',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '0.0000462963',
    sortOrder: 999,
    isNft: false,
  },
  {
    sousId: 6,
    stakingToken: serializedTokens.hodlx,
    earningToken: serializedTokens.hodl,
    contractAddress: {
      97: '',
      56: '0xa5838dF7d090d33a6dAa922dd46F64F66e961BCa',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '937500',
    sortOrder: 999,
    isNft: false,
  },
  {
    sousId: 7,
    stakingToken: serializedTokens.hh,
    earningToken: serializedTokens.hodlx,
    contractAddress: {
      97: '',
      56: '0x29e10e8461981b857f5fe6eab63e6a162dc51163',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '225',
    sortOrder: 999,
    isNft: true,
  },
  {
    sousId: 8,
    stakingToken: serializedTokens.hh,
    earningToken: serializedTokens.hodl,
    contractAddress: {
      97: '',
      56: '0x8d3d6e948e6987425ee80a186e620CF3DE7ca2D1',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '972222',
    sortOrder: 999,
    isNft: true,
  },
  {
    sousId: 9,
    stakingToken: serializedTokens.hh,
    earningToken: serializedTokens.hodlx,
    contractAddress: {
      97: '',
      56: '0xDD9323f7f064793Ce496E022Ba77BB8550D33D0e',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '40',
    sortOrder: 999,
    isNft: true,
  },
  {
    sousId: 10,
    stakingToken: serializedTokens.hh,
    earningToken: serializedTokens.hodl,
    contractAddress: {
      97: '',
      56: '0x8bf3b61c6413f86e6d1c2c67a799eb71329f1a9a',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '578703',
    sortOrder: 999,
    isNft: true,
  },
  {
    sousId: 11,
    stakingToken: serializedTokens.hodlx,
    earningToken: serializedTokens.hh,
    contractAddress: {
      97: '',
      56: '0xCc6AE14290CE4fec1EEe14C943d3dA2A697346C8',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '0.000043402778',
    sortOrder: 999,
    isNft: false,
  },
  {
    // NFT Staking > Earn HODL (till Fri, 16 Dec 2022)
    sousId: 12,
    stakingToken: serializedTokens.hh,
    earningToken: serializedTokens.hodl,
    contractAddress: {
      97: '',
      56: '0xa51b9c6f4812706f645d906a3eb3d42a7bcb51a3',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '1350308',
    sortOrder: 999,
    isNft: true,
  },
  {
    // NFT Staking > Earn HODLX (till Fri, 16 Dec 2022)
    sousId: 13,
    stakingToken: serializedTokens.hh,
    earningToken: serializedTokens.hodlx,
    contractAddress: {
      97: '',
      56: '0xf7F157531FE8F6c9892Ed7fd478A15e47e7bF186',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '578',
    sortOrder: 999,
    isNft: true,
  },
  {
    // Special Pools > Earn HODL Hand NFTs (till Fri, 16 Dec 2022)
    sousId: 14,
    stakingToken: serializedTokens.hodl,
    earningToken: serializedTokens.hh,
    contractAddress: {
      97: '',
      56: '0xd8f6822d4a26749694a36b7b49c34ef315a51875',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '0.00003858024',
    sortOrder: 999,
    isNft: false,
  },
  // this pools is to buy Hodl Hands with Hodl(same function as pool 0)
  {
    sousId: 15, // don't change chain ID
    stakingToken: serializedTokens.hodl,
    earningToken: serializedTokens.hh,
    contractAddress: {
      97: '',
      56: '0xEb61253582371d50d59d7f4DfA1BF8cC3d8E594e',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '1200000', // not needed
    sortOrder: 999,
    isNft: false,
    isBuyNFT: true,
  },
  {
    // NTF Staking > Earn HODL
    sousId: 16,
    stakingToken: serializedTokens.hh,
    earningToken: serializedTokens.hodl,
    contractAddress: {
      97: '',
      56: '0x3076B99971f8e3b1A7060C0555fCD8069508A941',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '1157407.40740741',
    depositFee: true,
    sortOrder: 999,
    isNft: true,
  },
  {
    // NTF Staking > Earn HODLX
    sousId: 17,
    stakingToken: serializedTokens.hh,
    earningToken: serializedTokens.hodlx,
    contractAddress: {
      97: '',
      56: '0x7b3E217F589e76aa9726ff8517F2Ef7968060A86',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '596.11499932639',
    depositFee: true,
    sortOrder: 999,
    isNft: true,
  },
  {
    // HODL Staking > Earn HH
    sousId: 18,
    stakingToken: serializedTokens.hodl,
    earningToken: serializedTokens.hh,
    contractAddress: {
      97: '',
      56: '0x915BD1814c72F663B9fa6da7E5B7B3Fc372C2bE0',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '0.000039746575832492',
    depositFee: true,
    sortOrder: 999,
    isNft: false,
    enableEmergencyWithdraw: true,
    isFinished: true,
  },
  {
    // HODL Staking > Earn HH
    sousId: 19,
    stakingToken: serializedTokens.hodl,
    earningToken: serializedTokens.hh,
    contractAddress: {
      97: '',
      56: '0x10E0b6Cb6d196633Ff5cbc0C2E830f9602AbcE74',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '0.000039746575832492',
    depositFee: true,
    sortOrder: 999,
    isNft: false,
    enableEmergencyWithdraw: false,
  },
  {
    // HODLX Staking > Earn HH
    sousId: 20,
    stakingToken: serializedTokens.hodlx,
    earningToken: serializedTokens.hh,
    contractAddress: {
      97: '',
      56: '0x6b275a399234fa7355d556Ed447dd9CbeeaF6aA6',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '0.000028103101198835',
    depositFee: true,
    sortOrder: 999,
    isNft: false,
    enableEmergencyWithdraw: false,
  },
  /*
  {
    // ACP HODL
    sousId: 20,
    stakingToken: serializedTokens.hodl,
    earningToken: serializedTokens.hodl,
    contractAddress: {
      97: '',
      56: '0x74f6E4201038A15D78413556005690b94c531b43',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    depositFee: true,
    sortOrder: 999,
    isNft: false,
    enableEmergencyWithdraw: false,
    useTimeStamp: true,
    isAutoCompounding: true,
  },
  */
  {
    sousId: 21, // don't change chain ID
    stakingToken: serializedTokens.bnb,
    earningToken: serializedTokens.hh,
    contractAddress: {
      97: '',
      56: '0x7E82123bCb6465133D6E9E1Ad94d0115DE041b3D',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '1200000', // not needed
    sortOrder: 999,
    isNft: false,
    isBuyNFT: true,
  },
  {
    // HODL Staking > Earn HH
    sousId: 22,
    stakingToken: serializedTokens.hodl,
    earningToken: serializedTokens.hh,
    contractAddress: {
      97: '',
      56: '0x0BAA72895eAD0B5b7a9926706e9141f43B98379B',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '0.000034722222222222',
    depositFee: true,
    withdrawFee: true,
    sortOrder: 999,
    isNft: false,
    enableEmergencyWithdraw: false,
  },
  {
    // HODLX Staking > Earn HH
    sousId: 23,
    stakingToken: serializedTokens.hodlx,
    earningToken: serializedTokens.hh,
    contractAddress: {
      97: '',
      56: '0xaf4Ce926058Dc47c52F6835440295323161e43D8',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '0.000034722222222222',
    depositFee: true,
    withdrawFee: true,
    sortOrder: 999,
    isNft: false,
    enableEmergencyWithdraw: false,
  },
  {
    // NTF Staking > Earn HODL
    sousId: 24,
    stakingToken: serializedTokens.hh,
    earningToken: serializedTokens.hodl,
    contractAddress: {
      97: '',
      56: '0xbdfba035Ca3dAe39f0dfc2e10CA0b7e2323Cbb3A',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '964506.172839506',
    depositFee: true,
    withdrawFee: true,
    sortOrder: 999,
    isNft: true,
  },
  {
    // NTF Staking > Earn HODLX
    sousId: 25,
    stakingToken: serializedTokens.hh,
    earningToken: serializedTokens.hodlx,
    contractAddress: {
      97: '',
      56: '0xba26EbFee4977e88745fd56E3c8eC45470ba6c05',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '482.253086419753',
    depositFee: true,
    withdrawFee: true,
    sortOrder: 999,
    isNft: true,
  },
  {
    // NTF Staking > Earn HODL
    sousId: 26,
    stakingToken: serializedTokens.hh,
    earningToken: serializedTokens.hodl,
    contractAddress: {
      97: '',
      56: '0xf5D40e7FA5eBBDe749982Ed7103f766bAB02969a',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '818368.779963570',
    depositFee: true,
    withdrawFee: true,
    sortOrder: 999,
    isNft: true,
  },
  {
    // NTF Staking > Earn HODLX
    sousId: 27,
    stakingToken: serializedTokens.hh,
    earningToken: serializedTokens.hodlx,
    contractAddress: {
      97: '',
      56: '0xc3178C4d8adF0c9BB0B3b8357396C949BF474c20',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '365.497076023392',
    depositFee: true,
    withdrawFee: true,
    sortOrder: 999,
    isNft: true,
  },
  {
    // NTF Staking > Earn HODL
    sousId: 28,
    stakingToken: serializedTokens.hh,
    earningToken: serializedTokens.hodl,
    contractAddress: {
      97: '',
      56: '0x3B177eb124bbE086B14d3E1c4FD338f4eAde4B6F',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '730994.152046784',
    depositFee: true,
    withdrawFee: true,
    sortOrder: 999,
    isNft: true,
  },
  {
    // HODL Staking > Earn HH
    sousId: 29,
    stakingToken: serializedTokens.hodl,
    earningToken: serializedTokens.hh,
    contractAddress: {
      97: '',
      56: '0x32B08e1459B6964915cc747a9d7b541f50C8Cc1A',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '0.000027412280701754',
    depositFee: true,
    withdrawFee: true,
    sortOrder: 999,
    isNft: false,
    enableEmergencyWithdraw: false,
  },
  {
    // HODLX Staking > Earn HH
    sousId: 30,
    stakingToken: serializedTokens.hodlx,
    earningToken: serializedTokens.hh,
    contractAddress: {
      97: '',
      56: '0xd2bA61D7d21514f4CfA08CD47ded8A796e33971b',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '0.000018274853801170',
    depositFee: true,
    withdrawFee: true,
    sortOrder: 999,
    isNft: false,
    enableEmergencyWithdraw: false,
  },
].filter((p) => !!p.contractAddress[CHAIN_ID])

export default pools
