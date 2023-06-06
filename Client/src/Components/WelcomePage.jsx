import { useEffect, useState } from "react"
import Cookies from 'js-cookie'
import "../Assets/Styles/welcome-page.css"
import loginPageImg from "../Assets/Images/loginpageImg.jpg"
import LoginPage from "./LoginPage"
import Room from "./Room"

export default function WelcomePage() {

  const [isLogin,setIsLogin]=useState(false);

  useEffect(()=>{
    if(Cookies.get("username")!=null||Cookies.get("username")!=undefined){
      setIsLogin(true);
    }
    console.log(Cookies.get("username"))
  },[]);

  return (
    <>
      <div className="login-container">
        <div className="login-img">
          <img src={loginPageImg} alt="login page image" />
        </div>
        <div className="login-details">
          <div className="title">
            <span>MIILIO</span>
          </div>
        
          {isLogin?<Room setIsLogin={setIsLogin}/>:<LoginPage setIsLogin={setIsLogin}/> }
        </div>
      </div>
    </>
  )
}
