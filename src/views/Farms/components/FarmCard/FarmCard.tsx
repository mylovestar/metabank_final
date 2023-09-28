import { useState } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { Card, Flex, Text, Skeleton, HelpIcon, useTooltip } from '@metabank/uikit'
import { DeserializedFarm } from 'state/types'
import { getBscScanLink } from 'utils'
import { useTranslation } from 'contexts/Localization'
import ExpandableSectionButton from 'components/ExpandableSectionButton'
import { BASE_ADD_LIQUIDITY_URL } from 'config'
import { getAddress, getMasterChefAddress } from 'utils/addressHelpers'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import DetailsSection from './DetailsSection'
import CardHeading from './CardHeading'
import CardActionsContainer from './CardActionsContainer'
import ApyButton from './ApyButton'

export interface FarmWithStakedValue extends DeserializedFarm {
  apr?: number
  lpRewardsApr?: number
  liquidity?: BigNumber
}

const StyledCard = styled(Card)`
  align-self: baseline;
`

const FarmCardInnerContainer = styled(Flex)`
  flex-direction: column;
  justify-content: space-around;
  padding: 24px;
`

const ExpandingWrapper = styled.div`
  padding: 24px;
  border-top: 2px solid ${({ theme }) => theme.colors.cardBorder};
  overflow: hidden;
`

interface FarmCardProps {
  farm: FarmWithStakedValue
  displayApr: string
  removed: boolean
  cakePrice?: BigNumber
  account?: string
}

const FarmCard: React.FC<FarmCardProps> = ({ farm, displayApr, removed, cakePrice, account }) => {
  const { t } = useTranslation()

  const [showExpandableSection, setShowExpandableSection] = useState(false)

  const totalValueFormatted =
    farm.liquidity && farm.liquidity.gt(0)
      ? `$${farm.liquidity.toNumber().toLocaleString(undefined, { maximumFractionDigits: 0 })}`
      : ''

  const lpLabel = farm.lpSymbol && farm.lpSymbol.toUpperCase().replace('PANCAKE', '')
  const earnLabel = !farm.isTokenOnly ? farm.dual ? farm.dual.earnLabel : t('HODLX + Swap Fees!') : t('HODLX')

  const liquidityUrlPathParts = getLiquidityUrlPathParts({
    quoteTokenAddress: farm.quoteToken.address,
    tokenAddress: farm.token.address,
  })
  const addLiquidityUrl = `${BASE_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`
  const lpAddress = getAddress(farm.lpAddresses)
  const masterchefAddress = getMasterChefAddress()
  const isPromotedFarm = (farm.token.symbol === 'HODLX') || (farm.quoteToken.symbol === 'HODL') || (farm.token.symbol === 'HODL')

  const {
    targetRef: totalStakedTargetRef,
    tooltip: totalStakedTooltip,
    tooltipVisible: totalStakedTooltipVisible,
  } = useTooltip(!farm.isTokenOnly ? t('Earn $HODLX rewards, with the APRs and ROI calculators available to view on each farm. LP providers also earn liquidity provider rewards which are shared proportionally among LP token holders. These LP rewards come from a fee of 0.17%, applied to all swaps.') : t('When staking, your tokens will go to the HODLX Masterchef, leaving a minimum of 1 token in your wallet. Staked tokens can be withdrawn at any time, and there are no fees or taxes other than gas fees to enable the pool, stake your tokens and withdraw rewards or tokens from the pool!'), {
    placement: 'bottom',
  })

  const {
    targetRef: apyTargetRef,
    tooltip: apyTooltip,
    tooltipVisible: apyTooltipVisible,
  } = useTooltip(t('APY calculation is based on manually compounding every 7 days.'), {
    placement: 'bottom',
  })

  const apy = (farm.apr / 365 * 7 / 100 + 1) ** (365 / 7) * 100 - 100;

  return (
    <StyledCard isActive={isPromotedFarm}>
      <FarmCardInnerContainer>
        <CardHeading
          lpLabel={lpLabel}
          multiplier={farm.multiplier}
          isCommunityFarm={farm.isCommunity}
          token={farm.token}
          quoteToken={farm.quoteToken}
          isTokenOnly={farm.isTokenOnly}
        />
        {!removed && (
          <Flex justifyContent="space-between" alignItems="center">
            <Text>{t('APR')}:</Text>
            <Text bold style={{ display: 'flex', alignItems: 'center' }}>
              {farm.apr ? (
                <ApyButton
                  variant="text-and-button"
                  pid={farm.pid}
                  lpSymbol={farm.lpSymbol}
                  multiplier={farm.multiplier}
                  isTokenOnly={farm.isTokenOnly}
                  lpLabel={lpLabel}
                  addLiquidityUrl={addLiquidityUrl}
                  cakePrice={cakePrice}
                  apr={farm.apr}
                  displayApr={displayApr}
                  decimal={farm.token.decimals}
                />
              ) : (
                <Skeleton height={24} width={80} />
              )}
            </Text>
          </Flex>
        )}
        {/* <Flex justifyContent="space-between">
          <Text>{t('APY')}:</Text>
          <Text bold>
            {apy.toFixed(2)}%
            <span ref={apyTargetRef}>
              <HelpIcon width="20px" ml="6px" mt="4px" mb="-4px" />
            </span>
            {apyTooltipVisible && apyTooltip}
          </Text>
        </Flex> */}
        <Flex justifyContent="space-between">
          <Text>{t('Earn')}:</Text>
          <Text bold>
            {earnLabel}
            <span ref={totalStakedTargetRef}>
              <HelpIcon width="20px" ml="6px" mt="4px" mb="-4px" />
            </span>
            {totalStakedTooltipVisible && totalStakedTooltip}
          </Text>
        </Flex>
        
        <CardActionsContainer
          farm={farm}
          lpLabel={lpLabel}
          account={account}
          cakePrice={cakePrice}
          addLiquidityUrl={addLiquidityUrl}
        />
      </FarmCardInnerContainer>

      <ExpandingWrapper>
        <ExpandableSectionButton
          onClick={() => setShowExpandableSection(!showExpandableSection)}
          expanded={showExpandableSection}
        />
        {showExpandableSection && (
          <DetailsSection
            removed={removed}
            bscScanAddress={getBscScanLink(masterchefAddress, 'address')}
            infoAddress={`/info/pool/${lpAddress}`}
            totalValueFormatted={totalValueFormatted}
            lpLabel={lpLabel}
            addLiquidityUrl={addLiquidityUrl}
            isTokenOnly={farm.isTokenOnly}
          />
        )}
      </ExpandingWrapper>
    </StyledCard>
  )
}

export default FarmCard
