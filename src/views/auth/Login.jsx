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

      // Save token and user data in localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      // Redirect to admin/attendance
      navigate('/admin/attendance'); // Use navigate instead of history.push
    } catch (error) {
      console.error('Error logging in:', error);

      // Assuming the error response contains a message field
      // Here you can set the error message from the API response to the email or password field
      if (error.response && error.response.data) {
        const { message } = error.response.data; // Adjust this based on your API response structure
        setError("email", { type: "manual", message }); // Set error message on the email field
      } else {
        // Handle other errors or set a generic message
        alert('Login failed. Please check your credentials and try again.');
      }
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit(onSubmit)} className="login-form">
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
          {errors.email && <p className="error-message">{errors.email.message}</p>}
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
          {errors.password && <p className="error-message">{errors.password.message}</p>}
        </div>

        {/* Submit Button */}
        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  );
};

export default Login;
