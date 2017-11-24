import React from 'react';
import { LinkedComponent } from 'valuelink'; 
import { Input } from 'valuelink/tags';
import Cookies from 'universal-cookie';

import './Home.css';

const cookies = new Cookies();

export default class Home extends LinkedComponent {
  constructor(props) {
    super(props);
    this.state = {
      walletFromID: '',
      walletToID: '',
      amount: '',
      wallets: null,
      allTransactions: null,
      selfTransactions: null
    }
    this.getWallets = this.getWallets.bind(this);
  }
  getWallets() {
    var token = cookies.get('token');
    fetch('/api/get-self-wallets', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `JWT ${token}`,
      }
    })
    .then(rslt => { 
      if (rslt.status === 400 || rslt.status === 401) { return false; }
      return rslt.json(); 
    })
    .then(data => {
      if (data) {
        this.setState({ wallets: data });
      }
    })
    .catch(err => { console.log(err) })
  }
  getAllTransactions() {
    fetch('/api/get-all-transactions', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then(rslt => { 
      if (rslt.status === 400 || rslt.status === 401) { return false; }
      return rslt.json(); 
    })
    .then(data => {
      if (data) {
        this.setState({ allTransactions: data });
      }
    })
    .catch(err => { console.log(err) })
  }
  getSelfTransactions() {
    var token = cookies.get('token');
    fetch('/api/get-self-transactions', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `JWT ${token}`,
      }
    })
    .then(rslt => { 
      if (rslt.status === 400 || rslt.status === 401) { return false; }
      return rslt.json(); 
    })
    .then(data => {
      if (data) {
        this.setState({ selfTransactions: data });
      }
    })
    .catch(err => { console.log(err) })
  }
  componentDidMount() {
    this.getWallets();
    this.getSelfTransactions();
    this.getAllTransactions();
  }
  handleChangeOption(e) {
    this.setState({
      walletFromID: e.target.value
    })
  }
  createWallet() {
    var token = cookies.get('token');
    fetch('/api/create-wallet', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `JWT ${token}`,
      }
    })
    .then(rslt => { 
      if (rslt.status === 401 || rslt.status === 400) {
        alert("Thêm ví thất bại! ");
        console.log(rslt.json());
        return false;
      }
      return rslt.json(); 
    })
    .then(data => {
      if (data) {
        alert("Thêm ví thành công!");
        window.location.reload();
      }
    })
    .catch(err => { console.log(err) })
  }
  transfer() {
    if (this.state.amount <= 0) { 
      alert("Số tiền phải lớn hơn 0 và nhỏ hơn hoặc bằng số dư của ví.");
    }
    else {
      if (this.state.walletFromID !== this.state.walletToID) {
        var token = cookies.get('token');
        fetch('/api/transfer', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `JWT ${token}`,
          },
          body: JSON.stringify({
            "walletFromID": this.state.walletFromID,
            "walletToID": this.state.walletToID,
            "amount": this.state.amount
          })
        })
        .then(rslt => { 
          if (rslt.status === 401 || rslt.status === 400) {
            alert("Chuyển tiền thất bại! " + rslt.json().message);
            return false;
          }
          return rslt.json(); 
        })
        .then(data => {
          if (data) {
            alert("Chuyển tiền thành công!");
            window.location.reload();
          }
        })
        .catch(err => { console.log(err) })
      } else {
        alert('2 mã ví không được trùng nhau!');
      }
    }
  }
  render() {
    const linked = this.linkAll();

    var wallets = null,
      walletOptions = null;
    if (this.state.wallets) {
      wallets = this.state.wallets.map((item, idx) => {
        return <li key={`wallet_${idx}`}>Mã: <span className="label label-default">{item._id}</span> Số dư: <span className="home-vt-small">{item.balance} VT</span></li>
      })
      walletOptions = this.state.wallets.map((item, idx) => {
        return <option key={`walletOption_${idx}`} value={item._id}>{item._id}</option>
      })
    }

    const haveWallet = (this.state.wallets && this.state.wallets.length === 0) ? null : (
      <p>
        <button className="btn btn-default" data-toggle="modal" data-target="#myModal">
          Gửi tiền
        </button>
      </p>
    )

    var selfTransactions = null;
    if (this.state.selfTransactions) {
      selfTransactions = this.state.selfTransactions.map((item, idx) => {
        return <li key={`self_${idx}`}>{item.walletFromID} chuyển đến {item.walletToID} <span className="home-vt-small">{item.amount} VT</span> vào lúc {item.time}</li>
      })
      selfTransactions = selfTransactions.reverse();
    }
    var allTransactions = null;
    if (this.state.allTransactions) {
      allTransactions = this.state.allTransactions.map((item, idx) => {
        return <li key={`all_${idx}`}>{item.walletFromID} chuyển đến {item.walletToID} <span className="home-vt-small">{item.amount} VT</span> vào lúc {item.time}</li>
      })
    }

    const userControls = this.props.userInfo ? (
      <div>
        {haveWallet}
        <h2>Các ví tiền: </h2>
        <ul>
          {wallets}
          <li><button onClick={this.createWallet.bind(this)} className="btn btn-success">+</button></li>
        </ul>
        <h2>Các giao dịch gần đây:</h2>
        <ul>
          {selfTransactions}
        </ul>
      </div>
    ) : (
      <div>
        <h3><a href="/sign-in">Đăng nhập</a> để có ví và giao dịch tiền ảo</h3>
      </div>
    )

    return (
      <div className="home-panel">
        <div className="panel panel-default home-padding-panel">
          <div className="panel-body">
            <div className="col col-md-6">
              {userControls}
            </div>
            <div className="col col-md-6">
              <h2>Tất cả giao dịch: </h2>
              <ul>
                {allTransactions}
              </ul>
            </div>
          </div>

          <div id="myModal" className="modal fade" role="dialog">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal">&times;</button>
                  <h4 className="modal-title">Gửi tiền</h4>
                </div>
                <div className="modal-body home-modal-body">
                  <div className="row">
                    <div className="col col-md-5">Mã ví tiền gửi:</div>
                    <select onChange={this.handleChangeOption.bind(this)}>
                      <option value=""></option>
                      {walletOptions}
                    </select>
                  </div>
                  <br />
                  <div className="row">
                    <div className="col col-md-5">Mã ví tiền nhận:</div>
                    <div className="col col-md-7"><Input valueLink={linked.walletToID} className="home-input-email" /></div>
                  </div>
                  <br />
                  <div className="row">
                    <div className="col col-md-5">Số tiền:</div>
                    <div className="col col-md-7"><Input type="number" valueLink={linked.amount} className="home-input-vt" /> VT</div>
                  </div>
                  <br />
                </div>
                <div className="modal-footer">
                  <button className="btn btn-default" data-dismiss="modal">Đóng</button>
                  <button onClick={this.transfer.bind(this)} className="btn btn-primary">Gửi tiền</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}