import { createContext, ReactNode, useCallback, useState, useEffect } from 'react'
import { useAuthRequest } from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'
import { api } from '../services/api';

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

  const [_, response, promptAsync] =  useAuthRequest({
    expoClientId: process.env.CLIENT_ID_AUTH_GOOGLE,
    redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
    scopes: ['profile', 'email']
  })

  async function signInWithGoogle(accessToken: string) {
    try {
      setIsUserLoading(true)

      const { data } = await api.post('/users', { accessToken })
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`

      const userInfo = await api.get('/me')

      setUser(userInfo.data.user)

    } catch (error) {
      console.log(error)
      throw error;
    } finally {
      setIsUserLoading(false)
    }
  }

  useEffect(() => {
    if(response?.type === 'success' && response.authentication?.accessToken) {
      signInWithGoogle(response.authentication.accessToken)
    }
  }, [response])

  async function signIn() {
    try {
      setIsUserLoading(true);
      await promptAsync();
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setIsUserLoading(false);
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, user, isUserLoading }}>
      { children }
    </AuthContext.Provider>
  )
}
