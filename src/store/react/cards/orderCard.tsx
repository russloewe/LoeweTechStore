import React from 'react';
import ReactDOM from 'react-dom';
import FadeIn from "react-fade-in";
import {ErrorCode} from '../../../core/interfaces/baseTypes';
import {postHeaders} from '../../../core/interfaces/coreInterface';
import { ProductOption, LineItem, ProductDetails, Order} from '../../interfaces/storeTypes';
import {postUpdateOrder} from '../../interfaces/storeEndpoints';
import {toCurrency} from '../../interfaces/storeFormatters';
import LineItemView from '../views/lineItemView';
import ShippingView from '../views/shippingView';
import OrderForm from '../forms/orderForm';
import { UpdateOrderPayload } from '../../interfaces/storeInterface';

interface OrderCardProps{
    order: Order;
    triggerUpdate: () => any;

}

interface OrderCardState{
   
}

class OrderCard extends React.Component{
    props: OrderCardProps;
    state: Order;

    constructor(props: OrderCardProps){
        super(props);
        this.state = props.order;
        this.handleChange = this.handleChange.bind(this);
        this.updateOrder = this.updateOrder.bind(this);

    }

    handleChange(event){
        const target = event.target;
        const name = target.name;
        console.log(name);
        const value = name === 'shipped'? target.checked : target.value;
        this.setState({
            [name]: value
        })

    }

    updateOrder(){
        let payload: UpdateOrderPayload = {
            order: this.state
        }

        fetch(postUpdateOrder, {
            method: 'POST',
            headers: postHeaders,
            body: JSON.stringify(payload)
        }).then( (res) => {
                if(res.status == 200){
                   this.props.triggerUpdate();
                   console.log(res);
                } else{
                    console.log(res) 
               }
        } )
    }

    render(){
        let order: Order = this.state; //this.props.order
        let itemList;
        try{
            itemList = order.cart.items.map((item, index) => (
                <div key={index}>
                    <hr/>
                    <LineItemView item={item} />
                </div>
                    ))
        }catch(err){
            itemList = "";
        }

        return(
            <div className='card' >
                <div className='card-header'>
                    <h2>Order: {order.id}</h2>
                                      
                </div>
                <div className='card-body'>
                    <div>
                        <h3>Payment</h3>
                        <div>
                            <label>Payment Status: </label>
                            {order.charge_status}
                        </div>
                        <div>
                            <label>Payment ID: </label>
                            {order.charge_id}
                        </div>

                        <div>
                            <label>Total: </label>
                            {order.cart.total}
                        </div>
                    </div>
                    
                    <div> 
                        <h3>Shipping Information</h3>
                        <ShippingView shipping={order.ship_to} />
                    </div>
                    <div>
                        <h3>Items:</h3>
                        {itemList}  
                        <hr/> 
                    </div>
                    <div>
                        <h3>Shipping Status:</h3>
                        <div>
                            <label>Shipped: </label> {this.props.order.shipped == true? 'yes' : 'no'}
                        </div>
                        <div>
                            <label>Tracking number: </label> {this.props.order.ship_tracking}
                        </div>
                    </div>
                    <OrderForm order={order} handleChange={this.handleChange} />
                    
                    <div>
                <button className="btn btn-primary" onClick={this.updateOrder}>Update Shipping Status</button>
                </div>

                </div>
            </div>
        )
    }
}
export default OrderCard
