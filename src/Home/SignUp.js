import { FormControl, Input , FormHelperText, InputLabel, MenuItem, Select, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import React , {useState , useEffect} from 'react'
import Header from './Header';
import Footer from './Footer';
import Axios from '../Axios';
import './SignUp.css';
import { Redirect } from 'react-router-dom';

const qs = require('querystring')

const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(1),
      fontSize: "16px",
      width:'280px',
            
    },
  }));
const defaultUser= {
    firstName :"",
    lastName:"",
    email : null ,
    password : null,
    userType : null,
    collegeID:"",
};

function SignUp() {
    const [user, setUser] = useState({...defaultUser})
    const[userLoginSuccess , setUserLogin] = useState(false);

    useEffect(() => { 
        loadUserData();
    }, []);
  
        const loadUserData = async(event)=>{
        await  Axios.get('/data' ,{withCredentials: true},
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                // "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
                    }
        })
        .then(data=>{
            data =data.data;
            console.log("login data ",data);
            setUser(prev => {return {...prev , name : data.name , collegeId : data.collegeId , userType : data.userType};})
            setUserLogin(true);
        }).catch(err=>{
        });
    }


    const classes = useStyles();
  
    function handleChange(event){
        const {name , value} = event.target;
        setUser( ( prev)=>{
            return {
                  ...prev ,
                  [name] : value
            };
        })
    }
    const onSubmit = async(event)=>{
        event.preventDefault();
     
        if( user.firstName ==="" || user.lastName===""|| user.email === "" ||
        user.password=== ""||  user.userType === ""|| user.collegeID==="" ){
            alert("Fill all the fields");
            return;
        }    
        await Axios.post('/signUp' , qs.stringify(user),
        {
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        .then(data=>{
            if(data.status===201){
                alert("Student Already Exists");
            }else if (data.status === 202){
                alert("Teacher Already Exists");
            }else{
                setUserLogin(true);
            }
        });

    }

 if(userLoginSuccess){
        if(user.userType === "Teacher"){
            return <Redirect to={{
                pathname: "/teacher/dashboard",
                state: { user: {  email: user.email,
                                    name :user.firstName+" "+user.lastName ,
                                    collegeId : user.collegeID
                                } 
                       }
              }}

             /> 
        } else {
            return <Redirect to={{
                pathname: "/student/dashboard",
                state: {  user: {  email: user.email,
                                    name :user.firstName+" "+user.lastName ,
                                    collegeId : user.collegeID
                                } 
                        }
              }}

             />}   
    }

    return (
        <div className="signUp">
        <Header/>
        <div className="login">
            <div className="login__header">
                <i style={{color:" #ffbdb3"}} className="fas fa-laptop-code"></i>
                <h1>Examster</h1>
            </div>
            <div className="login__body">
                <h2>Sign Up</h2>
                <div className="name">
                    <div className="input__field">
                        <Input 
                            placeholder="First Name"
                            type="text" 
                            name ="firstName"
                            value={user.firstName}
                            onChange={handleChange}   
                        />
                    </div>
                    <div className="input__field">
                        <Input 
                        name ="lastName"
                            placeholder="Last Name"
                            type="text" 
                            value={user.lastName}
                            onChange={handleChange}      
                        />
                    </div>
                </div>
                <div className="input__field">
                    <Input 
                        placeholder="Email"
                        type="email"
                        name ="email"
                        className={classes.selectEmpty}
                        value={user.email}
                        onChange={handleChange}   
                    />
                </div>
                <div className="input__field">
                    <Input 
                        name ="password"
                        placeholder="Password"
                        type="password"    
                        className={classes.selectEmpty}
                        value={user.password}
                        onChange={handleChange}   
                    />
                </div>
                <div className="input__field" style={{marginLeft:"-7px"}}>
                    <FormControl required className={classes.formControl}>

                        <InputLabel id="demo-simple-select-required-label">User Type</InputLabel>
                        <Select
                            labelId="demo-simple-select-required-label"
                            id="demo-simple-select-required"
                            value={user.userType}
                            onChange={handleChange}   
                            name="userType"
                            className={classes.selectEmpty}
                        >
                            
                            <MenuItem  value={"Teacher"}>Teacher</MenuItem>
                            <MenuItem value={"Student"}>Student</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div className="input__field">
                    <Input 
                        placeholder="Teacher / Student Id"
                        type="text" 
                        name="collegeID"   
                        className={classes.selectEmpty}
                        value={user.collegeID}
                        onChange={handleChange}   
                        
                    />
                </div>
                <div className="input__field">
                    <Button
                        className={classes.selectEmpty}
                        style={{width:'100%' , backgroundColor:"#ffbdb3"}}
                        onClick={onSubmit}
                     >Submit</Button>
                </div>

               
            </div>
        </div>
        <Footer />
        </div>
    )
}

export default SignUp;
