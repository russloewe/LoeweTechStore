import React from 'react';
import {postHeaders} from '../../core/interfaces/coreInterface';
import ShippingForm from './forms/shippingForm';
import {getOrdersEndpoint } from '../interfaces/storeEndpoints';
import {GetOrderPayload} from '../interfaces/storeInterface';
import {ShipDest, Order} from '../interfaces/storeTypes';
import OrderCard from './cards/orderCard';

interface OrderViewState{
  orders: Order[];
}
interface OrderViewProps{
  order: Order;
}


class OrderView extends React.Component {
  state: OrderViewState;
  props: OrderViewProps;
  
  constructor(props) {
    super(props);
    this.state = {
      orders: []
    }
    this.getOrders = this.getOrders.bind(this);
  }

  componentDidMount() {      
    this.getOrders();
  }

  async getOrders(){
    await fetch(getOrdersEndpoint)
        .then((response) => {
            return response.json();
        })
        .then((data: GetOrderPayload) => {
           // console.log(data.orders);
            this.setState({orders: Object.assign([], data.orders)})
        })
        .catch((err) => {
          console.log('No orders;');
        })
  }



  render() { 
    let orders = this.state.orders;
    let orderList;
     
    try{
      if(orders.length < 1){
        orderList = <h3>No Orders</h3>;
       }else{
        orderList = this.state.orders.map((order) => (<OrderCard key={order.id} order={order} triggerUpdate={this.getOrders} />));
       }
    }catch(err){
      console.log(err);
      orderList = '';
    }
    

    return (
      <div className="col"> 
      <h2>Orders</h2>
      {orderList}
      </div>
    );
  }
}

export default OrderView;
