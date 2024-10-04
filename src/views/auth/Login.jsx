import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom'; // Use useNavigate for redirection
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { loginUser } from '../../api'; // Adjust the path as necessary

const Login = () => {
  const { register, handleSubmit, formState: { errors }, setError } = useForm();
  const navigate = useNavigate(); // Initialize useNavigate
  const [rememberMe, setRememberMe] = useState(false); // Remember me state

  const handleSetRememberMe = () => setRememberMe(!rememberMe); // Toggle remember me

  const onSubmit = async (data) => {
    try {
      const response = await loginUser(data); // Use the existing loginUser function
      localStorage.removeItem('token'); // Clear old local storage data
      localStorage.removeItem('user'); 
      localStorage.setItem('token', response.token); // Save new token and user data
      localStorage.setItem('user', JSON.stringify(response.user));

      // Redirect to admin/attendance
      navigate('/admin/attendance'); 
    } catch (error) {
      console.error('Error logging in:', error);
      if (error.response && error.response.data) {
        const { message } = error.response.data; 
        setError("email", { type: "manual", message }); 
      } else {
        alert('Login failed. Please check your credentials and try again.');
      }
    }
  };

  return (
    <Box
      sx={{
        backgroundImage: '#fff',
        backgroundSize: 'cover',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Container maxWidth="sm">
        <Card>
          <Box
            sx={{
              backgroundColor: '#2196f3',
              color: 'white',
              padding: 2,
              textAlign: 'center',
              borderTopLeftRadius: '4px',
              borderTopRightRadius: '4px'
            }}
          >
            <Typography variant="h4" component="h1" gutterBottom>
              Sign in
            </Typography>
            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={2}>
                <Link href="#">
                  <FacebookIcon style={{ color:"#fff" }} />
                </Link>
              </Grid>
              <Grid item xs={2}>
                <Link href="#">
                  <GitHubIcon style={{ color:"#fff" }}/>
                </Link>
              </Grid>
              <Grid item xs={2}>
                <Link href="#">
                  <GoogleIcon style={{ color:"#fff" }}/>
                </Link>
              </Grid>
            </Grid>
          </Box>
          
          <Box sx={{ padding: 3 }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box mb={2}>
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  {...register('email', { 
                    required: 'Email is required', 
                    pattern: { 
                      value: /^\S+@\S+$/i, 
                      message: 'Invalid email format' 
                    } 
                  })}
                  error={!!errors.email}
                  helperText={errors.email ? errors.email.message : ''}
                />
              </Box>

              <Box mb={2}>
                <TextField
                  label="Password"
                  type="password"
                  fullWidth
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: { 
                      value: 6, 
                      message: 'Password must be at least 6 characters' 
                    }
                  })}
                  error={!!errors.password}
                  helperText={errors.password ? errors.password.message : ''}
                />
              </Box>

              <Box display="flex" alignItems="center">
                <Switch checked={rememberMe} onChange={handleSetRememberMe} />
                <Typography 
                  variant="body2" 
                  sx={{ cursor: 'pointer', ml: 1 }}
                  onClick={handleSetRememberMe}
                >
                  Remember me
                </Typography>
              </Box>

              <Box mt={3}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  fullWidth 
                  type="submit"
                >
                  Sign in
                </Button>
              </Box>
            </form>

            <Box mt={3} textAlign="center">
              <Typography variant="body2">
                Don&apos;t have an account?{' '}
                <Link href="/register" variant="body2" color="primary">
                  Sign up
                </Link>
              </Typography>
            </Box>

            <Box mt={1} textAlign="center">
              <Typography
                variant="body2"
                color="primary"
                sx={{ cursor: 'pointer' }}
                onClick={() => navigate('/forgot-password')}
              >
                Forgot Password?
              </Typography>
            </Box>
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

export default Login;
