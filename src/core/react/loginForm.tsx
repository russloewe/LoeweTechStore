import React from 'react';
import {postHeaders} from '../interfaces/coreInterface';

//import {Done,  Reject, Error, Loading} from './states.tsx';

import {User, GetUserStatus_ResPayload} from "../interfaces/userInterface";
import {getUserStatus, postUserLogout, postUserLogin} from '../interfaces/coreEndpoints';
import FadeIn from "react-fade-in";

function Loading(props){
  return(
<div>
  <FadeIn>
    <div className="loader">
      <span className="sr-only">Waiting for a response from the server.</span>
    </div>
  </FadeIn>
  <h2>Message Away...</h2>
  <p>If you can read this one of us is too slow</p>
</div>
)};

function Done(props){
  return(
<div>
  <FadeIn>
    <h2> All Done </h2>
  </FadeIn>

</div>
)};

export function Reject(props){
   return(
<div> 
    <FadeIn>
        <div className="row">
            <img src="public/images/reject.svg" alt="message rejected"></img>
        </div>
    </FadeIn>
        <h2>Message Rejected!</h2>
        <p>Your connection looks suspicious to our server. Try clearing your cookies and reloading the page.</p>
</div>
)};
function Success(props){
  return(
    <div> 
        <h2>Logged in!</h2>
         <button className="btn btn-primary btn-lg btn-block" id="dismiss" type="button" data-dismiss="modal">Yay!</button>
    </div>
  )
};
 function Error(props){
  return(
  <div> 
    <FadeIn>
    <div className="row">
      <img src="public/images/error.svg" alt="message rejected"></img>
    </div>
    </FadeIn>
    <h2>Server Error!</h2>
    <p>Looks like the admin killed the server. Give us a call at 541-357-4230 until we fix this.</p>
  </div>
)};


interface LoginFormState{
  form: string;
  username: string;
  password: string;
}

export default class LoginForm extends React.Component {
  state: LoginFormState;

    constructor(props){
        super(props);
        this.state = {form: 'visible',
                      username: '',
                      password: ''};
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    
    handleChange(event) {
      const target = event.target;
      const value = target.value;
      const name = target.name;
      this.setState({[name]: value});
    } 
    
    async handleSubmit(event) {
      event.preventDefault();
      this.setState({form: 'loading'});
      let payload = {
        username: this.state.username,
        password: this.state.password
      };

      let res;
      try{
        res = await fetch(postUserLogin, {
          method: 'POST',
          headers: postHeaders,
          body: JSON.stringify(payload)
        })
      }catch(err){
        this.setState({form: 'error'});
        return;
      }
     
      if(res.status == 200){
            this.setState({form: 'success'});
      } else{
              console.log(res);
              this.setState({form: 'error'}); 
      }
    }
    
    render() {
        const form = <form onSubmit={this.handleSubmit} >
                <div className="row mb-2">      
                    <div className="col-4">
                        <label> User Name </label>
                    </div>
                    <div className="col-8">
                        <input name="username" type="text" placeholder="Username" value={this.state.username} onChange={this.handleChange} />
                    </div>
                </div>
                <div className="row mb-2">
                    <div className="col-4">
                        <label> Password</label>
                    </div>
                    <div className="col-8">
                        <input name="password" type="password" placeholder="Password" value={this.state.password} onChange={this.handleChange} />
                    </div>
                 </div>
                 <div className="row mb-2">
                    <div className="col-4">
                    <input type="submit" value="submit" />
                    </div>
                    <div className="col-8">
                    </div>
                 </div>
              </form>;
        return(
        
            <div>
             {(this.state.form == 'visible') ? form : ''}
             {(this.state.form == 'success') ? <Success /> : ''}
             {(this.state.form == 'loading') ? <Loading /> : ''}
             {(this.state.form == 'reject') ? <Reject /> : ''}
             {(this.state.form == 'error') ? <Error /> : ''}    
              </div>
              
        )
    }
}
