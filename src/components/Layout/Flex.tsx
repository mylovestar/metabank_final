import { Flex, FlexProps } from '@metabank/uikit'
import styled from 'styled-components'

const FlexLayout = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  & > * {
    min-width: 280px;
    max-width: auto;
    width: 100%;
    margin: 0 8px;
    margin-bottom: 32px;
    ${({ theme }) => theme.mediaQueries.sm} {
      max-width: 31.5%;
    }
  }
`

export interface FlexGapProps extends FlexProps {
  gap?: string
  rowGap?: string
  columnGap?: string
}

export const FlexGap = styled(Flex)<FlexGapProps>`
  gap: ${({ gap }) => gap};
  row-gap: ${({ rowGap }) => rowGap};
  column-gap: ${({ columnGap }) => columnGap};
`

export default FlexLayout
