
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-toastify/dist/ReactToastify.css";
import Login from "./Components/Login"
import Chat from './Components/Chat';
import Register from './Components/Register';
import { Route, Routes } from 'react-router-dom';
import ThemeProvider from './Context.jsx/ThemeContext';
import AuthProvider from './Context.jsx/AuthContext';
import PrivateRouter from './PrivateRouter';
import ApiProvider from './Context.jsx/ApiContext';
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
</Routes>
</ThemeProvider>
</ApiProvider>
</AuthProvider>
</>

  )
}

export default App
