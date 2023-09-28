import { useCallback } from 'react'
import { parseUnits } from '@ethersproject/units'
import { unstakeFarm } from 'utils/calls'
import { useMasterchef, useSousChef } from 'hooks/useContract'
import getGasPrice from 'utils/getGasPrice'
import BigNumber from 'bignumber.js'

let options = {
  gasLimit: 700000,
}

const sousUnstake = async (sousChefContract: any, amount: string, decimals: number, isNft?: boolean, pool?: any) => {
  const gasPrice = getGasPrice()
  const units = parseUnits(amount, decimals)
  if (isNft)
    options.gasLimit = options.gasLimit * Number(amount) / 3
  return sousChefContract.withdraw(units.toString(), {
    ...(pool?.withdrawFee ? { value: new BigNumber((await sousChefContract.getWithdrawFee()).toString()).times(1.02).integerValue(BigNumber.ROUND_DOWN).toString() } : {}),
    gasPrice,
  })
}

const sousEmergencyUnstake = async (sousChefContract: any, pool?: any) => {
  const gasPrice = getGasPrice()
  return sousChefContract.emergencyWithdraw({ 
    ...(pool?.withdrawFee ? { value: new BigNumber((await sousChefContract.getWithdrawFee()).toString()).times(1.02).integerValue(BigNumber.ROUND_DOWN).toString() } : {}),
    gasPrice })
}

const useUnstakePool = (sousId: number, enableEmergencyWithdraw = false) => {
  const masterChefContract = useMasterchef()
  const sousChefContract = useSousChef(sousId)

  const handleUnstake = useCallback(
    async (amount: string, decimals: number, isNft?: boolean, pool?: any) => {
      if (sousId === 0) {
        return unstakeFarm(masterChefContract, 0, amount, 18)
      }
      if (enableEmergencyWithdraw) {
        return sousEmergencyUnstake(sousChefContract)
      }

      return sousUnstake(sousChefContract, amount, decimals, isNft, pool)
    },
    [enableEmergencyWithdraw, masterChefContract, sousChefContract, sousId],
  )

  return { onUnstake: handleUnstake }
}

export default useUnstakePool
