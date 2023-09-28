import { useCallback } from 'react'
import { unstakeFarm } from 'utils/calls'
import { useMasterchef } from 'hooks/useContract'

const useUnstakeFarms = (pid: number, decimals: number) => {
  const masterChefContract = useMasterchef()

  const handleUnstake = useCallback(
    async (amount: string) => {
      return unstakeFarm(masterChefContract, pid, amount, decimals)
    },
    [masterChefContract, pid, decimals],
  )

  return { onUnstake: handleUnstake }
}

export default useUnstakeFarms
