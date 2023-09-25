import React, { useState } from "react";
import './index.css';

function SignupForm() {
    const [formData, setFormData] = useState({
        Firstname: "",
        Lastname: "",
        Email: "",
        Password: "",
        ConfirmPassword: "",
    });

    const [errors, setErrors] = useState({});

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


    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!formData.Firstname) {
            newErrors.Firstname = "First Name is required";
        }

        if (!formData.Lastname) {
            newErrors.Lastname = "Last Name is required";
        }

        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailPattern.test(formData.Email)) {
            newErrors.Email = "Invalid Email format";
        }

        if (formData.Password.length < 6) {
            newErrors.Password = "Password must be at least 6 characters";
        }

        if (formData.Password !== formData.ConfirmPassword) {
            newErrors.ConfirmPassword = "Passwords do not match";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            onSignup(formData);
        }
    };

    return (
        <div className="signup-container">
            <h2 className="signup-heading">Sign Up</h2>
            <form className="signup-form" onSubmit={handleSubmit}>
                <div className="input">
                    <input
                        type="text"
                        name="Firstname"
                        id="Firstname"
                        placeholder="first name"
                        className="signup-input"
                        value={formData.Firstname}
                        onChange={handleInputChange}
                    />
                    <div>
                        <span className="error">{errors.Firstname}</span>
                    </div>
                </div>
                <div className="input">
                    <input
                        type="text"
                        name="Lastname"
                        id="Lastname"
                        placeholder="last name"
                        className="signup-input"
                        value={formData.Lastname}
                        onChange={handleInputChange}
                    />
                    <div>
                        <span className="error">{errors.Lastname}</span>

                    </div>
                </div>
                <div className="input">
                    <input
                        type="email"
                        name="Email"
                        id="Email"
                        placeholder="email"
                        className="signup-input"
                        value={formData.Email}
                        onChange={handleInputChange}
                    />
                    <div>   <span className="error">{errors.Email}</span>
                    </div>
                </div>
                <div className="input">
                    <input
                        type="password"
                        name="Password"
                        id="Password"
                        placeholder="password"
                        className="signup-input"
                        value={formData.Password}
                        onChange={handleInputChange}
                    />
                    <div>   <span className="error">{errors.Password}</span>
                    </div>
                </div>
                <div className="input">
                    <input
                        type="password"
                        name="ConfirmPassword"
                        id="ConfirmPassword"
                        placeholder="Confirm password"
                        className="signup-input"
                        value={formData.ConfirmPassword}
                        onChange={handleInputChange}
                    />
                    <div>
                        <span className="error">{errors.ConfirmPassword}</span>
                    </div>
                </div>
                <button type="submit" className="signup-button">
                    Sign Up
                </button>
            </form>
            {/* <p>
                Already have an account? <Link to="/login">Login</Link>
            </p> */}
        </div>
    );
}

export default SignupForm;
