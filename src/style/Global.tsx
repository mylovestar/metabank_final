import { createGlobalStyle } from 'styled-components'
// eslint-disable-next-line import/no-unresolved
import { PancakeTheme } from '@metabank/uikit/dist/theme'

declare module 'styled-components' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends PancakeTheme {}
}

const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'Jost', sans-serif;
  }
  body {
    // background-color: ${({ theme }) => theme.colors.background};
    background: linear-gradient(250deg, rgb(0, 3, 22) 33.3%, rgb(4, 15, 49));

    img {
      height: auto;
      max-width: 100%;
    }
  }
`

export default GlobalStyle
