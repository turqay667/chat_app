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
function App() {
  return (
   <>

       <AuthProvider>
        <ThemeProvider>  
<Routes>
  <Route exact path='/' Component={Register} />
  <Route path='/login' Component={Login}/>
  <Route   path='/home' Component={Chat}/>
  {/* <Route  exact path='/home/:id' Component={Chat}/> */}
  {/* <Route  path=`/home/:${user._id}` Component={Chat}/> */}
</Routes>
</ThemeProvider>
</AuthProvider>
</>






  )
}

export default App
