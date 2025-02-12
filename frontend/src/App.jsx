import { createContext, useContext, useState } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-toastify/dist/ReactToastify.css";
import Login from './Login'
import Chat from './Chat';
import Register from './Register';
import { Route, Routes } from 'react-router-dom';
import ThemeProvider from './ThemeContext';
import io from "socket.io-client";
import AuthProvider from './AuthContext';
import PrivateRouter from './PrivateRouter';
import ApiProvider from './ApiContext';
function App() {
  return (
   <>

       <AuthProvider>
        <ApiProvider>
        <ThemeProvider>  
<Routes>
  <Route   path='/login' Component={Login}/>
  <Route   exact path='/' Component={Register} />
  <Route   path='/home' Component={Chat}/>
  <Route path='/home' Component={PrivateRouter}/>
  {/* <Route  exact path='/home/:id' Component={Chat}/> */}
  {/* <Route  path=`/home/:${user._id}` Component={Chat}/> */}
</Routes>
</ThemeProvider>
</ApiProvider>
</AuthProvider>
</>

  )
}

export default App
