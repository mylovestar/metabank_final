import styled from 'styled-components'
import { Card } from '@metabank/uikit'

export const StyledCard = styled(Card)<{ isFinished?: boolean }>`
  background: linear-gradient(rgb(83, 222, 233), rgb(122, 146, 220)) 0% 0% / 400% 400%;
  max-width: 374px;
  margin: 0 8px 24px;
  width: 100%;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  align-self: baseline;
  position: relative;
  color: ${({ isFinished, theme }) => theme.colors[isFinished ? 'textDisabled' : 'secondary']};

  ${({ theme }) => theme.mediaQueries.sm} {
    margin: 0 12px 46px;
  }
`

export default StyledCard
