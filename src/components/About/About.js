import React, { Component } from 'react';

import './About.css';

export default class About extends Component {
  // static propTypes = {}
  // static defaultProps = {}
  // state = {}

  render() {
    return (
      <div>
        <h1 className='about-h1'>About</h1>
        <p>Đây là website hỗ trợ giao dịch tiền ảo. Cảm ơn bạn đã sử dụng.</p>
        <p>Make by Khoa - 1412257</p>
      </div>
    );
  }
}