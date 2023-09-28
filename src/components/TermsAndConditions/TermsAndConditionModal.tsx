/* eslint-disable jsx-a11y/label-has-associated-control */
import { Button, Modal, ModalBody } from '@metabank/uikit'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import { useUserAgreedTermsAndConditions } from 'state/user/hooks'
import styled from 'styled-components'

const StyledModal = styled(Modal)`
  width: 500px;
  max-width: 95%;
  min-height: 300px;
  color: #f4eeff;
  div {
    word-break: break-word;
    line-height: 1.2em;
  }
  a {
    color: #0098ff;
  }
  .checkList {
    list-style-type: disc;
    list-style-position: outside;
    margin-left: 1.2em;
  }
  .checkListItem {
    margin-bottom: 1em;
    padding-right: 0.3em;
    word-break: break-word;
    line-height: 1.2em;
  }
`
interface TermsAndConditionModalProps {
  onDismiss?: () => void
}

export const TermsAndConditionModal: React.FC<TermsAndConditionModalProps> = ({ onDismiss }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  const [userAgreedTermsAndConditions, setUserAgreedTermsAndConditions] = useUserAgreedTermsAndConditions()

  return (
    <StyledModal
      title={t('Terms of Use Agreement')}
      headerBackground={theme.colors.gradients.cardHeader}
      onDismiss={onDismiss}
    >
      <ModalBody>
        <div style={{ marginBottom: '1em', paddingRight: '0.3em' }}>
          By using this Site, I agree to the <a href="https://hodltoken.net/terms">Terms of Use</a> &{' '}
          <a href="https://hodltoken.net/privacy">Privacy Policy</a>.
        </div>
        <ul className="checkList">
          <li className="checkListItem">
            I am not a resident, citizen, or entity based in any{' '}
            <a href="https://hodltoken.net/terms">Prohibited Localities</a>.
          </li>
          <li className="checkListItem">
            I will not access this platform while located within any Prohibited Localities.
          </li>
          <li className="checkListItem">
            I am not using or will use a VPN to mask my location from within any Prohibited Localities.
          </li>
          <li className="checkListItem">
            I have legal permission to access and use this platform based on the laws of my jurisdiction.
          </li>
        </ul>
      </ModalBody>

      <Button
        variant="primary"
        onClick={() => {
          setUserAgreedTermsAndConditions(true)
          onDismiss?.()
        }}
        width="100%"
        style={{ marginTop: '1em' }}
      >
        {t(`Agree`)}
      </Button>
    </StyledModal>
  )
}
