import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Admin from './components/Admin';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import Header from './components/commons/header';
import Enroll from './components/enroll-course/enroll';
import CourseView from './components/course-view/course-view';


const Routes = () => {
    return (
    <div>
     <BrowserRouter>
     <Header />
      <div>
       <Route path ="/" exact component = {Home} />         
       <Route path ="/dashboard" exact component = {Dashboard} />  
       <Route path ="/admin" exact component = {Admin} />  
       <Route path ="/enroll" exact component = {Enroll} /> 
       <Route path ="/view-course" exact component = {CourseView} /> 
      </div>
     </BrowserRouter>
    </div>
 );
};

export default Routes;