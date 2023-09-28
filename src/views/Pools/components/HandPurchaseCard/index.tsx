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

const PoolCard: React.FC<{ pool: DeserializedPool; account: string }> = ({ pool, account }) => {
  const { sousId, stakingToken, earningToken, isFinished, userData } = pool
  const { t } = useTranslation()
  const stakedBalance = userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO
  const accountHasStakedBalance = stakedBalance.gt(0)

  // const isCakePool = earningToken.symbol === 'HODLX' && stakingToken.symbol === 'HODLX'
  const pool3 = usePool(3)
  const discountRate = pool.stakingTokenPrice ? new BigNumber(pool.stakingTokenPrice).times(new BigNumber(pool.earningTokenPrice).div(new BigNumber(pool3.pool.stakingTokenPrice)).times(new BigNumber(100))) : (new BigNumber(0))
  const discountSave = pool.stakingTokenPrice ? new BigNumber(pool3.pool.stakingTokenPrice).minus(new BigNumber(pool.stakingTokenPrice).times(new BigNumber(pool.earningTokenPrice))) : new BigNumber(0)

  const discountRatePercent = pool.discountRate !== undefined ? pool.discountRate.toString() : discountRate.toFixed(0)

  return (
    <StyledCard
      isFinished={isFinished && sousId !== 0 && sousId !== 15}
      ribbon={isFinished && <CardRibbon variantColor="textDisabled" text={t('Finished')} />}
    >
      <PoolCardHeader isStaking={accountHasStakedBalance} isFinished={isFinished && sousId !== 0 && sousId !== 15}>
        <PoolCardHeaderTitle
          title={t('Buy NFTs with HODLX')}
          subTitle={t('Get a discount when buying with HODLX')}
        />
        <TokenPairImage primaryToken={earningToken} secondaryToken={stakingToken} width={64} height={64} />
      </PoolCardHeader>
      <CardBody>
        <AprRow pool={pool} stakedBalance={stakedBalance} discountRatePercent={discountRatePercent} discountSave={discountSave}/>
        <Flex mt="24px" flexDirection="column">
          {account ? (
            <CardActions pool={pool} stakedBalance={stakedBalance} discountSave={discountSave}/>
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
