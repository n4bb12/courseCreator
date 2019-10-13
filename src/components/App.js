import React from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import StreamList from './streams/streamList';
import StreamCreate from './streams/streamCreate';
import StreamEdit from './streams/streamEdit';
import StreamDelete from './streams/streamDelete';
import StreamShow from './streams/streamShow';
import Header from './header';

const App = () => {
    return (
    <div>
     <BrowserRouter>
     <Header />
      <div>
       <Route path ="/" exact component = {StreamList} />         
       <Route path ="/streams/create" exact component = {StreamCreate} />  
       <Route path ="/streams/edit" exact component = {StreamEdit} />  
       <Route path ="/streams/delete" exact component = {StreamDelete} />  
       <Route path ="/streams/show" exact component = {StreamShow} />  
      </div>
     </BrowserRouter>
    </div>
 );
}

export default App;