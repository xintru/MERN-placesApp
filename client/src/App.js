import React, { useState, useCallback } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom'

import { AuthContext } from './shared/context/auth-context'

import UserPlaces from './places/pages/UserPlaces'
import Users from './user/pages/Users'
import Auth from './user/pages/Auth'
import NewPlace from './places/pages/NewPlace'
import UpdatePlace from './places/pages/UpdatePlace'
import MainNavigation from './shared/components/Navigation/MainNavigation'

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userId, setUserId] = useState(null)

  const login = useCallback(uid => {
    setIsLoggedIn(true)
    setUserId(uid)
  }, [])

  const logout = useCallback(() => {
    setIsLoggedIn(false)
    setUserId(null)
  }, [])

  return (
    <AuthContext.Provider value={{ isLoggedIn, userId, login, logout }}>
      <Router>
        <MainNavigation />
        <main>
          {isLoggedIn ? (
            <Switch>
              <Route exact path="/" component={Users} />
              <Route exact path="/:userId/places" component={UserPlaces} />
              <Route path="/places/new" component={NewPlace} />
              <Route path="/places/:placeId" component={UpdatePlace} />
              <Redirect to="/" />
            </Switch>
          ) : (
            <Switch>
              <Route exact path="/" component={Users} />
              <Route exact path="/:userId/places" component={UserPlaces} />
              <Route path="/auth" component={Auth} />
              <Redirect to="/auth" />
            </Switch>
          )}
        </main>
      </Router>
    </AuthContext.Provider>
  )
}

export default App
