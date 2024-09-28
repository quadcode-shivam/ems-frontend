import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import './Register.css'; // Importing CSS for styling

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/register', data);
      console.log(response.data); // You can display a success message or redirect
    } catch (error) {
      console.error('Error registering user:', error);
      // Handle error (e.g., display error message)
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit(onSubmit)} className="register-form">
        <h2>Register</h2>

        {/* Name Field */}
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            {...register('name', { required: 'Name is required' })}
          />
          {errors.name && <p className="error-message">{errors.name.message}</p>}
        </div>

        {/* Email Field */}
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
          />
          {errors.email && <p className="error-message">{errors.email.message}</p>}
        </div>

        {/* Password Field */}
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
          />
          {errors.password && <p className="error-message">{errors.password.message}</p>}
        </div>

        {/* Country Field */}
        <div className="form-group">
          <label>Country</label>
          <input
            type="text"
            placeholder="Enter your country"
            {...register('country', { required: 'Country is required' })}
          />
          {errors.country && <p className="error-message">{errors.country.message}</p>}
        </div>

        {/* State Field */}
        <div className="form-group">
          <label>State</label>
          <input
            type="text"
            placeholder="Enter your state"
            {...register('state', { required: 'State is required' })}
          />
          {errors.state && <p className="error-message">{errors.state.message}</p>}
        </div>

        {/* Mobile Field */}
        <div className="form-group">
          <label>Mobile</label>
          <input
            type="tel"
            placeholder="Enter your mobile number"
            {...register('mobile', { required: 'Mobile number is required', pattern: { value: /^[0-9]{10}$/, message: 'Invalid mobile number' } })}
          />
          {errors.mobile && <p className="error-message">{errors.mobile.message}</p>}
        </div>

        {/* Address Field */}
        <div className="form-group">
          <label>Address</label>
          <textarea
            placeholder="Enter your address"
            {...register('address', { required: 'Address is required' })}
          ></textarea>
          {errors.address && <p className="error-message">{errors.address.message}</p>}
        </div>

        {/* Submit Button */}
        <button type="submit" className="register-button">Register</button>
      </form>
    </div>
  );
};

export default Register;
