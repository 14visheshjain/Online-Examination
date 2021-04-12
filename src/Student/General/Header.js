import { Button } from '@material-ui/core';
import React ,{useState} from 'react';
import { Link , Redirect} from 'react-router-dom';
import './Header.css';
import Axios from '../../Axios';

function Header(props) {
    const user = props.user;
    const [logout, updateLogout] = useState( false);

    function Performlogout(){
         Axios.get('/logout' ,{withCredentials: true},
        {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            // "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
            }
        })
        .then(data=>{
            console.log("logged out");
            updateLogout(true);        
        });

    }
    if(logout){
        return <Redirect to={{
            pathname: "/home",
          }}
         />
    }else{
    return (
            <div className="home__headerStudent">
                <div className="home__headerStudentLeft">
                <Link to={{
                            pathname: "/student/dashboard",
                            state: { user: user },
                            
                        }}
                        replace
                        style={{color:"white" , marginRight : "2%"}}>
                        <i class="fas fa-laptop-code"></i>
                </Link> 
                    <h3>Hey! {user.name}</h3>
                </div>
                <div className="home__headerStudentRight">
                    
                        <div className = "home__navStudent">
                            <Link to={{
                                pathname: "/student/EnrolledClasses",
                                state: { user: user }}}
                                style={{color:"white",textDecorationLine:"none"}}
                                replace
                                >                                 
                                <h4>Class</h4>
                                </Link>
                        </div>
                        <div className = "home__navStudent">
                            <h4>Profile</h4>
                        </div>
                        <div className = "home__navStudent">
                        <button
                                onClick={Performlogout}
                                >
                                <h4>LogOut</h4>
                            </button>
                        </div>
                    
                </div>
            </div>
        )
    }
}
export default Header; 
