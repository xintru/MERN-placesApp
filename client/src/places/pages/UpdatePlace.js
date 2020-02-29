import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import Input from '../../shared/components/FormElements/Input/Input'
import Button from '../../shared/components/FormElements/Button/Button'
import Card from '../../shared/components/UIElements/Card/Card'
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from '../../shared/util/validators'
import useForm from '../../shared/hooks/form-hook'
import './PlaceForm.css'

const DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Empire State Building',
    description: 'Some description',
    imageUrl:
      'https://aws-tiqets-cdn.imgix.net/images/content/1e74453a4d2c45f9becb39add27f2dff.jpg?auto=format&fit=crop&ixlib=python-1.1.2&q=25&s=b720cbf5ab86e1786ee7bd2a6b4f26be&w=400&h=320&dpr=2.625',
    address: ' 20 W 34th St, New York, NY 10001',
    location: {
      lat: 40.7484405,
      lng: -73.9856644,
    },
    creator: 'u1',
  },
  {
    id: 'p2',
    title: 'Empire State Building',
    description: 'Some description',
    imageUrl:
      'https://aws-tiqets-cdn.imgix.net/images/content/1e74453a4d2c45f9becb39add27f2dff.jpg?auto=format&fit=crop&ixlib=python-1.1.2&q=25&s=b720cbf5ab86e1786ee7bd2a6b4f26be&w=400&h=320&dpr=2.625',
    address: ' 20 W 34th St, New York, NY 10001',
    location: {
      lat: 40.7484405,
      lng: -73.9856644,
    },
    creator: 'u2',
  },
]

const UpdatePlace = props => {
  const [isLoading, setIsLoading] = useState(true)
  const { placeId } = useParams()

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

  const identifiedPlace = DUMMY_PLACES.find(p => p.id === placeId)

  useEffect(() => {
    if (identifiedPlace) {
      setFormData(
        {
          title: {
            value: identifiedPlace.title,
            isValid: true,
          },
          description: {
            value: identifiedPlace.description,
            isValid: true,
          },
        },
        true
      )
    }
    setIsLoading(false)
  }, [setFormData, identifiedPlace])

  const placeUpdateSubmitHandler = event => {
    event.preventDefault()
  }

  if (!identifiedPlace) {
    return (
      <div className="center">
        <Card>
          <h2>Couldn't find the place!</h2>
        </Card>
      </div>
    )
  }

  return !isLoading ? (
    <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title"
        onInput={inputHandler}
        initialValue={formState.inputs.title.value}
        initialValid={formState.inputs.title.isValid}
      />
      <Input
        id="description"
        element="textarea"
        type="text"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description (min 5 characters)."
        onInput={inputHandler}
        initialValue={formState.inputs.description.value}
        initialValid={formState.inputs.description.isValid}
      />
      <Button type="submit" disabled={!formState.isValid}>
        Update Place
      </Button>
    </form>
  ) : (
    <div className="centered">LOADING</div>
  )
}

export default UpdatePlace
