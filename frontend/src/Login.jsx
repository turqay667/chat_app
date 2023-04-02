import axios from "axios"
const Login=(props)=>{
    const handleSubmit=(e)=>{
      e.preventDefault();
      const {value}=e.target[0];
      // props.onLogin({username:value,secret:value})
      axios.post("http://localhost:3001/authenticate",
      {username:value}
      )
      .then(result=>props.onLogin({...result.data,secret:value}))
      .catch(err=>console.log("Authentication error",err))
    }
    return (
        <div className="container chat-login">
<h2 className="text-center pb-5">Welcome to Chat app</h2>
<div className="justify-content-center row mt-4">
    <div className="col-md-4">
    <h4 className="mb-3">set a username to continue</h4>
    <form onSubmit={handleSubmit}>
    <div className="card">
<div className="mb-3">
<label >Username</label>
<input type="text" placeholder="enter your username" className="form-control" name="username" required/>
</div>
<div>
<label>Password</label>
<input type="password" placeholder="enter your password" className="form-control"/>
</div>
<div className="log-submit mt-4">
<button type="submit" className="btn btn-danger">Login</button>
</div>
</div>
</form>
</div>
         
</div>
</div>
    )
}
export default Login;