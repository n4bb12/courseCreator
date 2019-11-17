import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Admin from './components/Admin';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import Header from './components/header';


const Routes = () => {
    return (
    <div>
     <BrowserRouter>
     <Header />
      <div>
       <Route path ="/" exact component = {Home} />         
       <Route path ="/dashboard" exact component = {Dashboard} />  
       <Route path ="/admin" exact component = {Admin} />  
      </div>
     </BrowserRouter>
    </div>
 );
};

export default Routes;