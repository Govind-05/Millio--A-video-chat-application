import { useRef, useState } from "react";
import axios from "axios";

export default function Login() {

  const [error,setError]=useState(false);
  const [username,setUsername]=useState("");
  const [password,setPassword]=useState("");
  const usernameRef=useRef();
  const passwordRef=useRef();

  const handleChange=(e)=>{
    if(e.target.name==="username"){
      setUsername(e.target.value);
    }else{
      setPassword(e.target.value);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await axios.post(`${import.meta.env.VITE_DOMAIN}/loginUser`, {
      username: usernameRef.current.value,
      password: passwordRef.current.value
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (response.data.msg === "error") {
      setError(true);
      setTimeout(() => {
        setError(false)
      }, 2000)
    }else{
      console.log(response.data.msg);
    }

    setUsername("");
    setPassword("");
    
  }


  return (

    <form className="user-form" onSubmit={handleSubmit}>
      <input ref={usernameRef} type="text" name="username" value={username} onChange={handleChange} placeholder="Enter Your Username" required spellCheck="false" />
      <input ref={passwordRef} type="password" name="password" value={password} onChange={handleChange} placeholder="Enter Your Password" required />
      {error && <span style={{ fontWeight: "600" }}>*Invalid Credentials!</span>}
      <button type="submit" style={{ marginTop: error && "2.4%" }}>SIGN IN</button>
    </form>

  )
}
