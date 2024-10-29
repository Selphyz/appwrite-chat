import {useEffect, useState} from "react";
import {useAuth} from "../utils/AuthContext.jsx";
import {Link, useNavigate} from "react-router-dom";

function Login() {
    const {user, handleUserLogin} = useAuth();
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({email: '', password: ''});
    useEffect(() => {
        if(user) {
            navigate('/');
        }
    }, []);

    const handleChange = (e) => {
        setCredentials({...credentials, [e.target.name]: e.target.value});
    }

    return (
    <div className="auth--container">
        <div className="form--wrapper">
            <form onSubmit={(e)=>handleUserLogin(e, credentials)}>
                <div className="field--wrapper">
                    <label>Email:</label>
                    <input type="email" required name="email"
                           placeholder="Enter your email" value={credentials.email}
                           onChange={(e) => handleChange(e)}/>
                </div>
                <div className="field--wrapper">
                    <label>Password:</label>
                    <input type="password" required name="password"
                           placeholder="Enter your password" value={credentials.password}
                           onChange={(e) => handleChange(e)}/>
                </div>
                <div className="field--wrapper">
                    <input className="btn btn--lg btn--main" type="submit" value="Login"/>
                </div>
            </form>
            <p>Don&#39;t have an account? Register <Link to="/register">here</Link></p>
        </div>
    </div>
    );
}

export default Login;