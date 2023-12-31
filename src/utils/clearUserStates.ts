import * as Sentry from '@sentry/react'
import { Dispatch } from '@reduxjs/toolkit'
import { connectorLocalStorageKey } from '@metabankswap/uikit'
import { connectorsByName } from './web3React'
import { clearAllTransactions } from '../state/transactions/actions'

export const clearUserStates = (dispatch: Dispatch<any>, chainId: number) => {
  Sentry.configureScope((scope) => scope.setUser(null))
  // This localStorage key is set by @web3-react/walletconnect-connector
  if (window.localStorage.getItem('walletconnect')) {
    connectorsByName.walletconnect.close()
    connectorsByName.walletconnect.walletConnectProvider = null
  }
  window.localStorage.removeItem(connectorLocalStorageKey)
  if (chainId) {
    dispatch(clearAllTransactions({ chainId }))
  }
}
