import BigNumber from 'bignumber.js'

import { CardBody, Flex, Text, CardRibbon } from '@metabank/uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useTranslation } from 'contexts/Localization'
import { BIG_ZERO } from 'utils/bigNumber'
import { DeserializedPool } from 'state/types'
import { TokenImage, TokenPairImage } from 'components/TokenImage'
import { usePool } from 'state/pools/hooks'
import AprRow from './AprRow'
import { StyledCard } from './StyledCard'
import CardFooter from './CardFooter'
import PoolCardHeader, { PoolCardHeaderTitle } from './PoolCardHeader'
import CardActions from './CardActions'

const PoolCard: React.FC<{ pool: DeserializedPool; account: string; }> = ({ pool, account }) => {
  const { sousId, stakingToken, earningToken, isFinished, userData } = pool
  const { t } = useTranslation()
  const stakedBalance = userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO
  const accountHasStakedBalance = stakedBalance.gt(0)

  return (
    <StyledCard
      isFinished={isFinished && pool.isBuyNFT !== true}
      ribbon={isFinished && <CardRibbon variantColor="textDisabled" text={t('Finished')} />}
    >
      <PoolCardHeader isStaking={accountHasStakedBalance} isFinished={isFinished && pool.isBuyNFT !== true}>
        <PoolCardHeaderTitle
          title={t('Buy NFTs with BNB')}
          subTitle={t('Mint a superhero hand to win up to $20k!')}
        />
        <TokenPairImage primaryToken={earningToken} secondaryToken={stakingToken} width={64} height={64} />
      </PoolCardHeader>
      <CardBody>
        <AprRow pool={pool} />
        <Flex mt="24px" flexDirection="column">
          {account ? (
            <CardActions pool={pool} stakedBalance={stakedBalance} discountSave={new BigNumber(0)}/>
          ) : (
            <>
              <ConnectWalletButton />
            </>
          )}
        </Flex>
      </CardBody>
    </StyledCard>
  )
}

export default PoolCard
