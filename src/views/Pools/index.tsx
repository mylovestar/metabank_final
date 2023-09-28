import { useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { BigNumber as EthersBigNumber } from '@ethersproject/bignumber'
import { formatUnits } from '@ethersproject/units'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { Heading, Flex, Image, Text } from '@metabank/uikit'
import orderBy from 'lodash/orderBy'
import partition from 'lodash/partition'
import { useTranslation } from 'contexts/Localization'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import {
  useFetchPublicPoolsData,
  usePools,
  useFetchUserPools,
  useFetchCakeVault,
  useFetchIfoPool,
  useVaultPools,
} from 'state/pools/hooks'
import { latinise } from 'utils/latinise'
import FlexLayout from 'components/Layout/Flex'
import Page from 'components/Layout/Page'
import PageHeader from 'components/PageHeader'
import SearchInput from 'components/SearchInput'
import Select, { OptionProps } from 'components/Select/Select'
import { DeserializedPool } from 'state/types'
import { useUserPoolStakedOnly, useUserPoolsViewMode } from 'state/user/hooks'
import { usePoolsWithVault } from 'views/Home/hooks/useGetTopPoolsByApr'
import { ViewMode } from 'state/user/actions'
import { BIG_ZERO } from 'utils/bigNumber'
import { useRouter } from 'next/router'
import Loading from 'components/Loading'
import PoolCard from './components/PoolCard'
import VaultPoolCard from './components/VaultPoolCard'
import HandPurchaseCard from './components/HandPurchaseCard'
import HandPurchaseWithHodlCard from './components/HandPurchaseWithHodlCard'
import HandPurchaseWithBNBCard from './components/HandPurchaseWithBNBCard'
import CakeVaultCard from './components/CakeVaultCard'
import PoolTabButtons from './components/PoolTabButtons'
import BountyCard from './components/BountyCard'
import HelpButton from './components/HelpButton'
import PoolsTable from './components/PoolsTable/PoolsTable'
import { getCakeVaultEarnings } from './helpers'
import { serializeTokens } from 'config/constants/tokens'

const CardLayout = styled(FlexLayout)`
  justify-content: center;
`

const PoolControls = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;

  justify-content: space-between;
  flex-direction: row;
  margin-bottom: 32px;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    flex-wrap: wrap;
    padding: 16px 32px;
    margin-bottom: 0;
  }
`

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 0px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: auto;
    padding: 0;
  }
`

const LabelWrapper = styled.div`
  > ${Text} {
    font-size: 12px;
  }
`

const ControlStretch = styled(Flex)`
  > div {
    flex: 1;
  }
`

const NUMBER_OF_POOLS_VISIBLE = 12

export interface PoolsProps {
  tokenMode?: Boolean
}

const serializedTokens = serializeTokens()

const Pools: React.FC<PoolsProps> = ({ tokenMode = false }) => {
  const router = useRouter()
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { userDataLoaded } = usePools()
  const [stakedOnly, setStakedOnly] = useUserPoolStakedOnly()
  const [viewMode, setViewMode] = useUserPoolsViewMode()
  const [numberOfPoolsVisible, setNumberOfPoolsVisible] = useState(NUMBER_OF_POOLS_VISIBLE)
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOption, setSortOption] = useState('apr')
  const chosenPoolsLength = useRef(0)
  const vaultPools = useVaultPools()
  const cakeInVaults = Object.values(vaultPools).reduce((total, vault) => {
    return total.plus(vault.totalCakeInVault)
  }, BIG_ZERO)

  // const pools = usePoolsWithVault()
  const pools_ = usePoolsWithVault()
  const pools = useMemo(() => pools_.filter((pool) => {
    if ((tokenMode == pool.isNft && pool.isBuyNFT !== true) || (tokenMode === true && pool.isBuyNFT)) {
      return pool
    }
  }), [pools_])


  // TODO aren't arrays in dep array checked just by reference, i.e. it will rerender every time reference changes?
  const [finishedPools, openPools] = useMemo(() => partition(pools, (pool) => pool.isFinished), [pools])
  const stakedOnlyFinishedPools = useMemo(
    () =>
      finishedPools.filter((pool) => {
        if (pool.vaultKey) {
          return vaultPools[pool.vaultKey].userData.userShares && vaultPools[pool.vaultKey].userData.userShares.gt(0)
        }
        return pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0)
      }),
    [finishedPools, vaultPools],
  )
  const stakedOnlyOpenPools = useMemo(
    () =>
      openPools.filter((pool) => {
        if (pool.vaultKey) {
          return vaultPools[pool.vaultKey].userData.userShares && vaultPools[pool.vaultKey].userData.userShares.gt(0)
        }
        return pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0)
      }),
    [openPools, vaultPools],
  )
  const hasStakeInFinishedPools = stakedOnlyFinishedPools.length > 0

  useFetchCakeVault()
  useFetchIfoPool(false)
  useFetchPublicPoolsData()
  useFetchUserPools(account)

  useEffect(() => {
    if (isIntersecting) {
      setNumberOfPoolsVisible((poolsCurrentlyVisible) => {
        if (poolsCurrentlyVisible <= chosenPoolsLength.current) {
          return poolsCurrentlyVisible + NUMBER_OF_POOLS_VISIBLE
        }
        return poolsCurrentlyVisible
      })
    }
  }, [isIntersecting])

  const showFinishedPools = router.pathname.includes('history')

  const handleChangeSearchQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  const handleSortOptionChange = (option: OptionProps): void => {
    setSortOption(option.value)
  }


  const sortPools = (poolsToSort: DeserializedPool[]) => {
    switch (sortOption) {
      case 'apr':
        // Ternary is needed to prevent pools without APR (like MIX) getting top spot
        return orderBy(poolsToSort, (pool: DeserializedPool) => (pool.apr ? pool.isAutoCompounding === true ? 100000000000000 : pool.apr : 0), 'desc')
      case 'earned':
        return orderBy(
          poolsToSort,
          (pool: DeserializedPool) => {
            if (!pool.userData || !pool.earningTokenPrice) {
              return 0
            }
            return pool.vaultKey
              ? getCakeVaultEarnings(
                account,
                vaultPools[pool.vaultKey].userData.cakeAtLastUserAction,
                vaultPools[pool.vaultKey].userData.userShares,
                vaultPools[pool.vaultKey].pricePerFullShare,
                pool.earningTokenPrice,
              ).autoUsdToDisplay
              : pool.userData.pendingReward.times(pool.earningTokenPrice).toNumber()
          },
          'desc',
        )
      case 'totalStaked':
        return orderBy(
          poolsToSort,
          (pool: DeserializedPool) => {
            let totalStaked = Number.NaN
            if (pool.vaultKey) {
              if (pool.stakingTokenPrice && vaultPools[pool.vaultKey].totalCakeInVault.isFinite()) {
                totalStaked =
                  +formatUnits(
                    EthersBigNumber.from(vaultPools[pool.vaultKey].totalCakeInVault.toString()),
                    pool.stakingToken.decimals,
                  ) * pool.stakingTokenPrice
              }
            } else if (pool.sousId === 0) {
              if (pool.totalStaked?.isFinite() && pool.stakingTokenPrice && cakeInVaults.isFinite()) {
                const manualCakeTotalMinusAutoVault = EthersBigNumber.from(pool.totalStaked.toString()).sub(
                  cakeInVaults.toString(),
                )
                totalStaked =
                  +formatUnits(manualCakeTotalMinusAutoVault, pool.stakingToken.decimals) * pool.stakingTokenPrice
              }
            } else if (pool.totalStaked?.isFinite() && pool.stakingTokenPrice) {
              totalStaked =
                +formatUnits(EthersBigNumber.from(pool.totalStaked.toString()), pool.stakingToken.decimals) *
                pool.stakingTokenPrice
            }
            return Number.isFinite(totalStaked) ? totalStaked : 0
          },
          'desc',
        )
      case 'latest':
        return orderBy(poolsToSort, (pool: DeserializedPool) => Number(pool.sousId), 'desc')
      default:
        return poolsToSort
    }
  }

  let chosenPools
  if (showFinishedPools) {
    chosenPools = stakedOnly ? stakedOnlyFinishedPools : finishedPools
  } else {
    chosenPools = stakedOnly ? stakedOnlyOpenPools : openPools
  }

  if (searchQuery) {
    const lowercaseQuery = latinise(searchQuery.toLowerCase())
    chosenPools = chosenPools.filter((pool) =>
      latinise(pool.earningToken.symbol.toLowerCase()).includes(lowercaseQuery),
    )
  }

  chosenPools = sortPools(chosenPools).slice(0, numberOfPoolsVisible)
  chosenPoolsLength.current = chosenPools.length

  const cardLayout = (
    /*
    <CardLayout>
      {chosenPools.map((pool) =>
        // pool.vaultKey ? (
        //   <CakeVaultCard key={pool.vaultKey} pool={pool} showStakedOnly={stakedOnly} />
        // ) : (
        //   <PoolCard key={pool.sousId} pool={pool} account={account} />
        // ),
        pool.vaultKey ? <CakeVaultCard key={pool.vaultKey} pool={pool} showStakedOnly={stakedOnly} /> :
          pool.isAutoCompounding ? <VaultPoolCard key={pool.sousId} pool={pool} account={account} /> :
            pool.isBuyNFT ? 
              pool.stakingToken == serializedTokens.hodlx ? <HandPurchaseCard key={pool.sousId} pool={pool} account={account} /> :
                <HandPurchaseWithHodlCard key={pool.sousId} pool={pool} account={account} /> :
              <PoolCard key={pool.sousId} pool={pool} account={account} />
      )}
    </CardLayout>
    */
    <CardLayout>
    {chosenPools.map((pool) => {
      if (pool.vaultKey) {
        return <CakeVaultCard key={pool.vaultKey} pool={pool} showStakedOnly={stakedOnly} />;
      } else if (pool.isAutoCompounding) {
        return <VaultPoolCard key={pool.sousId} pool={pool} account={account} />;
      } else if (pool.isBuyNFT) {
        switch (pool.stakingToken.name) {        
          case 'HODLX':
            return <HandPurchaseCard key={pool.sousId} pool={pool} account={account} />;
          case 'HODL':
            return <HandPurchaseWithHodlCard key={pool.sousId} pool={pool} account={account} />;
          case 'BNB':
            return <HandPurchaseWithBNBCard key={pool.sousId} pool={pool} account={account} />;
        }
      } else {
        return <PoolCard key={pool.sousId} pool={pool} account={account} />;
      }
    }   
    )}
  </CardLayout>
  )

  const tableLayout = <PoolsTable pools={chosenPools} account={account} userDataLoaded={userDataLoaded} />

  return (
    <>
      <PageHeader>
        <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
          <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
            <Heading as="h1" scale="xxl" color="secondary" mb="24px">
              {
                tokenMode ? (
                  t('NFT Staking')
                ) : (
                  t('Special Pools')
                )
              }
            </Heading>
            <Heading scale="md" color="text">
              {
                tokenMode ? (
                  t('Stake HODL Hand NFTs')
                ) : (
                  t('Stake in these zero risk specialist pools to earn amazing APRs and APYs!')
                )
              }
            </Heading>
            {/* <Heading scale="md" color="text">
              {t('Good APR, low risk.')}
            </Heading> */}
          </Flex>
        </Flex>
      </PageHeader>
      <Page>
        <PoolControls>
          <PoolTabButtons
            stakedOnly={stakedOnly}
            setStakedOnly={setStakedOnly}
            hasStakeInFinishedPools={hasStakeInFinishedPools}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
          <FilterContainer>
            <LabelWrapper>
              <Text fontSize="12px" bold color="textSubtle" textTransform="uppercase">
                {t('Sort by')}
              </Text>
              <ControlStretch>
                <Select
                  options={[
                    // {
                    //   label: t('Hot'),
                    //   value: 'hot',
                    // },
                    {
                      label: t('APR'),
                      value: 'apr',
                    },
                    {
                      label: t('Earned'),
                      value: 'earned',
                    },
                    {
                      label: t('Total staked'),
                      value: 'totalStaked',
                    },
                    {
                      label: t('Latest'),
                      value: 'latest',
                    },
                  ]}
                  onOptionChange={handleSortOptionChange}
                />
              </ControlStretch>
            </LabelWrapper>
            {/* <LabelWrapper style={{ marginLeft: 16 }}>
              <Text fontSize="12px" bold color="textSubtle" textTransform="uppercase">
                {t('Search')}
              </Text>
              <SearchInput onChange={handleChangeSearchQuery} placeholder="Search Pools" />
            </LabelWrapper> */}
          </FilterContainer>
        </PoolControls>
        {showFinishedPools && (
          <Text fontSize="20px" color="failure" pb="32px">
            {t('These pools are no longer distributing rewards. Please unstake your tokens.')}
          </Text>
        )}
        {account && !userDataLoaded && stakedOnly && (
          <Flex justifyContent="center" mb="4px">
            <Loading />
          </Flex>
        )}
        {viewMode === ViewMode.CARD ? cardLayout : cardLayout}
        {/* {viewMode === ViewMode.CARD ? cardLayout : tableLayout} */}
        <div ref={observerRef} />
      </Page>
    </>
  )
}

export default Pools
