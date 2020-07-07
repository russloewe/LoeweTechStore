
import 'babel-polyfill';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';
import {Collapse} from 'react-collapse';
import Navbar from 'react-bootstrap/Navbar';
import './core/js/cookie';

// Import Views for server modules
import ContactView from './core/react/contactView';
import StoreApp from './store/react/storeApp';
import AdminDashboard from './core/react/adminDashboard';
import BlogView from './blog/react/blogView';
//import Footer from './core/react/footer';

// Import and init Google Analytics 
import ReactGA from 'react-ga';
ReactGA.initialize('UA-168380866-1') // Add your ID

// Create tracker
const Tracker = ({location}) => {
    console.log('tracking:', location.pathname);
    ReactGA.set({page: location.pathname})
    ReactGA.pageview(location.pathname)
    return null
}


function LoewetechNav(props){
    //const [navOpen, setNavOpen] = useState(true);
    return(
        <Navbar className="navbar navbar-dark" bg="dark" expand="lg">
            <Link className="navbar-brand nav-link"  to={'/'}>YeetWood Mac</Link>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <ul className="navbar-nav pl-2">
                    <li className="nav-item px-2"><Link className="nav-link"  to={'/blog'}>Blog</Link></li>
                    <li className="nav-item px-2"><Link className="nav-link"  to={'/contact'}>Contact</Link></li>
                </ul>
            </Navbar.Collapse>
        </Navbar>

   
    )
};

if(document.getElementById('loewetech-app-root')){
    ReactDOM.render(
        <Router >
            <div>
               <LoewetechNav />
                <main>
                    <Route render={Tracker} /> 
                    <Route path="/blog" component={BlogView} />
                    <Route path="/contact" component={ContactView} />
                    <Route path="/admin" component={AdminDashboard} />
                    <Route exact path="/" component={StoreApp} />
                </main>

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
                    <div className="pl-2">
                        <Link className="admin-link" to={'/admin'}> &pi; </Link>
                    </div>
                </div>
            </footer>

            </div>
        </Router>,
        document.getElementById('loewetech-app-root')
    )
}
