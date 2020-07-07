
/* filename:     auth.js
 * author:  russell loewe
 * project: WebApp
 * github: http://github.com/russloewe/WebApp
 * desc:   
 * 	
 * Web API to authorize users
 * 	
 */

import {Order, newStripeCharge,  LineItem,
        ShipDest, StripeChargeStatus, StripeWebhookData,
        SupportedCurrency, PaymentIntent,
        Cart,
        StripeEventTypes,
        StripeEvent} from '../interfaces/storeTypes';
import {ErrorCode, 
    OrderCheckoutReq, OrderCheckoutRes,
    CheckoutResponse, OrderControllerOptions,
        PaymentIntentWebhookReq, PaymentWebhookRes, 
    GetOrderReq, GetOrderRes, GetOrderPayload,
    UpdateOrderReq, UpdateOrderRes, UpdateOrderPayload,
        CheckoutErrorCode} from '../interfaces/storeInterface';




interface OrderControllerInterface{
    config:{
        (options: OrderControllerOptions): any;
    };
    checkout:{
        (req: OrderCheckoutReq, res: OrderCheckoutRes): any;
    };
    webhookPaymentIntent: {
        (req: PaymentIntentWebhookReq, res: PaymentWebhookRes ): any;
    };
    handleSuccessfulOrder: {
        (order: Order ): any;
    };
    handleFailedOrder: {
        (order: Order): any;
    };
    postUpdateOrder: {
        (req: UpdateOrderReq, res: UpdateOrderRes ): any;
    }
}

export default class OrderController implements OrderControllerInterface{
    dbCon: any;
    itemCon: any;
    stripeCon: any;
    mailCon: any;

    constructor(){
        this.config = this.config.bind(this);
        this.checkout = this.checkout.bind(this);
        this.getOrders = this.getOrders.bind(this);
        this.webhookPaymentIntent = this.webhookPaymentIntent.bind(this);
        this.handleSuccessfulOrder = this.handleSuccessfulOrder.bind(this);
        this.handleFailedOrder = this.handleFailedOrder.bind(this);
        this.postUpdateOrder = this.postUpdateOrder.bind(this);

    }
 
    config(options: OrderControllerOptions){
        this.dbCon = options.knexClient;
        this.stripeCon = options.stripeClient;
        this.mailCon = options.mailClient;
    }
    
    async postUpdateOrder(req: UpdateOrderReq, res: UpdateOrderRes){
        if(!req.isAuthenticated){
            return(res.sendStatus(ErrorCode.authError));
        };

        let order: Order;
        try{
            let data: UpdateOrderPayload = req.body;
            order = data.order;
        }catch(err){
            return(res.sendStatus(ErrorCode.badReq))
        };
        console.log("order: ", order);
        try{
            await this.dbCon('orders')
                .where('id', order.id)
                .update({
                    shipped: order.shipped,
                    ship_tracking: order.ship_tracking
                });
            res.sendStatus(200);
        }catch(err){
            return(res.sendStatus(ErrorCode.modelError))
        }
    }

    async checkout(req: OrderCheckoutReq, res: OrderCheckoutRes){
        if(!req.session){
            console.log("no session");
            return(res.sendStatus(ErrorCode.badReq))};
        if(!req.session.cart){
            console.log("no cart in session");
            return(res.sendStatus(ErrorCode.badReq))};
        if(!req.session.ship_to){
            console.log('no shiping address in cart');
            return(res.sendStatus(ErrorCode.badReq))};

        // Step 1: create order in database, get ID
        var order: Order = {
            ship_to: req.session.ship_to,
            shipped: false,
            customer: req.session.customer,
            cart: req.session.cart
        };
        let orderId: number; // Place holder for order id if created
        try{
            var ids = await this.dbCon('orders').returning('id').insert(order);
            orderId = ids[0];
            //console.log("Order Created: " + orderId);
        }catch(err){
            // If order isn't created 
            console.log(err);
            let error: CheckoutResponse = {
                error: true,
                error_code: CheckoutErrorCode.orderError,
                error_message: 'Error creating order',
                error_details: JSON.stringify(err)
            };
             return(res.json(error))
        };

        // Step 2: insert LineItems to database, ref to order id
        let items = order.cart.items
            .map((item: LineItem) => ({
                        product_id: item.product_id,
                        order_id: orderId,
                        qty: item.qty,
                        sub_total: item.sub_total,
                        options: item.options})
                );
        let lineitemIds: string[];
        try{ 
            lineitemIds = await this.dbCon('line_items').returning('id').insert(items);
           // console.log("Line item(s) succesfully inserted in database: " + lineitemIds);
        }catch(err){
            // If lineitems aren't inserted
            console.log(err);
            let error: CheckoutResponse = {
                error: true,
                error_code: CheckoutErrorCode.lineItemError,
                error_message: 'Error reserving items in order',
                error_details: JSON.stringify(err)
            };
        
            return(res.json(error))
        }
 
        req.session.order = order;
        // At this point there should be an order in the database and line items added to the 
        // lineitem table, thus securing stock.

        // Step 3 Create payment intent with stripe
        const total = order.cart.total;
        const fee = total * 0.05; // for connected accounts

        var paymentIntentReq = {
            payment_method_types: ['card'],
            amount:  order.cart.total,
            currency: 'usd',
            statement_descriptor: 'YeetWood Store',
            metadata: {
                'order_id': orderId,
                'email': order.customer.email},
            receipt_email: order.customer.email,
            shipping:{
                name: order.customer.name,
                address: {
                    line1: order.ship_to.addr_1,
                    line2: order.ship_to.addr_2,
                    city: order.ship_to.city,
                    postal_code: order.ship_to.zipcode,
                    state: order.ship_to.state
                },           
            },
           // application_fee_amount: parseInt(fee as unknown as string),
           // transfer_data: {
           //     destination: 'acct_1GyrQZAmAiQcNayc',
           // }
        };
        var paymentIntentOptions = {
          //  idempotency_key: "order_"+order.id
        }
        let paymentIntent;
        try{
            paymentIntent = await this.stripeCon.paymentIntents.create(paymentIntentReq);
        }catch(err){
            // If cant create charge with stripe
            console.log(err);

            // Delete the order from the database
            // The DB will cascade delete the line_items and restore stock qty
            try{
                await this.dbCon('orders').where('id', orderId).del();  
            }catch(err){
                console.log('Error deleting DB order: ', orderId);
            };
            
            
            let error: CheckoutResponse = {
                error: true,
                error_code: CheckoutErrorCode.stripeError,
                error_message: 'Error creating charge with processor: '+err.message,
                error_details: err
            };
             return(res.json(error))
        }

        // at this point the order is in the db and stripe has confirmed the charge
        // if order succesful, update charge status in database

        // Step 4, update the status of the order in the database
        try{
            //console.log("Updating order: " + orderId);
            await this.dbCon('orders').where('id', orderId).update({
                charge_id: paymentIntent.id,
                charge_status: 'pending'
            });
        }catch(err){
             // If we cant update order in db
             console.log(err);
             let error: CheckoutResponse = {
                 error: true,
                 error_code: CheckoutErrorCode.orderError,
                 error_message: 'Error finilazing order',
                 error_details: JSON.stringify(err)
             };
              return(res.json(error))
        };

        // At this point everything was successfull
    
        // Step 5 send client secret to client 
        let success: CheckoutResponse = {
            error: false,
            order_id: orderId,
            client_secret: paymentIntent.client_secret
        };
        return(res.json(success));                                                                                                                                                                                                                                                                                                                                                                                                                                            
    }
      
    async getOrders(req: GetOrderReq, res: GetOrderRes){
        if(!req.user || (req.user.user_type < 2)){
            return(res.sendStatus(ErrorCode.authError));
        };
        let orders;
        try{
            orders = await this.dbCon('orders').where('id', '>', -1);
            
        }catch(err){
           // console.log(err);
            return(res.sendStatus(ErrorCode.modelError));
        }
        let data: GetOrderPayload = {
            orders: orders
        }
        return(res.json(data));
    };

    async handleFailedOrder(order: Order){
        // Delete the order from the database
        // The DB will cascade delete the line_items and restore stock qty
        try{
            await this.dbCon('orders').where('id', order.id).del();  
        }catch(err){
            console.log('Error deleting DB order: ', order.id);
        };
    }

    async handleSuccessfulOrder(order: Order ){
        if(order.customer.email){
            let emailMessage ={
                from: '"Loewe Mailer" <support@loewetechsoftware.com>', // sender address
                to: order.customer.email, // list of receivers
                subject: "LoeweTech Contact", // Subject line
                text: "Order confirmation for order number: " + order.id + "cart: " + JSON.stringify(order.cart), // plain text body
                html: "<h2>Order Successful!</h2>"+
                "<h3>Order id: "+order.id+"</h3>"+
                "<p>cart: "+ JSON.stringify(order.cart)+"</p>" // html body
            }; 
            let info;
            try{
                info = await this.mailCon.sendMail(emailMessage);
            }catch(err){
                console.log(err);
            };

            console.log('Confirmation email sent');
            console.log(info);

        } 
    }

    async webhookPaymentIntent(req: PaymentIntentWebhookReq, res: PaymentWebhookRes){
        
        // Step one, pull event id from request body, ignore events we dont care about
        let event_id;
        try{
            const event: StripeEvent = req.body;
            event_id = event.id;
            switch(event.type){
                case StripeEventTypes.payment_failed:
                case StripeEventTypes.payment_succeeded:
                    console.log('Webhook event: ', event.type, event.id);
                    break;
                default:
                    console.log('Ignoring event: ', event.type, event.id);
                    return(res.sendStatus(ErrorCode.badReq))
            }
        }catch( err){
            return(res.sendStatus(ErrorCode.badReq))
        };

        // Step two, use the event_id to retrieve the event from Stripe directly for security
        let event: StripeEvent;
        let paymentIntent: PaymentIntent;
        try{
            event = await this.stripeCon.events.retrieve(event_id);
            paymentIntent = event.data.object;
            console.log('Payment id',event.type, paymentIntent.id);
        }catch( err){
            console.log('Unable to retrieve Event from stripe server: ', event_id);
            return(res.sendStatus(ErrorCode.badReq))
        };

        // Step 2.5, check to see if this is a connected paymnet
        let account;
        try{
            account = paymentIntent.transfer_data.destination;

        }catch(err){
            // do nothing
        }

        // Step 3 Retrieve order from our database
        let order: Order;
        try{
            let orders = await this.dbCon('orders').where('charge_id', paymentIntent.id);
            order = orders[0];
            console.log('Processing webhook for order: ', order.id);
        }catch(err){
            console.log(err);
            return(res.sendStatus(ErrorCode.badReq));
        }
        
        // Step 4, check to see if we need to update the order status
        if(paymentIntent.status == order.charge_status){
            // Nothing to update
            return(res.sendStatus(304));
        }

        // Step 5, Update the order charge_status in the Loewetech database 
        try{
            await this.dbCon('orders').where('charge_id', paymentIntent.id)
                        .update('charge_status', paymentIntent.status);
        }catch(err){
            console.log(err);
            return(res.sendStatus(ErrorCode.controllerError));
        }

        // Step 6, handle the change with a switch statement
        try{
            switch(event.type){
                case StripeEventTypes.payment_succeeded:
                    this.handleSuccessfulOrder(order);
                    break;
                case StripeEventTypes.payment_failed:
                    this.handleFailedOrder(order);
                    break;
                default:
                    console.log('No Effect.');
            }
        }catch(err){
            return(res.sendStatus(ErrorCode.controllerError))
        }
        
 
        return(res.sendStatus(200));
    }



};



