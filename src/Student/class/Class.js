import { Button, CircularProgress, List, ListItem, ListItemSecondaryAction, ListItemText, makeStyles } from '@material-ui/core';
import React , {useEffect , useState} from 'react';
import Footer from '../General/Footer';
import Header from '../General/Header';
import "./Class.css";
import Axios from '../../Axios';
import {Link, Redirect} from 'react-router-dom';

function listItemStyle(){
    return {
        marginTop : "20px",
        border : "1px  solid black",
        borderRadius : "5px",
        padding: "15px",
        fontSize:"20px",
    }
}

function getTime(){
    var objToday = new Date(),
	dayOfMonth = today + ( objToday.getDate() < 10) ? '0' + objToday.getDate()  : objToday.getDate() ,
	months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'),
	curMonth = (objToday.getMonth()+1<10)? "0"+(objToday.getMonth()+1) : objToday.getMonth()+1  ,
	curYear = objToday.getFullYear(),
	curHour = objToday.getHours() > 12 ? objToday.getHours() - 12 : (objToday.getHours() < 10 ? "0" + objToday.getHours() : objToday.getHours()),
	curMinute = objToday.getMinutes() < 10 ? "0" + objToday.getMinutes() : objToday.getMinutes(),
	curSeconds = objToday.getSeconds() < 10 ? "0" + objToday.getSeconds() : objToday.getSeconds(),
	curMeridiem = objToday.getHours() > 12 ? "PM" : "AM";
    var today = curYear+"-"+curMonth+"-"+dayOfMonth+"T"+curHour+":"+curMinute;
    return today;

}

function Class(props) {
    const [classData , setClassData] = useState({
        _id: "",
        classBranch: '',
        classSection: '',
        classSubjectName: '',
        classSubjectCode: '',
        oldTests: [],
        scheduledTest: [] ,
        startTime: ""
    });
    const listStyle = listItemStyle();
     let user = props.location.state.user;
    let classId = props.location.state.classId;
    
    function startTest(id){

    }

    useEffect(() => {
        loadClassData();
    }, [])
    const loadClassData = async(event)=>{
        await  Axios.get('/Student/classData?' +"email="+ user.email+"&classId="+classId,{withCredentials: true},
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                // "Access-Control-Allow-Origin": "*",
               //"Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
            }
        })
        .then(data=>{
            setClassData(data.data);
        });
    }

     const today =getTime();
  
    return (
    
        <div className="class__list__block">
               
            <div style={{ backgroundImage : "url("+ "../Images/Student/head.png"+")" , }}
                className="list__details">
                    <h3 className="classDetails">Class : {classData.classBranch +" - "+classData.classSection}</h3>
                    <h3 className="subjectDetails">Subject : {classData.classSubjectName +" - "+classData.classSubjectCode}</h3>
            </div>
            <div className="completedTestBody">
                <h2 className="completedTest">Scheduled Tests / Running Test</h2>
                { (classData.scheduledTest && classData.scheduledTest.length>0 ) ?
                    <List component="nav" aria-label="secondary mailbox folder" >
                    <ListItem
                        className="student__testList__header">
                            <ListItemText
                             primary={
                                <div className="student__testList">
                                        <div className="student__testList__testname">
                                            {"Test Name"}
                                        </div>
                                        <div className="student__testList__time">
                                            {"Time"}
                                        </div>
                                </div>
                            } />
                    </ListItem> 
                    {classData.scheduledTest.map((test) => {
                    return (

                        <ListItem
                            style={listStyle}
                            >
    
                            <ListItemText primary={
                                <div className="student__testList">
                                        <div className="student__testList__testname">
                                            {test.testName}
                                        </div>
                                        <div className="student__testList__time">
                                            {test.date+" -- "+ test.startTime}
                                        </div>
                                </div>
                            } />
                            <ListItemSecondaryAction>
                                
                            {/* {today>=test.date+"T"+test.startTime && console.log(today , test.date , test.startTime)  */}
                            { true
                            &&
                                <Link 
                                style={{textDecorationLine:"none"}}
                                to={{
                                        pathname: "/attemptTest",
                                        
                                        state: { user: user , 
                                                classId : classData._id,
                                                testData : test,
                                                classSubjectName: classData.classSubjectName,
                                                classSubjectCode: classData.classSubjectCode
                                                }}}
                                        replace >                                 
                                        <Button
                                            style={{
                                                width:"100px" , 
                                                backgroundColor:"cyan"
                                            }}
                                        >Start</Button>
                                    </Link>
                            }
                            </ListItemSecondaryAction>
                        </ListItem> 
                    )
                    })
                }
                </List> 

                :
                <div className="emptyState" >
                <h2>Hurray!! You have no remaining Test</h2> 
                </div>      
                } 
            </div>
            <div className="completedTestBody">

                <h2 className="completedTest">Completed Tests</h2> 
                
                { (classData.oldTests && classData.oldTests.length >0 ) ?
                <List component="nav" aria-label="secondary mailbox folder" >
                    <ListItem
                        className="student__testList__header">
                            <ListItemText primary={
                                <div className="student__testList">
                                        <div className="student__testList__testname">
                                            {"Test Name"}
                                        </div>
                                        <div className="student__testList__time">
                                            {"Time"}
                                        </div>
                                </div>
                            } />
                    </ListItem> 
                    {    
                        classData.oldTests.map((test)=>{
                        return (
                            <div>
                                <ListItem
                                    style={listStyle} >
                                <ListItemText primary={
                                    <div className="student__testList">
                                            <div className="student__testList__testname">
                                                {test.testName}
                                            </div>
                                            <div className="student__testList__time">
                                                {test.date+" -- "+ test.startTime}
                                            </div>
                                        </div>
                                    } />                                    
                                <ListItemSecondaryAction
                                        style={{
                                            fontSize:"20px",
                                            fontWeight:"bold",
                                            paddingRight:"4%"
                                        }}
                                    >
                                    {test.marksObtained }
                                    </ListItemSecondaryAction>
                                </ListItem>
                            </div>
                            );
                        })
                    }
                </List>
                :
                <div className="emptyState" >
                    <h2>You have no past test</h2> 
                </div>
                }       
            </div>
        </div>
        
    )
 }


export default Class;
