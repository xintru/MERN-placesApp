import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import PlaceList from '../components/PlaceList'
import ErrorModal from '../../shared/components/UIElements/Modal/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner/LoadingSpinner'
import useHttp from '../../shared/hooks/http-hook'

const UserPlaces = () => {
  const { isLoading, error, sendRequest, clearError } = useHttp()
  const [finishedLoading, setFinishedLoading] = useState(false)
  const [loadedPlaces, setLoadedPlaces] = useState([])
  const { userId } = useParams()

  useEffect(() => {
    ;(async () => {
      try {
        setFinishedLoading(false)
        const responseData = await sendRequest(`/api/places/user/${userId}`)
        setLoadedPlaces(responseData.places)
        setFinishedLoading(true)
      } catch (error) {
        setFinishedLoading(true)
      }
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
          <LoadingSpinner asOverlay />
        </div>
      )}
      {!isLoading && loadedPlaces && (
        <PlaceList
          items={loadedPlaces}
          onDeletePlace={placeDeletedHandler}
          finishedLoading={finishedLoading}
        />
      )}
    </>
  )
}

export default UserPlaces
