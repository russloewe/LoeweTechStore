/* filename:     auth.js
 * author:  russell loewe
 * project: WebApp
 * github: http://github.com/russloewe/WebApp
 * desc:   
 * 	
 * Web API to authorize users
 * 	
 */

import { User, Response, Request} from '../interfaces/userInterface';

let badRequest = {
  error: true,
  error_code: 400,
  error_message: 'Bad Request'
};
let success = {
  error: false
};
let databaseError = {
  error: true,
  error_code: 500,
  error_message: 'Database Error'
};
interface controllerOptions{
    model: any;
};

class userController{
    db: any;
    constructor(){
    this.addUser = this.addUser.bind(this);
    this.config = this.config.bind(this);

    };
    
    config( options: controllerOptions ) {
		if (!options.model){throw Error('Null database model')};	
        this.db = options.model;
    };
    
    async addUser (req: Request, res: Response) {
		if(!req.body || !req.body.user){return(res.json(badRequest))}
		const user: User = req.body.user;
		try{
			await this.db.addUser(user);
			res.json(success);
		}catch(err){
			if(process.env.NODEENV == 'dev'){console.log(err)};
			res.json(databaseError);
		}
    };

  
};
module.exports = new userController();


