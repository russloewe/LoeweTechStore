import React from 'react';
import {BrowserRouter as Link} from 'react-router-dom';


 class Navbar extends React.Component {
    
    constructor(props){
        super(props);
    }
     
    render() {
      

      
        return(
            
            <nav className="navbar navbar-expand-lg navbar-dark site-header py-2 bg-dark sticky-top" id="navbar">
                <a className="navbar-brand nav-link active" href="#">
                    <Link className="navbar-brand nav-link" to={'/YEETWood Mac'}></Link></a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul className="navbar-nav pl-2">
                        <li className="nav-item px-2"><Link className="nav-link" to={'/blog'}>Blog</Link>></li>
                        <li className="nav-item px-2"><Link to={'/contact'}>Contact</Link>></li>
                    </ul>
                </div>
            </nav>

        )
    }
}
export default Navbar;