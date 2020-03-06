import React, { useState, useEffect } from 'react'

import UsersList from '../components/UsersList'
import ErrorModal from '../../shared/components/UIElements/Modal/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner/LoadingSpinner'
import useHttp from '../../shared/hooks/http-hook'

const Users = () => {
  const [loadedUsers, setLoadedUsers] = useState([])
  const { isLoading, error, sendRequest, clearError } = useHttp()

  useEffect(() => {
    ;(async () => {
      try {
        const response = await sendRequest('/api/users')
        setLoadedUsers(response.users)
      } catch (error) {}
    })()
  }, [sendRequest])

  return (
    <>
      {<ErrorModal error={error} onClear={clearError} />}
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
    </>
  )
}

export default Users
