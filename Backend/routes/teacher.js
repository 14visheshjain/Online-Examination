const express = require('express');
const router = express.Router();

const Teacher=require("../models/Schemas").Teacher;
const Class = require("../models/Schemas").Class;
const {ensureAuthenticated ,forwardAuthenticated ,allowCrossDomain } = require('../config/auth.js');

router.post("/CreateClass",allowCrossDomain, function(req,res){
    // console.log("create Class  :",req.session);

    const Classdata = req.body ;
    
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
    

        
});

router.get("/getClassList/:email",allowCrossDomain, function(req,res){
    console.log("teacher get Class list Data :",req.session);
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
                               if(index === ClassIDs.length-1 ){
                                   res.send(classList);
                               }
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
});

router.get("/classData" ,allowCrossDomain, function(req ,res){
    // console.log("teacher Class Data :",req.session);
    const email = req.query.email;
    const classId = req.query.classId;
    Class.findById(classId , function(err , data){
        if(err){
            res.send("error in finding  class data");
        }else{
            res.send(data);
        }
    })
});


router.post("/assignTest" ,allowCrossDomain, function(req ,res){
    // console.log("assign Test :",req.session);
    console.log(req.body);
    
});

router.post("/createPaper",allowCrossDomain,function(req,res){
    console.log(req.body);
    res.send("paper created");
});

module.exports = router;