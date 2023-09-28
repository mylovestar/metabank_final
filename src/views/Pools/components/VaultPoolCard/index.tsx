import BigNumber from 'bignumber.js'

import { CardBody, Flex, Text, CardRibbon } from '@metabank/uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useTranslation } from 'contexts/Localization'
import { BIG_ZERO } from 'utils/bigNumber'
import { DeserializedPool } from 'state/types'
import { TokenVaultPoolPairImage } from 'components/TokenImage'
import { useRequiredHand } from 'hooks/useACPContract'
import LockRow from './LockRow'
import ApyRow from './ApyRow'
import { StyledCard } from './StyledCard'
import CardFooter from './CardFooter'
import PoolCardHeader, { PoolCardHeaderTitle } from './PoolCardHeader'
import CardActions from './CardActions'

const PoolCard: React.FC<{ pool: DeserializedPool; account: string }> = ({ pool, account }) => {
  const { sousId, stakingToken, earningToken, isFinished, userData } = pool
  const { t } = useTranslation()
  const stakedBalance = userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO
  const accountHasStakedBalance = stakedBalance.gt(0)

  const { requiredHands, apr } = useRequiredHand(pool.contractAddress[56])
  return (
    <StyledCard
      isFinished={isFinished && sousId !== 0}
      ribbon={isFinished && <CardRibbon variantColor="textDisabled" text={t('Finished')} />}
    >
      <PoolCardHeader isStaking={accountHasStakedBalance} isFinished={isFinished && sousId !== 0 && sousId !== 15}>
        <PoolCardHeaderTitle
          title={t('Auto-Compounding!')}
          subTitle={t('Stake %symbol% + %amount% %nft%, earn %symbol%', { amount: requiredHands, symbol: stakingToken.name, nft: requiredHands === '1' ? 'NFT' : 'NFTs' })}
        />
        <TokenVaultPoolPairImage primaryToken={earningToken} secondaryToken="https://pancakeswap.finance/images/tokens/autorenew.svg" width={64} height={64} />
      </PoolCardHeader>
      <CardBody>
        <ApyRow pool={pool} stakedBalance={stakedBalance} fixedApr={apr} />
        {
          pool.stakingToken.symbol === 'HODL' && <LockRow pool={pool} />
        }
        <Flex mt="24px" flexDirection="column">
          {account ? (
            <CardActions pool={pool} stakedBalance={stakedBalance} />
          ) : (
            <>
              <Text mb="10px" textTransform="uppercase" fontSize="12px" color="textSubtle" bold>
                {t('Start earning')}
              </Text>
              <ConnectWalletButton />
            </>
          )}
        </Flex>
      </CardBody>
      <CardFooter pool={pool} account={account} />
    </StyledCard>
  )
}

export default PoolCard
