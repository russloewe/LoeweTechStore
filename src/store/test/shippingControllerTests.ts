import ShippingController from '../controllers/shippingController';
const shippingController = new ShippingController();

// Import types
import {Product, Cart, 
    newStripeCharge, StripeChargeStatus, SupportedCurrency} from '../interfaces/storeTypes';

import {ShippingGetReq, ShippingPayload, ShippingControllerResponse, ShippingUpdateReq
        } from '../interfaces/storeInterface';
import {
    testProduct1, testProduct2, testProduct3,
    testLineItem1, testLineItem2, testLineItem3, 
    testcharge, testorder, testsession
} from './storeTestData';

// Import testing framework
const chai = require("chai");
let should = chai.should();
const expect = chai.expect;
const sinon = require("sinon");


describe('/store Shipping Controller', () => {
    describe('.getShipping()', () => {
        it('it should get shipping info from session', async () => {
            let testShip = {
                name: 'test name',
                addr_1: 'test street',
                state: 'OR',
                zipcode: '90210',
                city: 'test city'};
            let req: ShippingGetReq = {
                session:{
                    ship_to: testShip
                }
            };
            let res = {
                json: sinon.spy(),
                sendStatus: sinon.spy()
            };

            
            await shippingController.getShipping(req, res);
            expect(res.sendStatus.calledOnce).to.be.false;
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.getCall(0).args[0]).to.have.property('shipping').and.equal(testShip);
        });    
    })
});
