import Cookies from 'js-cookie'
import { ReactNode, createContext, useContext, useMemo, useState } from 'react'

interface AuthProviderProps {
  children: ReactNode
}

// 定义 AuthContext 的类型
interface AuthContextType {
  token: string | null
  setToken: (token: string | null) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AuthProvider = ({ children }: AuthProviderProps) => {
  // State to hold the authentication token
  const [token, setToken_] = useState<string | null>(Cookies.get('token') || null)

  // Function to set the authentication token
  const setToken = (newToken: string | null) => {
    setToken_(newToken)
  }

  // Memoized value of the authentication context
  const contextValue = useMemo(
    () => ({
      token,
      setToken,
    }),
    [token],
  )

  // Provide the authentication context to the children components
  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

// 使用 useAuth hook 来访问 AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthProvider
