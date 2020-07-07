import React from 'react';
import ReactDOM from 'react-dom';
import FadeIn from "react-fade-in";
import {Product} from '../interfaces/storeTypes';
import StoreCard from './cards/storeCard'

interface ProductViewWindowProps{
    products: Product[];
    updateCart: {
        (): any;
    };
};


 class ProductViewWindow extends React.Component {
     props: ProductViewWindowProps;
    constructor(props){
        super(props);
    }
      
    render() {
    let products;
    if(this.props.products.length > 0){
        products = this.props.products.map(
            (product: Product, i: number) => (
               <div className='col-md-4' key={i}>
                   <StoreCard updateCart={this.props.updateCart} product={product}/>
               </div>
           )
        )
    };   

      
        return(
            
             <div className="border ">
                 <h1 >Products</h1>
                 <div className="d-flex flex-wrap">
                    {products}
                </div>
            </div>

        )
    }
}
export default ProductViewWindow;