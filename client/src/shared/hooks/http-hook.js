import { useState, useCallback, useRef, useEffect } from 'react'

const useHttp = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState()

  const activeHttpRequests = useRef([])

  const sendRequest = useCallback(
    async (url, method = 'GET', body = null, headers = {}) => {
      setIsLoading(true)
      const httpAbortController = new AbortController()
      activeHttpRequests.current.push(httpAbortController)
      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortController.signal,
        })
        const responseData = await response.json()

        activeHttpRequests.current = activeHttpRequests.current.filter(
          controller => controller !== httpAbortController
        )

        if (!response.ok) {
          throw new Error(responseData.message)
        }
        setIsLoading(false)
        return responseData
      } catch (error) {
        setError(error.message)
        setIsLoading(false)
        throw error
      }
    },
    []
  )

  const clearError = () => {
    setError(null)
  }

  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach(controller => controller.abort())
    }
  }, [])

  return { isLoading, error, sendRequest, clearError }
}

export default useHttp
