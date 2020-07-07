import React from 'react';
import ReactDOM from 'react-dom';
import FadeIn from "react-fade-in";
import {ErrorCode} from '../../../core/interfaces/baseTypes';
import {postHeaders} from '../../../core/interfaces/coreInterface';
import {Product, ProductOption, LineItem, ProductDetails} from '../../interfaces/storeTypes';
import {addItemEndpoint, productListEndpoint} from '../../interfaces/storeEndpoints';
import {toCurrency} from '../../interfaces/storeFormatters';
import ProductOptionInput from '../forms/productOptionForm';
import ProductForm from '../forms/productForm';

interface ProductCardProps{
    product: Product;
    updateCart: {
        (): any;
    }
}

interface ProductCardState{
    lineItem: LineItem;
    image: string;
}

class ProductCard extends React.Component{
    props: ProductCardProps;
    state: ProductCardState;

    constructor(props: ProductCardProps){
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

        let initLineItem: LineItem = {
            product_id: props.product.id,
            sub_total: props.product.price,
            name: props.product.name,
            thumb_url: props.product.image_urls[0],
            options: options,
            qty: 1            
        };

        this.state = {
            lineItem: initLineItem,
            image: props.product.image_urls[1]
        };

        this.handleOptionChange = this.handleOptionChange.bind(this);
        this.updateTotal = this.updateTotal.bind(this);
        this.formatImages = this.formatImages.bind(this);
        this.addItem = this.addItem.bind(this);
    }
    
    formatImages(image_urls: string[]){
        let images = image_urls.slice(1).map(
            (url, id) => (
            <div key={id} className="col-md-4">
            <img className="img-fluid" src={url} onClick={() => {this.setState({image: url})}}/>
            </div>));
        return(images);
    }


    updateTotal(event){
        let qty: number = event.target.value;
        let price: number = this.props.product.price;
        let total: number = qty * price;
        var newLineItem = this.state.lineItem;
        newLineItem.qty = qty;
        newLineItem.sub_total = total;
        this.setState({
            lineItem: newLineItem
        })
    }

    handleOptionChange(event){
        const target = event.target;
        const name = target.name;
        const value = target.value;
        var newLineItem = this.state.lineItem;
        newLineItem.options[name] = value;
        this.setState({
            lineItem: newLineItem
        })
    }


    addItem(){
        fetch(addItemEndpoint, {
            method: 'POST',
            headers: postHeaders,
            body: JSON.stringify(this.state.lineItem)
        }).then( (res) => {
                if(res.status == 200){
                   this.props.updateCart();
                   console.log(res);
                } else{
                    console.log(res) 
               }
        } )
    }

   
   
    render(){
        let product: Product = this.props.product;
        //let details: ProductDetails = this.state.details;
        let lineItem = this.state.lineItem;

        return(
            <div className='card' >
                <ProductForm product={product} />

                <div className="col-md-3">
                    <button type='button' className='btn btn-primary text-small' onClick={this.addItem} >
                        <small>Add to cart</small>
                    </button>
                </div>
            </div>
        )
    }
}
export default ProductCard
