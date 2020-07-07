import CartController from '../controllers/cartController';
var cartController = new CartController();


// Import types
import {Product, Cart,
    newStripeCharge, StripeChargeStatus, SupportedCurrency} from '../interfaces/storeTypes';

import {CartAddItemReq, CartUpdateRes, CartRemoveItemReq, CartGetReq,
        } from '../interfaces/storeInterface';
import {
    testProduct1, testProduct2, testProduct3,  testDest,
    testLineItem1, testLineItem2, testLineItem3
} from './storeTestData';

// Import testing framework
const chai = require("chai");
let should = chai.should();
const expect = chai.expect;
const sinon = require("sinon");


describe('/store Cart Controller', () => {
    let testCart: Cart = {
        item_count: 0,
        charge_status: StripeChargeStatus.none,
        items: [testLineItem1, testLineItem2],
        total: 333
    };
    describe('CartController.addItem', () => {
        
        it('Should add a line item to session cart', async() => {
            let req: CartAddItemReq = {
                session: {
                    cart: testCart
                },
                body: testLineItem3
            };
            let res = {
                json: sinon.spy(),
                sendStatus: sinon.spy()
            };
            await cartController.addItem(req, res);
            expect(res.sendStatus.calledOnce).to.be.true;
            expect(res.sendStatus.getCall(0).args[0]).to.equal(200);
            expect(req.session.cart.items).to.have.members([testLineItem1, testLineItem2, testLineItem3]);
            // Make sure cart updates the item_count correctly.
            expect(req.session.cart.item_count).to.equal(6);
            // Make sure cart updates total correctly
            expect(req.session.cart.total).to.equal(testLineItem1.sub_total + testLineItem2.sub_total+testLineItem3.sub_total);
        });
        it('Should not add a Product to session cart', async() => {
            // Expecting lineItem instead
            let req = {
                session: {
                    cart: testCart
                },
                body: testProduct3
            };
            let res = {
                json: sinon.spy(),
                sendStatus: sinon.spy()
            };
            await cartController.addItem(req as unknown as CartAddItemReq, res);
            expect(res.sendStatus.calledOnce).to.be.true;
            expect(res.sendStatus.getCall(0).args[0]).to.equal(400);
        });
        it('Should handle no cart', async() => {
            let req: CartAddItemReq = {
                session: {
                },
                body: testLineItem3
            };
            let res = {
                json: sinon.spy(),
                sendStatus: sinon.spy()
            };
            await cartController.addItem(req, res);
            expect(res.sendStatus.calledOnce).to.be.true;
            expect(res.sendStatus.getCall(0).args[0]).to.equal(200);
            expect(req.session).to.have.property('cart')
                .and.to.have.property('items')
                .and.to.have.members([testLineItem3]);
        })
    })
    describe('CartController.getCart', () => {
        it('Should get the cart', async () => {
            let req = {
                session: {
                    cart: testCart
                }
            };
            let res = {
                json: sinon.spy(),
                sendStatus: sinon.spy()
            };
            await cartController.getCart(req, res);
            expect(res.sendStatus.calledOnce).to.be.false;
            expect(res.json.calledOnce).to.be.true;
            let call = res.json.getCall(0).args[0];
            expect(call).to.have.property('items');
            expect(call.items).to.have.members([testLineItem1, testLineItem2, testLineItem3]);
            expect(call).to.have.property('total').and.equal(666);
        });
        it('Should handle session without a cart', async () => {
            let req = {
                session: { }
            }
            let res = {
                json: sinon.spy(),
                sendStatus: sinon.spy()
            };
            await cartController.getCart(req, res);
            expect(res.sendStatus.calledOnce).to.be.false;
            expect(res.json.calledOnce).to.be.true;
            expect(req.session).to.have.property('cart')
                .and.to.have.property('items');
        });
        it('Should handle request without session', async () => {
            let req = {};
            let res = {
                json: sinon.spy(),
                sendStatus: sinon.spy()
            };
            await cartController.getCart(req as CartGetReq, res);
            expect(res.json.calledOnce).to.be.false;
            expect(res.sendStatus.calledOnce).to.be.true;
            expect(res.sendStatus.getCall(0).args[0]).to.equal(400);
        });
    });
    describe('CartController.postClearCart', () => {
        it('Should clear the session cart', async () => {
            let req = {
                session: {
                    cart: testCart
                }
            };
            let res = {
                sendStatus: sinon.spy()
            }
            await cartController.postClearCart(req, res);
            expect(res.sendStatus.calledOnce).to.be.true;
            expect(res.sendStatus.getCall(0).args[0]).to.equal(200);
            expect(req.session.cart).to.have.property('items').and.be.empty;
        });
    });
    describe('CartController.postRemoveItem', () => {
        it('Should remove the first item in the cart', async() => {
            var req: CartRemoveItemReq = {
                session: {
                    cart: {
                        charge_status: StripeChargeStatus.none,
                        item_count: 0,
                        items: [testLineItem1, testLineItem2],
                        total: 333
                    }
                },
                body: {
                    item: 0
                }
            };
            let res = {
                json: sinon.spy(),
                sendStatus: sinon.spy()
            };
            await cartController.postRemoveItem(req, res);
            expect(res.sendStatus.calledOnce).to.be.true;
            expect(res.sendStatus.getCall(0).args[0]).to.equal(200);
            expect(req.session.cart.items).to.have.members([testLineItem2]);
            expect(req.session.cart.total).to.equal( testLineItem2.sub_total);
        });
    })
})

