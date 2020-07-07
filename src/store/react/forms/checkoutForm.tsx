import React from 'react';
import FadeIn from "react-fade-in";
import {ElementsConsumer, CardElement} from '@stripe/react-stripe-js';

import CardSection from '../cardSection';
import {postHeaders} from '../../../core/interfaces/coreInterface';
import * as Endpoints from '../../interfaces/storeEndpoints';
import {ErrorCode, CheckoutResponse, CheckoutErrorCode} from '../../interfaces/storeInterface'
import { ResponsiveEmbed } from 'react-bootstrap';


function Loading(props){
  return(
<div>
  <FadeIn>
    <div className="loader">
      <span className="sr-only">Waiting for a response from the server.</span>
    </div>
  </FadeIn>
  <h2>Payment Processing...</h2>
</div>
)};

function Success(props){
  return(
    <div> 
        <h2>Order Placed!</h2>
        <p>Order number: {props.order_id}</p>
        <button className="btn btn-primary" onClick={props.onClick}>Back</button>
    </div>
  )
};

 function Error(props){
  return(
  <div> 
    <FadeIn>
    <div className="row">
      <img src="public/images/error.svg" alt="message rejected"></img>
    </div>
    </FadeIn>
    <h2>Server Error!</h2>
    <p>{props.error_message}</p>
    <button className="btn btn-primary" onClick={props.onClick}>Back</button>
  </div>
)};

interface CheckoutFormState{
  form: string;
  error_message: string;
  order_id?: number
};

class CheckoutForm extends React.Component {
  state: CheckoutFormState;
  props: any;
  constructor(props) {
    super(props);
    this.state = {
      form: 'visible',
      error_message: '',
    };
    this.submit = this.submit.bind(this);
    this.backButton = this.backButton.bind(this);
  }

  backButton(ev){
    ev.preventDefault();
    this.setState({form: 'visible'});
  }

  async submit(ev) {
    ev.preventDefault();
    // Step one, Remove the 'buy' button from the user 
    this.setState({form: 'loading'});

    // step one part 2, check for stripe and elements
    const {stripe, elements} = this.props;
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }
    // Step three, get paymentIntent client_secrect from LoeweTech(tm) servers
    const response = await fetch(Endpoints.OrderCheckout);
    const checkoutRes: CheckoutResponse = await response.json();
    if(checkoutRes.error){
      this.setState({form: 'error', error_message: checkoutRes.error_message});
      return;
    }else if(!checkoutRes.client_secret){
      this.setState({form: 'error', error_message: 'Unable to initiate checkout process with server.'});
      return;
    };

    // Step four, use client_secret and card details from Elements to finaliaze payment
    let clientSecret = checkoutRes.client_secret;
    let result;
    try{
      result = await this.props.stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)
        }
      });
    }catch(err){
      console.log(err);
      this.setState({form: 'error', error_message: 'Error with payment' });
    }
    
    // Step five, handle response from Stripe, informing user of success or failure
    if (result.error) {
      // Show error to your customer (e.g., insufficient funds)
      console.log(result.error.message);
      this.setState({
        form: 'error',
        error_message: result.error.message});
    } else {
      // The payment has been processed!
      if (result.paymentIntent.status === 'succeeded') {
        // Show a success message to your customer
        // There's a risk of the customer closing the window before callback
        // execution. Set up a webhook or plugin to listen for the
        // payment_intent.succeeded event that handles any business critical
        // post-payment actions.
        this.setState({
          form: 'success',
          order_id: checkoutRes.order_id});
      }
    }
  }

  render() {
    let formView = 
    <div>
      <h5 className="display-5">Payment Info</h5>
      <form onSubmit={this.submit}>
          <div className="form-row">    
          </div>  
          <div className="form-group col-md-6">          
            <CardSection />
          </div>
      </form>      
    </div>;

    return (
      <div className="checkout">
        {formView}
        {(this.state.form == 'visible') ? <button className="btn btn-primary" onClick={this.submit}>Buy Now!</button> : ''}
        {(this.state.form == 'success') ? <Success order_id={this.state.order_id} onClick={this.backButton}/> : ''}
        {(this.state.form == 'loading') ? <Loading /> : ''}
        {(this.state.form == 'error') ? <Error error_message={this.state.error_message} onClick={this.backButton} /> : ''}  
    </div>
    );
  }
}

export default function InjectedCheckoutForm() {
  return (
    <ElementsConsumer>
      {({stripe, elements}) => (
        <CheckoutForm  stripe={stripe} elements={elements} />
      )}
    </ElementsConsumer>
  );
}