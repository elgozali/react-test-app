import React, { useState } from 'react';
import "./Login.scss";
import { setUserSession } from '../../components/Utils/Common';
import { useHistory } from "react-router-dom";

const Login = () => {
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
        validatePassword(event.target.value);
    }

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    }

    const validatePassword = () => {
        const errors = [];

        if (password.length < 8) {
            errors.push("Password should be at least 8 characters.");
        }

        if (!password.match(/[a-z]/)) {
            errors.push("Password should contain at least one lowercase letter.");
        }

        if (!password.match(/[A-Z]/)) {
            errors.push("Password should contain at least one uppercase letter.");
        }

        if (!password.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)) {
            errors.push("Password should contain at least one special character.");
        }

        return errors;
    };

    const handleLogin = (event) => {
        event.preventDefault();
        setLoading(true);
        const errors = validatePassword();
        // added a delay of 2 seconds to show the loading state
        setTimeout(() => {
            if (errors.length > 0) {
                setErrors(errors);
                setLoading(false);
            } else {
                // this is to generating random token
                const token = Math.random().toString(36).substr(2);
                let user = {
                    email: email,
                    password: password
                }
                setUserSession(token, user);
                setLoading(false);
                history.push("/home");
            }
        }, 2000);
    }

    return (
        <div className="container">
            <div className="login">
                <form onSubmit={handleLogin}>
                    <h1>Login</h1>
                    <input type="email" id="username" placeholder="Email address" name="email" value={email} onChange={handleEmailChange} />
                    <div className="password-input">
                        <input type={showPassword ? "text" : "password"} id="password" placeholder="Password" name="password" value={password} onChange={handlePasswordChange} />
                        <div className="toggle-password" onClick={handleTogglePassword}>
                            {showPassword ? <i className='fa fa-eye-slash'></i> : <i className='fa fa-eye'></i>}
                        </div>
                    </div>
                    {errors.length > 0 && (
                        <ul className="error-list">
                            {errors.map((error, index) => (
                                <li key={index}><span className='error'>{error}</span></li>
                            ))}
                        </ul>
                    )}
                    <button type="submit" disabled={loading}>
                        {loading ? <>Loading...<div className="spinner"><div></div><div></div><div></div><div></div></div></> : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
