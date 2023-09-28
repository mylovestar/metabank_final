import { Flex, Skeleton, Text } from '@metabank/uikit'
import { FC } from 'react'
import styled from 'styled-components'
import { formatAmount, formatAmountNotation } from 'utils/formatInfoNumbers'
import { FlexGap, FlexGapProps } from './Layout/Flex'

const formatOptions = {
  notation: 'compact' as formatAmountNotation,
  displayThreshold: 0.001,
  tokenPrecision: false,
}

interface TokenDisplayProps extends FlexGapProps {
  value?: number | string
  inputSymbol?: string
  outputSymbol?: string
  format?: boolean
}

const TextLabel = styled(Text)`
  font-size: 20px;
  line-height: 1.1;

  ${({ theme }) => theme.mediaQueries.lg} {
    font-size: 40px;
  }
`

const PairPriceDisplay: FC<TokenDisplayProps> = ({
  value,
  inputSymbol,
  outputSymbol,
  children,
  format = true,
  ...props
}) => {
  return value ? (
    <FlexGap alignItems="baseline" {...props}>
      <Flex alignItems="inherit">
        <TextLabel mr="8px" bold>
          {format ? formatAmount(typeof value === 'string' ? parseFloat(value) : value, formatOptions) : value}
        </TextLabel>
        {inputSymbol && outputSymbol && (
          <Text color="textSubtle" fontSize="16px" bold lineHeight={1.1}>
            {`${inputSymbol}/${outputSymbol}`}
          </Text>
        )}
      </Flex>
      {children}
    </FlexGap>
  ) : (
    <Skeleton height="24px" width="128px" {...props} />
  )
}

export default PairPriceDisplay
