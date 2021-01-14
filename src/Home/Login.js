import { FormControl, Input , FormHelperText, InputLabel, MenuItem, Select, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import React ,{useState} from 'react'
import Header from './Header';
import Footer from './Footer';
import Axios from '../Axios';
import './Login.css';
import {  Redirect} from 'react-router-dom';

const qs = require('querystring')

const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(1.4),
      fontSize: "16px",
      width:'250px'
      
    },
  }));
const defaultUser= {
    email : null ,
    password : null,
    userType : null
};

function Login() {
    const [user, setUser] = useState({...defaultUser})
    const[userLoginSuccess , setUserLogin] = useState(false);
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
     
        if( user.firstName ==="" ||  user.password=== ""||  user.userType === ""){
            alert("Fill all the fields");
            
        }else{ 
            await Axios.post('/login' , qs.stringify(user),{withCredentials: true},
            {
                headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                //  "Access-Control-Allow-Origin": "*",
                // "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
                }
            })
            .then(data=>{
                setUserLogin(true);
        })
        .catch(err => {
            alert("Invalid Email or Password");
        })
        }
    }
    if(userLoginSuccess){
        if(user.userType === "Teacher"){
            return <Redirect to={{
                pathname: "/teacher/dashboard",
                state: { email: user.email }
              }}

             /> 
        } else {
            return <Redirect to={{
                pathname: "/student/dashboard",
                state: { email: user.email }
              }}

             />         }   
    }
    return (
        <div>
        <Header/>
        <div className="login">
            <div className="login__header">
                <i className="fas fa-laptop-code"></i>
                <h1>Exam Master</h1>
            </div>
            <div className="login__body">
                <h2>Login</h2>
                <div className="login__input">
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
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem  value={"Teacher"}>Teacher</MenuItem>
                        <MenuItem value={"Student"}>Student</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div className="login__input">
                    <Input 
                        placeholder="Email"
                        type="email"
                        className={classes.selectEmpty}
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                    />
                </div>
                <div className="login__input">
                    <Input 
                        placeholder="Password"
                        type="password"    
                        className={classes.selectEmpty}
                        name = "password"
                        value={user.password}                        
                        onChange={handleChange}
                    />
                </div>
                <div className="login__input">
                    <Button
                        style={{backgroundColor : "lightBlue"}}
                        className={classes.selectEmpty}
                        onClick={onSubmit}
                     >Submit</Button>
                </div>
            </div>
        </div>
        <Footer />
        </div>
    )
}

export default Login;
