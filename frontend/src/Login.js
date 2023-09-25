import React, { useState } from "react";
import './index.css';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-hot-toast";
import ValidationMessage from "./common";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import swal from 'sweetalert';
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

function LoginForm({ setLoggedIn }) {
    const dispatch = useDispatch(); //Get the dispacth function
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({});
    const [loginError, setLoginError] = useState(null); // State to track login errors

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        setErrors({
            ...errors,
            [name]: "",
        });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email) {
            newErrors.email = ValidationMessage.LoginEmail;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = ValidationMessage.InvalidLoginemail;
        }
        if (!formData.password) {
            newErrors.password = ValidationMessage.LoginPassword;
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }
    const { email, password } = formData;
    const handleSubmit = (e) => {
        e.preventDefault();
        const isFormValid = validateForm();
        if (isFormValid) {
            try {
                axios.post('http://localhost:4000/LoginUser', { email, password })
                    .then(response => {
                        if (response.status === 200 && response?.data?.success == true) {
                            toast.success("Login Successfully");
                            navigate('/userdashboard')
                            // Call the "Create" API to fetch records
                        } else {
                            console.log('Login error:', response.data.message);
                            swal({
                                text: `${response.data.message}`,
                                icon: "error",
                                button: "OK",
                            });
                        }
                    })
                    .catch(postError => {
                        console.error('Login network error:', postError);
                        swal({
                            text: `${postError.response.data.error}`,
                            icon: "error",
                            button: "OK",
                        })
                    });
            } catch (error) {
                console.error('Network error:', error);
            }
        }
    };
    return (
        <div className="login-container">
            <h2 className="login-heading">Login</h2>
            <form className="login-form" onSubmit={handleSubmit}>
                <Box
                    component="form"
                    sx={{
                        "& > :not(style)": { m: 1, width: "25ch" }
                    }}
                    noValidate
                    autoComplete="off"
                ><div className="input">
                        <TextField
                            id="email"
                            label="Email"
                            variant="outlined"
                            type="email"
                            name="email"
                            className="login-input"
                            value={formData.email}
                            onChange={handleInputChange}

                        />
                        {errors.email && <div className="error" style={{ fontFamily: "Arial" }}>{errors.email}</div>}

                    </div>
                    <div className="input">
                        <TextField
                          id="password"
                            label="Password"
                            variant="outlined"
                            type="password"
                            name="password"
                            className="login-input"
                            value={formData.password}
                            onChange={handleInputChange}
                        />
                        {errors.password && <div className="error" style={{ fontFamily: "Arial" }}>{errors.password}</div>}
                    </div>
                </Box>
                <button type="submit" className="login-button" >
                    Login
                </button>
            </form>
            {loginError && <p className="error">{loginError}</p>} {/* Display the login error */}
            <div style={{ paddingTop: "20px" }}><p className="account" style={{ fontFamily: "Arial" }}>Create new account?  <Link to="/" style={{ fontFamily: "Arial", listStyle: "none" }}>  Register</Link></p></div>

        </div>
    );
}

export default LoginForm;
