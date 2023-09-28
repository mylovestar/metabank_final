import { useState } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { Flex, CardFooter, ExpandableLabel, HelpIcon, useTooltip, Tag, RefreshIcon } from '@metabank/uikit'
import { DeserializedPool } from 'state/types'
import { CompoundingPoolTag, ManualPoolTag } from 'components/Tags'
import ExpandedFooter from './ExpandedFooter'

interface FooterProps {
  pool: DeserializedPool
  account: string
  totalCakeInVault?: BigNumber
  defaultExpanded?: boolean
}

const ExpandableButtonWrapper = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  button {
    padding: 0;
  }
`

const Footer: React.FC<FooterProps> = ({ pool, account, defaultExpanded }) => {
  const { vaultKey } = pool
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(defaultExpanded || false)

  const manualTooltipText = pool.isNft ? 
                            pool.stakingToken.name === 'HODL Hand NFTs' ?
                              t('Stake your HODL Hands NFTs, valued at 0.3 BNB each, to earn tokens at the displayed APR. Grow your rewards by joining the pool now!')                      
                              : t('The price of each NFT is based on the live $ price of each NFT to mint, minus the discount. This is then converted into how many tokens that is worth.  There are no taxes on swapping tokens for NFTs and the tokens are sent to the deployer or to specialist pools for investors to earn!')
                            : t('To claim your NFTs you must ‘Harvest’ and you can topup in BNB on any partially earned NFTs!', { symbol: pool.stakingToken.symbol })
  const autoTooltipText = t(
    'Any funds you stake in this pool will be automagically harvested and restaked (compounded) for you.',
  )

  const { targetRef, tooltip, tooltipVisible } = useTooltip(vaultKey ? autoTooltipText : manualTooltipText, {
    placement: 'bottom',
  })

  return (
    <CardFooter>
      <ExpandableButtonWrapper>
        <Flex alignItems="center">
          {/* {vaultKey ? <CompoundingPoolTag /> : <ManualPoolTag />} */}
          {/* <Tag variant="secondary" outline startIcon={<RefreshIcon width="18px" color="secondary" mr="4px" />}>
            {t('How does it work?')}
          </Tag> */}
          <Tag variant="secondary" outline >
            {t('How does it work?')}
          </Tag>
          {tooltipVisible && tooltip}
          <Flex ref={targetRef}>
            <HelpIcon ml="4px" width="20px" height="20px" color="textSubtle" />
          </Flex>
        </Flex>
        <ExpandableLabel expanded={isExpanded} onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? t('Hide') : t('Details')}
        </ExpandableLabel>
      </ExpandableButtonWrapper>
      {isExpanded && <ExpandedFooter pool={pool} account={account} />}
    </CardFooter>
  )
}

export default Footer
