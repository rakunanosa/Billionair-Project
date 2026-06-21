import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { getMsalInstance } from './config/msal'
import './index.css'
import App from './App.jsx'

async function init() {
  const msal = getMsalInstance()
  await msal.initialize()

  // ポップアップのリダイレクト先として開かれた場合はアプリを描画しない
  const isPopupRedirect =
    window.opener !== null &&
    (window.location.search.includes('code=') ||
      window.location.search.includes('error=') ||
      window.location.hash.includes('code='))

  if (isPopupRedirect) {
    try { await msal.handleRedirectPromise() } catch {}
    return
  }

  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
}

init()
