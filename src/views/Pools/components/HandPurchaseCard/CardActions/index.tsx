import BigNumber from 'bignumber.js'

import styled from 'styled-components'
import { BIG_ZERO } from 'utils/bigNumber'
import { Flex, Text, Box } from '@metabank/uikit'
import { useTranslation } from 'contexts/Localization'
import { PoolCategory } from 'config/constants/types'
import { useProfileRequirement } from 'views/Pools/hooks/useProfileRequirement'
import { DeserializedPool } from 'state/types'
import ApprovalAction from './ApprovalAction'
import StakeActions from './StakeActions'
import HarvestActions from './HarvestActions'
import { ProfileRequirementWarning } from '../../ProfileRequirementWarning'

const InlineText = styled(Text)`
  display: inline;
`

interface CardActionsProps {
  pool: DeserializedPool
  stakedBalance: BigNumber
  discountSave: BigNumber
}

const CardActions: React.FC<CardActionsProps> = ({ pool, stakedBalance, discountSave }) => {
  const { sousId, stakingToken, earningToken, harvest, poolCategory, userData, earningTokenPrice, profileRequirement } =
    pool
  // Pools using native BNB behave differently than pools using a token
  const isBnbPool = poolCategory === PoolCategory.BINANCE
  const { t } = useTranslation()
  const allowance = userData?.allowance ? new BigNumber(userData.allowance) : BIG_ZERO
  const stakingTokenBalance = userData?.stakingTokenBalance ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO
  const earnings = userData?.pendingReward ? new BigNumber(userData.pendingReward) : BIG_ZERO
  const needsApproval = !allowance.gt(0) && !isBnbPool
  const isStaked = stakedBalance.gt(0)
  const isLoading = !userData

  const { notMeetRequired, notMeetThreshold } = useProfileRequirement(profileRequirement)

  return (
    <Flex flexDirection="column">
      <Box display="inline">
        <InlineText color={isStaked ? 'secondary' : 'textSubtle'} textTransform="uppercase" bold fontSize="12px">
          {t('Buy HODL HANDS with HODLX')}
        </InlineText>
      </Box>
      {notMeetRequired || notMeetThreshold ? (
        <ProfileRequirementWarning profileRequirement={profileRequirement} />
      ) : needsApproval ? (
        <ApprovalAction pool={pool} isLoading={isLoading} />
      ) : (
        <StakeActions
          isLoading={isLoading}
          pool={pool}
          stakingTokenBalance={stakingTokenBalance}
          stakedBalance={stakedBalance}
          isBnbPool={isBnbPool}
          isStaked={isStaked}
          discountSave={discountSave}
        />
      )}
    </Flex>
  )
}

export default CardActions
