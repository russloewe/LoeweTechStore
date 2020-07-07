import React from 'react';
import {postHeaders} from '../../../core/interfaces/coreInterface';
import ShippingForm from '../forms/shippingForm';
import {postAddShippingEndpoint, getShippingEndpoint } from '../../interfaces/storeEndpoints';
import {ShippingPayload} from '../../interfaces/storeInterface';
import {ShipDest} from '../../interfaces/storeTypes';
import { IgnorePlugin } from 'webpack';

interface ShippingCardState{
  form: ShipDest;
  server?: ShipDest;
}

let blankShippingInfo: ShipDest = {
  name: '',
  addr_1: '',
  addr_2: '',
  state: '',
  zipcode: '',
  city: '',
  email: ''
}

function shippingEqual(info1, info2){
  if(!info1 || !info2){
    return false
  };
  const attr = ['name', 'addr_1', 'addr_2', 'state', 'zipcode', 'city', 'email'];
  const results = attr.map((name) => (info1[name] != info2[name]? true : false)).filter((val) => (val));
  console.log(results);
  if(results.length != 0){
    console.log(results);
    return false
  }else{
    return true
  }
};

class ShippingCard extends React.Component {
  state: ShippingCardState;
  timerID: any;
  
  constructor(props) {
    super(props);
    this.state = {
      form: blankShippingInfo
    }
    this.handleChange = this.handleChange.bind(this);
    this.submit = this.submit.bind(this);
    this.getShipping = this.getShipping.bind(this);
    this.tick = this.tick.bind(this);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  async componentDidMount(){
    await this.getShipping();
    this.timerID = setInterval(() => this.tick(), 5000)
  }

  async tick(){
    if(!shippingEqual(this.state.form, this.state.server)){
      console.log('Change detected in shipping form');
      await this.submit();
      //await this.getShipping();
    }
  };

  async getShipping(){
    await fetch(getShippingEndpoint)
        .then((response) => {
            return response.json();
        })
        .then((data: ShippingPayload) => {
            console.log(data.shipping);
            this.setState({form: Object.assign({}, data.shipping),
                           server: data.shipping})
        })
        .catch((err) => {
          console.log('No cart;');
        })
  }

  handleChange(event){
    const name = event.target.name;
    const value = event.target.value;
    var newForm: ShipDest = Object.assign({}, this.state.form);
    newForm[name] = value;
    this.setState({form: newForm})
    console.log('state change: ', value);
};

  submit() {
   // ev.preventDefault();
   let ship: ShipDest = this.state.form;
    let payload: ShippingPayload = {
      shipping: ship,
      customer: {
        name: this.state.form.name,
        email: this.state.form.email
      }};

    fetch(postAddShippingEndpoint, {
      method: 'POST',
      headers: postHeaders,
      body: JSON.stringify(payload)
    }).then( (res) => {
        if(res.status == 200){
          this.setState({server: ship})
        } else{
            console.log(res) 
        }
    } )
  }

  render() {
    return (
      <div className="col"> 
        <ShippingForm shipping_address={this.state.form} handleChange={this.handleChange} />
      </div>
    );
  }
}

export default ShippingCard;
