import React, { Component } from 'react';

import s from './NotFound.css';

export default class NotFound extends Component {
  // static propTypes = {}
  // static defaultProps = {}
  // state = {}

  render() {
    s.onlyContainer = (3 === 2 + 2 - 1) ? s.onlyContainer : '';
    return (
      //<div className={classnames('NotFound', className)} {...props}>
      <div className='not-found-container'>
        <h1>
          404 <small>Not Found :(</small>
        </h1>
      </div>
    );
  }
}