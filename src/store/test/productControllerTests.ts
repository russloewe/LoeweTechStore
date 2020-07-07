import {ProductController} from '../controllers/productController'
const productController = new ProductController();


// Import types
import {Product, Cart, 
    newStripeCharge, StripeChargeStatus, SupportedCurrency} from '../interfaces/storeTypes';

import {CartAddItemReq, CartUpdateRes, OrderControllerOptions,
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

   

describe('/store Product Controller', () => {
    let testProds: Product[] = [testProduct1, testProduct2]
    describe('listProducts', () => {
        it('it should get all the products', async () => {
            let req = {};
            let res = {
                json: sinon.spy(),
                sendStatus: sinon.spy()
            };
            let testclient = sinon.stub().returns({
                where: sinon.stub().resolves(testProds)
            });
            productController.config({knexClient: testclient});
            await productController.listProducts(req, res);
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.getCall(0).args[0]).to.have.members(testProds);
        });    
        it('it should handle db error', async () => {
            let req = { 
                session: testsession
            };
            let res = {
                json: sinon.spy(),
                sendStatus: sinon.spy()
            };
            let testclient = ()=> ({
                where: sinon.stub().rejects('err')
            });
            productController.config({knexClient: testclient});
            await productController.listProducts(req, res);
            expect(res.sendStatus.calledOnce).to.be.true;
            expect(res.sendStatus.getCall(0).args[0]).to.equal(503);
        }); 
    });
    describe('addProduct', () => {
        it('should add new porduct', async () => {
            let req = {
                isAuthenticated: true,
                body: testProduct3
            };
            let res = {
                sendStatus: sinon.spy()
            };
            let testClient = () => ({
                insert: sinon.stub().resolves(true)
            });
            productController.config({knexClient: testClient});
            await productController.addProduct(req, res);
            expect(res.sendStatus.calledOnce).to.be.true;
            expect(res.sendStatus.getCall(0).args[0]).to.equal(200);
        });
        it('should handle db error', async () => {
            let req = {
                isAuthenticated: true,
                body: testProduct3
            };
            let res = {
                sendStatus: sinon.spy()
            };
            let testClient = () => ({
                insert: sinon.stub().rejects('error')
            });
            productController.config({knexClient: testClient});
            await productController.addProduct(req, res);
            expect(res.sendStatus.calledOnce).to.be.true;
            expect(res.sendStatus.getCall(0).args[0]).to.equal(503);
        })
    });
    describe('updateProduct', () => {
        it('should update the product', async () => {
            let req = {
                isAuthenticated: true,
                body: testProduct3
            };
            let res = {
                sendStatus: sinon.spy()
            };
            let testClient = () => ({
                where: sinon.stub().returns({
                    update: sinon.stub().resolves(true)
                })
            });
            productController.config({knexClient: testClient});
            await productController.updateProduct(req, res);
            expect(res.sendStatus.calledOnce).to.be.true;
            expect(res.sendStatus.getCall(0).args[0]).to.equal(200);
        })
        it('should handle db error', async () => {
            let req = {
                isAuthenticated: true,
                body: testProduct3
            };
            let res = {
                sendStatus: sinon.spy()
            };
            let testClient = () => ({
                where: sinon.stub().returns({
                    update: sinon.stub().rejects('error')
                })
            });
            productController.config({knexClient: testClient});
            await productController.updateProduct(req, res);
            expect(res.sendStatus.calledOnce).to.be.true;
            expect(res.sendStatus.getCall(0).args[0]).to.equal(503);
        })
    });
});
