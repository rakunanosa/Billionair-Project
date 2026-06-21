import { useState, useEffect, useCallback } from 'react'
import { getMsalInstance, loginScopes } from '../config/msal'

export function useAuth() {
  const [account, setAccount] = useState(null)
  const [authReady, setAuthReady] = useState(false)

  useEffect(() => {
    const msal = getMsalInstance()
    msal.initialize()
      .then(() => msal.handleRedirectPromise())
      .then(response => {
        if (response?.account) {
          setAccount(response.account)
        } else {
          const accounts = msal.getAllAccounts()
          if (accounts.length > 0) setAccount(accounts[0])
        }
      })
      .catch(e => console.warn('MSAL init:', e))
      .finally(() => setAuthReady(true))
  }, [])

  const login = useCallback(async () => {
    const msal = getMsalInstance()
    const result = await msal.loginPopup({ scopes: loginScopes })
    setAccount(result.account)
  }, [])

  const logout = useCallback(() => {
    getMsalInstance().logoutPopup()
    setAccount(null)
  }, [])

  const getToken = useCallback(async () => {
    if (!account) throw new Error('ログインが必要です')
    const result = await getMsalInstance().acquireTokenSilent({
      scopes: loginScopes,
      account,
    })
    return result.accessToken
  }, [account])

  return { account, authReady, login, logout, getToken }
}
