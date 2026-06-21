import { useState, useEffect, useCallback } from 'react'
import { getMsalInstance, loginScopes } from '../config/msal'

export function useAuth() {
  const [account, setAccount] = useState(null)
  const [authReady, setAuthReady] = useState(false)

  useEffect(() => {
    const msal = getMsalInstance()
    // main.jsx で initialize() 済みなので handleRedirectPromise のみ
    msal.handleRedirectPromise()
      .then(response => {
        if (response?.account) {
          setAccount(response.account)
        } else {
          const accounts = msal.getAllAccounts()
          if (accounts.length > 0) setAccount(accounts[0])
        }
      })
      .catch(e => console.warn('MSAL:', e))
      .finally(() => setAuthReady(true))
  }, [])

  const login = useCallback(async () => {
    const msal = getMsalInstance()
    const popupRedirectUri = `${window.location.origin}${import.meta.env.BASE_URL}auth.html`
    const result = await msal.loginPopup({ scopes: loginScopes, redirectUri: popupRedirectUri })
    setAccount(result.account)
    return result.account
  }, [])

  const logout = useCallback(() => {
    getMsalInstance().logoutPopup()
    setAccount(null)
  }, [])

  const getToken = useCallback(async (overrideAccount) => {
    const target = overrideAccount ?? account
    if (!target) throw new Error('ログインが必要です')
    const result = await getMsalInstance().acquireTokenSilent({
      scopes: loginScopes,
      account: target,
    })
    return result.accessToken
  }, [account])

  return { account, authReady, login, logout, getToken }
}
