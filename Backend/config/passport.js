const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const Schema = require('../models/Schemas');

const Student = Schema.Student;
const Teacher = Schema.Teacher;

module.exports = function(passport){
    passport.use(
       'StudentStrategy',  new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
          // Match user
          Student.findOne({
            email: email
          }).then(user => {
            if (!user) {
              return done(null, false, { message: 'That email is not registered' });
            }
    
            // Match password
            bcrypt.compare(password, user.password, (err, isMatch) => {
              if (err) throw err;
              if (isMatch) {
                return done(null, user);
              } else {
                return done(null, false, { message: 'Password incorrect' });
              }
            });
          });
        })
      );
      passport.use(
        'TeacherStrategy',  new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
           // Match user
           Teacher.findOne({
             email: email
           }).then(user => {
             if (!user) {
               return done(null, false, { message: 'That email is not registered' });
             }
     
             // Match password
             bcrypt.compare(password, user.password, (err, isMatch) => {
               if (err) throw err;
               if (isMatch) {
                 return done(null, user);
               } else {
                 return done(null, false, { message: 'Password incorrect' });
               }
             });
           });
         })
       );
    
      function SessionConstructor(userId, userGroup, details , name ,collegeId) {
        this.userId = userId;
        this.userGroup = userGroup;
        this.email = details;
        this.name = name;
        this.collegeId = collegeId;
      }

      passport.serializeUser(function (userObject, done) {
        // userObject could be a Model1 or a Model2... or Model3, Model4, etc.
        let userGroup = "Student";
        let userPrototype =  Object.getPrototypeOf(userObject);
        
        if (userPrototype === Student.prototype) {
            userGroup = "Student";
        } else if (userPrototype === Teacher.prototype) {
            userGroup = "Teacher";
        }
        console.log("detaisls " , userObject);

        let sessionConstructor = new SessionConstructor(userObject.id, userGroup , userObject.email , userObject.firstName+" "+userObject.lastName , userObject.collegeID);
        done(null,sessionConstructor);
      });



      passport.deserializeUser(function (sessionConstructor, done) {
        if (sessionConstructor.userGroup == 'Student') {
          Student.findOne({
              _id: sessionConstructor.userId
          }, '-localStrategy.password', function (err, user) { // When using string syntax, prefixing a path with - will flag that path as excluded.
              done(err, user);
          });
        } else if (sessionConstructor.userGroup == 'Teacher') {
          Teacher.findOne({
              _id: sessionConstructor.userId
          }, '-localStrategy.password', function (err, user) { // When using string syntax, prefixing a path with - will flag that path as excluded.
              done(err, user);
          });
        }
      });  
};