import { Link } from '@metabank/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { DEFAULT_META, getCustomMeta } from 'config/constants/meta'
import { useCakeBusdPrice } from 'hooks/useBUSDPrice'
import Container from './Container'

const StyledPage = styled(Container)`
  min-height: calc(100vh - 121px);
  padding-top: 16px;
  padding-bottom: 16px;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-top: 24px;
    padding-bottom: 24px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-top: 32px;
    padding-bottom: 32px;
  }
`

const StyledImg = styled.img`
  width: 100%;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 60%;
  }
`

export const PageMeta: React.FC<{ symbol?: string }> = ({ symbol }) => {
  const { t } = useTranslation()
  const { pathname } = useRouter()
  const cakePriceUsd = useCakeBusdPrice()
  const cakePriceUsdDisplay = cakePriceUsd ? `$${cakePriceUsd.toFixed(3)}` : '...'

  const pageMeta = getCustomMeta(pathname, t) || {}
  const { title, description, image } = { ...DEFAULT_META, ...pageMeta }
  let pageTitle = cakePriceUsdDisplay ? [title, cakePriceUsdDisplay].join(' - ') : title
  if (symbol) {
    pageTitle = [symbol, title].join(' - ')
  }

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
    </Head>
  )
}

interface PageProps extends React.HTMLAttributes<HTMLDivElement> {
  symbol?: string
}

const Page: React.FC<PageProps> = ({ children, symbol, ...props }) => {
  return (
    <>
      <PageMeta symbol={symbol} />
      <StyledPage {...props}>{children}

      </StyledPage>
      <div style={{ textAlign: 'center' }}>
        <Link
          small
          external
          ellipsis
          href="https://bet.hodlx.exchange/rangefinder/hodlx"
          style={{ justifyContent: "center", width: "auto" }}
        >
          <StyledImg src="/images/hodl_bet.gif" style={{ marginBottom: "50px", marginTop: "50px" }} alt='' />
        </Link>
      </div>
    </>
  )
}

export default Page