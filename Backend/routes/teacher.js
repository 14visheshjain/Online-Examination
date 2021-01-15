const express = require('express');
const router = express.Router();

const Teacher=require("../models/Schemas").Teacher;
const Class = require("../models/Schemas").Class;
const Test = require("../models/Schemas").Test;
const QuestionPaper = require("../models/Schemas").QuestionPaper;

const {ensureAuthenticated ,forwardAuthenticated ,allowCrossDomain } = require('../config/auth.js');

router.post("/CreateClass",allowCrossDomain, function(req,res){
    // console.log("create Class  :",req.session);

    const Classdata = req.body ;
    const findData = {
        classBranch:Classdata.classBranch,
        classSection:Classdata.classSection,
        classSubjectCode:Classdata.classSubjectCode,
    }
    Class.findOne(findData ,function(err ,data){
        if(err){
            res.send("error");
        }else{
            if(data){
                res.status(201).send("class already created");
            }else{
                const email = req.body.email;
                const newClass = new Class(Classdata);
                newClass.save()
                .then((data)=>{
                    Teacher.findOneAndUpdate({email : email} , {$push : {classes : data._id}} , 
                    function(err,data){
                        if(err){
                            console.log(err);
                            res.status(500).send("error in adding class in teacher ");
                        }else{
                            res.status(200).send("insert ok");
                        }
                    }); 
                });
            }
        }
      
        
    })        
});

router.get("/getClassList/:email",allowCrossDomain, function(req,res){
    const email=req.params.email;
    const classList=[];

    Teacher.findOne({email:email},function(err,data){
        if(err){
            console.log(err);
        } else {
            if(data){
                const ClassIDs=data.classes;
                ClassIDs.forEach(function(id,index){
                    Class.findById(id,function(err,classData){
                        if(err){
                            console.log(err);
                        } else {
                            if(classData){
                                const specificData = {
                                    classId : classData._id,
                                    classBranch : classData.classBranch,
                                    classSection : classData.classSection,
                                    classSubjectCode : classData.classSubjectCode,
                                    classSubjectName : classData.classSubjectName,
                                };
                                classList.push(specificData);
                            } else {
                                console.log("ClassData is empty");
                            }
                        }

                        
                    })
                })
            } else {
                console.log("teacher ka classList data nhi hai");
            }
        }
    });
    setTimeout(() => {
        res.send(classList);  
    }, 1000);

});


router.get("/paperList",allowCrossDomain,function(req,res){
    const email=req.query.email;
    let paperList=[];

    Teacher.findOne({email:email},function(err,data){
        if(err){
            console.log(err);
        } else {
            if(data){
                const paperIDs=data.questionPaperIDs;
                paperIDs.forEach(function(id,index){
                    QuestionPaper.findById(id,function(err,paperData){
                        if(err){
                            console.log(err);
                        } else {
                            if(paperData){
                                const specificData = {
                                    paperName:paperData.paperName,
                                    paperCode:paperData.paperCode
                                };
                                paperList.push(specificData);
                               if(index === paperIDs.length-1 ){
                                   res.send(paperList);
                               }
                            } else {
                                console.log("PpaerData is empty");
                            }
                        }


                    })
                })
            } else {
                console.log("paper ka questionList data nhi hai");
            }
        }
    });
})

router.get("/classData" ,allowCrossDomain, function(req ,res){
    // console.log("teacher Class Data :",req.session);
    const email = req.query.email;
    const classId = req.query.classId;
    Class.findById(classId , function(err , data){
        if(err){
            res.send("error in finding  class data");
        }else{
            let newTest =[];
            let oldTest =[];
            console.log(data.students);
             data.scheduledTest.forEach(element => {
                 console.log(element);
                if(element.studentResponse.length === data.students.length ){
                    oldTest.push(element);
                }else{
                    newTest.push(element);
                }
            });
            data.scheduledTest = newTest;
            data.oldTests = [ ...oldTest , ...data.oldTests];
            console.log("old test",oldTest);
            console.log("now new data is printing",data);
            data.save();
            setTimeout(()=>{res.send(data);} , 100);
            
        }
    })
});


router.post("/assignTest" ,allowCrossDomain, function(req ,res){
    // console.log("assign Test :",req.session);
    // console.log(req.body);

    const classId=req.query.classId;
    // const email=req.query.email;

    // console.log(classId);
    // console.log(email);

    QuestionPaper.findOne({paperCode:req.body.questionPaperCode},function(err,found){
        if(err || !found){
            res.status(201).send("Question paper doesnot exist");
        }
    })

    Class.findOneAndUpdate({_id : classId} , {$push : {scheduledTest : req.body}} , 
        function(err,data){
            if(err){
                console.log(err);
                res.status(500).send("error in Scheduling test in teacher ");
            }else{
                res.status(200).send("insert ok");
            }
        }); 
});

router.post("/createPaper",allowCrossDomain,function(req,res){

    const newQuestionPaper=new QuestionPaper(req.body);
    const email=req.body.email;

    QuestionPaper.findOne({paperCode:newQuestionPaper.paperCode},function(err,found){
        if(err || found){
            res.status(201).send("paper code already exist");
        }
    })

    newQuestionPaper.save()
    .then((data)=>{
        Teacher.findOneAndUpdate({email : email} , {$push : {questionPaperIDs : data._id}} , 
        function(err,data){
            if(err){
                console.log(err);
                res.status(500).send("error in adding question paper in teacher ");
            }else{
                res.status(200).send("insert ok");
            }
        }); 
    });

    console.log(newQuestionPaper);

});

router.get("/paperList",allowCrossDomain,function(req,res){
    const email=req.query.email;
    let paperList=[];

    Teacher.findOne({email:email},function(err,data){
        if(err){
            console.log(err);
        } else {
            if(data){
                const paperIDs=data.questionPaperIDs;
                paperIDs.forEach(function(id,index){
                    QuestionPaper.findById(id,function(err,paperData){
                        if(err){
                            console.log(err);
                        } else {
                            if(paperData){
                                const specificData = {
                                    paperName:paperData.paperName,
                                    paperCode:paperData.paperCode
                                };
                                paperList.push(specificData);
                               if(index === paperIDs.length-1 ){
                                   res.send(paperList);
                               }
                            } else {
                                console.log("PpaerData is empty");
                            }
                        }


                    })
                })
            } else {
                console.log("paper ka questionList data nhi hai");
            }
        }
    });
})

module.exports = router;