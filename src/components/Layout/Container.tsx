import { Box, BoxProps } from '@metabankswap/uikit'

const Container: React.FC<BoxProps> = ({ children, ...props }) => (
  <Box px={['16px', '24px']} mx="auto" maxWidth="1280px" {...props}>
    {children}
  </Box>
)

export default Container
