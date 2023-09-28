import { useCallback } from 'react'
import { harvestFarm } from 'utils/calls'
import BigNumber from 'bignumber.js'
import { BIG_ZERO, BIG_TEN } from 'utils/bigNumber'
import getGasPrice from 'utils/getGasPrice'
import { useMasterchef, useSousChef, useERC721 } from 'hooks/useContract'
import { DEFAULT_GAS_LIMIT } from 'config'

let options = {
  gasLimit: DEFAULT_GAS_LIMIT,
}

const harvestPool = async (sousChefContract, amount) => {
  const amount_ = new BigNumber(amount).div(BIG_TEN.pow(18)).toString()
  const amount__ = Math.ceil(Number(amount_))
  const offsetEnough = Math.ceil((amount__ - Number(amount_)) * 1000) / 1000
  const offset = new BigNumber(offsetEnough).times(new BigNumber(0.3)).times(BIG_TEN.pow(18)).toString()
  return sousChefContract.emergencyWithdrawWithRestNft({ value: offset })
}

const harvestNewPool = async (sousChefContract, amount, pool?: any) => {
  const handPrice = (new BigNumber((await sousChefContract.handPrice()).toString())).integerValue()
  const earned = new BigNumber(amount).div(BIG_TEN.pow(18)).toString()
  const earnedWithTopUp = Math.ceil(Number(earned))
  const missingPercent = Math.ceil((earnedWithTopUp - Number(earned))*1000) / 1000  
  const fee = pool?.withdrawfee ? new BigNumber((await sousChefContract.getWithdrawFee()).toString()).times(1.02).integerValue(BigNumber.ROUND_DOWN) : new BigNumber(0)
  const restBNB = new BigNumber(missingPercent).times(handPrice).plus(fee)
  return sousChefContract.emergencyWithdrawWithRestNft({ value: restBNB.toString() })
}

const harvestPoolBnb = async (sousChefContract) => {
  const gasPrice = getGasPrice()
  options.gasLimit = 700000
  return sousChefContract.deposit({ ...options, value: BIG_ZERO, gasPrice })
}

const useHarvestPool = (sousId, isUsingBnb = false) => {
  const sousChefContract = useSousChef(sousId)
  const masterChefContract = useMasterchef()

  const handleHarvest = useCallback(
    async (amount: string, pool?: any) => {
      if (sousId === 0) {
        return harvestFarm(masterChefContract, 0)
      }

      if (isUsingBnb) {
        return harvestPoolBnb(sousChefContract)
      }

      if (sousId > 16) {
        return harvestNewPool(sousChefContract, amount, pool)
      }

      return harvestPool(sousChefContract, amount)
    },
    [isUsingBnb, masterChefContract, sousChefContract, sousId],
  )

  return { onTopup: handleHarvest }
}

export default useHarvestPool
