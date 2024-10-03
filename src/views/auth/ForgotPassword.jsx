// views/auth/ForgotPassword.jsx

import React from "react";
import { useForm } from "react-hook-form";
import './Login.css'; // Importing the CSS file
const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    // Handle password reset logic here (e.g., call API)
    console.log("Password reset request for email:", data.email);
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="forgot-password-form">
        {/* Email Field */}
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            {...register("email", { 
              required: "Email is required", 
              pattern: { 
                value: /^\S+@\S+$/i, 
                message: "Invalid email format" 
              } 
            })}
          />
          {errors.email && <p className="error-message">{errors.email.message}</p>}
        </div>

        {/* Submit Button */}
        <button type="submit" className="forgot-password-button">Reset Password</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
