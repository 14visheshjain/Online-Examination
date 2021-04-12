const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

const Schema = require('../models/Schemas');
const {ensureAuthenticated ,forwardAuthenticated ,allowCrossDomain } = require('../config/auth.js');

router.post('/signUp' , (req ,res)=>{
    const userType = req.body.userType;
    if(userType === 'Student'){
        const studentData= req.body;

        Schema.Student.findOne({ email: req.body.email }).then(user => {
            if (user) {
                res.status(201).send({ msg: 'Student already exists' })
            } else {
               const newStudent = new Schema.Student(studentData);
      
              bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newStudent.password, salt, (err, hash) => {
                  if (err) throw err;
                    newStudent.password = hash;
                  newStudent
                    .save()
                    .then(user => {
                        res.send(studentData);
                    })
                    .catch(err =>{ 
                        console.log(err);
                        res.send(err)}
                    );
                });
              });
            }
          });
    }
    if(userType === 'Teacher'){
        const teacherData= req.body;

        Schema.Teacher.findOne({ email: req.body.email }).then(user => {
            if (user) {
                res.status(202).send({ msg: 'Teacher already exists' })
            } else {
               const newTeacher = new Schema.Teacher(teacherData);
      
              bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newTeacher.password, salt, (err, hash) => {
                  if (err) throw err;
                    newTeacher.password = hash;
                  newTeacher
                    .save()
                    .then(user => {
                        res.send(teacherData);
                    })
                    .catch(err =>{ 
                        console.log(err);
                        res.send(err)}
                    );
                });
              });
            }
        });
    }
})

// Login
router.post('/login', allowCrossDomain,(req, res, next) => {
  console.log("login " ,req.session);
    const userType = req.body.userType;
    if(userType==='Student'){
        passport.authenticate('StudentStrategy', )(req, res, function(err ,data){
          if(err){
            console.log(err);
            res.status(201).send(err);
          }
            res.send(req.user);
        });
    }else{
        passport.authenticate('TeacherStrategy', )(req, res, function(err ,data){
          if(err){
            res.status(201).send(err);
          } 
          res.send(req.user);
        });
    }   
});
router.get('/logout', allowCrossDomain,(req, res, next) => {
  req.logout();
  console.log("logout ");
  res.send("Logout");

});


router.get("/data",allowCrossDomain, function(req,res){
  console.log(" General login data :" ,req.session);

  if(!req.session.passport){
      res.status(401).send("not authenticated");
  }else{
      let user = {  email:req.session.passport.user.email,
          name : "Vishesh " ,
          collegeId : "391" ,
          userType : req.session.passport.user.userGroup,
          }
          res.status(201).send(user);
  }
       
});


module.exports = router;