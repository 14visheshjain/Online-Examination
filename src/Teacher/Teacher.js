import React,{useEffect, useState} from 'react';
import Header from './General/Header';
import Footer from './General/Footer';
import ClassList from './EnrolledClasses/ClassList';
import TestList from "./classTest/TestList";
import Dashboard from './Dashboard/Dashboard';
import MarksList from './testMarks/MarksList';
import QuestionPapersList from './questionPapers/PapersList';
import CreatePaper from './createPaper/Papers';
import { Route } from 'react-router-dom/cjs/react-router-dom.min';
import Axios from '../Axios';
import { Redirect } from 'react-router';
 

function Teacher(props) {
    //const user = props.location.state.user;
    const [logout, updateLogout] = useState( false);
  const [user, updateUser] = useState( {  email: "TO BE LOADED",
                                        name : "USER NAME" ,
                                        collegeId : "ID" 
                                        });

  
    useEffect(() => { 
        loadUserData();
    }, []);
  
  const loadUserData = async(event)=>{
    await  Axios.get('/Teacher/data' ,{withCredentials: true},
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
                <Header
                    user = {user}
                />            
                <Route path="/teacher/dashboard" component={Dashboard}></Route>
                <Route path='/teacher/classList' component={ClassList}></Route>
                <Route path='/teacher/class' component={TestList}></Route>
                <Route path='/teacher/paper' component={QuestionPapersList}></Route>
                <Route path='/teacher/marksList' component={MarksList}></Route>
                <Route path='/teacher/createPaper' component={CreatePaper}></Route>
                <Footer />
            </div>
        )
   }
}

export default Teacher
