import React from 'react';
import ReactDOM from 'react-dom';
import FadeIn from "react-fade-in";
import {ErrorCode} from '../../../core/interfaces/baseTypes';
import {postHeaders} from '../../../core/interfaces/coreInterface';
import {Product, ProductOption, LineItem, ProductDetails} from '../../interfaces/storeTypes';
import {addItemEndpoint, productListEndpoint} from '../../interfaces/storeEndpoints';
import {toCurrency} from '../../interfaces/storeFormatters';



interface ProductFormProps{
    product: Product;
}

interface ProductFormState{
    product: Product;
}

class ProductForm extends React.Component{
    props: ProductFormProps;
    state: Product;

    constructor(props: ProductFormProps){
        super(props);

        this.state = props.product;

        this.handleChange = this.handleChange.bind(this);
        this.onUpdateImg = this.onUpdateImg.bind(this);
    }
    
 

    onUpdateImg (event) {
        let i: number = parseInt(event.target.name);
        let value: string = event.target.value;
        // i - array index of target image 
        // j - array index place holder for mapping
        this.setState( (state: Product) => {
            const image_urls = state.image_urls.map((item, j) => {
                if(i == j){
                    return(value);
                }else{
                    return(item);
                }
            });
            return {
                image_urls,
            };
        })
        };
    



    handleChange(event){
        const target = event.target;
        const name = target.name;
        const value = name === 'published'? target.checked : target.value;
        this.setState({
            [name]: value
        })
    }



   
   
    render(){

        //let details: ProductDetails = this.state.details;
        return(
            <div className='card' >
        <div className="col"> 
        <h5 className="display-4 border">Product:</h5>
        <div className="col-6 form-group">
          <label htmlFor="inputName">Name</label>
          <input type="text" className="form-control" name="name" value={this.state.name} onChange={this.handleChange}  required/>
        </div>
        <div className="col-6 form-group">
          <label htmlFor="inputName">Description</label>
          <textarea className="form-control" id="form-contact-message" value={this.state.description} onChange={this.handleChange} rows={5} name="description" required={true}></textarea>
        </div>
        <div className="row">
          <div className="col-6 form-group">
            <label htmlFor="price">price:</label>
            <input type="number" className="form-control" name="price" value={this.state.price} onChange={this.handleChange}  required/>
          </div>
          
        </div>
        <div className="row">
          <div className="col-6 form-group">
            <label htmlFor="published">published:</label>
            <input type="checkbox" className="form-control" name="published" checked={this.state.published} onChange={this.handleChange}  required/>
          </div>
          
        </div>
      </div>


                    </div>

        )
    }
}
export default ProductForm
