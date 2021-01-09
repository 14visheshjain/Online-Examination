import { Button } from '@material-ui/core';
import React ,{useState , useEffect} from 'react';
import PapersList from '../questionPapers/PapersList';
import './Papers.css';
import Type1 from './Type1';
import Type2 from './Type2';
import Type3 from './Type3';
import Type4 from './Type4';


const props = {
    subjectName : "",
    subjectCode : "",
    testName : "",
    questionPaper :{
    },
    minuteLimit : 0,
    maximumMarks : 0
}

function Papers() {
     
    const [ minutes, setMinutes ] = useState(0);
    const [seconds, setSeconds ] =  useState(0);

    function submit(){

    }
    const date = new Date();
    return (
        <div className="classtest">
            <div className="classtest__header">
                <div className="classtest__headerLeft">
                    <div className="classtest__headerSubjectName">
                        <p>{props.subjectName + " ["+props.subjectCode +"]"}</p>
                    </div>
                    <br />
                    <div className="classtest__headerTestName">
                        <p>{props.testName}</p>
                    </div>
                    <div className="classtest__headerMaxMarks">
                        <p>{"Maximum Marks : "+props.maximumMarks}</p>
                    </div>
                </div>
                <div className="classtest__headerRemTime">
                    <p>Time Left: {minutes+" : "+seconds}</p>
                </div>
            </div>
            <div className="classtest__body">
                 <Type1 />
                 <Type3 />
                 <Type4 />
                 <Type2 />
            </div>
            <div style={{
                            width : "fit-content",
                            margin:"20px auto"
                        }}>
                <Button style={{
                            width : "fit-content",
                            minWidth :"100px",
                            height:"50px",
                            borderBottom:"1px solid black",
                            backgroundColor:"white",
                            fontSize:"20px",
                            color:"purple",
                            fontWeight:"500",
                        }}
                        onClick={()=>{
                                submit();
                            }}   
                    >
                    Submit
                </Button>
            </div>
        </div>
    )
}

export default Papers;
