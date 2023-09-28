import { useWeb3React } from '@web3-react/core'
import { FAST_INTERVAL } from 'config/constants'
import { useVaultContract, useVaultContractForHodl, useErc721CollectionContract } from './useContract'
import { useSWRContract } from './useSWRContract'

export const useCheckPossibleStake = (contracAddress: string) => {
  const { account } = useWeb3React()

  const contract = useVaultContract(contracAddress, false)
  const { data } = useSWRContract(
    account
      ? {
          contract,
          methodName: 'isPossibleStake',
          params: [account],
        }
      : null,
    {
      refreshInterval: FAST_INTERVAL,
    },
  )

  return {
    isPossibleStake: data,
  }
}

export const useRequiredHand = (contracAddress: string) => {
  const contract = useVaultContract(contracAddress, false)
  const { data } = useSWRContract(
    {
      contract,
      methodName: 'poolInfo',
      params: [0],
    },
    {
      refreshInterval: FAST_INTERVAL,
    },
  )
  return {
    requiredHands: data ? data.handCountRequired.toString() : '',
    apr: data ? data.increaseRate.toNumber() : 0,
  }
}

export const useRequiredHandForHodl = (contracAddress: string) => {
  const contract = useVaultContractForHodl(contracAddress, false)
  const { data } = useSWRContract(
    {
      contract,
      methodName: 'poolInfo',
      params: [0],
    },
    {
      refreshInterval: FAST_INTERVAL,
    },
  )
  return {
    requiredHands: data ? data.handCountRequired.toString() : '',
    apr: data ? data.increaseRate.toNumber() : 0,
  }
}

export const useLockingEnd = (contracAddress: string) => {
  const { account } = useWeb3React()

  const contract = useVaultContractForHodl(contracAddress, false)
  const { data } = useSWRContract(
    account
      ? {
          contract,
          methodName: 'userInfo',
          params: [account],
        }
      : null,
    {
      refreshInterval: FAST_INTERVAL,
    },
  )

  return {
    lockingStart: data ? data.stakedBlock.toNumber() : 0,
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

export default useCheckPossibleStake
