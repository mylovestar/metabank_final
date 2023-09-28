import poolsConfig from 'config/constants/pools'
import sousChefABI from 'config/abi/sousChef.json'
import autoCompoundABI from 'config/abi/ACPHodl.json'
import nftStakingABI from 'config/abi/nftStakingPool.json'
import erc20ABI from 'config/abi/erc20.json'
import erc721CollectionABI from 'config/abi/erc721collection.json'
import multicall, { multicallWithOtherApi } from 'utils/multicall'
import { getMasterchefContract } from 'utils/contractHelpers'
import { getAddress } from 'utils/addressHelpers'
import { simpleRpcProvider } from 'utils/providers'
import BigNumber from 'bignumber.js'
import { BIG_ONE, BIG_ZERO } from 'utils/bigNumber'

// Pool 0, Cake / Cake is a different kind of contract (master chef)
// BNB pools use the native BNB token (wrapping ? unwrapping is done at the contract level)
const nonBnbPools = poolsConfig.filter((pool) => pool.stakingToken.symbol !== 'BNB')
const bnbPools = poolsConfig.filter((pool) => pool.stakingToken.symbol === 'BNB')
const nonMasterPools = poolsConfig.filter((pool) => pool.isBuyNFT !== true)
const masterChefContract = getMasterchefContract()

export const fetchPoolsAllowance = async (account) => {
  const calls = nonBnbPools.map((pool) => ({
    address: pool.stakingToken.address,
    name: !pool.isNft ? 'allowance' : 'isApprovedForAll',
    params: [account, getAddress(pool.contractAddress)],
  }))
  const abis = nonBnbPools.map((pool) => (pool.isNft ? erc721CollectionABI : erc20ABI))
  const allowances = await multicallWithOtherApi(abis, calls)

  return nonBnbPools.reduce(
    (acc, pool, index) => ({
      ...acc,
      [pool.sousId]: pool.isNft ? allowances[index][0] ? '1' : '0' : new BigNumber(allowances[index]).toJSON(),
    }),
    {},
  )
}

export const fetchUserBalances = async (account) => {
  // Non BNB pools
  const calls = nonBnbPools.map((pool) => ({
    address: pool.stakingToken.address,
    name: 'balanceOf',
    params: [account],
  }))
  const abis = nonBnbPools.map((pool) => (pool.isNft ? erc721CollectionABI : erc20ABI))
  const tokenBalancesRaw = await multicallWithOtherApi(abis, calls)
  const tokenBalances = nonBnbPools.reduce(
    (acc, pool, index) => ({ ...acc, [pool.sousId]: new BigNumber(tokenBalancesRaw[index]).toJSON() }),
    {},
  )

  // BNB pools
  const bnbBalance = await simpleRpcProvider.getBalance(account)
  const bnbBalances = bnbPools.reduce(
    (acc, pool) => ({ ...acc, [pool.sousId]: new BigNumber(bnbBalance.toString()).toJSON() }),
    {},
  )

  return { ...tokenBalances, ...bnbBalances }
}

export const fetchUserStakeBalances = async (account) => {
  const calls = nonMasterPools.map((p) => ({
    address: getAddress(p.contractAddress),
    name: p.isAutoCompounding ? 'getUserInfo' : 'userInfo',
    params: [account],
  }))
  const abis = nonMasterPools.map((p) => (p.isNft ? nftStakingABI : p.isAutoCompounding ? autoCompoundABI : sousChefABI))
  const userInfo = await multicallWithOtherApi(abis, calls)
  const stakedBalances = nonMasterPools.reduce(
    (acc, pool, index) => ({
      ...acc,
      [pool.sousId]: pool.isAutoCompounding ? new BigNumber(userInfo[index].staked._hex).toJSON() : new BigNumber(userInfo[index].amount._hex).toJSON(),
    }),
    {},
  )

  // Cake / Cake pool
  const { amount: masterPoolAmount } = await masterChefContract.userInfo('0', account)

  return { ...stakedBalances, 0: new BigNumber(masterPoolAmount.toString()).toJSON() }
}

export const fetchUserPendingRewards = async (account) => {
  const calls = nonMasterPools.map((p) => ({
    address: getAddress(p.contractAddress),
    name: p.isAutoCompounding ? 'getUserInfo' : 'pendingReward',
    params: [account],
  }))
  const abis = nonMasterPools.map((p) => (p.isNft ? nftStakingABI : p.isAutoCompounding ? autoCompoundABI : sousChefABI))
  const res = await multicallWithOtherApi(abis, calls)
  const pendingRewards = nonMasterPools.reduce(
    (acc, pool, index) => ({
      ...acc,
      [pool.sousId]: pool.isAutoCompounding ? new BigNumber(res[index][1]).toJSON() : new BigNumber(res[index]).toJSON(),
    }),
    {},
  )

  // Cake / Cake pool
  const pendingReward = await masterChefContract.pendingHodlx('0', account)

  return { ...pendingRewards, 0: new BigNumber(pendingReward.toString()).toJSON() }
}
