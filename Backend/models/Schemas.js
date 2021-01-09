const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema({
    firstName : String,
    lastName : String,
    email : String,
    password :String,
    collegeID : String,
    classes : [
        {
            classBranch : String,
            classSection : String,
            classSubjectCode : String,
            classSubjectName : String, 
        }
    ],
    questionPaperCodes :[ String],
}) ;


const StudentSchema = new mongoose.Schema({
    firstName : String,
    lastName : String,
    email : String,
    password :String,
    collegeID : String,
    enrolledClasses : [
        {
            subjectCode : String,
            subjectName : String, 
        }
    ],
}) ;

const TestSchema = new mongoose.Schema({
    testCode : String ,
    testName : String ,
    
    date : String,
    time : String,
    timeLimit : Number,

    maximumMarks : Number,
    questionPaperCode : String,
    studentResponse : [
        {
            studentId : String,
            answers :[Object],
            marks : Number
        }
    ]
    

});

const ClassSchema = new mongoose.Schema({
    teacherId : String,
    students : [  String],
    classBranch : String,
    classSection : String,
    classSubjectCode : String,
    classSubjectName : String, 
    scheduledTest : TestSchema,
    OldTests :[ TestSchema],
});

const QuestionPaperSchema = new mongoose.Schema({
    code : String ,
    questions : [Object],
});

const Type1 = new mongoose.Schema({
    question : String,
    type : Number ,
    choice1 : String,
    choice2 : String,
    choice3 : String,
    choice4 : String,
    answer : [Number],
    points :Number ,
});

const Type3 = new mongoose.Schema({
    question : String,
    type : Number ,
    answer :String,
    points :Number ,
});

const Type4 = new mongoose.Schema({
    question : String,
    type : Number ,
    answer :{
        data : Buffer,
        contentType : String,
    },
    points :Number ,
});

module.exports = {
    Teacher : new mongoose.model('Teacher' ,TeacherSchema),
    Student :  new mongoose.model('Student' ,StudentSchema),
    Test    : TestSchema,
    Class  : ClassSchema,
    QuestionPaper : QuestionPaperSchema,
    Type1         : Type1,
    Type3         : Type3,
    Type4         : Type4,
};