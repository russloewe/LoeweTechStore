import {ClientRequest, ServerResponse} from '../interfaces/coreInterface';

interface ensureAdminOptions{
    userLevel?: number | string;
};

function ensureAdmin(options: ensureAdminOptions) {
 
  return function(req: ClientRequest, res: ServerResponse, next: any) {
    if (!req.isAuthenticated ) {
        res.sendStatus(401);
    }else if ((req.user.user_type >= 2)) {
		next();
        
    }else{
		res.sendStatus(401);
	}
    
  }
}

module.exports = ensureAdmin;
