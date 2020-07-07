
import {User, Request, Response,
GetUserStatus_ResPayload} from '../interfaces/userInterface';

interface AuthControllerOptions{
    knexClient: {
        (): any;
    };
};

interface AuthControllerInterface{
    getUserStatus : {
        (req: Request, res: Response): any;
    };
    postUserLogin : {
        (req: Request, res: Response): any;
    };
    postUserLogout : {
        (req: Request, res: Response): any;
    };
    config : {
        (options: AuthControllerOptions): any;
    }
}

export default class AuthController implements AuthControllerInterface {
    knex: any;
    constructor(){
        this.getUserStatus = this.getUserStatus.bind(this);
        this.postUserLogin = this.postUserLogin.bind(this);
        this.postUserLogout = this.postUserLogout.bind(this);
        this.config = this.config.bind(this);
    }

    config(options: AuthControllerOptions){
        this.knex = options.knexClient;
    }

    async getUserStatus(req: Request, res: Response){
        if(req.user){

            // Get the user from the database
            try{
                let user = await this.knex('users').where('user_id', req.user.user_id).first();
                let payload: GetUserStatus_ResPayload = {
                    error: false,
                    isAuthenticated: true,
                    user: {
                        name: user.name,
                        email: user.email,
                        user_type: user.user_type
                    }
                }
                return(res.json(payload));
            }
            catch(err){
                let payload: GetUserStatus_ResPayload = {
                    error: true,
                    isAuthenticated: false,
                    error_code: 1,
                    error_message: "Database Error",
                    error_details: err
                };
                console.log(payload);
                return(res.json(payload));
            }
            
        }else{
            let payload: GetUserStatus_ResPayload = {
                error: false,
                isAuthenticated: false
            }
            return(res.json(payload));
        }
    }

    postUserLogin(req: Request, res: Response){

    }

    postUserLogout(req: Request, res: Response){

    }
}