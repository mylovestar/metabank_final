import { Button, AutoRenewIcon, Skeleton } from '@metabank/uikit'
import { useTranslation } from 'contexts/Localization'
import { useERC20, useErc721CollectionContract } from 'hooks/useContract'
import { DeserializedPool } from 'state/types'
import { useApprovePool, useApprovePoolNft } from '../../../hooks/useApprove'

interface ApprovalActionProps {
  pool: DeserializedPool
  isLoading?: boolean
}

const ApprovalAction: React.FC<ApprovalActionProps> = ({ pool, isLoading = false }) => {
  const { sousId, stakingToken, earningToken } = pool
  const { t } = useTranslation()
  const stakingTokenContract = !pool.isNft ? useERC20(stakingToken.address || '') : useErc721CollectionContract(stakingToken.address || '')
  const { handleApprove, pendingTx } = !pool.isNft ? useApprovePool(stakingTokenContract, sousId, earningToken.symbol) : useApprovePoolNft(stakingTokenContract, sousId, earningToken.symbol)

  return (
    <>
      {isLoading ? (
        <Skeleton width="100%" height="52px" />
      ) : (
        <Button
          isLoading={pendingTx}
          endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
          disabled={pendingTx}
          onClick={handleApprove}
          width="100%"
        >
          {t('Enable')}
        </Button>
      )}
    </>
  )
}

export default ApprovalAction
