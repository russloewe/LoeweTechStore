// Import Controllers
import AuthController from '../controllers/authController';

// Set up Database Client
const knexConfig = {
    client: 'pg',
    debug: (process.env.NODE_ENV == 'dev')? true : false,
    connection: process.env.DATABASE_URL,
    searchPath: ['knex', 'public'],
  }
let knex = require('knex')(knexConfig);

// Import types
import { User, GetUserStatus_ResPayload, Request, Response} from '../interfaces/userInterface';
import {ClientRequest} from '../interfaces/coreInterface';
import { testSession, testUser, testUser2,testUserStatusPayload } from './coreTestData';

// Import testing framework
const chai = require("chai");
let should = chai.should();
const expect = chai.expect;
const sinon = require("sinon");

describe('CORE CONTROLLERS', () => {
    

    describe('Auth Controller', () => {
        describe('loginUser', () => {
  
        });
        describe('logoutUser', () => {
  
        });
        describe('getUserStatus', () => {
            it('should get the user status', async () => {
                let req  = {
                    isAuthenticated: true,
                    user: testUser2,
                    body: {}
                };
                let res = {
                    json: sinon.spy()
                };
                let testClient = () => ({
                    where: sinon.stub().returns({
                        first: sinon.stub().resolves(testUser2)
                    })
                });
                var authController = new AuthController();
                authController.config({knexClient: testClient});
                await authController.getUserStatus(req, res);
                expect(res.json.calledOnce).to.be.true;
                expect(res.json.getCall(0).args[0]).to.have.property('error').and.be.false;
                expect(res.json.getCall(0).args[0]).to.have.property('user').and.to.have.property('name').and.equal(testUser2.name);
                expect(res.json.getCall(0).args[0]).to.have.property('user').and.to.have.property('email').and.equal(testUser2.email);
            })
            it('should get the test user from the database', async () => {
                let req: Request  = {
                    isAuthenticated: true,
                    user: {
                        user_id: 1
                    },
                    body: {}
                };
                let res = {
                    json: sinon.spy()
                };
                var authController = new AuthController();
                authController.config({knexClient: knex});
                await authController.getUserStatus(req, res);
                expect(res.json.calledOnce).to.be.true;
                expect(res.json.getCall(0).args[0]).to.have.property('error').and.be.false;
                expect(res.json.getCall(0).args[0]).to.have.property('user').and.have.property('name').and.equal(testUser.name);
                expect(res.json.getCall(0).args[0]).to.have.property('user').and.have.property('email').and.equal(testUser.email);
            })
        });
    });

});