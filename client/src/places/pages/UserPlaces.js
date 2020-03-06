import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import PlaceList from '../components/PlaceList'
import ErrorModal from '../../shared/components/UIElements/Modal/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner/LoadingSpinner'
import useHttp from '../../shared/hooks/http-hook'

const UserPlaces = () => {
  const { isLoading, error, sendRequest, clearError } = useHttp()
  const [loadedPlaces, setLoadedPlaces] = useState([])
  const { userId } = useParams()

  useEffect(() => {
    ;(async () => {
      try {
        const responseData = await sendRequest(`/api/places/user/${userId}`)
        setLoadedPlaces(responseData.places)
      } catch (error) {}
    })()
  }, [sendRequest, userId])

  const placeDeletedHandler = deletedPlaceId => {
    setLoadedPlaces(prevPlaces =>
      prevPlaces.filter(place => place.id !== deletedPlaceId)
    )
  }

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedPlaces && (
        <PlaceList items={loadedPlaces} onDeletePlace={placeDeletedHandler} />
      )}
    </>
  )
}

export default UserPlaces
