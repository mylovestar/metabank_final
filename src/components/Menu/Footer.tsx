import styled from 'styled-components'
import { ButtonMenu, ButtonMenuItem, LinkExternal, Flex, Svg, Image, Button } from '@metabank/uikit'
import { useTranslation } from 'contexts/Localization'

const Wrapper = styled.div<{ $isSide: boolean }>`
  background: #000316;
  width: 100%;
  height: ${({ $isSide }) => ($isSide ? '100%' : 'auto')};
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
  align-items: center;
  padding-right: ${({ $isSide }) => ($isSide ? '32px' : '0px')};
  ${({ theme }) => theme.mediaQueries.md} {
    justify-content: center;
    flex-direction: ${({ $isSide }) => ($isSide ? 'column' : 'row')};
  }
  @media (max-width: 575px) {
    padding-bottom: 40px;
  }
`

const BubbleWrapper = styled(Flex)`
  svg {
    fill: ${({ theme }) => theme.colors.textSubtle};
    transition: background-color 0.2s, opacity 0.2s;
  }
  &:hover {
    svg {
      opacity: 0.65;
    }
  }
  &:active {
    svg {
      opacity: 0.85;
    }
  }
`

type FooterVariant = 'default' | 'side'

const Footer: React.FC<{ variant?: FooterVariant }> = ({ variant = 'default' }) => {
  const { t } = useTranslation()
  const isSide = variant === 'side'
  return (
    <Wrapper $isSide={isSide}>
      <Flex>
        <a href="/#"><img src="/images/twitter.svg" alt="" aria-label="twitter" style={{margin: "20px"}} /></a>
        <a href="/#"><img src="/images/telegram.svg" alt="" aria-label="telegram" style={{margin: "20px"}} /></a>
        <a href="https://wa.me/+60169736682"><img src="/images/whatsapp.png" alt="" aria-label="whatsapp"  style={{margin: "20px", width: "18px"}} /></a>
        <a href="mailto:metabank.exchange@gmail.com"><img src="/images/mail.png" alt="" aria-label="whatsapp"  style={{margin: "20px", width: "18px"}} /></a>
      </Flex>
    </Wrapper>
  )
}

export default Footer
