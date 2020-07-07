import React from 'react';
import ReactDOM from 'react-dom';
import FadeIn from "react-fade-in";
import {ErrorCode} from '../../../core/interfaces/baseTypes';
import {postHeaders} from '../../../core/interfaces/coreInterface';
import {Product, ProductOption, LineItem, ProductDetails} from '../../interfaces/storeTypes';
import {addItemEndpoint, productListEndpoint} from '../../interfaces/storeEndpoints';
import {toCurrency} from '../../interfaces/storeFormatters';
import ItemOptionForm from '../forms/itemOptionForm';
import ProductView from '../views/productView';
import LineItemForm from '../forms/lineItemForm';

interface StoreCardProps{
    product: Product;
    updateCart: {
        (): any;
    }
}

interface StoreCardState{
    lineItem: LineItem;
    image: string;
}

class StoreCard extends React.Component{
    props: StoreCardProps;
    state: StoreCardState;

    constructor(props: StoreCardProps){
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
            product_options: props.product.options,
            qty: 1            
        };

        this.state = {
            lineItem: initLineItem,
            image: props.product.image_urls[1]
        };

        this.handleOptionChange = this.handleOptionChange.bind(this);
        this.updateTotal = this.updateTotal.bind(this);
        this.addItem = this.addItem.bind(this);
    }


    updateTotal(event){
        // upate the lineitem qty and update the price 
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
                <ProductView product={product}/>
                <h6>Options</h6>
                <ItemOptionForm  options={lineItem.product_options} values={lineItem.options} onChange={this.handleOptionChange} />
                <LineItemForm lineItem={lineItem} handleChange={this.updateTotal} />
                <div className="col-md-3">
                    <button type='button' className='btn btn-primary text-small' onClick={this.addItem} >
                    <small>Add to cart</small>
                    </button>
                </div>
            </div>
        )
    }
}
export default StoreCard
