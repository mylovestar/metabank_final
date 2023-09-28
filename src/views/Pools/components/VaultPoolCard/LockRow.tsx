import styled from 'styled-components'
import { Flex, TooltipText, IconButton, useModal, CalculateIcon, Skeleton, useTooltip } from '@metabank/uikit'
import { useTranslation } from 'contexts/Localization'
import Balance from 'components/Balance'
import RoiCalculatorModal from 'components/RoiCalculatorModal'
import { DeserializedPool } from 'state/types'
import BigNumber from 'bignumber.js'
import { BIG_ZERO } from 'utils/bigNumber'
import { vaultPoolConfig } from 'config/constants/pools'
import { useLockingEnd, useLockPeriod } from 'hooks/useACPContract'
import Countdown from './Countdown'

interface AprRowProps {
  pool: DeserializedPool
}

const AprRow: React.FC<AprRowProps> = ({ pool }) => {
  const { t } = useTranslation()
  const {
    isFinished,
    apr,
    userData
  } = pool

  const lockingData = useLockingEnd(pool.contractAddress[56]);
  const endTime = lockingData.lockingEnd;
  const lockedPeriod = useLockPeriod(pool.contractAddress[56]).lockPeriod;

  const tooltipContent =
    t('This pool currently has no end date, however when staking $HODL, the tokens are locked for the first 90 days. Note - This lock period will be reset to a new period of 90 days if you add more $HODL at any time.')

  const { targetRef, tooltip, tooltipVisible } = useTooltip(tooltipContent, { placement: 'bottom-start' })


  return (
    <Flex alignItems="center" justifyContent="space-between" >
      {tooltipVisible && tooltip}
      <TooltipText ref={targetRef}>{`${userData.stakedBalance.gt(0) ? t('LOCKED UNTIL') : t('LOCK PERIOD')}:`}</TooltipText>
      {!isFinished ? (
        <Countdown nextEventTime={endTime} isLocked={userData.stakedBalance.gt(0)} lockPeriod={lockedPeriod} />
      ) : (
        <Skeleton width="82px" height="32px" />
      )}
    </Flex>
  )
}

export default AprRow
