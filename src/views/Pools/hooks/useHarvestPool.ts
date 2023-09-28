import { useCallback } from 'react'
import { harvestFarm } from 'utils/calls'
import { BIG_ZERO } from 'utils/bigNumber'
import getGasPrice from 'utils/getGasPrice'
import { useMasterchef, useSousChef } from 'hooks/useContract'
import { DEFAULT_GAS_LIMIT } from 'config'
import BigNumber from 'bignumber.js'

let options = {
  gasLimit: DEFAULT_GAS_LIMIT,
}

const harvestPool = async (sousChefContract) => {
  const gasPrice = getGasPrice()
  // options.gasLimit = 700000
  return sousChefContract.deposit('0', { gasPrice })
}

const harvestNewPool = async (sousChefContract, withdrawFee?: boolean) => {
  const gasPrice = getGasPrice()
  // options.gasLimit = 700000
  return sousChefContract.withdraw('0', {
    ...(withdrawFee ? { value: new BigNumber((await sousChefContract.getWithdrawFee()).toString()).times(1.02).integerValue(BigNumber.ROUND_DOWN).toString() } : {}),
    gasPrice: gasPrice })
}

const harvestPoolBnb = async (sousChefContract) => {
  const gasPrice = getGasPrice()
  options.gasLimit = 700000
  return sousChefContract.deposit({ ...options, value: BIG_ZERO, gasPrice })
}

const useHarvestPool = (sousId, isUsingBnb = false) => {
  const sousChefContract = useSousChef(sousId)
  const masterChefContract = useMasterchef()

  const handleHarvest = useCallback(async (withdrawFee?: boolean) => {
    if (sousId === 0) {
      return harvestFarm(masterChefContract, 0)
    }

    if (isUsingBnb) {
      return harvestPoolBnb(sousChefContract)
    }

    if (sousId >= 16) {
      return harvestNewPool(sousChefContract, withdrawFee)
    }

    return harvestPool(sousChefContract)
  }, [isUsingBnb, masterChefContract, sousChefContract, sousId])

  return { onReward: handleHarvest }
}

export default useHarvestPool
