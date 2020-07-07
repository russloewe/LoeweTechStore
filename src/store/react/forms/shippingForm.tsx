
import React from 'react';
import {ShipDest} from '../../interfaces/storeTypes';

interface ShippingFormProps{
  shipping_address: ShipDest;
  handleChange: {
    (ev: any): any;
  }
}

export default function ShippingForm(props: ShippingFormProps){
  const shipping_address: ShipDest = props.shipping_address;
    return (
      <div className="col"> 
        <h5 className="display-5">Shipping Details:</h5>
        <div className="col-6 form-group">
          <label htmlFor="inputName">Name</label>
          <input type="text" className="form-control" name="name" value={shipping_address.name} onChange={props.handleChange}  required/>
        </div>
        <div className="col-6 form-group">
          <label htmlFor="inputName">Address 1</label>
          <input type="text" className="form-control" name="addr_1" value={shipping_address.addr_1} onChange={props.handleChange}  required/>
        </div>
        <div className='row'>
          <div className="col-4 form-group col-md-4">
            <label htmlFor="inputName">Address 2 <small>(optional)</small></label>
            <input type="text" className="form-control" name="addr_2" value={shipping_address.addr_2} onChange={props.handleChange}  />
          </div>
        </div>
        <div className="row">
          <div className="col-6 form-group ">
            <label htmlFor="inputName">City</label>
            <input type="text" 
              className="form-control" 
              name="city" 
              value={shipping_address.city} 
              onChange={props.handleChange}  
              required/>
          </div>
          <div className="col-2 form-group ">
            <label htmlFor="inputName">State</label>
            <input type="text" 
              className="form-control" 
              name="state" 
              value={shipping_address.state} 
              onChange={props.handleChange}  
              required/>
          </div>
        </div>
        <div className="row">
          <div className="col-4 form-group">
            <label htmlFor="zipcode">Zipcode</label>
            <input type="text" 
              className="form-control" 
              name="zipcode" 
              value={shipping_address.zipcode} 
              onChange={props.handleChange}  
              required/>
          </div>
          
        </div>
        <div className="row">
          <div className="col-6 form-group">
            <label htmlFor="zipcode">Email <small>(optional, for confirmation)</small></label>
            <input type="text" 
            className="form-control" 
            name="email" 
            value={shipping_address.email} 
            onChange={props.handleChange}  
            />
          </div>
        </div>
      </div>
    );
}
