import styled from 'styled-components'
import { ButtonMenu, ButtonMenuItem, NotificationDot } from '@metabank/uikit'
import { useTranslation } from 'contexts/Localization'
import { useRouter } from 'next/router'
import { NextLinkFromReactRouter } from 'components/NextLink'

interface FarmTabButtonsProps {
  hasStakeInFinishedFarms: boolean
}

const FarmTabButtons: React.FC<FarmTabButtonsProps> = ({ hasStakeInFinishedFarms }) => {
  const router = useRouter()
  const { t } = useTranslation()
  let path;
  let activeIndex
  switch (router.pathname) {
    case '/pools':
      activeIndex = 0
      path = "/pools"
      break
    case '/pools/history':
      activeIndex = 1
      path = "/pools"
      break
    case '/farms':
      activeIndex = 0
      path = "/farms"
      break
    case '/farms/history':
      activeIndex = 1
      path = "/farms"
      break
    case '/farms/archived':
      activeIndex = 2
      path = "/farms"
      break
    default:
      activeIndex = 0
      break
  }

  return (
    <Wrapper>
      <ButtonMenu activeIndex={activeIndex} scale="sm" variant="subtle">
        <ButtonMenuItem as={NextLinkFromReactRouter} to={`${path}`}>
          {t('Live')}
        </ButtonMenuItem>
        <NotificationDot show={hasStakeInFinishedFarms}>
          <ButtonMenuItem as={NextLinkFromReactRouter} to={`${path}/history`} id="finished-farms-button">
            {t('Finished')}
          </ButtonMenuItem>
        </NotificationDot>
      </ButtonMenu>
    </Wrapper>
  )
}

export default FarmTabButtons

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  a {
    padding-left: 12px;
    padding-right: 12px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: 16px;
  }
`
