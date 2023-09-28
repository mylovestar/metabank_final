import styled from 'styled-components'
import { FC } from 'react'
import { Button, Heading, Text, LogoIcon } from '@metabankswap/uikit'
import Page from 'components/Layout/Page'
import { useTranslation } from 'contexts/Localization'
import Link from 'next/link'

const StyledNotFound = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 130px);
  justify-content: center;
`

const AboutUs = ({ children }) => {
  const { t } = useTranslation()

  return (
    <Page>
      <StyledNotFound>
        {/* <LogoIcon width="64px" mb="8px" /> */}
        <Heading scale="lg">Metabank Coin (MBC) Team</Heading>
        <Heading scale="lg">CONTACT</Heading>
        <Heading scale="lg">Whatsapp: +60169736682</Heading>
        <Heading scale="lg">Email: metabank.exchange@gmail.com</Heading>
        {/* <Text mb="16px">{t('This page will coming soon.')}</Text>
        <Link href="/" passHref>
          <Button as="a" scale="sm">
            {t('Back Home')}
          </Button>
        </Link> */}
      </StyledNotFound>
    </Page>
  )
}


export default AboutUs
