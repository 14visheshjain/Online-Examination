import React ,{useState, useEffect} from 'react';
import CList from './CList';
import Header from '../General/Header';
import Footer from '../General/Footer';
import { Button } from '@material-ui/core';
import './ClassList.css';
import Axios from '../../Axios';
import { Redirect } from 'react-router';

const qs = require('querystring')

function TeacherClass(props) {
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
            loadClassList(data);
          
           
            

        }).catch(err=>{
            updateLogout(true);
        });
    }

    const [newClass, setNewClass] = useState(false);
    const [classFormData,setClassFormData]=useState({
        classBranch:"",
        classSection:"",
        classSubjectName:"",
        classSubjectCode:"",
        email : user.email,
    });
    const [enrolledClasses,setEnrolledClasses]=useState([]);

    // useEffect(() => {
    //     loadClassList();
    //   }, []);

    const loadClassList = async(event)=>{
        //console.log("load class list",event.email);
        await Axios.get('/Teacher/getClassList/'+event.email,{withCredentials: true},
        {
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            //  "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
            }
        })
        .then(data=>{
            setEnrolledClasses(data.data);
            });
    }

    function changed(event){
        const {name,value}=event.target;

        setClassFormData((prevData) => {
            return ({
                ...prevData,
                [name]:value
            });
        })
    }


    const submitted = async(event)=>{
        event.preventDefault();

        if( classFormData.classBranch ==="" ||  classFormData.classSection=== ""||  classFormData.classSubjectCode === "" || classFormData.classSubjectName === ""){
            alert("Fill all the fields");
            
        }else{ 
            await Axios.post('/Teacher/CreateClass' , qs.stringify(classFormData),//{withCredentials: true},
            {
                headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                 "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
                }
            })
            .then(data=>{
                if(data.status===201){
                    alert("Class Already Create")
                }else{
                    loadClassList();
                   
                }
                setNewClass(false);
        });
        }
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
            <div className="classList__body">
                <div style={{ backgroundImage : "url("+ "../Images/Student/head.png"+")" , objectFit:"center"}}
                    className="teacher__classlist__details">
                        <h3 className="teacher__head">Your Classes</h3>
                </div>
                { (enrolledClasses && enrolledClasses.length >0)?
                    <CList
                        enrolledClasses ={enrolledClasses}
                        user = {user}
                        />
                    :  
                    <div className="teacher__noclass__emptyState" >
                        <h2>You have not any class</h2> 
                    </div>
                }
            <div style={{
                                width : "fit-content",
                                margin:"20px auto"
                            }}>
                    <Button style={{
                                width : "200px",
                                height:"50px",
                                backgroundColor:"cyan",
                                fontSize :"1rem",
                            }}
                            onClick={()=>{
                                    setNewClass((prev)=>{return !prev;});
                                }}
                            
                        >
                            New Class
                    </Button>
                </div>

                {newClass &&
                    <div className="teacher__newClass">
                        <input 
                            name="classBranch"
                            type="text" 
                            placeholder="Branch"
                            onChange={changed}
                            value={classFormData.classBranch}
                            />
                        <input 
                            name="classSection"
                            type="text" 
                            placeholder="Section"
                            onChange={changed}
                            value={classFormData.classSection}
                            />
                        <input 
                            type="text" 
                            name="classSubjectName"
                            placeholder="Subject Name"
                            onChange={changed}
                            value={classFormData.classSubjectName}
                            />
                        <input 
                            type="text" 
                            name="classSubjectCode"
                            placeholder="Subject Code"
                            onChange={changed}
                            value={classFormData.classSubjectCode}
                            />
                        <div style={{
                                width : "fit-content",
                                margin:"20px auto"
                            }}>
                            
                            <div className="teacher__createButton">
                                <Button style={{
                                            width : "200px",
                                            height:"50px",
                                            backgroundColor:"cyan",
                                            textDecorationLine :"none",
                                        }}

                                        onClick={submitted}
                                >
                                        Create
                                </Button>
                            </div>
                        </div>
                    </div>
                }
            </div>
            </div>
        )
    }
}

export default TeacherClass
