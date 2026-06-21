import { PublicClientApplication } from '@azure/msal-browser'

const redirectUri = `${window.location.origin}${import.meta.env.BASE_URL}`

export const msalConfig = {
  auth: {
    clientId: '44527747-3e46-48db-a243-7ace89fa7683',
    authority: 'https://login.microsoftonline.com/consumers',
    redirectUri,
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false,
  },
}

export const loginScopes = ['Files.ReadWrite', 'User.Read']

let _instance = null

export function getMsalInstance() {
  if (!_instance) {
    _instance = new PublicClientApplication(msalConfig)
  }
  return _instance
}
