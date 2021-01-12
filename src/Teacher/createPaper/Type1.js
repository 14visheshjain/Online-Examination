import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from '@material-ui/core';
import React ,{useState} from 'react';
import './Type1.css';

function Type1(props) {
    let ansOption;
    const [questionData, setQuestionData] = useState({
        questionStatement:"",
        points:"",
        option1:"",
        option2:"",
        option3:"",
        option4:""
    });

    function handleChange(event){
        event.preventDefault();
        const {name,value}=event.target;

        setQuestionData((prevData) => {
            return {
                ...prevData,
                [name]:value
            }
        })
        props.addQuestionData(questionData,props.id);
    }

    return (
        <div className="type1Teacher">
            <div className="type1__question">
            <TextField
                id="standard-textarea"
                label="Question Statement"
                placeholder="Question Statement"
                multiline
                name="questionStatement"
                value={questionData.questionStatement}
                color = 'secondary'
                onChange ={handleChange}
                style={{width:"100%"}}
            />
            </div>
            <div className="type1__points">
                    <TextField
                            id="standard-textarea"
                            label="Points"
                            placeholder="Points"
                            name="points"
                            value={questionData.points}
                            multiline
                            color = 'secondary'
                            onChange ={handleChange}
                            style={{width:"15%"}}
                        />
            </div>
            <div className="teachertype1__body">
                <div className="type1__optionsBlock">
                <FormControl component="fieldset" style={{width:"100%"}}>
                    <RadioGroup aria-label="gender" style={{width:"100%"}} name="ansOption" value={ansOption} onChange={handleChange}>
                        <FormControlLabel value="0" control={<Radio />} label={<TextField
                            id="standard-textarea"
                            placeholder="Option 1"
                            multiline
                            name="option1"
                            value={questionData.option1}
                            color = 'secondary'
                            onChange ={handleChange}
                            fullWidth="true"
                        />} />
                        <FormControlLabel value="1" control={<Radio />} label={<TextField
                            id="standard-textarea"
                            placeholder="Option 2"
                            multiline
                            name="option2"
                            value={questionData.option2}
                            color = 'secondary'
                            onChange ={handleChange}
                        />} />
                        <FormControlLabel value="2" control={<Radio />} label={<TextField
                            id="standard-textarea"
                            placeholder="Option 3"
                            multiline
                            name="option3"
                            value={questionData.option3}
                            color = 'secondary'
                            onChange ={handleChange}
                        />} />
                        <FormControlLabel value="3" control={<Radio />} label={<TextField
                            id="standard-textarea"
                            placeholder="Option 4"
                            multiline
                            name="option4"
                            value={questionData.option4}
                            color = 'secondary'
                            onChange ={handleChange}
                        />} />
                    </RadioGroup>
                </FormControl>
                </div>
                <div className="type1__marks">

                </div>
            </div>
            
        </div>
    )
}

export default Type1;
