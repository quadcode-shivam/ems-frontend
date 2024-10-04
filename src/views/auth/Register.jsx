import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import './Register.css'; // Importing CSS for styling
import axios from 'axios';
import { fetchDesignationsAndPositionsApi } from 'api';
import { useNavigate } from 'react-router-dom';
import Loader from 'views/Loader/Loader';

const Register = () => {
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();  // For navigation
  const [designations, setDesignations] = useState([]);
  const [positions, setPositions] = useState([]);
  const { control, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/admin/employees/create", data);
      setSuccessMessage('Successfully registered! Redirecting to login...');
      setLoading(false);
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/login')
      }, 2000);
    } catch (error) {
      console.error('Error registering user:', error);
      // Handle error (e.g., display error message)
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchDesignationsAndPositions = async () => {
      setLoading(true);
      try {
        const response = await fetchDesignationsAndPositionsApi();
        setDesignations(response.designations);
        setPositions(response.positions);
      } catch (error) {
        setError("Failed to load designations and positions. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDesignationsAndPositions();
  }, []);

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit(onSubmit)} className="login-form">
        <h2>Register</h2>

        {successMessage && (
          <div style={{ color: 'green', textAlign: 'center', marginBottom: '20px' }}>
            {successMessage}
          </div>
        )}

        {/* Name Field */}
        <Controller
          name="user_name"
          type="text"
          control={control}
          defaultValue=""
          rules={{ required: 'Name is required' }}
          render={({ field }) => (
            <TextField
              className="mb-3 mt-2"
              {...field}
              label="Name"
              fullWidth
              error={!!errors.user_name}
              helperText={errors.user_name?.message}
              variant="outlined"
              InputProps={{
                style: { backgroundColor: '#333', color: '#e0e0e0' },
              }}
            />
          )}
        />

        {/* Email Field */}
        <Controller
          name="user_email"
          control={control}
          type="text"
          defaultValue=""
          rules={{
            required: 'Email is required',
            pattern: {
              value: /^\S+@\S+$/i,
              message: 'Email is invalid',
            },
          }}
          render={({ field }) => (
            <TextField
              className="mb-3 mt-2"
              {...field}
              label="Email"
              fullWidth
              error={!!errors.user_email}
              helperText={errors.user_email?.message}
              variant="outlined"
              InputProps={{
                style: { backgroundColor: '#333', color: '#e0e0e0' },
              }}
            />
          )}
        />

        {/* Password Field */}
        <Controller
          name="password"
          control={control}
          defaultValue=""
          rules={{ required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } }}
          render={({ field }) => (
            <TextField
              className="mb-3 mt-2"
              {...field}
              label="Password"
              type="password"
              fullWidth
              error={!!errors.password}
              helperText={errors.password?.message}
              variant="outlined"
              InputProps={{
                style: { backgroundColor: '#333', color: '#e0e0e0' },
              }}
            />
          )}
        />

        {/* Country Field */}
        <Controller
          name="country"
          control={control}
          defaultValue=""
          rules={{ required: 'Country is required' }}
          render={({ field }) => (
            <TextField
              className="mb-3 mt-2"
              {...field}
              label="Country"
              fullWidth
              error={!!errors.country}
              helperText={errors.country?.message}
              variant="outlined"
              InputProps={{
                style: { backgroundColor: '#333', color: '#e0e0e0' },
              }}
            />
          )}
        />

        {/* State Field */}
        <Controller
          name="state"
          control={control}
          defaultValue=""
          rules={{ required: 'State is required' }}
          render={({ field }) => (
            <TextField
              className="mb-3 mt-2"
              {...field}
              label="State"
              fullWidth
              error={!!errors.state}
              helperText={errors.state?.message}
              variant="outlined"
              InputProps={{
                style: { backgroundColor: '#333', color: '#e0e0e0' },
              }}
            />
          )}
        />

        {/* Mobile Field */}
        <Controller
          name="phone"
          control={control}
          defaultValue=""
          rules={{ required: 'Mobile number is required', pattern: { value: /^[0-9]{10}$/, message: 'Invalid mobile number' } }}
          render={({ field }) => (
            <TextField
              className="mb-3 mt-2"
              {...field}
              label="Mobile"
              fullWidth
              error={!!errors.phone}
              helperText={errors.phone?.message}
              variant="outlined"
              InputProps={{
                style: { backgroundColor: '#333', color: '#e0e0e0' },
              }}
            />
          )}
        />

        {/* Address Field */}
        <Controller
          name="address"
          control={control}
          defaultValue=""
          rules={{ required: 'Address is required' }}
          render={({ field }) => (
            <TextField
              className="mb-3 mt-2"
              {...field}
              label="Address"
              fullWidth
              error={!!errors.address}
              helperText={errors.address?.message}
              variant="outlined"
              multiline
              rows={4}
              InputProps={{
                style: { backgroundColor: '#333', color: '#e0e0e0' },
              }}
            />
          )}
        />
        
        <Controller
          name="account_type"
          control={control}
          defaultValue="employee"
          render={({ field }) => (
            <TextField
              type="hidden"
              {...field}
            />
          )}
        />
        
        <Controller
          name="designation"
          control={control}
          defaultValue=""
          rules={{ required: "Designation is required" }}
          render={({ field }) => (
            <FormControl
              className="mb-3 mt-2"
              fullWidth
              error={!!errors.designation}
            >
              <InputLabel>Designation</InputLabel>
              <Select {...field}>
                {loading ? (
                  <MenuItem disabled>
                    <Loader size={24} />
                  </MenuItem>
                ) : (
                  designations.map((designation) => (
                    <MenuItem
                      key={designation.id}
                      value={designation.title}
                    >
                      {designation.title}
                    </MenuItem>
                  ))
                )}
              </Select>
              {errors.designation && (
                <span className="text-danger">
                  {errors.designation.message}
                </span>
              )}
            </FormControl>
          )}
        />

        {/* Position Field */}
        <Controller
          name="position"
          control={control}
          defaultValue=""
          rules={{ required: "Position is required" }}
          render={({ field }) => (
            <FormControl
              className="mb-3 mt-2"
              fullWidth
              error={!!errors.position}
            >
              <InputLabel>Position</InputLabel>
              <Select {...field}>
                {loading ? (
                  <MenuItem disabled>
                    <Loader size={24} />
                  </MenuItem>
                ) : (
                  positions.map((position) => (
                    <MenuItem key={position.id} value={position.title}>
                      {position.title}
                    </MenuItem>
                  ))
                )}
              </Select>
              {errors.position && (
                <span className="text-danger">
                  {errors.position.message}
                </span>
              )}
            </FormControl>
          )}
        />

        {/* Submit Button */}
        <button type="submit" className="login-button">REGISTER</button>

        <div className="form-links">
          <p style={{ color: '#7289DA', textAlign: 'center', marginTop: '10px' }}>
            Already have an account?
          </p>
          <p style={{ color: '#7289DA', textAlign: 'center', marginTop: '5px' }}>
            <span className="link">Forgot Password?</span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;