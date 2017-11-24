import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import Home from './components/Home/Home'
import About from './components/About/About'
import NotFound from './components/NotFound/NotFound'
import SignUp from './components/SignUp/SignUp'
import SignIn from './components/SignIn/SignIn'

// The Main component renders one of the three provided
// Routes (provided that one matches). Both the /roster
// and /schedule routes will match any pathname that starts
// with /roster or /schedule. The / route will only match
// when the pathname is exactly the string "/"
class Main extends Component {
  render() {
    const userInfo = this.props.userInfo;
    return (
      <main>
        <Switch>
          <Route exact path='/' 
            render={(props) => <Home {...props} userInfo={userInfo} />}
          />
          <Route path='/about' component={About}/>
          <Route path='/sign-in'
            render={(props) => <SignIn {...props} userInfo={userInfo} />}
          />
          <Route exact path='/sign-up'
            render={(props) => <SignUp {...props} />}
          />
          <Route path='*' component={NotFound}/>
        </Switch>
      </main>
    )
  }
}

export default Main
