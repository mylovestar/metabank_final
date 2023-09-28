import { useEffect, useState } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useSlowRefreshEffect } from './useRefreshEffect'
import { getMasterchefContract, getReferralContract } from 'utils/contractHelpers'
import { getBalanceNumber } from 'utils/formatBalance'
import BigNumber from 'bignumber.js'

const referralContract = getReferralContract()

const useTotalReferralCount = () => {
    const [count, setCount] = useState(0)
    const { account } = useActiveWeb3React()

    useSlowRefreshEffect(() => {
        async function fetchTotalRef() {
            const total = await referralContract.referralsCount(account)
            setCount(getBalanceNumber(new BigNumber(total.toString()), 0))
        }
        fetchTotalRef()
    }, [account])

    return count
}

export default useTotalReferralCount