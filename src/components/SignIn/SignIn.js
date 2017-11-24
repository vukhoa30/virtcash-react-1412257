import React from 'react'
import { LinkedComponent } from 'valuelink'
import { Input } from 'valuelink/tags'
import Cookies from 'universal-cookie'
import { Redirect } from 'react-router'

import './SignIn.css';
import '../SignUp/SignUp.css'

const cookies = new Cookies();

export default class SignIn extends LinkedComponent {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      failed: false
    }
  }
  handleSubmit(e) {
    e.preventDefault();
    fetch('/api/sign-in', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
      })
    })
    .then(rslt => { 
      if (rslt.status === 401 || rslt.status === 400) { 
        this.setState({ failed: true });
        return false; 
      }
      return rslt.json(); 
    })
    .then(data => {
      if (data) {
        console.log(data);
        cookies.set('token', data.token, { path: '/' });
        //this.setState({ redirect: true });
        window.location.assign("/");
      }
    })
    .catch(err => { console.log(err); });
  }
  render() {
    const linked = this.linkAll();

    if (this.state.redirect || this.props.userInfo) {
      return <Redirect push to="/" />;
    }

    const err = this.state.failed ? (
      <ul className="sign-up-error">
        <li>Tài khoản hoặc mật khẩu không hợp lệ.</li>
      </ul>
    ) : null;

    return (
      <div className="sign-in-padding-panel">
        <div className="panel panel-default sign-in-panel">
          <div className="panel-body">
            <form onSubmit={this.handleSubmit.bind(this)}>
              <div className="row">
                <div className="col col-md-5">Email: </div>
                <div className="col col-md-7">
                  <Input valueLink={linked.email} className="sign-in-input"/>
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col col-md-5">Mật khẩu: </div>
                <div className="col col-md-7">
                  <Input type="password" valueLink={linked.password} className="sign-in-input"/>
                </div>
              </div>
              <br />
              {err}
              <div className="row sign-in-right">
                <button type="submit" className="btn btn-success">Sign in</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}