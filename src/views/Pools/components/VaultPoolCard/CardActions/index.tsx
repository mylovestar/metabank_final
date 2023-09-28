import BigNumber from 'bignumber.js'

import styled from 'styled-components'
import { BIG_ZERO } from 'utils/bigNumber'
import { Flex, Text, Box } from '@metabank/uikit'
import { useTranslation } from 'contexts/Localization'
import { PoolCategory } from 'config/constants/types'
import { useProfileRequirement } from 'views/Pools/hooks/useProfileRequirement'
import { DeserializedPool } from 'state/types'
import { useRequiredHand, useRequiredHandForHodl, useAppravalHand } from 'hooks/useVaultContract'
import { mainnetTokens } from 'config/constants/tokens'
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
}

const CardActions: React.FC<CardActionsProps> = ({ pool, stakedBalance }) => {
  const { sousId, stakingToken, earningToken, harvest, poolCategory, userData, earningTokenPrice, profileRequirement } =
    pool
  // Pools using native BNB behave differently than pools using a token
  const isBnbPool = poolCategory === PoolCategory.BINANCE
  const { t } = useTranslation()
  const allowance = userData?.allowance ? new BigNumber(userData.allowance) : BIG_ZERO
  const stakingTokenBalance = userData?.stakingTokenBalance ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO
  const earnings = userData?.pendingReward ? new BigNumber(userData.pendingReward) : BIG_ZERO
  const { isApproved: allowanceHand } = useAppravalHand(mainnetTokens.hh.address, pool.contractAddress[56])
  const needsApproval = !allowance.gt(0) && !isBnbPool || !allowanceHand
  const isStaked = stakedBalance.gt(0)
  const isLoading = !userData

  const { notMeetRequired, notMeetThreshold } = useProfileRequirement(profileRequirement)

  const { requiredHands } = pool.stakingToken.symbol === 'HODLX' ? useRequiredHand(pool.contractAddress[56]) : useRequiredHandForHodl(pool.contractAddress[56])

  return (
    <Flex flexDirection="column">
      <Flex flexDirection="column">
        {harvest && (
          <>
            <Box display="inline">
              <InlineText color="secondary" textTransform="uppercase" bold fontSize="12px">
                {`${earningToken.name} `}
              </InlineText>
              <InlineText color="textSubtle" textTransform="uppercase" bold fontSize="12px">
                {t('Earned')}
              </InlineText>
            </Box>
            <HarvestActions
              earnings={earnings}
              earningToken={earningToken}
              sousId={sousId}
              earningTokenPrice={earningTokenPrice}
              isBnbPool={isBnbPool}
              isLoading={isLoading}
              isFinished={pool.isFinished}
            />
          </>
        )}
        <Box display="inline">
          <InlineText color={isStaked ? 'secondary' : 'textSubtle'} textTransform="uppercase" bold fontSize="12px">
            {isStaked ? stakingToken.name : t('Stake')}{' '}
          </InlineText>
          <InlineText color={isStaked ? 'textSubtle' : 'secondary'} textTransform="uppercase" bold fontSize="12px">
            {isStaked ? t('Staked') : `${stakingToken.name} + ${requiredHands} NFT${requiredHands !== '1' ? 's' : ''}`}
          </InlineText>
        </Box>
        {notMeetRequired || notMeetThreshold ? (
          <ProfileRequirementWarning profileRequirement={profileRequirement} />
        ) : needsApproval ? (
          <ApprovalAction pool={pool} isLoading={isLoading} allowance={!allowance.gt(0)} allowanceHand={!allowanceHand} />
        ) : (
          <StakeActions
            isLoading={isLoading}
            pool={pool}
            stakingTokenBalance={stakingTokenBalance}
            stakedBalance={stakedBalance}
            isBnbPool={isBnbPool}
            isStaked={isStaked}
          />
        )}
      </Flex>
    </Flex>
  )
}

export default CardActions
