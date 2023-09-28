import { useState } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { Flex, CardFooter, ExpandableLabel, HelpIcon, useTooltip, Tag, RefreshIcon, Text } from '@metabank/uikit'
import { DeserializedPool } from 'state/types'
import { CompoundingPoolTag, ManualPoolTag } from 'components/Tags'
import { useRequiredHand, useRequiredHandForHodl } from 'hooks/useVaultContract'
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

  const { requiredHands } = pool.stakingToken.symbol === 'HODLX' ? useRequiredHand(pool.contractAddress[56]) : useRequiredHandForHodl(pool.contractAddress[56])

  const manualTooltipText = (
    <>
      <Text>
        {pool.stakingToken.symbol === 'HODLX' ?
          t('Stake %amount% %nft% along with your %symbol% to enter this pool.', { symbol: pool.stakingToken.symbol, amount: requiredHands, nft: requiredHands === '1' ? 'NFT' : 'NFTs' }) :
          t('To gain access to this special pool you will need to provide %amount% %nft% along with the $HODL you stake. Note - there is no tax when adding or removing $HODL from this pool.', { amount: requiredHands, nft: requiredHands === '1' ? 'NFT' : 'NFTs' })
        }
      </Text>
      <Text my="24px">
        {pool.stakingToken.symbol === 'HODLX' ?
          t('Step 1 - Connect your wallet. Step 2 - Click \'Enable %symbol%\'. There will be two transactions to confirm so please wait once the first is confirmed. If you have issues enabling both %symbol% and NFTs, enable them individually with the buttons on this page.', { symbol: pool.stakingToken.symbol, amount: requiredHands, nft: requiredHands === '1' ? 'NFT' : 'NFTs' }) :
          t('Simply connect your wallet, \'enable HODL\', wait for and \'enable NFTs\' and then select the amout of $HODL you wish to stake. If you have issues enabling both $HODL and NFTs, enable them individually with the buttons on this page.')
        }
      </Text>
      <Text my="24px">
        {pool.stakingToken.symbol === 'HODLX' ?
          t('Rewards are distributed and included in your staked balance daily so there’s no need to manually compound.', { symbol: pool.stakingToken.symbol }) :
          t('Rewards are distributed and included in your staking balance weekly. There’s no need to manually compound your rewards.')
        }
      </Text>
      <Text my="24px">
        {pool.stakingToken.symbol === 'HODLX' ?
          t('Note – There’s a 2.5% tax on withdrawals within the first 30 days.') : t('This pool currently has no end date, however when staking $HODL, the tokens are locked for the first 90 days. Note - This lock period will be reset to a new period of 90 days if you add more $HODL at any time.')
        }
      </Text>
    </>)
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
