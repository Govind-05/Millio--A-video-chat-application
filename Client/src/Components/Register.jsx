import { useRef, useState } from "react"
import axios from "axios";
axios.defaults.withCredentials=true;


export default function Register(props) {

    const [diffPass, setDiffPass] = useState(true);
    const [passwordValue, setPasswordValue] = useState("");
    const [confPasswordValue, setConfPasswordValue] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState(false);
    const passwordRef = useRef();
    const usernameRef = useRef();
    const {setIsLogin}=props;

    const handlePassChange = (event) => {
        if (event.target.name === "password") {
            setPasswordValue(event.target.value)
            if (event.target.value === confPasswordValue) {
                setDiffPass(false);
            } else {
                setDiffPass(true);
            }
        } else {
            setConfPasswordValue(event.target.value);
            if (event.target.value === passwordValue) {
                setDiffPass(false);
            } else {
                setDiffPass(true);
            }
        }
        if (event.target.value === "") {
            setDiffPass(true);
        }

    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await axios.post(`${import.meta.env.VITE_DOMAIN}/registerUser`, {
            username: usernameRef.current.value,
            password: passwordRef.current.value
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        },{withCredentials:true})

        if (response.data.msg === 11000) {
            setError(true);
            setTimeout(() => {
                setError(false)
            }, 2000)
            setUsername("");
            setPasswordValue("");
            setConfPasswordValue("");
            setDiffPass(true);
        }else{
            setIsLogin(true);
        }


    }


    return (

        <form className="user-form" id="register-form" onSubmit={handleSubmit}>
            <input ref={usernameRef} type="text" placeholder="Enter Your Username" value={username} onChange={(e) => { setUsername(e.target.value) }} required spellCheck="false" />
            <input ref={passwordRef} type="password" value={passwordValue} onChange={handlePassChange} name="password" placeholder="Enter Your Password" required />
            <input type="password" value={confPasswordValue} onChange={handlePassChange} name="confPassword" placeholder="Confirm Your Password" required />
            {error && <span className="error-msg" style={{ fontWeight: "600" }}>*Username already exists!</span>}
            <button disabled={diffPass} type="submit" id="register-btn" style={{ marginTop: error && "2.4%" }}>SIGN UP</button>
        </form>

    )
}
