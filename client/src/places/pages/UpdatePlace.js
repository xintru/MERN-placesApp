import React, { useEffect, useState, useContext } from 'react'
import { useParams, useHistory } from 'react-router-dom'

import Input from '../../shared/components/FormElements/Input/Input'
import Button from '../../shared/components/FormElements/Button/Button'
import Card from '../../shared/components/UIElements/Card/Card'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner/LoadingSpinner'
import ErrorModal from '../../shared/components/UIElements/Modal/ErrorModal'
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from '../../shared/util/validators'
import useHttp from '../../shared/hooks/http-hook'
import useForm from '../../shared/hooks/form-hook'
import { AuthContext } from '../../shared/context/auth-context'
import './PlaceForm.css'

const UpdatePlace = props => {
  const { isLoading, error, sendRequest, clearError } = useHttp()
  const { placeId } = useParams()
  const [loadedPlace, setLoadedPlace] = useState()
  const history = useHistory()
  const { userId } = useContext(AuthContext)

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: '',
        isValid: false,
      },
      description: {
        value: '',
        isValid: false,
      },
    },
    false
  )

  useEffect(() => {
    ;(async () => {
      const response = await sendRequest(`/api/places/${placeId}`)
      setLoadedPlace(response.place)
      setFormData(
        {
          title: {
            value: response.place.title,
            isValid: true,
          },
          description: {
            value: response.place.description,
            isValid: true,
          },
        },
        true
      )
    })()
  }, [setFormData, sendRequest, placeId])

  const placeUpdateSubmitHandler = async event => {
    event.preventDefault()
    try {
      await sendRequest(
        `/api/places/${placeId}`,
        'PATCH',
        {
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        },
        {
          'Content-Type': 'application/json',
        }
      )
      history.push('/' + userId + '/places')
    } catch (error) {}
  }

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!loadedPlace && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Couldn't find the place!</h2>
        </Card>
      </div>
    )
  }

  return (
    <>
      {error && <ErrorModal error={error} onClear={clearError} />}
      {!isLoading && loadedPlace && (
        <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title"
            onInput={inputHandler}
            initialValue={loadedPlace.title}
            initialValid={true}
          />
          <Input
            id="description"
            element="textarea"
            type="text"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (min 5 characters)."
            onInput={inputHandler}
            initialValue={loadedPlace.description}
            initialValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            Update Place
          </Button>
        </form>
      )}
    </>
  )
}

export default UpdatePlace
