import React, { useState, useContext } from 'react'

import Card from '../../shared/components/UIElements/Card/Card'
import Input from '../../shared/components/FormElements/Input/Input'
import Button from '../../shared/components/FormElements/Button/Button'
import ErrorModal from '../../shared/components/UIElements/Modal/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner/LoadingSpinner'
import ImageUpload from '../../shared/components/FormElements/ImageUpload/ImageUpload'

import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../../shared/util/validators'

import useForm from '../../shared/hooks/form-hook'
import useHttp from '../../shared/hooks/http-hook'
import { AuthContext } from '../../shared/context/auth-context'
import './Auth.css'

const Auth = () => {
  const [isLoginMode, setIsLoginMode] = useState(true)
  const { login } = useContext(AuthContext)
  const { isLoading, error, sendRequest, clearError } = useHttp()
  const [formState, inputHandler, setFormData] = useForm({
    email: {
      value: '',
      isValid: false,
    },
    password: {
      value: '',
      isValid: false,
    },
  })
  const authSubmitHandler = async event => {
    event.preventDefault()
    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          '/api/users/login',
          'POST',
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            'Content-Type': 'application/json',
          }
        )
        login(responseData.user.id)
      } catch (error) {}
    } else {
      try {
        const formData = new FormData()
        formData.append('email', formState.inputs.email.value)
        formData.append('name', formState.inputs.name.value)
        formData.append('password', formState.inputs.password.value)
        formData.append('image', formState.inputs.image.value)
        const responseData = await sendRequest(
          '/api/users/signup',
          'POST',
          formData
        )
        login(responseData.user.id)
      } catch (error) {}
    }
  }

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      )
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: '',
            isValid: false,
          },
          image: {
            value: null,
            isValid: false,
          },
        },
        false
      )
    }
    setIsLoginMode(prevMode => !prevMode)
  }

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>{isLoginMode ? 'Login required' : 'Signup'}</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Input
              element="input"
              id="name"
              type="text"
              label="Your name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a name"
              onInput={inputHandler}
            />
          )}
          {!isLoginMode && (
            <ImageUpload
              id="image"
              center
              onInput={inputHandler}
              errorText="Please provide an image."
            />
          )}
          <Input
            element="input"
            id="email"
            type="email"
            label="Email"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email address."
            onInput={inputHandler}
          />
          <Input
            element="input"
            id="password"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Please enter a valid password. At least 6 characters."
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? 'LOGIN' : 'SIGNUP'}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
        </Button>
      </Card>
    </>
  )
}

export default Auth
