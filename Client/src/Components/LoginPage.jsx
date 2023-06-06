import { useState } from 'react';
import Login from './Login'
import Register from './Register'

export default function LoginPage(props) {

    const [formType, setFormType] = useState(true);
    const {setIsLogin}=props;

    return (
        <>
            {formType ?
                <>
                    <div className="user-type">
                        <span>Already Members</span>
                    </div>
                    <Login setIsLogin={setIsLogin}/>
                    <div className="toggle-login-container">
                        <span className="toggle-login-info">Don't have an account yet?</span>
                        <span className="toggle-login" onClick={() => setFormType(false)}>Create an account</span>
                    </div>
                </>

                :
                <>
                    <div className="user-type">
                        <span>New Member</span>
                    </div>
                    <Register setIsLogin={setIsLogin}/>
                    <div className="toggle-login-container">
                        <span className="toggle-login-info">Already have an account?</span>
                        <span className="toggle-login" onClick={() => setFormType(true)}>Login here</span>
                    </div>
                </>
            }
        </>

    )
}
