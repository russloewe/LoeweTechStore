
import React from 'react';
import ReactDOM from 'react-dom';

import ProductViewWindow from './productViewWindow'
import CartViewWindow from './cartViewWindow';
import {productListEndpoint, 
        getCartEndpoint} from '../interfaces/storeEndpoints';
import {Product, Cart, StripeChargeStatus} from '../interfaces/storeTypes';
import {User} from '../../core/interfaces/userInterface';
import CheckoutViewWindow from './checkoutViewWindow';

interface StoreAppState{
    hasError: boolean,
    products: Product[];
    cart?: Cart;
    user?: User;

}

class StoreApp extends React.Component{
    state: StoreAppState;
    timerID: any;
    constructor(props){
        super(props);
        
        this.state = {
            hasError: false,
            products: [],
            cart: {
                item_count: 0,
                items: [],
                charge_status: StripeChargeStatus.none,
                total: 0.0
            }
        };
        this.getCart = this.getCart.bind(this);
        this.getProducts = this.getProducts.bind(this);
        this.getProducts();
    }

    componentDidMount() {      
        this.timerID = setInterval(() => this.tick(), 3000)
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
      }

    static getDerivedStateFromError(error) {
            // Update state so the next render will show the fallback UI.
            return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
            // You can also log the error to an error reporting service
            console.log("Store Error");
            console.log(errorInfo);
    }
    

    tick(){
     // this.getCart();
    }


    getCart(){
        fetch(getCartEndpoint)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log(data.items);
            this.setState({cart: data})
        })

    }

    getProducts(){
        fetch(productListEndpoint)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            this.setState({products: data})
        })

    }



    render(){
        if (this.state.hasError) {
            //fallback UI
            return <h1>Something went wrong.</h1>;
        }

        return(
            <div>
                <ProductViewWindow products={this.state.products} updateCart={this.getCart} />
                <CartViewWindow updateCart={this.getCart} cart={this.state.cart}/>
                <CheckoutViewWindow />

            </div>
        )
    }
}

export default StoreApp;