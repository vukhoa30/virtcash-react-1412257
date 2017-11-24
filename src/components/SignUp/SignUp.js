import React from 'react';
import { LinkedComponent } from 'valuelink'; 
import { Input } from 'valuelink/tags';

import './SignUp.css';
import '../SignIn/SignIn.css'

export default class SignUp extends LinkedComponent {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      repeatPassword: '',
      err: false,
      registed: false,
      existed: false,
    }
  }
  onSubmit(e) {
    e.preventDefault();
    this.setState({ err: true })
    if (validateEmail(this.state.email) && validatePassword(this.state.password) &&
      validateRepeatPassword(this.state.password, this.state.repeatPassword)) {
      fetch('/api/register', {
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
        if (rslt.status === 400 || rslt.status === 401) { 
          this.setState({ existed: true })
          return false; 
        }
        this.setState({ existed: false });
        return rslt.json(); 
      })
      .then(data => {
        if (data) {
          console.log(data);
          this.setState({ redirect: true, registed: true });
        }
      })
      .catch(err => { console.log(err); });
    }
  }
  render() {
    const linked = this.linkAll();
    if (this.state.registed) {
      return (
        <div className="panel panel-default sign-up-text-center sign-up-succes-panel">
          <div className="panel-body">
            <h1>Đăng ký thành công! <a href="/sign-in">Đăng nhập</a></h1>
          </div>
        </div>
      )
    }
    
    const emailCheckClass = validateEmail(linked.email.value) ? null : <li>Email không hợp lệ.</li>;
    const passwordCheckClass = validatePassword(linked.password.value) ? null : <li>Mật khẩu không hợp lệ.</li>;
    const repeatPasswordCheckClass = validateRepeatPassword(linked.password.value, linked.repeatPassword.value) ? null : <li>Xác nhận mật khẩu chưa đúng.</li>;
    const existed = this.state.existed ? <li>Email đã được dùng để đăng ký.</li> : null;
    const err = this.state.err ? (
      <ul className="sign-up-error">
        {existed}
        {emailCheckClass}
        {passwordCheckClass}
        {repeatPasswordCheckClass}
      </ul>
    ) : null;

    return (
      <form onSubmit={this.onSubmit.bind(this)} className="sign-in-padding-panel">
        <div className="panel panel-default sign-in-panel">
          <div className="panel-body">
            <div className="row">
              <div className="col col-md-5">Email: </div>
              <div className="col col-md-7">
                <Input type="email" valueLink={ linked.email } className="sign-in-input"/>
              </div>
            </div>
            <br />
            <div className="row">
              <div className="col col-md-5">Mật khẩu: </div>
              <div className="col col-md-7">
                <Input type="password" valueLink={ linked.password } className="sign-in-input"/>
              </div>
            </div>
            <br />
            <div className="row">
              <div className="col col-md-5">Xác nhận mật khẩu: </div>
              <div className="col col-md-7">
                <Input type="password" valueLink={ linked.repeatPassword } className="sign-in-input"/>
              </div>
            </div>
            <br />
            <div className="row">
              {err}
            </div>
            <div className="row sign-in-right">
              <button type="submit" className="btn btn-primary sign-up">Sign Up</button>
            </div>
          </div>
        </div>
      </form>
    );
  }
}
function validateEmail(email) {
  return email !== '' && /^[a-zA-Z0-9_]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email);
}
function validatePassword(pwd) {
  return pwd.length >= 6;
}
function validateRepeatPassword(pwd, rptpwd) {
  return pwd === rptpwd;
}