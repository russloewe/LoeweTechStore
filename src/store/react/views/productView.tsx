import React from 'react';
import {Product, ProductOption, LineItem, ProductDetails} from '../../interfaces/storeTypes';
import {toCurrency} from '../../interfaces/storeFormatters';


interface ProductViewProps{
    product: Product;
}

interface ProductViewState{
}

class ProductView extends React.Component{
    props: ProductViewProps;
    state: ProductViewState;

    constructor(props: ProductViewProps){
        super(props);
        

        // Map the array of product options to a key-value dict for lineitem
        var options = {};
        props.product.options.map((option: ProductOption) => {
            switch(option.type){
                case 'select':
                    options[option.label] = option.choices[0].label;
                    break;
                default:
                    options[option.label] = option.value;
            }
        });


        this.formatImages = this.formatImages.bind(this);

    }
    
    formatImages(image_urls: string[]){
        let images = image_urls.slice(1).map(
            (url, id) => (
            <div key={id} className="col-md-4">
            <img className="img-fluid" src={url} onClick={() => {this.setState({image: url})}}/>
            </div>));
        return(images);
    }

    render(){
        let product: Product = this.props.product;

        return(
            <div className='card' >
                <div className='card-header'>
                    <h4 className='card-title'>
                    {product.name}  {toCurrency(product.price)}
                    </h4>
                    
                </div>
                <div className='card-body'>
                    <div>
                    <img className='card-img-top' src={product.image_urls[0]} />
                    <p>
                        {product.description}
                    </p>
                    <div className="d-flex flex-row">
                    {this.formatImages(product.image_urls)}
                    </div>
                    </div>
                </div>
                <div className='card-footer'>
   
                </div>
            </div>
        )
    }
}
export default ProductView
