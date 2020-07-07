
import React from 'react';
import {LineItem} from '../../interfaces/storeTypes';

import {toCurrency} from '../../interfaces/storeFormatters';

interface LineItemFormProps{
  lineItem: LineItem;
  handleChange: {
    (ev: any): any;
  }
}

export default function LineItemForm(props: LineItemFormProps){
    let lineItem = props.lineItem;
    return (
    
    <div className="row my-1">
        
        <div className='col-md-2'>
            <label htmlFor='qty-input'>Qty:</label>
        </div>
        <div className="col-md-4">                            
            <input className="form-control" id="qty" value={lineItem.qty} onChange={props.handleChange} type="number" name="qty" step={1}/>
        </div>

        <div className="row">
            <span>Sub Total: {toCurrency(lineItem.sub_total)}</span>
        </div>
       
    </div>
    );
}
