
import React from 'react';
import {Order} from '../../interfaces/storeTypes';



interface OrderFormProps{
  order: Order;
  handleChange: {
    (ev: any): any;
  }
}

export default function OrderForm(props: OrderFormProps){
    let order = props.order;
    return (
    
    <div className="row my-1">
        <div className='col-md-2'>
            <label htmlFor='qty-input'>Shipped:</label>
            <input type="checkbox" 
                    className="form-control" 
                    name="shipped" 
                    checked={order.shipped} 
                    onChange={props.handleChange}  required/>
        </div>
        <div className='col-md-6'>
            <label htmlFor='qty-input'>Tracking number:</label>
            <input type="text" 
                    className="form-control" 
                    name="ship_tracking" 
                    value={order["ship_tracking"]} 
                    onChange={props.handleChange}  />
        </div>
    </div>
    );
}
