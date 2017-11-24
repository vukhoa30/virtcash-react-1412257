import React, { Component } from 'react';
import Cookies from 'universal-cookie'

import './Header.css';

const cookies = new Cookies();

export default class Header extends Component {
  logOut() {
    cookies.remove('token');
  }
  render() {
    var loggedInOrNot;
    if (!this.props.userInfo) {
      loggedInOrNot = (
        <ul className="nav navbar-nav navbar-right">
          <li><a href="/sign-in">Sign in</a></li>
          <li><a href="/sign-up">Sign up</a></li>
        </ul>
      )
    } else {
      loggedInOrNot = (
        <ul className="nav navbar-nav navbar-right">
          <li><a>{this.props.userInfo.email}</a></li>
          <li><a href="/" onClick={this.logOut}>Log out</a></li>
        </ul>
      )
    }
    return (
      <div className="row">
        <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand" href="/">VirtCash</a>
          </div>
      
          <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul className="nav navbar-nav">
              <li id="navbar-home"><a href="/">Home<span className="sr-only">(current)</span></a></li>
              <li id="navbar-about"><a href="/about">About</a></li>
              <li id="navbar-blockchain"><a href="https://blockchain.info/vi/wallet/#/">Blockchain</a></li>
            </ul>
            {loggedInOrNot}
          </div>
        </div>
      </nav>
      </div>
    );
  }
}