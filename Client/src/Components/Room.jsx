import { useState,useRef } from "react"
import "../Assets/Styles/room-page.css"
import Cookies from 'js-cookie'
import axios from "axios";
import {useNavigate} from "react-router-dom"

export default function Room(props) {

    const [joinRoom, setJoinRoom] = useState(false);
    const roomCodeRef=useRef();

    const navigate=useNavigate();
    const {setIsLogin}=props;

    const handleLogout = async () => {
        Cookies.remove('username');
        const response = await axios.post(`${import.meta.env.VITE_DOMAIN}/logoutUser`, {
            headers: {
                'Content-Type': 'application/json'
            }
        }, { withCredentials: true });
        setIsLogin(false)
    }

    const handleJoin=(e)=>{
        e.preventDefault();

        navigate(`/meet?meetId=${roomCodeRef.current.value}`)
        

    }

    const meetId=String(Math.floor(Math.random()*10000));

    const handleCreateRoom=()=>{
        navigate(`/meet?meetId=${Cookies.get("username")}-${meetId}`)
    }

    return (
        <>
            {!joinRoom ?
                <>
                    <div className="user-type">
                        <span>Create or Join an Existing Room</span>
                    </div>
                    <form className="user-form room-form" >
                        <button type="button" onClick={handleCreateRoom}>CREATE A ROOM</button>
                        <button type="button" onClick={() => { setJoinRoom(true) }}>JOIN A ROOM</button>
                    </form>
                    <div className="toggle-login-container">
                        <span className="toggle-login-info">Want to use another Account?</span>
                        <span className="toggle-login" onClick={handleLogout}>Click Here To LOGOUT</span>
                    </div>
                </>
                :
                <>
                    <div className="user-type">
                        <span>Join an Existing Room</span>
                    </div>
                    <form className="user-form room-form" onSubmit={handleJoin}>
                        <input ref={roomCodeRef} type="text" placeholder="Enter Code" required spellCheck="false" />
                        <button type="Submit">JOIN ROOM</button>
                    </form>
                    <div className="toggle-login-container">
                        <span className="toggle-login-info">Want to create your Room?</span>
                        <span className="toggle-login" onClick={() => { setJoinRoom(false) }}>Click Here To Go Back</span>
                    </div>
                </>
            }

        </>
    )
}
