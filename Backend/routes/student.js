const express = require('express');
const router = express.Router();

const Student=require("../models/Schemas").Student;
const Class = require("../models/Schemas").Class;
const QuestionPaper = require("../models/Schemas").QuestionPaper;
const {ensureAuthenticated ,forwardAuthenticated ,allowCrossDomain } = require('../config/auth.js');

router.post("/JoinClass",allowCrossDomain, function(req,res){

    console.log("join class " ,req.session);
    
    const Classdata = req.body ; 
    const email = req.body.email;
//    console.log(email );
//    console.log(Classdata)
    Student.findOne({email :email}, function(err ,data){
        if(err){
            res.send("student not found");
        }
        const studentId = data._id;
        Class.findOne({
            classBranch : Classdata.classBranch,
            classSection :Classdata.classSection,
            classSubjectCode : Classdata.classSubjectCode} , function(err, cdata){
              //  console.log(cdata);
                if(err) {
                    res.send("error occured")
                }else{
                    if(cdata){
                        const classId = cdata._id;
                        const temp ={
                            classBranch : cdata.classBranch,
                            classSection : cdata.classSection,
                            classSubjectCode : cdata.classSubjectCode,
                            classSubjectName : cdata.classSubjectName,
                            classId: classId,
                        }
                        if(("filter",data.enrolledClasses.filter(e=>e.classId+""=== classId+"")).length>0){
                            res.status(201).send("already joined this class");
                        }else{
                            cdata.students.push(studentId);
                            cdata.save();
                            
                             data.enrolledClasses.push(temp); 
                            data.save();
                            res.send("insert successful");
                        }  
                    }else{
                        res.status(202).send("class not found");
                    }
                }
        });
    })    
});


router.get("/getClassList/:email",allowCrossDomain, function(req,res){
    console.log("getclasslist " ,req.passport);
    console.log("getclasslist " ,req.session.passport.user);

        
   // const email = req.params.email;

    const email = req.session.passport.user.email;

        Student.findOne({email :email}, function(err ,data){
            if(err){
                res.send("student not found");
            }
            res.send(data.enrolledClasses);
         });
});

router.get("/classData" ,allowCrossDomain, function(req ,res){
    console.log("class data : " ,req.session);
    const email = req.query.email;
    const classId = req.query.classId;
    Class.findById(classId , function(err , data){
        if(err){
            res.send("error in finding  class data");
        }
        const dataToSend = {
            ...data._doc
        };
        const newTest = [];
        const oldTests = [];

        dataToSend.scheduledTest.forEach((test )=>{
            let cur = null;
            if(test.studentResponse.findIndex(function(t){ cur =t; if(t.studentEmail == email)return 1;}) >=0 ){
                oldTests.push(   
                    {
                        testCode : test.testCode ,
                        testName : test.testName ,
                        date : test.date,
                        startTime : test.startTime,
                        questionPaperCode : test.questionPaperCode,
                        marksObtained : cur.marks,
                    }
                );
            }else{
                newTest.push(   
                    {
                        testCode : test.testCode ,
                        testName : test.testName ,
                        date : test.date,
                        startTime : test.startTime,
                        questionPaperCode : test.questionPaperCode,
                    }
                );
            }
            
        });
        dataToSend.scheduledTest = newTest;
        dataToSend.oldTests.forEach((test )=>{
            let cur= null; 
            test.studentResponse.forEach(function(t){ cur =t; })
            oldTests.push(   
                {
                    testCode : test.testCode ,
                    testName : test.testName ,
                    date : test.date,
                    startTime : test.startTime,
                    questionPaperCode : test.questionPaperCode,
                    marksObtained : cur.marks,
                }
            );
        });
        dataToSend.oldTests = oldTests;
        setTimeout(() => {
            res.send(dataToSend);
        }, 500);
      
    })
});

router.get("/attempTest",allowCrossDomain,function(req,res){
    const questionPaperCode = req.query.questionPaperCode;
    console.log("attempttest " ,req.session);
    QuestionPaper.findOne({paperCode : questionPaperCode} , function(err ,data){
        if(err){
            res.send("No Question  paper found or not assigned any paper");
        }else{
            if(!data){
                res.send("no question paper for req test");
            }else{
                res.status(200).send({
                    maximumMarks : data.maximumMarks,
                    questionsList:  data.questionsList,
                    timeLimit : data.timeLimit
                });
            }
        }
    });
})

router.post("/attempTest",allowCrossDomain,function(req,res){
    const {studentEmail , classId , testCode,testName ,questionPaperCode ,
        response , maximumMarks} = req.body;
    QuestionPaper.findOne({paperCode : questionPaperCode}, function(err ,Paperdata){
        if(err || !Paperdata){
            //res.send("question paper not found");
        }
                
        Class.findById(classId , function(err ,data){
            data.scheduledTest.map((aTest , outerIndex)=>{
                if(aTest.testCode== testCode && aTest.testName==testName){
                    if(("filter",aTest.studentResponse.filter(e=>e.studentEmail+""=== studentEmail+"")).length>0){
                    }else{
                        let actualAnswer = Paperdata.answerList;
                        let marksScored = 0 ;
                        response.forEach((studentAnswer , index)=>{
                            if(studentAnswer.toString() === actualAnswer[index].toString() ){
                                marksScored = marksScored +Number(Paperdata.questionsList[index].points);
                            }
                            if(index === response.length-1){
                                aTest.studentResponse.push(
                                    { studentEmail : studentEmail,
                                       response : response,
                                        marks : Number(marksScored)+"/"+maximumMarks
                                    }
                                )
                            return aTest;
                              
                            }
                        })
                    }
                
                }else{
                        return aTest;
                }
            });
            setTimeout(()=>{
                data.save(function(err , data){
                   if(err){
                    console.log(err)
                   }else{
                   }
                });
            },1000);
        });          
    });
    setTimeout(() => {
        res.send("inserted");  
    }, 1000);
});

router.get("/data",allowCrossDomain, function(req,res){
    console.log(" student login data :" ,req.session);

    if(!req.session.passport){
        res.status(401).send("not authenticated");
    }else{
        let user = {  email:req.session.passport.user.email,
            name : req.session.passport.user.name ,
            collegeId : req.session.passport.user.collegeId 
            }
            res.status(201).send(user);
    }
         
});

module.exports = router;