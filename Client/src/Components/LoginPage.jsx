import { useState } from "react"
import "../../public/Styles/login-page.css"
import Login from './Login'
import Register from './Register'

export default function LoginPage() {

  const [formType, setFormType] = useState(true);

  return (
    <>
      <div className="login-container">
        <div className="login-img">
          <img src="../../public/Images/Loginpage.jpg" alt="login page image" />
        </div>
        <div className="login-details">
          <div className="title">
            <span>MIILIO</span>
          </div>

          {
            formType ?
              <>
                <div className="user-type">
                  <span>Already Members</span>
                </div>
                <Login />
                <div className="toggle-login-container">


                  <span className="toggle-login-info">Don't have an account yet?</span>
                  <span className="toggle-login" onClick={() => setFormType(false)}>Create an account</span></div>
              </>

              :
              <>
                <div className="user-type">
                  <span>New Member</span>
                </div>
                <Register />
                <div className="toggle-login-container">
                  <span className="toggle-login-info">Already have an account?</span>
                  <span className="toggle-login" onClick={() => setFormType(true)}>Login here</span>
                </div>
              </>
          }
        </div>
      </div>
    </>
  )
}
