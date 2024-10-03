import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom'; // Use useNavigate for redirection
import './Login.css'; // Importing the CSS file
import { loginUser } from '../../api'; // Adjust the path as necessary

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError, // To set error programmatically
  } = useForm();

  const navigate = useNavigate(); // Initialize useNavigate

  const onSubmit = async (data) => {
    try {
      const response = await loginUser(data); // Use the existing loginUser function

      // Clear old local storage data
      localStorage.removeItem('token'); // Remove old token if it exists
      localStorage.removeItem('user'); // Remove old user data if it exists

      // Save new token and user data in localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      // Redirect to admin/attendance
      navigate('/admin/attendance'); // Use navigate instead of history.push
    } catch (error) {
      console.error('Error logging in:', error);

      if (error.response && error.response.data) {
        const { message } = error.response.data; // Adjust this based on your API response structure
        setError("email", { type: "manual", message }); // Set error message on the email field
      } else {
        alert('Login failed. Please check your credentials and try again.');
      }
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit(onSubmit)} className="login-form">
      {errors.email && <p className="error-message">{errors.email.message}</p>}
        <h2>Login</h2>

        {/* Email Field */}
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            {...register('email', { 
              required: 'Email is required', 
              pattern: { 
                value: /^\S+@\S+$/i, 
                message: 'Invalid email format' 
              } 
            })}
          />
          
        </div>

        {/* Password Field */}
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            {...register('password', { 
              required: 'Password is required',
              minLength: { 
                value: 6, 
                message: 'Password must be at least 6 characters' 
              }
            })}
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="login-button">Login</button>

        {/* Links for Registration and Forgot Password */}
        <div className="form-links" style={{ display:"flex", justifyContent:"space-between" }}>
            <span onClick={() => navigate('/forgot-password')} className="link"> Forgot Password?</span>
            <span onClick={() => navigate('/register')} className="link">Register</span>
        </div>
      </form>
    </div>
  );
};

export default Login;
