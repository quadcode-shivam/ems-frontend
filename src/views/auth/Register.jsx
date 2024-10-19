import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  Box,
  Container,
  Typography,
} from "@mui/material";
import axios from "axios";
import { fetchDesignationsAndPositionsApi } from "api"; // Adjust this import according to your project structure
import { useNavigate } from "react-router-dom";
import Loader from "views/Loader/Loader"; // Adjust according to your project structure
import "./Register.css"; // Importing CSS for styling

const Register = () => {
  const [designations, setDesignations] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  // Submit Handler
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/admin/employees/create",
        data
      ); // Adjust the URL accordingly
      setSuccessMessage("Successfully registered! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Error registering user:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetching designations and positions
  useEffect(() => {
    const fetchDesignationsAndPositions = async () => {
      setLoading(true);
      try {
        const response = await fetchDesignationsAndPositionsApi();
        console.log(response); // Log the response to check the structure
        setDesignations(response.designations);
        setPositions(response.positions);
      } catch (error) {
        console.error(error); // Log any error to debug
        setError(
          "Failed to load designations and positions. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDesignationsAndPositions();
  }, []);

  return (
    <Box
      sx={{
        backgroundImage: "#fff",
        backgroundSize: "cover",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container maxWidth="sm">
        <Card>
          <Box
            sx={{
              backgroundColor: "#2196f3",
              color: "white",
              padding: 2,
              textAlign: "center",
              borderTopLeftRadius: "4px",
              borderTopRightRadius: "4px",
            }}
          >
            <Typography variant="h4" component="h1" gutterBottom>
              Register
            </Typography>
          </Box>

          <Box sx={{ padding: 3 }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              {successMessage && (
                <Typography color="green" align="center" gutterBottom>
                  {successMessage}
                </Typography>
              )}

              {/* Name Field */}
              <Controller
                name="user_name"
                control={control}
                defaultValue=""
                rules={{ required: "Name is required" }}
                render={({ field }) => (
                  <TextField
                    label="Name"
                    fullWidth
                    error={!!errors.user_name}
                    helperText={errors.user_name?.message}
                    variant="outlined"
                    {...field}
                    sx={{ backgroundColor: "#fff", marginBottom: 2 }}
                  />
                )}
              />

              {/* Email Field */}
              <Controller
                name="user_email"
                control={control}
                defaultValue=""
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email format",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    label="Email"
                    fullWidth
                    error={!!errors.user_email}
                    helperText={errors.user_email?.message}
                    variant="outlined"
                    {...field}
                    sx={{ backgroundColor: "#fff", marginBottom: 2 }}
                  />
                )}
              />

              {/* Password Field */}
              <Controller
                name="password"
                control={control}
                defaultValue=""
                rules={{
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    variant="outlined"
                    {...field}
                    sx={{ backgroundColor: "#fff", marginBottom: 2 }}
                  />
                )}
              />

              {/* Country Field */}
              <Controller
                name="country"
                control={control}
                defaultValue=""
                rules={{ required: "Country is required" }}
                render={({ field }) => (
                  <TextField
                    label="Country"
                    fullWidth
                    error={!!errors.country}
                    helperText={errors.country?.message}
                    variant="outlined"
                    {...field}
                    sx={{ backgroundColor: "#fff", marginBottom: 2 }}
                  />
                )}
              />

              {/* State Field */}
              <Controller
                name="state"
                control={control}
                defaultValue=""
                rules={{ required: "State is required" }}
                render={({ field }) => (
                  <TextField
                    label="State"
                    fullWidth
                    error={!!errors.state}
                    helperText={errors.state?.message}
                    variant="outlined"
                    {...field}
                    sx={{ backgroundColor: "#fff", marginBottom: 2 }}
                  />
                )}
              />
              <Controller
                name="account_type"
                control={control}
                defaultValue="employee"
                rules={{ required: "Account type is required" }} // Make sure there's no extra space in the field name
                render={({ field }) => (
                  <input
                    type="hidden"
                    {...field}
                    value="employee" // This sets the value directly
                  />
                )}
              />

              {/* Mobile Field */}
              <Controller
                name="phone"
                control={control}
                defaultValue=""
                rules={{
                  required: "Mobile number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Invalid mobile number",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    label="Mobile"
                    fullWidth
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                    variant="outlined"
                    {...field}
                    sx={{ backgroundColor: "#fff", marginBottom: 2 }}
                  />
                )}
              />

              {/* Address Field */}
              <Controller
                name="address"
                control={control}
                defaultValue=""
                rules={{ required: "Address is required" }}
                render={({ field }) => (
                  <TextField
                    label="Address"
                    fullWidth
                    multiline
                    rows={4}
                    error={!!errors.address}
                    helperText={errors.address?.message}
                    variant="outlined"
                    {...field}
                    sx={{ backgroundColor: "#fff", marginBottom: 2 }}
                  />
                )}
              />

              {/* Designation Field */}
              <FormControl
                fullWidth
                error={!!error}
                sx={{ backgroundColor: "#fff", marginBottom: 2 }}
              >
                <InputLabel>Designation</InputLabel>
                <Controller
                  name="designation"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Select {...field} label="Designation">
                      {loading ? (
                        <Loader />
                      ) : designations.length === 0 ? (
                        <MenuItem disabled>No Designations Available</MenuItem>
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
                  )}
                />
              </FormControl>

              {/* Position Field */}
              <FormControl
                fullWidth
                error={!!error}
                sx={{ backgroundColor: "#fff", marginBottom: 2 }}
              >
                <InputLabel>Position</InputLabel>
                <Controller
                  name="position"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Select {...field} label="Position">
                      {loading ? (
                        <Loader />
                      ) : positions.length === 0 ? (
                        <MenuItem disabled>No Positions Available</MenuItem>
                      ) : (
                        positions.map((position) => (
                          <MenuItem key={position.id} value={position.title}>
                            {position.title}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  )}
                />
              </FormControl>

              {/* Submit Button */}
              <Button
                variant="contained"
                color="primary"
                fullWidth
                type="submit"
                disabled={loading}
              >
                {loading ? "Registering..." : "Register"}
              </Button>
            </form>
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

export default Register;
