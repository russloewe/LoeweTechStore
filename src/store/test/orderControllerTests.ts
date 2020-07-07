import OrderController from '../controllers/orderController';
const orderController = new OrderController();


// Import types
import {Product, Cart, 
    newStripeCharge, StripeChargeStatus, SupportedCurrency, StripeWebhookTypes, StripeWebhookData} from '../interfaces/storeTypes';

import {CartAddItemReq, CartUpdateRes, OrderControllerOptions,
        } from '../interfaces/storeInterface';
import {
    testProduct1, testProduct2, testProduct3, testDest,
    testLineItem1, testLineItem2, testLineItem3,
    testcharge, testorder, testsession
} from './storeTestData';

// Import testing framework
const chai = require("chai");
let should = chai.should();
const expect = chai.expect;
const sinon = require("sinon");


describe('/store Order Controller', () => {
    let testCart: Cart = {
        item_count: 0,
        charge_status: StripeChargeStatus.none,
        items: [testLineItem1, testLineItem2],
        total: 333
    };
    it('.checkout should checkout an order', async () => {
        let req = {
            session: {
                cart: testCart
            },
            body: {
                source: 'test-source'
            }
        };
        let res = {
            sendStatus: sinon.spy(),
            json: sinon.spy()
        };
        let testclient = sinon.stub().returns({
            returning: sinon.stub().returns({
                insert: sinon.stub().resolves(32)
            })
        });
        let teststripe = {
            charges: sinon.stub().returns({
                create: sinon.stub().returns({
                    then: sinon.stub().returns(
                        {id: 'testcharge',
                        status: 'teststatus'}
                        )
                })
            })
        };
        let testMailer = {

        };
        let options: OrderControllerOptions = {
            knexClient: testclient,
            stripeClient: teststripe,
            mailClient: testMailer
        };
        orderController.config(options);
        await orderController.checkout(req, res);
        expect(res.sendStatus.calledOnce).to.be.true;
        expect(res.json.calledOnce).to.be.false;
        expect(res.sendStatus.getCall(0).args[0]).to.equal(200);
    });
    it('.webhook should update order charge status', async () => {
        let testData: StripeWebhookData = {
            id: 'test',
            amount: 0,
            captured: true,
            description:{
                order_id: '3'
            },
            status: StripeChargeStatus.succeeded
        }
        let req = {
            body: {
                type: StripeWebhookTypes.chargeSucceed,
                data: {
                    object: testData}
                }
            };
        let res = {
            sendStatus: sinon.spy()
        };
        let testclient = sinon.stub().returns({
            where: sinon.stub().returns({
                update: sinon.stub().resolves(
                    true
                )
            })
        });
        let testMailer = {};
        let testStripe = {};
        let options = {
            knexClient: testclient, 
            stripeClient: testStripe,
            mailClient: testMailer
        };
        orderController.config(options);
        await orderController.webhookPaymentIntent(req, res);
        expect(res.sendStatus.calledOnce).to.be.true;
        expect(res.sendStatus.getCall(0).args[0]).to.equal(200);
    })
})
