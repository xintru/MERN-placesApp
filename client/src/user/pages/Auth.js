import React, { useState, useContext } from 'react'

import Card from '../../shared/components/UIElements/Card/Card'
import Input from '../../shared/components/FormElements/Input/Input'
import Button from '../../shared/components/FormElements/Button/Button'
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../../shared/util/validators'
import useForm from '../../shared/hooks/form-hook'
import { AuthContext } from '../../shared/context/auth-context'
import './Auth.css'

const Auth = props => {
  const [isLoginMode, setIsLoginMode] = useState(true)
  const { login } = useContext(AuthContext)
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

  const authSubmitHandler = event => {
    event.preventDefault()
    if (isLoginMode) {
      login()
    } else {
      console.log(formState.inputs)
    }
  }

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: null,
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
        },
        false
      )
    }
    setIsLoginMode(prevMode => !prevMode)
  }

  return (
    <Card className="authentication">
      <h2>Login required</h2>
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
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid password ."
          onInput={inputHandler}
        />
        <Button type="submit" disabled={!formState.isValid}>
          {isLoginMode ? 'LOGIN' : 'SIGNUP'}
        </Button>
      </form>
      <Button inverse onClick={switchModeHandler}>
        SWITCH TO {isLoginMode ? 'LOGIN' : 'SIGNUP'}
      </Button>
    </Card>
  )
}

export default Auth
