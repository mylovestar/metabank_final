import { Button, AutoRenewIcon, Skeleton } from '@metabank/uikit'
import { useTranslation } from 'contexts/Localization'
import { useERC20, useErc721CollectionContract } from 'hooks/useContract'
import { DeserializedPool } from 'state/types'
import { useApproveVaultPool, useApprovePoolNft } from '../../../hooks/useApprove'

interface ApprovalActionProps {
  pool: DeserializedPool
  isLoading?: boolean
  allowance: boolean
  allowanceHand: boolean
}

const ApprovalAction: React.FC<ApprovalActionProps> = ({ pool, isLoading = false, allowance, allowanceHand }) => {
  const { sousId, stakingToken, earningToken } = pool
  const { t } = useTranslation()
  const stakingTokenContract = useERC20(stakingToken.address || '')
  const handContract = useErc721CollectionContract("0x7E82123bCb6465133D6E9E1Ad94d0115DE041b3D" || '')
  const { handleApprove, pendingTx } = useApproveVaultPool(stakingTokenContract, handContract, sousId, earningToken.symbol)
  const { handleApprove: handleApprove1, pendingTx: pendingTx1 } = useApprovePoolNft(handContract, pool.sousId, "NFT")

  return (
    <>
      {isLoading ? (
        <Skeleton width="100%" height="52px" />
      ) : (
        <>
          {
            allowance && <Button
              isLoading={pendingTx}
              endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
              disabled={pendingTx}
              onClick={handleApprove}
              width="100%"
            >
              {t('Enable %symbol%', { symbol: pool.stakingToken.symbol })}
            </Button>
          }
          {
            allowanceHand && <Button
              isLoading={pendingTx1}
              endIcon={pendingTx1 ? <AutoRenewIcon spin color="currentColor" /> : null}
              disabled={pendingTx1}
              onClick={handleApprove1}
              width="100%"
              style={{ marginTop: '0.5rem' }}
            >
              {t('Enable NFTs')}
            </Button>
          }
        </>
      )}
    </>
  )
}

export default ApprovalAction
