/* filename:     auth.js
 * author:  russell loewe
 * project: WebApp
 * github: http://github.com/russloewe/WebApp
 * desc:   
 * 	
 * Web API to authorize users
 * 	
 */

import {Cart, Product, LineItem, StripeChargeStatus} from '../interfaces/storeTypes';
import {ErrorCode, CartUpdateReq, CartUpdateRes, CartRemoveItemReq,
        CartAddItemReq, CardAddShippingReq, CartClearReq,
        CartGetReq, CartGetRes} from '../interfaces/storeInterface';

function countTotal(items: LineItem[]){
    var total:number;
    switch(items.length){
        case 0:
            total = 0;
            break;
        case 1:
            total = items[0].sub_total;
            break;
        default:
            total = items.map( (item) => (item.sub_total)).reduce((x,y) => (x+y));
    };
    return total;
};

function countItems(items: LineItem[]){
    var total:number;
    switch(items.length){
        case 0:
            total = 0;
            break;
        case 1:
            total = items[0].qty;
            break;
        default:
            total = items.map( (item) => (item.qty)).reduce((x,y) => (parseInt(x as unknown as string) + parseInt(y as unknown as string)));
    };
    return total;
};

interface CartControllerOptions{
    knexClient: any;
}

interface CartControllerInterface{
    config: {
        (options: CartControllerOptions): any;
    };
    getCart: {
        (req: CartGetReq, res: CartGetRes): any;
    };
    addItem: {
        (req: CartAddItemReq, res: CartUpdateRes): any;

    };
    postClearCart: {
        (req: CartClearReq, res: CartUpdateRes): any;
    };
    postRemoveItem: {
        (req: CartRemoveItemReq, res: CartUpdateRes): any;
    };
}
export default class CartController implements CartControllerInterface{
    dbCon: any;

    constructor(){
        this.getCart = this.getCart.bind(this);
        this.addItem = this.addItem.bind(this);
        this.postClearCart = this.postClearCart.bind(this);
        this.postRemoveItem = this.postRemoveItem.bind(this);
        this.config = this.config.bind(this);
    }

    config(options: CartControllerOptions){
        this.dbCon = options.knexClient;
    }

    postClearCart(req: CartClearReq, res: CartUpdateRes){
        if(!req.session){
            console.log('no session');
            return(res.sendStatus(ErrorCode.badReq))
        };
        var cart: Cart = {
                items: [],
                total: 0,
                item_count: 0,
                charge_status: StripeChargeStatus.none
            };
        req.session.cart = cart;
        return(res.sendStatus(200));
    }

    postRemoveItem(req: CartRemoveItemReq, res: CartUpdateRes){
        if(!req.session || !req.session.cart ){
            console.log('no session');
            return(res.sendStatus(ErrorCode.badReq))
        };
        if( !req.body ){
            console.log('no item in request body');
            return(res.sendStatus(ErrorCode.badReq))
        };
        try{
            let dropItem: number = req.body.item;
            var newitems = req.session.cart.items.filter( (item: LineItem, i: number) => (i != dropItem) );   
            req.session.cart.items = newitems;
            req.session.cart.total = countTotal(newitems);
            req.session.cart.item_count = countItems(newitems);
         console.log(req.session.cart.items);
            return(res.sendStatus(200));
        }
        catch(err){
            console.log(err);
            return(res.sendStatus(ErrorCode.controllerError));
        }

    }


    async addItem(req: CartAddItemReq, res: CartUpdateRes){
        // Step 1, retreive item from request body
        let item: LineItem;
        try{
            item = req.body;
            if(isNaN(item.product_id)){throw 'no product number'};
        }catch(err){
            return(res.sendStatus(ErrorCode.badReq))
        };

        // Step 2, retrieve price directly from database
        let product;
        try{
            let products = await this.dbCon('products').select('price').where('id', item.product_id);
            console.log(products);
            product = products[0];
        }catch(err){
            return(res.sendStatus(ErrorCode.modelError));
        };

        // Step 3, change price on line item from client
        try{
            item.sub_total = item.qty * product.price;
        }catch(err){
            return(res.sendStatus(ErrorCode.modelError));
        }


        let cart: Cart;
        try{
            if(!req.session.cart || !req.session.cart.items){
                cart = {
                    items: [item],
                    item_count: item.qty,
                    total: item.sub_total,
                    charge_status: StripeChargeStatus.none
                };
                req.session.cart = cart;
                return(res.sendStatus(200));
            }else{
                req.session.cart.items.push(item);
                req.session.cart.total = countTotal(req.session.cart.items);
                req.session.cart.item_count = countItems(req.session.cart.items);
                return(res.sendStatus(200)); 
            }
        }catch(err){
            return(res.sendStatus(ErrorCode.controllerError))
        }
    }
        

    getCart(req: CartGetReq, res: CartGetRes){
        if(!req.session){
            return(res.sendStatus(ErrorCode.badReq))
        };
        var cart: Cart;
        try{
            cart = req.session.cart;
            if(isNaN(cart.total)){throw 'bad cart'}
        }catch(err){
            cart = {
                items: [],
                total: 0,
                item_count: 0,
                charge_status: StripeChargeStatus.none
            };
            req.session.cart = cart;
        };

        res.json(cart);
    }
};



