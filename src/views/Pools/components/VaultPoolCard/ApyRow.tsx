import styled from 'styled-components'
import { Flex, TooltipText, IconButton, useModal, CalculateIcon, Skeleton, useTooltip, Text } from '@metabank/uikit'
import { useTranslation } from 'contexts/Localization'
import Balance from 'components/Balance'
import RoiCalculatorModal from 'components/RoiCalculatorModal'
import { DeserializedPool } from 'state/types'
import BigNumber from 'bignumber.js'
import { BIG_ZERO } from 'utils/bigNumber'
import { vaultPoolConfig } from 'config/constants/pools'
import { useRequiredHand } from 'hooks/useACPContract'

const ApyLabelContainer = styled(Flex)`
  cursor: pointer;

  &:hover {
    opacity: 0.5;
  }
`

interface AprRowProps {
  pool: DeserializedPool
  stakedBalance: BigNumber
  performanceFee?: number
  fixedApr: number
}

const AprRow: React.FC<AprRowProps> = ({ pool, stakedBalance, performanceFee = 0, fixedApr }) => {
  const { t } = useTranslation()
  const {
    stakingToken,
    earningToken,
    isFinished,
    apr,
    rawApr,
    earningTokenPrice,
    stakingTokenPrice,
    userData,
    vaultKey,
  } = pool

  /* const apy = ((1 + fixedApr / 365 / 100) ** 365 - 1) * 100;
  let apy = 0
  if (pool.sousId === 16) {
    apy = 100
  }

  if (pool.sousId === 17) {
    apy = 85
  }
  if (pool.sousId === 18) {
    apy = 65
  }
  if (pool.sousId === 19) {
    apy = 32.5
  }
  if (pool.sousId === 20) {
    apy = 37.5
  }
  */

  const stakingTokenBalance = userData?.stakingTokenBalance ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO

  const tooltipContent = 'Rewards are automatically distributed and included in your staking balance. There’s no need to manually compound your rewards.'

  const { targetRef, tooltip, tooltipVisible } = useTooltip(tooltipContent, { placement: 'bottom-start' })

  const apyModalLink = stakingToken.address ? `/swap?outputCurrency=${stakingToken.address}` : '/swap'

  const [onPresentApyModal] = useModal(
    <RoiCalculatorModal
      earningTokenPrice={earningTokenPrice}
      stakingTokenPrice={stakingTokenPrice}
      apr={vaultKey ? rawApr : apr}
      linkLabel={t('Get %symbol%', { symbol: stakingToken.symbol })}
      linkHref={apyModalLink}
      stakingTokenBalance={stakedBalance.plus(stakingTokenBalance)}
      stakingTokenSymbol={stakingToken.symbol}
      earningTokenSymbol={earningToken.symbol}
      autoCompoundFrequency={vaultPoolConfig[vaultKey]?.autoCompoundFrequency ?? 0}
      performanceFee={performanceFee}
      decimal={stakingToken.decimals}
    />,
  )
  
  return (
    <Flex alignItems="center" justifyContent="space-between" >
      {tooltipVisible && tooltip}
      <TooltipText ref={targetRef}>{`${t('FIXED APY')}:`}</TooltipText>
      {!isFinished ? (
        <Text bold>{fixedApr/10}%</Text>
      ) : (
        <Skeleton width="82px" height="32px" />
      )}
    </Flex>
  )
}

export default AprRow
