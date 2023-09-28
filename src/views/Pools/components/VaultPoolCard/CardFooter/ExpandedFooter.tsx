import { memo, useCallback, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import { useTranslation } from 'contexts/Localization'
import {
  Flex,
  MetamaskIcon,
  Text,
  TooltipText,
  LinkExternal,
  TimerIcon,
  Skeleton,
  useTooltip,
  Button,
  Link,
  HelpIcon,
} from '@metabank/uikit'
import { BASE_BSC_SCAN_URL } from 'config'
import { useCurrentBlock } from 'state/block/hooks'
import { useVaultPoolByKey, useVaultPools } from 'state/pools/hooks'
import { DeserializedPool } from 'state/types'
import { getAddress, getVaultPoolAddress } from 'utils/addressHelpers'
import { registerToken } from 'utils/wallet'
import { getBscScanLink } from 'utils'
import Balance from 'components/Balance'
import { getPoolBlockInfo } from 'views/Pools/helpers'
import { BIG_ZERO } from 'utils/bigNumber'
import { mainnetTokens } from 'config/constants/tokens'
import { useHandBalanceOfContract } from 'hooks/useTokenBalance'
import MaxStakeRow from '../../MaxStakeRow'

interface ExpandedFooterProps {
  pool: DeserializedPool
  account: string
}

const ExpandedWrapper = styled(Flex)`
  svg {
    height: 14px;
    width: 14px;
  }
`

const ExpandedFooter: React.FC<ExpandedFooterProps> = ({ pool, account }) => {
  const { t } = useTranslation()
  const currentBlock = useCurrentBlock()

  const {
    stakingToken,
    earningToken,
    totalStaked,
    startBlock,
    endBlock,
    stakingLimit,
    stakingLimitEndBlock,
    contractAddress,
    sousId,
    vaultKey,
    profileRequirement,
  } = pool

  const {
    totalCakeInVault,
    fees: { performanceFee },
  } = useVaultPoolByKey(vaultKey)

  const vaultPools = useVaultPools()
  const cakeInVaults = Object.values(vaultPools).reduce((total, vault) => {
    return total.plus(vault.totalCakeInVault)
  }, BIG_ZERO)

  const tokenAddress = earningToken.address || ''
  const poolContractAddress = getAddress(contractAddress)
  const cakeVaultContractAddress = getVaultPoolAddress(vaultKey)
  const isMetaMaskInScope = !!window.ethereum?.isMetaMask
  const isManualCakePool = sousId === 0

  const { shouldShowBlockCountdown, blocksUntilStart, blocksRemaining, hasPoolStarted, blocksToDisplay } =
    getPoolBlockInfo(pool, currentBlock)

  const endDateStr = new Date(Date.now() + blocksRemaining * 3 * 1000 - 5 * 3600 * 1000).toUTCString().slice(0, 16)
  const startDateStr = new Date(Date.now() + (blocksRemaining + startBlock - endBlock) * 3 * 1000 - 5 * 3600 * 1000).toUTCString().slice(0, 16)

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t('Subtracted automatically from each yield harvest and burned.'),
    { placement: 'bottom-start' },
  )

  const getTotalStakedBalance = () => {
    if (vaultKey) {
      return getBalanceNumber(totalCakeInVault, stakingToken.decimals)
    }
    if (isManualCakePool) {
      const manualCakeTotalMinusAutoVault = new BigNumber(totalStaked).minus(cakeInVaults)
      return getBalanceNumber(manualCakeTotalMinusAutoVault, stakingToken.decimals)
    }
    return getBalanceNumber(totalStaked, stakingToken.decimals)
  }

  const {
    targetRef: totalStakedTargetRef,
    tooltip: totalStakedTooltip,
    tooltipVisible: totalStakedTooltipVisible,
  } = useTooltip(t('Total amount of %symbol% staked in this pool', { symbol: stakingToken.symbol === "HH" ? "HODL Hand NFTs" : stakingToken.symbol }), {
    placement: 'bottom',
  })

  const {
    targetRef: totalStakedHandTargetRef,
    tooltip: totalStakedHandTooltip,
    tooltipVisible: totalStakedHandTooltipVisible,
  } = useTooltip(t('Total amount of %symbol% staked in this pool', { symbol: "HODL Hand NFTs" }), {
    placement: 'bottom',
  })

  const getTokenLink = earningToken.address ? `/swap?outputCurrency=${earningToken.address}` : '/swap'

  const { balance: handBalance } = useHandBalanceOfContract(pool.contractAddress[56])

  const bal = useMemo(() => {
    return getFullDisplayBalance(handBalance, 0, 0);
  }, [handBalance])

  return (
    <ExpandedWrapper flexDirection="column">
      {profileRequirement && (profileRequirement.required || profileRequirement.thresholdPoints.gt(0)) && (
        <Flex mb="8px" justifyContent="space-between">
          <Text small>{t('Requirement')}:</Text>
          <Text small textAlign="right">
            {profileRequirement.required && t('Pancake Profile')}{' '}
            {profileRequirement.thresholdPoints.gt(0) && (
              <Text small>
                {profileRequirement.thresholdPoints.toNumber().toLocaleString()} {t('Profile Points')}
              </Text>
            )}
          </Text>
        </Flex>
      )}
      <Flex mb="2px" justifyContent="space-between" alignItems="center">
        <Text small>{t('Total staked')}:</Text>
        <Flex alignItems="flex-start">
          {totalStaked && totalStaked.gte(0) ? (
            <>
              <Balance small value={getTotalStakedBalance()} decimals={0} unit={` ${stakingToken.symbol === "NFT" ? "NFTs" : stakingToken.symbol}`} />
              <span ref={totalStakedTargetRef}>
                <HelpIcon color="textSubtle" width="20px" ml="6px" mt="4px" />
              </span>
            </>
          ) : (
            <Skeleton width="90px" height="21px" />
          )}
          {totalStakedTooltipVisible && totalStakedTooltip}
        </Flex>
      </Flex>
      <Flex mb="2px" justifyContent="space-between" alignItems="center">
        <Text small>{t('Total staked')}:</Text>
        <Flex alignItems="flex-start">
          {totalStaked && totalStaked.gte(0) ? (
            <>
              <Balance small value={Number(bal)} decimals={0} unit={` NFTs`} />
              <span ref={totalStakedHandTargetRef}>
                <HelpIcon color="textSubtle" width="20px" ml="6px" mt="4px" />
              </span>
            </>
          ) : (
            <Skeleton width="90px" height="21px" />
          )}
          {totalStakedHandTooltipVisible && totalStakedHandTooltip}
        </Flex>
      </Flex>
      {stakingLimit && stakingLimit.gt(0) && (
        <MaxStakeRow
          small
          currentBlock={currentBlock}
          hasPoolStarted={hasPoolStarted}
          stakingLimit={stakingLimit}
          stakingLimitEndBlock={stakingLimitEndBlock}
          stakingToken={stakingToken}
        />
      )}

      <Flex mb="2px" justifyContent="space-between" alignItems="center">
        <Text small>{t('End date')}:</Text>

        <Flex alignItems="center">
          <Text small ml="4px">
            No end scheduled
          </Text>
        </Flex>
      </Flex>
      <Flex mb="2px" justifyContent="flex-end">
        <LinkExternal href={stakingToken.projectLink} bold={false} small>
          {pool.isNft ? t('Learn about HODL Hands') : t('View Project Site')}
        </LinkExternal>
      </Flex>
      {poolContractAddress && (
        <Flex mb="2px" justifyContent="flex-end">
          <LinkExternal
            href={`${BASE_BSC_SCAN_URL}/address/${vaultKey ? cakeVaultContractAddress : poolContractAddress}`}
            bold={false}
            small
          >
            {t('View Contract')}
          </LinkExternal>
        </Flex>
      )}
      <Flex mb="2px" justifyContent="flex-end">
        <LinkExternal
          href={getTokenLink}
          bold={false}
          small
        >
          {t('Buy %symbol%', { symbol: pool.earningToken.symbol })}
        </LinkExternal>
      </Flex>
      <Flex mb="2px" justifyContent="flex-end">
        <LinkExternal
          href={mainnetTokens.hh.projectLink}
          bold={false}
          small
        >
          {t('Buy NFTs')}
        </LinkExternal>
      </Flex>
    </ExpandedWrapper>
  )
}

export default memo(ExpandedFooter)
