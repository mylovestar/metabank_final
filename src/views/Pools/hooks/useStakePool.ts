import { useCallback } from 'react'
import { stakeFarm } from 'utils/calls'
import BigNumber from 'bignumber.js'
import { DEFAULT_TOKEN_DECIMAL, DEFAULT_GAS_LIMIT } from 'config'
import { BIG_TEN } from 'utils/bigNumber'
import { useBuyHandwithHodlx, useBuyHandwithHodl, useSousChef, useERC721, useErc721CollectionContract } from 'hooks/useContract'
import getGasPrice from 'utils/getGasPrice'

let options = {
  gasLimit: 700000,
}

const buyHandWithHoldx = async (sousChefContract, amount) => {
  return sousChefContract.purchase(amount)
}

const buyHandWithBnb = async (handContract, amount, handPrice) => {
  console.log(new BigNumber(amount).times(new BigNumber(handPrice).times(BIG_TEN.pow(18))).toString())
  return handContract.purchase(amount, { value: new BigNumber(amount).times(new BigNumber(handPrice).times(BIG_TEN.pow(18))).toString() })
} 


const sousStake = async (sousChefContract, amount, decimals = 18, isNft?: boolean, pool?: any) => {
  const gasPrice = getGasPrice()
  return sousChefContract.deposit(new BigNumber(amount).times(BIG_TEN.pow(decimals)).toString(), {
    // ...options,
    ...(pool?.depositFee ? { value: new BigNumber((await sousChefContract.getFee()).toString()).times(1.02).integerValue(BigNumber.ROUND_DOWN).toString() } : {}),
    gasPrice,
  })
}

const sousStakeBnb = async (sousChefContract, amount) => {
  const gasPrice = getGasPrice()
  return sousChefContract.deposit(new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString(), {
    ...options,
    gasPrice,
  })
}

const useStakePool = (sousId: number, isUsingBnb = false) => {

  const handContract = "0x7E82123bCb6465133D6E9E1Ad94d0115DE041b3D";
  const sousChefContract = useSousChef(sousId)
  const contractABI = sousId === 0 ? 
    useBuyHandwithHodlx() : sousId === 15 ?
    useBuyHandwithHodl() : sousId === 21 ? useErc721CollectionContract(handContract) : ""

  const handleStake = useCallback(
    async (amount: string, decimals: number, isNft?: boolean, pool?: any) => {
      if (pool.isBuyNFT == true) {      
        return pool.contractAddress[56] == handContract ? buyHandWithBnb(contractABI, amount, pool.earningTokenPrice)
          : buyHandWithHoldx(contractABI, amount);
      }
      
      if (isUsingBnb) {
        return sousStakeBnb(sousChefContract, amount)
      }
      return sousStake(sousChefContract, amount, decimals, isNft, pool)
    },
    [isUsingBnb, contractABI, sousChefContract, sousId],
  )

  return { onStake: handleStake }
}

export default useStakePool
