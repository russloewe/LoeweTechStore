import React from 'react';


import {User, GetUserStatus_ResPayload} from "../interfaces/userInterface";
import {getUserStatus, postUserLogout} from '../interfaces/coreEndpoints';
import LoginModal from './loginModal';

interface UserBoxState{
    user: User;
    isAuthenticated: boolean;
}

class UserBox extends React.Component {
    state: UserBoxState;

    constructor(props){
        super(props);
        this.state = {
            user: {
            },
            isAuthenticated: false
        }
        this.logout = this.logout.bind(this);
        this.getUserStatus = this.getUserStatus.bind(this);
    }
    
    logout(e){
      e.preventDefault();
      fetch(postUserLogout)
      .then((response) => {
          return response.json();
      })
      .then((data: GetUserStatus_ResPayload) => {
          switch(data.error){
              case true:
                  console.log(data.error_message);
                  break;
              case false:
                  this.setState({
                      user: data.user,
                      isAuthenticated: data.isAuthenticated});
                  break;
          } 
      })
    }

    getUserStatus(){
        fetch(getUserStatus)
        .then((response) => {
            return response.json();
        })
        .then((data: GetUserStatus_ResPayload) => {
            switch(data.error){
                case true:
                    console.log(data.error_message);
                    break;
                case false:
                    this.setState({user: data.user});
                    break;
            } 
        })

    }

    componentDidMount() {
        this.getUserStatus();
    }
    
    render() {

        const name = this.state.isAuthenticated? this.state.user.name : '';
        const greeting = <span>Hello, {name}!</span>;
        const logout = <a className="small" href="#" onClick={this.logout}>Logout</a>;
        const login = <a className="nav-link" href="#" data-toggle='modal' data-target='#LoginModal' >Login</a>;

        
        
        return(
           <div id="userbox">
            <div className="col">
              <div className="row">
                {this.state.isAuthenticated ? greeting : <LoginModal />}
              </div>
              <div className="row">
                {this.state.isAuthenticated ? logout : login }
              </div>
            </div>
           </div>
        )
    }
}
export default UserBox;