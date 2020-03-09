import { useCallback, useState, useEffect } from 'react'

let logoutTimer

const useAuth = () => {
  const [token, setToken] = useState(false)
  const [userId, setUserId] = useState(null)
  const [tokenExpirationDate, setTokenExpirationDate] = useState()

  const login = useCallback((uid, token, expirationDate) => {
    setToken(token)
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 360)
    setTokenExpirationDate(tokenExpirationDate)
    localStorage.setItem(
      'userData',
      JSON.stringify({
        userId: uid,
        token,
        expiration: tokenExpirationDate.toISOString(),
      })
    )
    setUserId(uid)
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setTokenExpirationDate(null)
    setUserId(null)
    localStorage.removeItem('userData')
  }, [])

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'))
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.token,
        new Date(storedData.expiration)
      )
    }
  }, [login])

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime()
      logoutTimer = setTimeout(logout, remainingTime)
    } else {
      clearTimeout(logoutTimer)
    }
  }, [token, logout, tokenExpirationDate])

  return { userId, token, login, logout }
}

export default useAuth
