import { useWeb3React } from '@web3-react/core'
import { FAST_INTERVAL } from 'config/constants'
import { useACPContract, useErc721CollectionContract } from './useContract'
import { useSWRContract } from './useSWRContract'

export const useRequiredHand = (contracAddress: string) => {
  const contract = useACPContract(contracAddress, false)
  const { data } = useSWRContract(
    {
      contract,
      methodName: 'getPoolInfo',
    },
    {
      refreshInterval: FAST_INTERVAL,
    },
  )
  return {
    requiredHands: data ? data.handCountRequired.toString() : '',
    apr: data ? data.increaseRate[data.increaseRate.length - 1][2].toNumber() : 0,
  }
}

export const useLockingEnd = (contracAddress: string) => {
  const { account } = useWeb3React()

  const contract = useACPContract(contracAddress, false)
  const { data } = useSWRContract(
    account
      ? {
          contract,
          methodName: 'getUserInfo',
          params: [account],
        }
      : null,
    {
      refreshInterval: FAST_INTERVAL,
    },
  )

  return {
    lockingEnd: data ? data.userLocktime.toNumber() : 0,
  }
}

export const useLockPeriod = (contracAddress: string) => {

  const contract = useACPContract(contracAddress, false)
  const { data } = useSWRContract(
    {
      contract,
      methodName: 'lockPeriod'
    },
    {
      refreshInterval: FAST_INTERVAL,
    },
  )

  return {
    lockPeriod: data ? data.toNumber() : 0,
  }
}

export const useAppravalHand = (handAddress: string, contracAddress: string) => {
  const { account } = useWeb3React()

  const contract = useErc721CollectionContract(handAddress, false)
  const { data } = useSWRContract(
    account
      ? {
          contract,
          methodName: 'isApprovedForAll',
          params: [account, contracAddress],
        }
      : null,
    {
      refreshInterval: FAST_INTERVAL,
    },
  )

  return {
    isApproved: data,
  }
}


export const useAmountHands = (handAddress: string) => {
  const { account } = useWeb3React()

  const contract = useErc721CollectionContract(handAddress, false)
  const { data } = useSWRContract(
    account
      ? {
          contract,
          methodName: 'balanceOf',
          params: [account],
        }
      : null,
    {
      refreshInterval: FAST_INTERVAL,
    },
  )

  return {
    hands: data,
  }
}

