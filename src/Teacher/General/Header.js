import './Header.css';
import React ,{useState} from 'react';
import { Link , Redirect} from 'react-router-dom';import Axios from '../../Axios';
function Header(props ) {
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
            <div className="home__headerTeacher">
                <div className="home__headerTeacherLeft">
                    <Link to={{
                            pathname: "/teacher/dashboard",
                            state: { user: user }
                        }} style={{color:"white", marginRight : "2%" ,  fontSize:"1.5rem"}} replace><i class="fas fa-laptop-code"></i></Link>
                    
                        <h2>Hey! {user.name}</h2>
                </div>
                <div className="home__headerTeacherRight">
                    <div className = "home__navTeacher">
                        <Link to={{
                            pathname: "/teacher/classList",
                            state: {  user: user }
                        }} style={{color:"white" , textDecorationLine :"none",}} replace><h3>Class</h3></Link>
                    </div>
                    <div className = "home__navTeacher">
                    <Link to={{
                            pathname: "/teacher/paper",
                            state: {  user: user }
                        }} style={{color:"white", textDecorationLine :"none",}} replace><h3>Paper</h3></Link>
                    </div>
                    <div className = "home__navTeacher">
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
