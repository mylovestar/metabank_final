import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import {
  Modal,
  Text,
  Flex,
  Image,
  Button,
  Slider,
  BalanceInput,
  AutoRenewIcon,
  Link,
  CalculateIcon,
  IconButton,
  Skeleton,
} from '@metabank/uikit'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import useToast from 'hooks/useToast'
import useCatchTxError from 'hooks/useCatchTxError'
import BigNumber from 'bignumber.js'
//import RoiCalculatorModal from 'components/RoiCalculatorModal'
import { ToastDescriptionWithTx } from 'components/Toast'
import { getFullDisplayBalance, formatNumber, getDecimalAmount } from 'utils/formatBalance'
import { DeserializedPool } from 'state/types'
import { updateUserBalance, updateUserPendingReward, updateUserStakedBalance } from 'state/pools'
import { useAppDispatch } from 'state'
//import { getInterestBreakdown } from 'utils/compoundApyHelpers'
import { BIG_TEN } from 'utils/bigNumber'
import PercentageButton from './PercentageButton'
import useStakePool from '../../../hooks/useStakePool'
//import useUnstakePool from '../../../hooks/useUnstakePool'

interface StakeModalProps {
  isBnbPool: boolean
  pool: DeserializedPool
  stakingTokenBalance: BigNumber
  stakingTokenPrice: number
  isRemovingStake?: boolean
  discountSave: BigNumber
  onDismiss?: () => void
}

const StyledLink = styled(Link)`
  width: 100%;
`

const AnnualRoiContainer = styled(Flex)`
  cursor: pointer;
`

const AnnualRoiDisplay = styled(Text)`
  width: 72px;
  max-width: 72px;
  overflow: hidden;
  text-align: right;
  text-overflow: ellipsis;
`

const StakeModal: React.FC<StakeModalProps> = ({
  isBnbPool,
  pool,
  stakingTokenBalance,
  stakingTokenPrice,
  isRemovingStake = false,
  discountSave,
  onDismiss,
}) => {
  const { sousId, stakingToken, earningTokenPrice, apr, userData, stakingLimit, earningToken } = pool
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { onStake } = useStakePool(sousId, isBnbPool)
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const [percent, setPercent] = useState(1)
  const [buyAmount, setBuyAmount] = useState(1)
  const [stakeAmount, setStakeAmount] = useState(getFullDisplayBalance(new BigNumber(percent).times(pool.earningTokenPrice).times(BIG_TEN.pow(stakingToken.decimals)), stakingToken.decimals, 2))
  const [hasReachedStakeLimit, setHasReachedStakedLimit] = useState(false)
  //const [showRoiCalculator, setShowRoiCalculator] = useState(false)
  const getCalculatedStakingLimit = () => {
    if (isRemovingStake) {
      return userData.stakedBalance
    }
    return stakingLimit.gt(0) && stakingTokenBalance.gt(stakingLimit) ? stakingLimit : stakingTokenBalance
  }
  const fullDecimalStakeAmount = getDecimalAmount(new BigNumber(stakeAmount), stakingToken.decimals)
  const userNotEnoughToken = isRemovingStake
    ? userData.stakedBalance.lt(fullDecimalStakeAmount)
    : userData.stakingTokenBalance.lt(fullDecimalStakeAmount)

  const usdValueStaked = new BigNumber(stakeAmount).times(stakingTokenPrice)
  const formattedUsdValueStaked = !usdValueStaked.isNaN() && formatNumber(usdValueStaked.toNumber())

  const handleStakeInputChange = (input: string) => {
    setStakeAmount(input)
    const amount = Math.floor(Number(input) / (pool.earningTokenPrice)) > 20 ? 20 : Math.floor(Number(input) / (pool.earningTokenPrice))
    setBuyAmount(amount)
    setPercent(amount)
  }

  const handleChangePercent = (sliderPercent: number) => {
    setBuyAmount(sliderPercent)
    setStakeAmount(getFullDisplayBalance(new BigNumber(sliderPercent).times(pool.earningTokenPrice).times(BIG_TEN.pow(stakingToken.decimals)), stakingToken.decimals, 2))
    setPercent(sliderPercent)
  }

  const handleChangeHand = (sliderPercent: number) => {
    setBuyAmount(sliderPercent)
    setStakeAmount(getFullDisplayBalance(new BigNumber(sliderPercent).times(pool.earningTokenPrice).times(BIG_TEN.pow(stakingToken.decimals)), stakingToken.decimals, 2))
    setPercent(sliderPercent)
  }

  const handleConfirmClick = async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return onStake(buyAmount.toString(), 0, pool.isNft, pool)
    })
    if (receipt?.status) {
      if (isRemovingStake) {
        toastSuccess(
          `${t('Unstaked')}!`,
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {t('Your %symbol% earnings have also been harvested to your wallet!', {
              symbol: earningToken.symbol,
            })}
          </ToastDescriptionWithTx>,
        )
      } else {
        toastSuccess(
          `${t('Success')}!`,
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {t('Your %symbol% has been swapped for NFTs!', {
              symbol: stakingToken.symbol,
            })}
          </ToastDescriptionWithTx>,
        )
      }
      dispatch(updateUserStakedBalance(sousId, account))
      dispatch(updateUserPendingReward(sousId, account))
      dispatch(updateUserBalance(sousId, account))
      onDismiss?.()
    }
  }
  /*
  if (showRoiCalculator) {
    return (
      <RoiCalculatorModal
        earningTokenPrice={earningTokenPrice}
        stakingTokenPrice={stakingTokenPrice}
        apr={apr}
        linkLabel={t('Get %symbol%', { symbol: stakingToken.symbol })}
        linkHref={getTokenLink}
        stakingTokenBalance={userData.stakedBalance.plus(stakingTokenBalance)}
        stakingTokenSymbol={stakingToken.symbol}
        earningTokenSymbol={earningToken.symbol}
        onBack={() => setShowRoiCalculator(false)}
        initialValue={stakeAmount}
      />
    )
  }
  */

  return (
    <Modal
      minWidth="346px"
      title={t('Buy HODL Hand NFTs')}
      onDismiss={onDismiss}
      headerBackground={theme.colors.gradients.cardHeader}
    >
      <Flex alignItems="center" justifyContent="space-between" mb="8px">
        <Text bold>{t('Price per NFT')}:</Text>
        <Flex alignItems="center" minWidth="70px">
          <Text ml="4px" bold>
            {`${Number(pool.earningTokenPrice).toFixed(2)} `}{stakingToken.symbol}
          </Text>
        </Flex>
      </Flex>
      <BalanceInput
        value={Number(stakeAmount).toFixed(2)}
        onUserInput={handleStakeInputChange}
        currencyValue={stakingTokenPrice !== 0 && `~${formattedUsdValueStaked || 0} USD`}
        isWarning={hasReachedStakeLimit || userNotEnoughToken}
        decimals={stakingToken.decimals}
      />
      {hasReachedStakeLimit && (
        <Text color="failure" fontSize="12px" style={{ textAlign: 'right' }} mt="4px">
          {t('Maximum total stake: %amount% %token%', {
            amount: getFullDisplayBalance(new BigNumber(stakingLimit), stakingToken.decimals, 0),
            token: stakingToken.symbol,
          })}
        </Text>
      )}
      {userNotEnoughToken && (
        <Text color="failure" fontSize="12px" style={{ textAlign: 'right' }} mt="4px">
          {t('Insufficient %symbol% balance', {
            symbol: stakingToken.symbol,
          })}
        </Text>
      )}
      <Text ml="auto" color="textSubtle" fontSize="12px" mb="8px">
        {t('BNB Balance: %balance%', {
          balance: Number(getFullDisplayBalance(getCalculatedStakingLimit(), stakingToken.decimals, 4)).toFixed(3),
        })}
      </Text>
      <Slider
        min={0}
        max={20}
        value={percent}
        onValueChanged={handleChangePercent}
        name="stake"
        valueLabel={`${percent} NFT`}
        step={1}
      />
      <Flex alignItems="center" justifyContent="space-between" mt="8px">
        <PercentageButton onClick={() => handleChangeHand(1)}>1 NFT</PercentageButton>
        <PercentageButton onClick={() => handleChangeHand(2)}>2 NFT</PercentageButton>
        <PercentageButton onClick={() => handleChangeHand(5)}>5 NFT</PercentageButton>
        <PercentageButton onClick={() => handleChangeHand(10)}>10 NFT</PercentageButton>
        <PercentageButton onClick={() => handleChangeHand(15)}>15 NFT</PercentageButton>
        <PercentageButton onClick={() => handleChangeHand(20)}>20 NFT</PercentageButton>
      </Flex>
      {isRemovingStake && pool.enableEmergencyWithdraw && (
        <Flex maxWidth="346px" mt="24px">
          <Text textAlign="center">
            {t(
              'This pool was misconfigured. Please unstake your tokens from it, emergencyWithdraw method will be used. Your tokens will be returned to your wallet, however rewards will not be harvested.',
            )}
          </Text>
        </Flex>
      )}
      <Button
        isLoading={pendingTx}
        endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
        onClick={handleConfirmClick}
        disabled={!stakeAmount || parseFloat(stakeAmount) === 0 || hasReachedStakeLimit || userNotEnoughToken || buyAmount === 0}
        mt="24px"
      >
        {pendingTx ? t('Buying') : `${t('Buy')} ${buyAmount && buyAmount} HODL Hand ${buyAmount > 1 ? 'NFTs' : 'NFT'}`}
      </Button>
    </Modal>
  )
}

export default StakeModal
