import React, { useState, useEffect } from 'react'

import UsersList from '../components/UsersList'
import ErrorModal from '../../shared/components/UIElements/Modal/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner/LoadingSpinner'
import useHttp from '../../shared/hooks/http-hook'

const Users = () => {
  const [loadedUsers, setLoadedUsers] = useState([])
  const [finishedLoading, setFinishedLoading] = useState(false)
  const { isLoading, error, sendRequest, clearError } = useHttp()

  useEffect(() => {
    ;(async () => {
      try {
        setFinishedLoading(false)
        const response = await sendRequest('/api/users')
        setLoadedUsers(response.users)
        setFinishedLoading(true)
      } catch (error) {
        setFinishedLoading(true)
      }
    })()
  }, [sendRequest])

  return (
    <>
      {<ErrorModal error={error} onClear={clearError} />}
      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      )}
      {!isLoading && loadedUsers && (
        <UsersList items={loadedUsers} finishedLoading={finishedLoading} />
      )}
    </>
  )
}

export default Users
