import styled from 'styled-components'
import { Flex, TooltipText, Text, IconButton, useModal, CalculateIcon, Skeleton, useTooltip } from '@metabank/uikit'
import { useTranslation } from 'contexts/Localization'
import Balance from 'components/Balance'
import RoiCalculatorModal from 'components/RoiCalculatorModal'
import { DeserializedPool } from 'state/types'
import BigNumber from 'bignumber.js'
import { BIG_ZERO } from 'utils/bigNumber'
import { vaultPoolConfig } from 'config/constants/pools'

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
  discountRatePercent?: string
  discountSave: BigNumber
}

const AprRow: React.FC<AprRowProps> = ({ pool, stakedBalance, performanceFee = 0, discountRatePercent, discountSave }) => {
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

  const stakingTokenBalance = userData?.stakingTokenBalance ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO

  const tooltipContent = vaultKey
    ? t('APY includes compounding, APR doesn’t. This pool’s HODLX is compounded automatically, so we show APY.')
    : t('This pool’s rewards aren’t compounded automatically, so we show APR')

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
    />,
  )

  return (
    <>
      <Flex alignItems="center" justifyContent="space-between">
        {tooltipVisible && tooltip}
        <Text>{vaultKey ? `${t('Discount')}:` : `${t('Discount')}:`}</Text>
        <Text bold>{Number(discountRatePercent)}{t('% OFF!')}</Text>
      </Flex>
      <Flex alignItems="center" justifyContent="space-between">
        <Text>{`${t('Price:')}`}</Text>
        <Text>{`${pool.earningTokenPrice ? Math.floor(Number(pool.earningTokenPrice)).toLocaleString("en-US", { maximumFractionDigits: 0 }) : 0} `}{stakingToken.symbol}</Text>
      </Flex>
      <Flex alignItems="center" justifyContent="space-between">
        <Text>{`${t('$ Saving:')}`}</Text>
        <Text>{`${discountSave.toFixed(2)} USD`}</Text>
      </Flex>
    </>
  )
}

export default AprRow
