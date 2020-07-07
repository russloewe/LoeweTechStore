import {Order} from '../interfaces/storeTypes';

interface OrderFunc {
    (order: Order): Promise<Order>;
}

interface OrderModelInterface{
    knex: any;
    addOrder: OrderFunc;
    delOrder: any;
    config: any;
}
interface OrderModelOptions{
    knexClient: any
}

class orderModel implements OrderModelInterface{
    knex: any;
    constructor(){
        this.addOrder = this.addOrder.bind(this);
        this.delOrder = this.delOrder.bind(this);
        this.config = this.config.bind(this);
    }

    config(options: OrderModelOptions){
        this.knex = options.knexClient;
    };
    

    async addOrder(order: Order){
        try{
            let success = await this.knex.insert(order);
            return(Promise.resolve(success))
        }catch(err){
            return(new Promise( (res, rej) => {rej(err)}))
        }
    }
    
    async delOrder(order: Order){
        try{
            let success = await this.knex.where(order).del();
            return(Promise.resolve(success))
        }catch(err){
            return(new Promise( (res,rej) => {rej(err)}))
        }
    }
}


module.exports = new orderModel();
