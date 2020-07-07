import React from 'react';
import ReactDOM from 'react-dom';
import FadeIn from "react-fade-in";
import {Product} from '../interfaces/storeTypes';
import ProductCard from './cards/productCard';

import ProductViewWindow from './productViewWindow'
import {productListEndpoint} from '../interfaces/storeEndpoints';



interface ProductAdminWindowState{
    products: Product[]
};
interface ProductAdminWindowProps{

};

 class ProductAdminWindow extends React.Component {
     props: ProductAdminWindowProps;
     state: ProductAdminWindowState;
    constructor(props){
        super(props);
        this.state = {
            products: []
        };
        this.getProducts = this.getProducts.bind(this);
        this.getProducts();
    }
      
    componentDidMount() {      
        this.getProducts();
    }

    componentWillUnmount() {
        
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

    static getDerivedStateFromError(error) {
            // Update state so the next render will show the fallback UI.
            return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
            // You can also log the error to an error reporting service
            console.log(errorInfo);
    }




    render() {
    let products;
    if(this.state.products.length > 0){
        products = this.state.products.map(
            (product: Product, i: number) => (
               <div className='col-md-6' key={i}>
                   <ProductCard updateCart={this.getProducts} product={product}/>
               </div>
           )
        )
    };   

      
        return(
            
             <div className="border ">
                 <h3 className="display-3">Products</h3>
                 <div className="d-flex flex-wrap">
                    {products}
                </div>
            </div>

        )
    }
}
export default ProductAdminWindow;