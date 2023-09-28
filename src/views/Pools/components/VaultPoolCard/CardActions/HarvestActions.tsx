import { useState } from 'react'
import { Flex, Text, Button, Heading, useModal, Skeleton } from '@metabank/uikit'
import BigNumber from 'bignumber.js'
import { Token } from '@metabank/sdk'
import { useTranslation } from 'contexts/Localization'
import { getFullDisplayBalance, getBalanceNumber, formatNumber } from 'utils/formatBalance'
import Balance from 'components/Balance'
import CollectModal from '../Modals/CollectModal'
import CollectModalNft from '../Modals/CollectModalForNft'

interface HarvestActionsProps {
  earnings: BigNumber
  earningToken: Token
  sousId: number
  earningTokenPrice: number
  isBnbPool: boolean
  isLoading?: boolean
  isFinished?: boolean
}

const HarvestActions: React.FC<HarvestActionsProps> = ({
  earnings,
  earningToken,
  sousId,
  isBnbPool,
  earningTokenPrice,
  isLoading = false,
  isFinished
}) => {
  const { t } = useTranslation()
  const earningTokenBalance = getBalanceNumber(earnings, earningToken.decimals === 0 ? 18 : earningToken.decimals)
  const formattedBalance = formatNumber(earningTokenBalance, earningToken.decimals === 0 ? 6 : 3, earningToken.decimals === 0 ? 6 : 3)

  const earningTokenDollarBalance = getBalanceNumber(earnings.multipliedBy(earningTokenPrice), earningToken.decimals === 0 ? 18 : earningToken.decimals)

  const fullBalance = getFullDisplayBalance(earnings, earningToken.decimals)
  const hasEarnings = earnings.toNumber() > 0
  const isDisableHarvest = earningToken.decimals === 0 ? earnings.toNumber() > 0 : earnings.toNumber() > 0

  const isOpenModal = earningToken.decimals === 0 ? earnings.toNumber() > 0 && earningTokenBalance > 1 : false

  const isCompoundPool = sousId === 0

  const [onPresentCollect] = useModal(
    <CollectModal
      formattedBalance={formattedBalance}
      fullBalance={fullBalance}
      earningToken={earningToken}
      earningsDollarValue={earningTokenDollarBalance}
      sousId={sousId}
      isBnbPool={isBnbPool}
      isCompoundPool={isCompoundPool}
    />,
  )

  const [onPresentCollectNft] = useModal(
    <CollectModalNft
      formattedBalance={formattedBalance}
      fullBalance={fullBalance}
      earningToken={earningToken}
      earningsDollarValue={earningTokenDollarBalance}
      sousId={sousId}
      isBnbPool={isBnbPool}
      isCompoundPool={isCompoundPool}
      isFinished={isFinished}
    />,
  )

  const [seen, setSeen] = useState(false)

  if (!seen) {
    setSeen(true)
    if (isOpenModal) {
      onPresentCollectNft()
    }
  }

  return (
    <Flex justifyContent="space-between" alignItems="center" mb="16px">
      <Flex flexDirection="column">
        {isLoading ? (
          <Skeleton width="80px" height="48px" />
        ) : (
          <>
            {hasEarnings ? (
              <>
                <Balance bold fontSize="20px" decimals={earningToken.decimals === 0 ? 6 : 0} value={earningTokenBalance} />
                {earningTokenPrice > 0 && (
                  <Balance
                    display="inline"
                    fontSize="12px"
                    color="textSubtle"
                    decimals={2}
                    prefix="~"
                    value={earningTokenDollarBalance}
                    unit=" USD"
                  />
                )}
              </>
            ) : (
              <>
                <Heading color="textDisabled">0</Heading>
                <Text fontSize="12px" color="textDisabled">
                  0 USD
                </Text>
              </>
            )}
          </>
        )}
      </Flex>
      <Button disabled={!isDisableHarvest} onClick={earningToken.decimals === 0 ? onPresentCollectNft : onPresentCollect}>
        {isCompoundPool ? t('Collect') : t('Harvest')}
      </Button>
    </Flex>
  )
}

export default HarvestActions
