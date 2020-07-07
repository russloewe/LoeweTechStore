import React from 'react';
import FadeIn from "react-fade-in";
import {LineItem, Cart} from '../interfaces/storeTypes';
import {postHeaders} from '../../core/interfaces/coreInterface';
import * as Endpoints from '../interfaces/storeEndpoints';
import {toCurrency} from '../interfaces/storeFormatters';

import CartCard from './cards/cartCard';

interface CartViewWindowProps{
    cart: Cart;
    updateCart: {
        (): any;
    }
}

 class CartViewWindow extends React.Component {
    props: CartViewWindowProps;
    constructor(props){
        super(props);
        this.clearCart = this.clearCart.bind(this);
        this.countItems = this.countItems.bind(this);
    }

    componentDidMount(){
        this.props.updateCart();
    }

    countItems(){
        var itemCount: number;
        switch(this.props.cart.items.length){
            case 0:
                itemCount = 0;
                break;
            case 1:
                itemCount = this.props.cart.items[0].qty;
                break;
            default:
                itemCount = this.props.cart.items.map((item) => (item.qty)).reduce((x,y) => (x + y));
        };
        return itemCount;
    };

    clearCart(event){
        event.preventDefault();
        fetch(Endpoints.ClearCart, {
            method: "POST",
            headers: postHeaders,
            body: JSON.stringify({})
          }).then( (res) => {
              if(res.status == 200){
                  console.log('Cart cleared');
                  this.props.updateCart();
              }else{
                  console.log("Error clearing cart");
              }
            })
    }
     
    render() {
      
        var items = [];
        if(this.props.cart.items.length > 0){
            items =  this.props.cart.items.map(  
                    (item: LineItem, i: number) => (
                    <FadeIn key={i}>
                        <CartCard updateCart={this.props.updateCart} item={item} index={i}/>
                    </FadeIn>
                )
            );
        };
      
        return(
            
             <div className="border ">
                 <h1 className="display-3">Cart</h1>
                 
                 <div className="d-flex flex-column">
                    {items}
                </div>
                <div>
                     <h2>
                        {this.props.cart.item_count}
                            <small> item{this.props.cart.item_count==1? '': 's'} for </small>
                        {toCurrency(this.props.cart.total)}
                     </h2>
                     
                 </div>
                <div>
                    <button className="btn btn-primary" onClick={this.clearCart}>Clear Cart</button>
                </div>
            </div>

        )
    }
}
export default CartViewWindow;