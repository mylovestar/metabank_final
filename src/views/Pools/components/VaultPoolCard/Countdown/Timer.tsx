import styled from 'styled-components'
import { Flex, Heading } from '@metabank/uikit'
import { useTranslation } from 'contexts/Localization'

export interface TimerProps {
  minutes?: number
  hours?: number
  days?: number
}

const StyledTimerFlex = styled(Flex) <{ showTooltip?: boolean }>`
  ${({ theme, showTooltip }) => (showTooltip ? ` border-bottom: 1px dashed ${theme.colors.textSubtle};` : ``)}
  div:last-of-type {
    margin-right: 0;
  }
`

const StyledTimerText = styled(Heading)`
  background: white;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const Wrapper: React.FC<TimerProps> = ({ minutes, hours, days }) => {
  const { t } = useTranslation()

  return (
    <StyledTimerFlex alignItems="flex-end">
      {Boolean(days) && (
        <>
          <StyledTimerText scale="md">
            {days}
          </StyledTimerText>
          <StyledTimerText mr="6px">{t('d')}</StyledTimerText>
        </>
      )}
      {Boolean(hours) && (
        <>
          <StyledTimerText scale="md">
            {hours}
          </StyledTimerText>
          <StyledTimerText mr="6px">{t('h')}</StyledTimerText>
        </>
      )}
      {Boolean(minutes) && (
        <>
          <StyledTimerText scale="md">
            {minutes}
          </StyledTimerText>
          <StyledTimerText>{t('m')}</StyledTimerText>
        </>
      )}
    </StyledTimerFlex>
  )
}

export default Wrapper
