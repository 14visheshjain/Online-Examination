import React ,{useEffect, useState}from 'react';
import Header from './General/Header';
import Footer from './General/Footer';
import StudentClass from './EnrolledClasses/ClassList';
import Dashboard from './Dashboard/Dashboard';
import Class from './class/Class';
import EnrolledClass from './EnrolledClasses/ClassList';
import { Route } from 'react-router-dom/cjs/react-router-dom.min';
import Axios from '../Axios';
import { Redirect } from 'react-router';
 
function Student(props) {

  //  const user = props.location.state.user;
  const [logout, updateLogout] = useState( false);
  const [user, updateUser] = useState( {  email: "TO BE LOADED",
                                        name : "USER NAME" ,
                                        collegeId : "ID" 
                                        });

  
    useEffect(() => { 
        loadUserData();
    }, []);
  
  const loadUserData = async(event)=>{
    await  Axios.get('/Student/data' ,{withCredentials: true},
    {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            // "Access-Control-Allow-Origin": "*",
           "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
                   }
    })
    .then(data=>{
      
            data = data.data;
            updateUser(data);
            console.log("new user",user);
            console.log("data" ,data);
    }).catch(err=>{
        updateLogout(true);
    });
  }
  if(logout){
      alert("You are not allowed to visit this page! Please first login or signup ");
    return <Redirect to={{
        pathname: "/home",
      }}
     />
  }else{
        return (
                <div>
                    <div>
                        <Header
                            user = {user}
                        />
                        <Route path='/student/dashboard' component={Dashboard}></Route>
                        <Route path='/student/EnrolledClasses' component={EnrolledClass}></Route>
                        <Route path='/student/class' component={Class}></Route>
                        <Footer />
                    </div>

                </div>
        );
  }
}
export default Student