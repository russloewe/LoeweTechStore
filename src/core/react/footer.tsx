import React from 'react';
import {BrowserRouter as Link} from 'react-router-dom';

 class Footer extends React.Component {
    
    constructor(props){
        super(props);
    }
     
    render() {

        return(
            <footer className="page-footer font-small blue pt-4 bg-dark">
                <div className="container-fluid text-center text-md-left">
                    <div className="row">
                        <div className="col-md-6 mt-md-0 mt-3">
                            <h5 className="text-uppercase"></h5>
                            <div id="user-box"></div>
                        </div>
                        <hr className="clearfix w-100 d-md-none pb-3" />
                        <div className="col-md-3 mb-md-0 mb-3">
                            <h5 className="text-uppercase">Boring Stuff</h5>
                            <ul className="list-unstyled">
                                <li><a href="legal.html#Terms-of-Service" target="_blank">Terms of Service</a></li>
                                <li><a href="legal.html#Privacy-Policy" target="_blank">Privacy Statement</a></li>
                                <li><a href="public/sitemap.xml" target="_blank">Sitemap</a></li>
                            </ul>
                        </div>
                        <div className="col-md-3 mb-md-0 mb-3">
                            <h5 className="text-uppercase">Cool Stuff</h5>
                            <ul className="list-unstyled">
                                <li><a href="https://loewetechsoftware.com" target="_blank">Loewe Tech Homepage</a></li>
                                <li><a href="https://www.facebook.com/loewetechsoftware/" target="_blank">Loewe Tech Facebook</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="footer-copyright text-center py-3">
                    &copy; Copyright <a href="https://loewetechsoftware.com/russell/" target="_blank"></a>
                    <div className="pl-4">
                        <Link to={'/admin'}> &pi; </Link>
                    </div>
                </div>
            </footer>

        )
    }
}
export default Footer;