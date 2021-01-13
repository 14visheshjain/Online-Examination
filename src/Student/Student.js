import React ,{useState}from 'react';
import Header from './General/Header';
import Footer from './General/Footer';
import StudentClass from './EnrolledClasses/ClassList';
import Dashboard from './Dashboard/Dashboard';
import Class from './class/Class';
import ClassTest from './ClassTest/ClassTest';
import EnrolledClass from './EnrolledClasses/ClassList';
import { Route } from 'react-router-dom/cjs/react-router-dom.min';
function Student(props) {
    const [joinClass, setJoinClass] = useState(false);
   
    return (
        <div>
          <Header
              email = {props.location.state.email}
          />
          <Route path='/student/dashboard' component={Dashboard}></Route>
          <Route path='/student/EnrolledClasses' component={EnrolledClass}></Route>
          <Route path='/student/class' component={Class}></Route>
          <Route path='/student/attemptTest' component={ClassTest}></Route>
          <Footer />
        </div>
    )
}

export default Student
