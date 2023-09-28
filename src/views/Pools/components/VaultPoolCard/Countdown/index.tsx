import { Flex, Heading, Skeleton, Text } from '@metabank/uikit'
import getTimePeriods from 'utils/getTimePeriods'
import Timer from './Timer'

interface CountdownProps {
  nextEventTime: number
  preCountdownText?: string
  postCountdownText?: string
  isLocked: boolean
  lockPeriod: number
}

const Countdown: React.FC<CountdownProps> = ({ nextEventTime, preCountdownText, postCountdownText, isLocked, lockPeriod }) => {
  const secondsRemaining = nextEventTime
  const endDay = new Date(secondsRemaining).toDateString()
  const endDayComma = endDay.substr(0, 3).concat(',').concat(endDay.substr(3, 7)).concat(',').concat(endDay.substr(10))
  const lockPeriodStr = (lockPeriod / (60*60*24)).toFixed(0) + ' days'
  return (
    <>
      {secondsRemaining >= 0 ? (
        <Flex display="inline-flex" justifyContent="flex-end" alignItems="flex-end">
          {preCountdownText && (
            <Heading mr="12px" color="#ffff">
              {preCountdownText}
            </Heading>
          )}
          <Text bold>{isLocked ? endDayComma : lockPeriodStr}</Text>
          {postCountdownText && <Heading color="#ffff">{postCountdownText}</Heading>}
        </Flex>
      ) : (
        <Skeleton height="41px" width="250px" />
      )}
    </>
  )
}

export default Countdown
