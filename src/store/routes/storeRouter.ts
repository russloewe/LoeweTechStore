/* filename:     auth.js
 * author:  russell loewe
 * project: WebApp
 * github: http://github.com/russloewe/WebApp
 * desc:   
 * 	
 * Web API to authorize users
 * 	
 */
 
 // endpoints



const express = require('express');
const bodyParser = require('body-parser');
const router  = express.Router();

import * as endpoint from '../interfaces/storeEndpoints';
// Import Stripe Nodejs API
const stripeServerKey = process.env.STRIPE_SERVER;
if(!stripeServerKey){throw 'no stripe server key in env: "STRIPE_SERVER"'}
const stripeAPI = require("stripe")(stripeServerKey, {
  apiVersion: '2020-03-02',
});

// Set up Database Client
const knexConfig = {
    client: 'pg',
    debug: false,
   // debug: (process.env.NODE_ENV == 'dev')? true : false,
    connection: process.env.DATABASE_URL,
    searchPath: ['knex', 'public'],
  }
let knex = require('knex')(knexConfig);

// Set up cart controller
import CartController from '../controllers/cartController';
const cart = new CartController();
cart.config({knexClient: knex});

// Set up Product controller
import {ProductController} from '../controllers/productController';
const product = new ProductController();
product.config({knexClient: knex});

// Set up Order controller

const nodemailer = require("nodemailer");
  let mailtransporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
     // user: "support@loewetechsoftware.com",
      //pass: "osakkxieatoqveyg"
    //  user: "russloewe@gmail.com", // generated ethereal user
     // pass: "bhduwsccviijaiov" // generated ethereal password
    }
  });
  

import OrderController from '../controllers/orderController';
const order = new OrderController();
import {OrderControllerOptions} from '../interfaces/storeInterface';

let orderOptions: OrderControllerOptions = {
  knexClient: knex,
  stripeClient: stripeAPI,
  mailClient: mailtransporter
};
order.config(orderOptions);

// Import Shipping Controller
import ShippingController from '../controllers/shippingController';
const shippingController = new ShippingController();

router.get(endpoint.OrderCheckout, order.checkout);
router.post(endpoint.postPaymentIntentWebhook, order.webhookPaymentIntent);
router.post(endpoint.postUpdateOrder, order.postUpdateOrder);
router.get(endpoint.getOrdersEndpoint, order.getOrders);
router.post(endpoint.ClearCart, cart.postClearCart);
router.post(endpoint.postAddShippingEndpoint, shippingController.postAddShipping);
router.get(endpoint.getShippingEndpoint, shippingController.getShipping);
router.post(endpoint.addItemEndpoint, cart.addItem);
router.post(endpoint.postRemoveItem, cart.postRemoveItem)
router.get(endpoint.getCartEndpoint, cart.getCart);
router.get(endpoint.productListEndpoint, product.listProducts);

module.exports = router;
