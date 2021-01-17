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
                console.log("Teacher's classList is empty");
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
                                console.log("PaperData is empty");
                            }
                        }


                    })
                })
            } else {
                console.log("Paper's questionList data is not there");
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
             data.scheduledTest.forEach(element => {
                if(element.studentResponse.length === data.students.length ){
                    oldTest.push(element);
                }else{
                    newTest.push(element);
                }
            });
            data.scheduledTest = newTest;
            data.oldTests = [ ...oldTest , ...data.oldTests];
            data.save();
            setTimeout(()=>{res.send(data);} , 100);
            
        }
    })
});


router.post("/assignTest" ,allowCrossDomain, function(req ,res){
    // console.log("assign Test :",req.session);

    const classId=req.query.classId;

    QuestionPaper.findOne({paperCode:req.body.questionPaperCode},function(err,found){
        if(err || !found){
            res.status(201).send("Question paper doesnot exist");
        }else{
            Class.findOneAndUpdate({_id : classId} , {$push : {scheduledTest : req.body}} , 
                function(err,data){
                    if(err){
                        console.log(err);
                        res.status(500).send("error in Scheduling test in teacher ");
                    }else{
                        res.status(200).send("insert ok");
                    }
                });
        }
    })

     
});

router.post("/createPaper",allowCrossDomain,function(req,res){

    const newQuestionPaper=new QuestionPaper(req.body);
    const email=req.body.email;

    QuestionPaper.findOne({paperCode:newQuestionPaper.paperCode},function(err,found){
        if(err || found){
            res.status(201).send("paper code already exist");
        } else {
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
        }
    })
});

module.exports = router;