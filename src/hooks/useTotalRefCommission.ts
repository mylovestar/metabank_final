import { useEffect, useState } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useSlowRefreshEffect } from './useRefreshEffect'
import { getMasterchefContract, getReferralContract } from 'utils/contractHelpers'
import { getBalanceNumber } from 'utils/formatBalance'
import BigNumber from 'bignumber.js'

const masterChefContract = getMasterchefContract()
const referralContract = getReferralContract()

const useTotalRefCommission = () => {
    const [commission, setCommission] = useState(0)
    const { account } = useActiveWeb3React()

    useSlowRefreshEffect(() => {
        async function fetchTotalRef() {
            const totalCommissions = await referralContract.totalReferralCommissions(account)
            setCommission(getBalanceNumber(new BigNumber(totalCommissions.toString())))
        }
        fetchTotalRef()
    }, [account])

    return commission
}

export default useTotalRefCommission


export const useGetReferrate = () => {

    const [commission, setCommission] = useState(0)

    useSlowRefreshEffect(() => {
        async function fetchTotalRef() {
            const commissionrate = await masterChefContract.referralCommissionRate()
            setCommission(commissionrate/100)
        }
        fetchTotalRef()
    }, [])

    return commission
}