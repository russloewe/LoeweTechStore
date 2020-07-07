/*
* Author     : Russell Loewe russloewe@gmail.com
* Date       : 5-24-2019
* Filename   : db_pages.js
* project    : WebApp
* site       : https://github.com/russloewe/WebApp
* Description: 
* 
* Collection of functions for retrieving data from a Post SQL
* server.
*/

import {User} from '../interfaces/userInterface';

interface modelOptions{
    client: any
};

class userModel{
    knex: any;
    table: string;
	constructor(){
		this.config = this.config.bind(this);
		this.addUser = this.addUser.bind(this);
		this.getUser = this.getUser.bind(this);
		this.table = 'users';
	}
	
	config(options: modelOptions){
		if (!options.client){throw Error('Null database client')};
		this.knex = options.client;
	}
	
	async addUser(object: User){
		try{
			let success = await this.knex(this.table).insert(object);
			if(success){return(Promise.resolve(true))}
		}catch(err){
			return( new Promise( (res,rej) => {rej(err)}))
		}
		
	};

	async getUser(object: User){
		try{
			let user = await this.knex(this.table).where(object);
			if(user){return(Promise.resolve(user))}
		}catch(err){
			return(new Promise( (res, rej) => {rej(err)}))
		}
	};


}
module.exports = new userModel();
