const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const session = require('express-session');
const passport = require('passport');
require('dotenv').config();

// mongoose connection
const db_url = "mongodb+srv://admin:"+ "77YDVesgrUVqBPuZ"+"@cluster0.gygcf.mongodb.net/OnlineExaminationSystem?retryWrites=true&w=majority";
mongoose.connect(db_url , {useNewUrlParser:true ,useUnifiedTopology: true,useCreateIndex : true });


const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// app.use(express.cookieParser());
app.use(cors());

// Passport Config (strategy , ser , deserialize) 
require('./config/passport')(passport);


// express session
app.use(session({
    name :'connect.oesbackend.id',
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
     maxAge :3600000,
    expires:false,
    cookie: {    
       name :'connect.oesbackend.id',
      expires:false,
}
}));

// passport middleware
app.use(passport.initialize());
app.use(passport.session());



// API's
app.get('/' ,function(req,res){
    res.status(200).send("Hello World");
});

app.listen(9000 , function(req ,res){
    console.log("Server is running at port 9000...");
});

app.use('/', require('./routes/home.js'));
app.use('/Teacher',require('./routes/teacher.js'));
app.use('/Student',require('./routes/Student.js'));
