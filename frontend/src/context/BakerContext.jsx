import { createContext, useContext, useState } from 'react'

const BAKER_PIN = '1234'

const BakerContext = createContext(null)

export function BakerProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(
    () => sessionStorage.getItem('baker_auth') === 'true'
  )

  const login = (pin) => {
    if (pin === BAKER_PIN) {
      sessionStorage.setItem('baker_auth', 'true')
      setAuthenticated(true)
      return true
    }
    return false
  }

  const logout = () => {
    sessionStorage.removeItem('baker_auth')
    setAuthenticated(false)
  }

  return (
    <BakerContext.Provider value={{ authenticated, login, logout }}>
      {children}
    </BakerContext.Provider>
  )
}

export function useBaker() {
  return useContext(BakerContext)
}
