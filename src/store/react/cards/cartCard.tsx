import React from 'react';
import ReactDOM from 'react-dom';
import FadeIn from "react-fade-in";
import {Product, ProductOption, LineItem,
    LineItemOptionValues, ProductDetails, ProductOptions} from '../../interfaces/storeTypes';
import * as Endpoints from '../../interfaces/storeEndpoints';
import {postHeaders} from '../../../core/interfaces/coreInterface';
import {CartUpdateRes, RemoveItemReqPayload} from '../../interfaces/storeInterface';
import {toCurrency} from '../../interfaces/storeFormatters';

import LineItemView from '../views/lineItemView';

class CartCardProps{
    item: LineItem;
    index: number;
    updateCart: {
        (): any;
    }
}
class CartCardState{
    item: LineItem;
}



class CartCard extends React.Component{
    props: CartCardProps;
    state: CartCardState;

    constructor(props: CartCardProps){
        super(props);
        this.state = {
            item: props.item
        }
        this.removeItem = this.removeItem.bind(this);
        this.itemOptions = this.itemOptions.bind(this);

    }

    itemOptions(options: LineItemOptionValues){
        return(
            Object.entries(options).map((option, id) =>(
                <div className='row' key={id}>
                    <span>{option[0]}: {option[1]}</span>
                </div>
            ))
        )
    }
    removeItem(event){
        event.preventDefault();
        let payload: RemoveItemReqPayload = {item: this.props.index};
        fetch(Endpoints.postRemoveItem, {
            method: "POST",
            headers: postHeaders,
            body: JSON.stringify(payload)
          }).then( (res) => {
              if(res.status == 200){
                  console.log('Item cleared');
                  this.props.updateCart();
              }else{
                  console.log("Error clearing  item");
              }
            })
    }
    render(){
        let item: LineItem = this.state.item;

        return(
            <div className='card'>

                <LineItemView item={item} />

                <div>
                <button className="btn btn-primary" onClick={this.removeItem}>remove item</button>
                </div>
                        
                  
            </div>
        )
    }
};
export default CartCard;
