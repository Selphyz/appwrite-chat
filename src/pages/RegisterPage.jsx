import React from 'react';
import {useAuth} from "../utils/AuthContext.jsx";
import {Link} from "react-router-dom";

const RegisterPage = () => {
    const {handleUserRegister} = useAuth();
    const [credentials, setCredentials] = React.useState({name: "", email: "", password: "", password2: ""});
    const handleChange = (e) => {
        setCredentials({...credentials, [e.target.name]: e.target.value});
    }
    return (
        <div className="auth--container">
            <div className="form--wrapper">
                <form onSubmit={(e) => handleChange(e)}>
                    <div className="field--wrapper">
                        <label>Name</label>
                        <input type="text" required name="name"
                               placeholder="Enter your email" value={credentials.name}
                               onChange={(e) => handleChange(e)}/>
                    </div>
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
                        <label>Repeat your Password:</label>
                        <input type="password" required name="password2"
                               placeholder="Confirm your password" value={credentials.password2}
                               onChange={(e) => handleChange(e)}/>
                    </div>
                    <div className="field--wrapper">
                        <input className="btn btn--lg btn--main" type="submit" value="Login"/>
                    </div>
                </form>
                <p>Already have an account? Login <Link to="/login">here</Link></p>
            </div>
        </div>
    );
};

export default RegisterPage;