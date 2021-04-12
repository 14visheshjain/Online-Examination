import React ,{useState , useEffect}from 'react';
import CList from './CList';
import { Button } from '@material-ui/core';
import './ClassList.css';
import Axios from '../../Axios';
import {  Redirect} from 'react-router-dom';

const qs = require('querystring')

function ClassList(props) {
    // const user = props.location.state.user;


      //  const user = props.location.state.use;
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
    const defaultFormData={
        classBranch : "",
        classSection : "",
        classSubjectCode : "",
        email : user.email,
    };
    const [joinClass, setJoinClass] = useState(false);
    const [enrolledClasses , setEnrolledClasses] = useState([
        // {
        //     classSubjectName : "Machine Learning",
        //     classSubjectCode : "CO326",
        // }
    ]);
    const [joinClassFormData , setFormdata] = useState(defaultFormData);


    function handleChange(event ){
        event.preventDefault();
        const {name ,value} = event.target;
        setFormdata((prev)=>{
            return {
                ...prev,
                [name] : value,
            }; 
        })
    }
    const onSubmit = async(event)=>{
        event.preventDefault();
        console.log(joinClassFormData);
        if( joinClassFormData.className ==="" ||  joinClassFormData.classBranch=== ""|| 
            joinClassFormData.classSubjectCode === ""){
            alert("Fill all the fields");
            
        }else{ 
           await  Axios.post('/Student/JoinClass' , qs.stringify(joinClassFormData),{withCredentials: true},
            {
                headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                //  "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
                }
            })
            .then((data)=>{
                console.log(data);
                if(data.status===201){
                    alert("Already Joined this class");
                }else if (data.status === 202){
                    alert("Class with provided details doesn't exists. Try Again" );
                }
                return loadClassList();
            });
        }
    }

    useEffect(() => { 
        loadClassList();
    }, []);
  
  const loadClassList = async(event)=>{
    await  Axios.get('/Student/getClassList/'+joinClassFormData.email ,{withCredentials: true},
    {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            // "Access-Control-Allow-Origin": "*",
           "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
                   }
    })
    .then(data=>{
        console.log("classlist",data);
        if(data.status===401){
            console.log("redirect kyo nhi hua 401");
            return <Redirect to={{
                pathname: "/login",
              }}

             />
        }else{
            setEnrolledClasses(data.data);
            setJoinClass(false);
            setFormdata(defaultFormData);
        }

       
    })
    .catch(err=>{

        console.log("redirect kyo nhi" , err);
        return <Redirect to={{
            pathname: "/login",
          }}

         />
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
                <div className="classList__body">
                <div style={{ backgroundImage : "url("+ "../Images/Student/head.png"+")" , objectFit:"center"}}
                    className="classlist__details">
                        <h3 className="head">Your Enrolled Class</h3>
                </div>
                    { (enrolledClasses && enrolledClasses.length >0) ?
                        <CList
                            user = {user}
                            enrolledClasses ={enrolledClasses}
                            />
                        :  
                        <div className="emptyState" >
                            <h2>You have not enrolled any class</h2> 
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
                                }}
                                onClick={()=>{
                                        setJoinClass((prev)=>{return !prev;});
                                    }}
                                
                            >
                                Join Class
                        </Button>
                    </div>

                    {joinClass &&
                        <div className="student__joinClass">
                            <input 
                                type="text" 
                                placeholder="Branch"
                                name ="classBranch"
                                onChange={handleChange}
                                value={joinClassFormData.classBranch}
                            
                                />
                                <input 
                                type="text" 
                                placeholder="Section"
                                name ="classSection"
                                onChange={handleChange}
                                value={joinClassFormData.classSection} 
                                />
                                <input 
                                type="text" 
                                placeholder="Subject Code"
                                name ="classSubjectCode"
                                onChange={handleChange}
                                value={joinClassFormData.classSubjectCode} 
                                />
                            <div style={{
                                    width : "fit-content",
                                    margin:"20px auto"
                                }}>
                                
                                <div className="student__joinButton">
                                    <Button style={{
                                                width : "200px",
                                                height:"50px",
                                                backgroundColor:"cyan",
                                            }}
                                        onClick={onSubmit}  
                                        >
                                            Join
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

export default ClassList;
