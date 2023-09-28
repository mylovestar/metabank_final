import styled from 'styled-components'
import { FC } from 'react'
import AboutUs from './AboutUs'

const StyledNotFound = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 130px);
  justify-content: center;
`


export const AboutPageLayout: FC = ({ children }) => {
  return <AboutUs>{children}</AboutUs>
}

export default AboutPageLayout
