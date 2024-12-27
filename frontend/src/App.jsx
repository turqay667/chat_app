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

export const userContext=createContext()

function App() {
const [user,setUser]=useState(null)
  return (
   <userContext.Provider value={{user, setUser}}>
       <ThemeProvider>
<Routes>
  <Route path='/' Component={Register}/>
  <Route path='/login' Component={Login}/>
  <Route  exact path='/home' Component={Chat}/>
  <Route  exact path='/home/:id' Component={Chat}/>
  {/* <Route  path=`/home/:${user._id}` Component={Chat}/> */}
</Routes>
</ThemeProvider>
</userContext.Provider>






  )
}

export default App
