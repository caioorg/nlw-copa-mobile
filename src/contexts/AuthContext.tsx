import { createContext, ReactNode, useCallback, useState, useEffect } from 'react'
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'

WebBrowser.maybeCompleteAuthSession();

interface UserProps {
  name: string,
  avatarUrl: string
}

export interface AuthContextDataProps {
  user: UserProps,
  signIn: () => Promise<void>
  isUserLoading: boolean
}

export const AuthContext = createContext({} as AuthContextDataProps)

export const AuthContextProvider = ({ children }: { children: ReactNode } ) => {
  const [isUserLoading, setIsUserLoading] = useState<boolean>(false)
  const [user, setUser] = useState<UserProps>({} as UserProps)

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '597012181178-oj72q4b59ph1g1kca1v6rr2rfsgk48bc.apps.googleusercontent.com',
    redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
    scopes: ['profile', 'email']
  })


  async function signInWithGoogle(access_token: string) {
    console.log('TOKEN ====>', access_token)
  }

  useEffect(() => {
    if(response?.type === 'success' && response.authentication.accessToken) {
      signInWithGoogle(response.authentication.accessToken)
    }
  }, [response])

  const signIn = useCallback(async () => {
    try {
      setIsUserLoading(true)
      await promptAsync()

    } catch (error) {
      console.log(error)
      throw error;
    } finally {
      setIsUserLoading(false)
    }

  }, [])

  return (
    <AuthContext.Provider value={{ signIn, user, isUserLoading }}>
      { children }
    </AuthContext.Provider>
  )
}