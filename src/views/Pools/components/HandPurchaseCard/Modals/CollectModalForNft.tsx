import { useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import {
  Modal,
  Text,
  Button,
  Heading,
  Flex,
  AutoRenewIcon,
  useTooltip,
} from '@metabank/uikit'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import useToast from 'hooks/useToast'
import { ToastDescriptionWithTx } from 'components/Toast'
import { Token } from '@metabank/sdk'
import useCatchTxError from 'hooks/useCatchTxError'
import { updateUserBalance, updateUserPendingReward, updateUserStakedBalance } from 'state/pools'
import { useAppDispatch } from 'state'
import useHarvestPool from '../../../hooks/useHarvestPool'
import useTopupPool from '../../../hooks/useTopupPool'
import useStakePool from '../../../hooks/useStakePool'

interface CollectModalProps {
  formattedBalance: string
  fullBalance: string
  earningToken: Token
  earningsDollarValue: number
  sousId: number
  isBnbPool: boolean
  isCompoundPool?: boolean
  isFinished?: boolean
  onDismiss?: () => void
}

const StyledModal = styled(Modal)`
  border-radius: 0;
  &>div {
    border-radius: 0 !important;
    border-bottom: none;    
  }
  &>div:first-child {
    padding: 0;
    & button {
      width: 24px;
      height: 24px;
    }
  }
`

const CollectModal: React.FC<CollectModalProps> = ({
  formattedBalance,
  fullBalance,
  earningToken,
  earningsDollarValue,
  sousId,
  isBnbPool,
  isCompoundPool = false,
  isFinished,
  onDismiss,
}) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { toastSuccess } = useToast()
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()

  const { onReward } = useHarvestPool(sousId, isBnbPool)
  const { onTopup } = useTopupPool(sousId, isBnbPool)
  const { onStake } = useStakePool(sousId, isBnbPool)
  const [shouldCompound, setShouldCompound] = useState(isCompoundPool)

  const handleHarvestConfirm = async () => {
    const receipt = await fetchWithCatchTxError(() => {
      if (shouldCompound) {
        return onStake(fullBalance, earningToken.decimals)
      }
      return onReward()
    })
    if (receipt?.status) {
      if (shouldCompound) {
        toastSuccess(
          `${t('Compounded')}!`,
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {t('Your %symbol% earnings have been re-invested into the pool!', { symbol: earningToken.symbol })}
          </ToastDescriptionWithTx>,
        )
      } else {
        toastSuccess(
          `${t('Collected')}!`,
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {t('Your %symbol% earnings have been sent to your wallet!', { symbol: earningToken.symbol })}
          </ToastDescriptionWithTx>,
        )
      }
      dispatch(updateUserStakedBalance(sousId, account))
      dispatch(updateUserPendingReward(sousId, account))
      dispatch(updateUserBalance(sousId, account))
      onDismiss?.()
    }
  }

  const handleTopupConfirm = async () => {
    const receipt = await fetchWithCatchTxError(() => {
      if (shouldCompound) {
        return onStake(fullBalance, earningToken.decimals)
      }
      return onTopup(fullBalance)
    })
    if (receipt?.status) {
      if (shouldCompound) {
        toastSuccess(
          `${t('Compounded')}!`,
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {t('Your %symbol% earnings have been re-invested into the pool!', { symbol: earningToken.symbol })}
          </ToastDescriptionWithTx>,
        )
      } else {
        toastSuccess(
          `${t('Collected')}!`,
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {t('Your %symbol% earnings have been sent to your wallet!', { symbol: earningToken.symbol })}
          </ToastDescriptionWithTx>,
        )
      }
      dispatch(updateUserStakedBalance(sousId, account))
      dispatch(updateUserPendingReward(sousId, account))
      dispatch(updateUserBalance(sousId, account))
      onDismiss?.()
    }
  }

  return (
    <StyledModal
      title=""
      onDismiss={onDismiss}
      background={theme.colors.background}
    >
      <Flex justifyContent="center" alignItems="center" mb="24px" mt="-24px">
        <Flex flexDirection="column" alignItems="center">
          <Text fontSize='16px' mb="12px">{`${t('CONGRATULATIONS!')}`}</Text>
          <Heading textAlign="center" fontSize='24px !important' style={{ letterSpacing: "2px", fontWeight: "700" }}>
            {`${t('YOU\'VE UNLOCKED')}`}
          </Heading>
          <Heading textAlign="center" fontSize='24px !important' style={{ letterSpacing: "2px", fontWeight: "700" }}>
            {`${t('YOUR HODL HAND!')}`}
          </Heading>
        </Flex>
      </Flex>
      {
        isFinished ? (
          <Button
            mt="8px"
            onClick={handleTopupConfirm}
            isLoading={pendingTx}
            endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
          >
            {pendingTx ? t('COLLECTING') : `${t('TOP UP & COLLECT')} ${Math.floor(Number(formattedBalance) + 1)} ${earningToken.symbol}`}
          </Button>
        ) : (
          <Button
            mt="8px"
            onClick={handleHarvestConfirm}
            isLoading={pendingTx}
            endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
            disabled={Math.floor(Number(formattedBalance)) === 0}
          >
            {pendingTx ? t('COLLECTING') : `${t('COLLECT')} ${Math.floor(Number(formattedBalance))} ${earningToken.symbol}`}
          </Button>
        )
      }
      <Button
        mt="8px"
        onClick={handleTopupConfirm}
        isLoading={pendingTx}
        endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
      >
        {pendingTx ? t('COLLECTING') : `${t('TOP UP & COLLECT')} ${Math.floor(Number(formattedBalance) + 1)} ${earningToken.symbol}`}
      </Button>
      <Button
        mt="8px"
        onClick={handleHarvestConfirm}
        isLoading={pendingTx}
        endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
        disabled={Math.floor(Number(formattedBalance)) === 0}
      >
        {pendingTx ? t('COLLECTING') : `${t('COLLECT')} ${Math.floor(Number(formattedBalance))} ${earningToken.symbol}`}
      </Button>
    </StyledModal>
  )
}

export default CollectModal
