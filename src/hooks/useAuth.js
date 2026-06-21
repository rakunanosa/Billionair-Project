import { useState, useEffect, useCallback } from 'react'
import { msalInstance, loginScopes } from '../config/msal'

export function useAuth() {
  const [account, setAccount] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    msalInstance.initialize().then(() => {
      msalInstance.handleRedirectPromise().then(response => {
        if (response?.account) {
          setAccount(response.account)
        } else {
          const accounts = msalInstance.getAllAccounts()
          if (accounts.length > 0) setAccount(accounts[0])
        }
        setReady(true)
      })
    })
  }, [])

  const login = useCallback(async () => {
    const result = await msalInstance.loginPopup({ scopes: loginScopes })
    setAccount(result.account)
  }, [])

  const logout = useCallback(() => {
    msalInstance.logoutPopup()
    setAccount(null)
  }, [])

  const getToken = useCallback(async () => {
    if (!account) throw new Error('ログインが必要です')
    const result = await msalInstance.acquireTokenSilent({
      scopes: loginScopes,
      account,
    })
    return result.accessToken
  }, [account])

  return { account, ready, login, logout, getToken }
}
