import styled from 'styled-components'
import { Flex, Text } from '@metabank/uikit'
import { useTranslation } from 'contexts/Localization'
import { DeserializedPool } from 'state/types'

const ApyLabelContainer = styled(Flex)`
  cursor: pointer;

  &:hover {
    opacity: 0.5;
  }
`

interface AprRowProps {
  pool: DeserializedPool
}

const AprRow: React.FC<AprRowProps> = ({ pool }) => {
  const { t } = useTranslation()

  const {
    stakingToken
  } = pool

  return (
    <>
      <Flex alignItems="center" justifyContent="space-between">
        <Text>{`${t('Price:')}`}</Text>
        <Text>{`${Number(pool.earningTokenPrice).toFixed(3).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1')} `}{stakingToken.symbol}</Text>
      </Flex>
    </>
  )
}

export default AprRow
