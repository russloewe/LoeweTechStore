import React from 'react';
import ReactDOM from 'react-dom';
import FadeIn from "react-fade-in";
import ContactForm from '../../mailer/react/ContactForm';

 class ContactView extends React.Component {
    
    constructor(props){
        super(props);
    }
     
    render() {
      

      
        return(
            <div className="container" id="Contact">
                <div className="pricing-header px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
                    <h1 className="display-4">Contact Us</h1>
                    <p className="lead"></p>
                </div>
                <div className="row">
                    <div className="col-md-4 order-md-1"><h3>Let’s Connect</h3><div className="ts-column-count-sm-2"></div>
                        <a className="mb-3 d-flex ts-align__vertical" href="facebooklink" target="_blank">
                            <span className="ts-circle__xs border ts-border-muted mr-4"><i className="fa fa-facebook"></i>
                            </span><span>Facebook</span>
                        </a>
                        <a className="mb-3 d-flex ts-align__vertical" href="tel:555-555-5555" target="_blank">
                                <span className="ts-circle__xs border ts-border-muted mr-4"><i className="fa fa-phone"></i>
                                </span><span>Call Now</span></a>
                    </div>
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-title text-center"><h2>Direct Message</h2></div>
                            <div className="card-body">
                                <ContactForm />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default ContactView;