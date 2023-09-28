import { Flex } from '@metabank/uikit'
import { PageMeta } from 'components/Layout/Page'
import styled from 'styled-components'
import Footer from './components/Footer'
import Hero from './components/Hero'
import { Proposals } from './components/Proposals'

const Chrome = styled.div`
  flex: none;
`

const Content = styled.div`
  flex: 1;
  height: 100%;
`

const Voting = () => {
  return (
    <>
      <PageMeta />
      <Flex flexDirection="column" minHeight="100vh">
        <Chrome>
          <Hero />
        </Chrome>
        <Content>
          <Proposals />
        </Content>
        <Chrome>
          <Footer />
        </Chrome>
      </Flex>
    </>
  )
}

export default Voting
