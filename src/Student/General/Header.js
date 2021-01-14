import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header(props) {
    return (
        <div className="home__header">
            <div className="home__headerLeft">
            <Link to={{
                        pathname: "/student/dashboard",
                        state: { email: props.email }
                    }}><i class="fas fa-laptop-code"></i></Link>
            </div>
            <div className="home__headerRight">
                
                    <div className = "home__nav">
                        <Link to={{
                            pathname: "/student/EnrolledClasses",
                            state: { email: props.email }}}>                                 
                            <h4>Class</h4>
                            </Link>
                    </div>
                    <div className = "home__nav">
                        <h4>Profile</h4>
                    </div>
                    <div className = "home__nav">
                        <h4>LogOut</h4>
                    </div>
                   
            </div>
        </div>
    )
}

export default Header;
