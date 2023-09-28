/* eslint-disable import/prefer-default-export */
import BigNumber from 'bignumber.js'
import poolsDeployedBlockNumber from 'config/constants/poolsDeployedBlockNumber'
import poolsConfig from 'config/constants/pools'
import sousChefV2 from 'config/abi/sousChefV2.json'
import autoCompoundPools from 'config/abi/ACPHodl.json'
import multicall from '../multicall'
import { simpleRpcProvider } from '../providers'
import { getAddress } from '../addressHelpers'

/**
 * Returns the total number of pools that were active at a given block
 */
export const getActivePools = async (block?: number) => {
  const eligiblePools = poolsConfig
    .filter((pool) => pool.sousId !== 0)
    .filter((pool) => pool.sousId !== 15)
    .filter((pool) => pool.isFinished === false || pool.isFinished === undefined)
    .filter((pool) => pool.isAutoCompounding === false)
    .filter((pool) => {
      const { contractAddress, deployedBlockNumber } = pool
      const address = getAddress(contractAddress)
      return (deployedBlockNumber && deployedBlockNumber < block) || poolsDeployedBlockNumber[address] < block
    })
  const blockNumber = block || (await simpleRpcProvider.getBlockNumber())
  const startBlockCalls = eligiblePools.map(({ contractAddress }) => ({
    address: getAddress(contractAddress),
    name: 'startBlock',
  }))
  const endBlockCalls = eligiblePools.map(({ contractAddress }) => ({
    address: getAddress(contractAddress),
    name: 'bonusEndBlock',
  }))
  const startBlocks = await multicall(sousChefV2, startBlockCalls)
  const endBlocks = await multicall(sousChefV2, endBlockCalls)

  const eligiblePoolsACP = poolsConfig
      .filter((pool) => pool.isFinished === false || pool.isFinished === undefined)
      .filter((pool) => pool.isAutoCompounding === true)

  const timeStamp = new Date().getTime();
  const startTimeCalls = eligiblePoolsACP.map(({ contractAddress }) => ({
      address: getAddress(contractAddress),
      name: 'startTime',
    }))
  const endTimeCalls = eligiblePoolsACP.map(({ contractAddress }) => ({
    address: getAddress(contractAddress),
    name: 'endTime',
  }))
  const startTimes = await multicall(autoCompoundPools, startTimeCalls)
  const endTimes = await multicall(autoCompoundPools, endTimeCalls)

  return eligiblePools.concat(eligiblePoolsACP).reduce((accum, poolCheck, index) => {
    const startBlock = startBlocks[index] ? new BigNumber(startBlocks[index]) : null
    const endBlock = endBlocks[index] ? new BigNumber(endBlocks[index]) : null
    const startTime = startTimes[index] ? new BigNumber(startTimes[index]) : null
    const endTime = endTimes[index] ? new BigNumber(endTimes[index]) : null

    if (!startTime && !endTime && (!startBlock || !endBlock)) {
      return accum
    }

    if (!startBlock && !endBlock && (!startTime || !endTime)) {
      return accum
    }

    if ((!startBlock && !endBlock) && (startBlock.gte(blockNumber) || endBlock.lte(blockNumber))) {
      return accum
    }

    if ((!startTime && !endTime) && (startTime.gte(timeStamp) || endTime.lte(timeStamp))) {
      return accum
    }

    return [...accum, poolCheck]
  }, [])
}