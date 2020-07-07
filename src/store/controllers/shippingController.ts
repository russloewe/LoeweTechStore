/* filename:     auth.js
 * author:  russell loewe
 * project: WebApp
 * github: http://github.com/russloewe/WebApp
 * desc:   
 * 	
 * Web API to authorize users
 * 	
 */

import {Cart, StripeChargeStatus, ShipDest} from '../interfaces/storeTypes';
import {ErrorCode, ShippingPayload, ShippingControllerResponse,
        ShippingGetReq, ShippingUpdateReq,
        CartGetReq, CartGetRes} from '../interfaces/storeInterface';


interface shippingControllerInterface{
    getShipping: {
        (req: ShippingGetReq, res: ShippingControllerResponse): any;
    },
    postAddShipping: {
        (req: ShippingUpdateReq, res: ShippingControllerResponse): any;

    }
}
export default class ShippingController implements shippingControllerInterface{

    constructor(){
        this.getShipping = this.getShipping.bind(this);
        this.postAddShipping = this.postAddShipping.bind(this);
    }


    postAddShipping(req: ShippingUpdateReq, res: ShippingControllerResponse){
        if(!req.session){
            console.log('no session');
            return(res.sendStatus(ErrorCode.badReq))};
        if(!req.body){
            console.log('no request body');
            return(res.sendStatus(ErrorCode.badReq))};
        if(!req.body.shipping){
            console.log('no shipping info in payload');
            return(res.sendStatus(ErrorCode.badReq))}; 
        if(!req.body.customer){
            console.log('no customer info in payload');
            return(res.sendStatus(ErrorCode.badReq))};
       // const newShipping: ShipDest = req.body.shipping_info;
       let shipping: ShipDest;
        try{
            req.session.ship_to =  req.body.shipping;
            req.session.customer = req.body.customer;
            return(res.sendStatus(200));
        }catch(err){
            return(res.sendStatus(ErrorCode.controllerError))
        }
    }


    getShipping(req: ShippingGetReq, res: ShippingControllerResponse){
        if(!req.session || !req.session.ship_to || !req.session.customer){
            return(res.sendStatus(ErrorCode.badReq))
        };

        try{
            let payload: ShippingPayload = {
                shipping: req.session.ship_to,
                customer: req.session.customer
            };
            return(res.json(payload));
        }catch(err){
            return(res.sendStatus(ErrorCode.controllerError))
        };
    };
};



