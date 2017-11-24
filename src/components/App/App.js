import React, { Component } from 'react'
import './App.css'
import Main from '../../routes'
import Header from '../Header/Header'
import Cookies from 'universal-cookie'

const cookies = new Cookies();

class App extends Component { 
  constructor(props) {
    super(props);
    this.state = {
      userInfo: undefined,
    }
  }
  updateUserInfo() {
    var token = cookies.get('token');
    if (token) {
      fetch('/api/user-info', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `JWT ${token}`,
        }
      })
      .then(rslt => { return rslt.json(); })
      .then(data => {
        if (data !== this.state.userInfo) {
          this.setState({ userInfo: data });
        }
      })
      .catch(err => { console.log(err) })
    }
  }
  componentDidMount() {
    this.updateUserInfo();
  }
  componentDidUpdate() {
    //this.updateUserInfo();
  }
  render() {
    return (
      <div className="container">
        <Header userInfo={this.state.userInfo} />
        <div className="app-background">
          <Main userInfo={this.state.userInfo} />
        </div>
      </div>
    )
  }
}

export default App