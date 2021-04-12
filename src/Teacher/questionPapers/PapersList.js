import React, { useEffect, useState } from 'react';
import PList from './PList';
import {Button} from '@material-ui/core'
import Axios from '../../Axios';
import { Redirect } from 'react-router';

import './PapersList.css';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

function PapersList(props) {
    // const user  =  props.location.state.user;
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
            loadPaperList(data);
          
           
            

        }).catch(err=>{
            updateLogout(true);
        });
    }

    const [paperList,setPaperList]=useState([]);

    // useEffect(() => {
    //     loadPaperList();
    // }, [])

    const loadPaperList = async(event)=>{
        await Axios.get('/Teacher/paperList?'+"email="+event.email,//{withCredentials: true},
        {
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            //  "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
            }
        })
        .then(data=>{
            setPaperList(data.data);
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
            <div className="papersList__body">
                <div style={{ backgroundImage : "url("+ "../Images/Student/head.png"+")" , }}
                    className="teacher__paperImage">
                        <h3 className="teacher__paperTitle">Your Question Papers</h3>
                </div>
                { (paperList && paperList.length > 0)?
                    <PList
                        papersList ={paperList}
                    />
                    :  
                    <div className="teacher__nopaper__emptyState" >
                        <h2>You have no previous question paper</h2> 
                    </div>

                }

                <div style={{
                            width : "fit-content",
                            margin:"20px auto"
                        }}>
                    <Link to={{
                            pathname: "/teacher/createPaper",
                            state: { user: user }
                        }} replace>
                        <Button style={{
                                    width : "200px",
                                    height:"50px",
                                    backgroundColor:"cyan",
                                    textDecorationLine:"none",
                                }}>
                                Create Test
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }
}

export default PapersList