import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import "../auth/login.css";
import { loginUser } from 'api';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const { email, password } = data;
      const response = await loginUser(email, password);

      if (response.success) {
        // Store response data in local storage
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('token', response.token);

        // Redirect to the Employee Management page
        navigate('/admin/employees'); // Ensure the path starts with a '/'
      } else {
        // Show validation errors using toast
        toast.error(response.message || 'Login failed.');
      }
    } catch (error) {
      // Show generic error message using toast
      toast.error('An error occurred. Please try again.');
      console.error("Login failed:", error);
    }
  };

  return (
    <div className={'mainContainer'}>
      <div className={'titleContainer'}>
        <h2>Login</h2> {/* Changed to h2 for better semantics */}
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={'inputContainer'}>
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Invalid email format",
              },
            })}
            placeholder="Enter your email here"
            className={'inputBox'}
          />
          {errors.email && <label className="errorLabel">{errors.email.message}</label>}
        </div>
        <div className={'inputContainer'}>
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long",
              },
            })}
            placeholder="Enter your password here"
            className={'inputBox'}
          />
          {errors.password && <label className="errorLabel">{errors.password.message}</label>}
        </div>
        <div className={'inputContainer'}>
          <input className={'inputButton'} type="submit" value={'Log in'} />
        </div>
      </form>
    </div>
  );
};

export default Login;
