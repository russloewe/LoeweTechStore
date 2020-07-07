import React from 'react';
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';
import ProductAdminWindow from '../../store/react/productAdminWindow';
import {User, GetUserStatus_ResPayload} from "../interfaces/userInterface";
import {getUserStatus, postUserLogout} from '../interfaces/coreEndpoints';
import UserBox from './userBox';
import OrderView from '../../store/react/orderViewWindow';

interface AdminDashState{
    hasError: boolean;
    
}

function DashboardBanner(props){
    return(
        <div>
            <h2>Admin Dashboard home</h2>
        </div>
    )
};
 class AdminDashboard extends React.Component {
    state: AdminDashState;

    constructor(props){
        super(props);
        this.state = {
            hasError: false,
            };
    }
    componentDidMount() {
        //this.getUserStatus();
    }
    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.log("Store Error");
        console.log(errorInfo);
    }

  


    render() {
    if (this.state.hasError) {
            //fallback UI
            return <h1>Something went wrong.</h1>;
        }
      
        return(
            
            <Router> 
                <nav className="navbar navbar-expand-lg navbar-dark site-header py-2 bg-dark sticky-top" id="navbar">
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavDropdown">
                        <ul className="navbar-nav pl-2">
                            <li className="nav-item px-2"><Link className="nav-link"  to={'/admin'}>Dashboard Home</Link></li>
                            <li className="nav-item px-2"><Link className="nav-link"  to={'/admin/orders'}>Orders</Link></li>
                            <li className="nav-item px-2"><Link className="nav-link"  to={'/admin/products'}>Products</Link></li>
                        </ul>
                    </div>
                </nav>
                <main>
                    <Route exact path="/admin" component={UserBox} />
                    <Route path="/admin/orders" component={OrderView} />
                    <Route path="/admin/products" component={ProductAdminWindow} />
                </main>
            </Router>

        )
    }
}

export default AdminDashboard;