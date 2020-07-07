import React from 'react';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';

import CheckoutForm from './forms/checkoutForm';
import {stripe_client} from '../keys';
import ShippingCard from './cards/shippingCard';

const stripePromise = loadStripe(stripe_client);

class CheckoutViewWindow extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        return(
          <div className='card'>
            
            <div className='card-header'>
            <h3 className="display-3">
                    Checkout
                </h3>
            </div>
            <ShippingCard  />
            <div className='card-body'>
                  <Elements stripe={stripePromise}>
                    <CheckoutForm />
                  </Elements>
            </div>
          </div>
        )
    }
}
export default CheckoutViewWindow;

                
