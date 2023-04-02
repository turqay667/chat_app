import { useState } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Login'
import Chat from './Chat';

function App() {
  const [user, setUser] = useState(undefined);

  return (
    <div className="App">
{
 user ? <Chat user={user}/> : <Login onLogin={(user)=>setUser(user)}/>
}
    </div>
  )
}

export default App
