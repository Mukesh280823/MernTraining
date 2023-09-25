import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import ValidationMessage from './common';
import { toast } from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from "axios";
import swal from 'sweetalert';
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";



const styles = {
    showPasswordButton: {
        margin: "0px 350px",
        position: 'relative',
        '&.password-button': {
            position: 'absolute',
            padding: "10px 20px",
        },
        '&.confirm-password-button': {
        },
    },
    container: {
        maxWidth: '400px',
        margin: '0 auto',
        marginTop: '130px',
        padding: '20px',
        border: '1px solid #eaeaea',
        borderRadius: '5px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    heading: {
        textAlign: 'center',
        color: '#333',
        fontSize: '24px',
        marginBottom: '20px',
    },
    input: {
        width: "380px",
        padding: '0px',
        marginBottom: '20px',
        border: '1px solid #eaeaea',
        borderRadius: '5px',
        fontSize: '16px',
        backgroundColor: '#f8f8f8',
    },
    error: {
        color: 'red',
        fontSize: '14px',
        marginTop: '-10px',
        marginBottom: '15px',
    },
    submitButton: {
        width: '100%',
        padding: '15px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '18px',
        transition: 'background-color 0.3s ease-in-out',
    },
    loginLink: {
        textAlign: 'center',
        marginTop: '15px',
    },
    loginLinkAnchor: {
        color: '#007bff',
        textDecoration: 'none',
    },
    loginLinkAnchorHover: {
        textDecoration: 'underline',
    },
};
function RegistrationForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };
    const [formErrors, setFormErrors] = useState({});

    const handleInputChange = (e) => {

        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {

        const errors = {};
        if (!formData.firstName) {
            errors.firstName = ValidationMessage.InvaidFirstname;
          } else if (!/^[A-Za-z]+$/.test(formData.firstName)) {
            errors.firstName = "Use only Alphabets";
          }
        if (!formData.lastName) {
            errors.lastName = ValidationMessage.InvalidLastname;
          } else if (!/^[A-Za-z]+$/.test(formData.lastName)) {
            errors.lastName = "Use only Alphabets";
          }
        if (!formData.email.trim()) {
            errors.email = ValidationMessage.emailReq;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = ValidationMessage.Invalidemail;
        }
        const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&*!])[A-Za-z\d@#$%^&*!]{6,}$/;
        if (!formData.password) {
            errors.password = ValidationMessage.pwdReq;
        } else if (!passwordPattern.test(formData.password)) {
            errors.password = ValidationMessage.InvalidPasswordFormat;
        }

        if (!formData.confirmPassword) {
            errors.confirmPassword = ValidationMessage.confirmpassword;
        } else if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = ValidationMessage.InvalidConfirmPass;
        }

        setFormErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isFormValid = validateForm();
        if (isFormValid) {
            console.log("dggchsh", formData);
            const { firstName, lastName, email, password, confirmPassword } = formData;
            try {
                const response = await axios.post('http://localhost:4000/register', { firstName, lastName, email, password, confirmPassword }).then(responsdData => {
                    if (responsdData.data.message === 'User registered successfully') {
                        toast.success(" User registered successfully");
                        navigate('/login'); // Navigate to the login page on success
                    } else {
                        swal({
                            text: `${responsdData.data.message}`,
                            icon: "error",
                            button: "OK",
                        });
                        console.log('Registration error:', responsdData.data.message);
                    }
                });
            } catch (error) {
                console.log('Network error:', error);
            }
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Registration</h2>
            <form onSubmit={handleSubmit} method='POST'>
                <Box
                    component="form"
                    sx={{
                        "& > :not(style)": { m: 1, width: "25ch" }
                    }}
                    noValidate
                    autoComplete="off"
                >  <div>
                        <TextField
                            className='input'
                            id="firstName"
                            label="First Name"
                            variant="outlined"
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            style={styles.input}
                        />

                        {formErrors.firstName && (<p style={{ ...styles.error, fontFamily: "Arial" }}>{formErrors.firstName}</p>)}

                    </div>
                    <div>
                        <TextField
                            id="lastName"
                            label="Last Name"
                            variant="outlined"
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            style={styles.input}
                        />

                        {formErrors.lastName && <p style={{ ...styles.error, fontFamily: "Arial" }}>{formErrors.lastName}</p>}
                    </div>
                    <div>
                        <TextField
                            id="email"
                            label="Email"
                            variant="outlined"
                            type="text"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            style={styles.input}
                        />

                        {formErrors.email && <p style={{ ...styles.error, fontFamily: "Arial" }}>{formErrors.email}</p>}
                    </div>
                    <div style={{ position: "relative" }}>
                        <TextField
                            id="password"
                            label="Password"
                            variant="outlined"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            placeholder='Example- Admin@123'
                            onChange={handleInputChange}
                            style={styles.input}
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            style={{ position: "absolute", marginLeft: "340px", marginTop: "-60px" }}

                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                        {formErrors.password && <p style={{ ...styles.error, fontFamily: "Arial" }}>{formErrors.password}</p>}
                    </div>
                    <div style={{ position: "relative" }}>
                        <TextField
                            id="confirmPassword"
                            label="Confirm Password"
                            variant="outlined"
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            style={styles.input}
                        />
                        <button
                            type="button"
                            onClick={toggleConfirmPasswordVisibility}
                            // style={styles.showPasswordButton}
                            style={{ position: "absolute", marginLeft: "340px", marginTop: "-60px" }}
                        >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                        {formErrors.confirmPassword && (
                            <p style={{ ...styles.error, fontFamily: "Arial" }}>{formErrors.confirmPassword}</p>
                        )}
                    </div>
                    <button
                        type="submit"
                        style={styles.submitButton}
                        onClick={handleSubmit}
                    >
                        Register
                    </button>

                </Box>  </form>
            <div style={styles.loginLink}>
                <p style={{ fontFamily: "Arial" }}>
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        style={{ ...styles.loginLinkAnchor, fontFamily: "Arial" }}
                    >
                        Login
                    </Link>
                </p>
            </div>

        </div>
    );
}

export default RegistrationForm;
