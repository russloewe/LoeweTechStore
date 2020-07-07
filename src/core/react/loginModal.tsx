import React from 'react';
import LoginForm from './loginForm';

 class LoginModal extends React.Component {
    
    constructor(props){
        super(props);
    }
     
    render() {
      

      
        return(
            
            <div className="modal fade LoginModal" id="LoginModal" role="dialog" aria-labelledby="LoginModalLabel">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2 className="text-dark">Login</h2>
                        </div>
                        <div className="modal-body">
                            <LoginForm />
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}
export default LoginModal;