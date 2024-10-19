import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Loader from "./Loader/Loader";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Paper,
  Chip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useForm, Controller } from "react-hook-form";
import DemoNavbar from "components/Navbars/DemoNavbar";
import {
  fetchEmployees,
  removeEmployees,
  createEmployee,
  fetchDesignationsAndPositionsApi,
} from "api";
import { toast } from "react-toastify";
import {
  Expand,
  ExpandCircleDown,
  RemoveCircleOutlineOutlined,
} from "@mui/icons-material";
import { CardHeader } from "reactstrap";
import Swal from "sweetalert2";

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [rangeDate, setRangeDate] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)),
    end: new Date(),
  });
  const [designations, setDesignations] = useState([]);
  const [positions, setPositions] = useState([]);
  const [role, setRole] = useState();

  const [openModal, setOpenModal] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onRangeChange = (dates) => {
    const [start, end] = dates;
    setRangeDate({ start, end });
  };

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const response = await fetchEmployees(
        currentPage,
        itemsPerPage,
        rangeDate
      );
      setEmployees(response.data);
      setError(null);
    } catch (error) {
      setError("Failed to load employees. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDesignationsAndPositions = async () => {
    setLoading(true);
    try {
      const response = await fetchDesignationsAndPositionsApi();
      setDesignations(response.designations);
      setPositions(response.positions);
      setError(null);
    } catch (error) {
      setError("Failed to load designations and positions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployees = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        await removeEmployees(id);
        loadEmployees();
        Swal.fire("Deleted!", "The employee has been deleted.", "success");
      } catch (error) {
        setError("Failed to remove employee. Please try again.");
        Swal.fire(
          "Error!",
          "Failed to remove employee. Please try again.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    }
  };
  const handleAddEmployee = async (data) => {
    setLoading(true);
    try {
      await createEmployee(data);
      toast.success("Employee added successfully!");
      loadEmployees();
      fetchDesignationsAndPositions();
      reset();
      setOpenModal(false);
    } catch (error) {
      console.error("Error adding employee:", error);
      if (error.response && error.response.data) {
        const { errors } = error.response.data;
        Object.keys(errors).forEach((field) => {
          errors[field].forEach((message) => {
            toast.error(`${field}: ${message}`);
          });
        });
      } else {
        toast.error("Failed to add employee. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
    fetchDesignationsAndPositions();
    const user = JSON.parse(localStorage.getItem("user"));
    setRole(user.role);
  }, [currentPage, itemsPerPage]);

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <CircularProgress />;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <DemoNavbar size="sm" />
      {loading == true && <Loader />}
      <div
        style={{ marginTop: "60px", minHeight: "100%", background: "#0F1214" }}
      >
        <Card className="p-3 px-4" style={{ background: "#0F1214" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
            className="px-3"
          >
            <Typography variant="h4" className="text-light">
              Employee Management
            </Typography>
            <div
              className=" p-1"
              style={{ display: "flex", alignItems: "center" }}
            >
              <input
                type="text"
                placeholder="Search by Name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ marginRight: "4px" }}
                className="form-control date-picker border border-1"
              />
              <DatePicker
                selected={rangeDate.start}
                onChange={onRangeChange}
                selectsRange
                startDate={rangeDate.start}
                endDate={rangeDate.end}
                className="form-control date-picker border border-1 text-light fw-bold"
                dateFormat="dd-M-yyyy"
                maxDate={new Date()}
                style={{ marginRight: "16px" }}
              />
              <Button
                className="btn border border-2 pt-2 ml-1"
                style={{
                  background: "#080B0F",
                  color: "#fff",
                  minWidth: "100px",
                }}
                onClick={loadEmployees}
              >
                <span className="fw-bold" style={{ fontSize: "14px" }}>
                  Search
                </span>
              </Button>
              <Button
                className="btn w-100 border border-2 pt-2 ml-4"
                style={{ background: "#11171D", color: "#fff" }}
                onClick={() => setOpenModal(true)}
              >
                <span
                  className="fw-bold"
                  style={{ fontSize: "14px", minWidth: "150px" }}
                >
                  Add Employee
                </span>
              </Button>
            </div>
          </div>

          <CardContent>
            <CardHeader className="bg-dark">
              <Grid container spacing={3}>
                <Grid item xs={3}>
                  <Paper
                    elevation={0}
                    style={{
                      background: "transparent",
                      color: "#fff",
                      fontWeight: "bold",
                    }}
                  >
                    <span>USER DETAIL</span>
                  </Paper>
                </Grid>
                <Grid item xs={3}>
                  <Paper
                    elevation={0}
                    style={{
                      background: "transparent",
                      color: "#fff",
                      fontWeight: "bold",
                    }}
                  >
                    <span>CONTACT</span>
                  </Paper>
                </Grid>
                <Grid item xs={3}>
                  <Paper
                    elevation={0}
                    style={{
                      background: "transparent",
                      color: "#fff",
                      fontWeight: "bold",
                    }}
                  >
                    <span>STATUS</span>
                  </Paper>
                </Grid>
                <Grid item xs={3}>
                  <Paper
                    elevation={0}
                    style={{
                      background: "transparent",
                      color: "#fff",
                      fontWeight: "bold",
                    }}
                  >
                    <span>JOINING DATE</span>
                  </Paper>
                </Grid>
              </Grid>
            </CardHeader>
            {filteredEmployees.map((employee) => (
              <Accordion key={employee.id} className="">
                <AccordionSummary
                  expandIcon={
                    <ExpandCircleDown
                      style={{ fontSize: "30px", color: "#fff" }}
                    />
                  }
                  aria-controls={`panel-content-${employee.id}`}
                  id={`panel-header-${employee.id}`}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    background: "#11171D",
                    borderBottom: "1px solid white",
                  }} // Ensure full width
                >
                  <Grid container spacing={3}>
                    <Grid item xs={3}>
                      <Paper
                        elevation={0}
                        style={{
                          background: "transparent",
                          color: "#fff",
                          fontWeight: "bold",
                        }}
                      >
                        <Typography variant="body2">
                          {employee.name}
                          <br />
                          <span className="badge bg-dark">
                            {employee.user_id}
                          </span>
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={3}>
                      <Paper
                        elevation={0}
                        style={{
                          background: "transparent",
                          color: "#fff",
                          fontWeight: "bold",
                        }}
                      >
                        <Typography variant="body2">
                          {employee.email}
                          <br />
                          <span className="badge bg-warning border-2 text-dark border border-dark">
                            {employee.mobile}
                          </span>
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={3}>
                      <Paper
                        elevation={0}
                        style={{
                          background: "transparent",
                          color: "#fff",
                          fontWeight: "bold",
                        }}
                      >
                        <Typography variant="body2">
                          {employee.status == "hold" && (
                            <span
                              style={{ fontSize: "12px" }}
                              className="badge mt-2 bg-warning "
                            >
                              {employee.status}
                            </span>
                          )}
                          {employee.status == "active" && (
                            <span
                              style={{ fontSize: "12px" }}
                              className="badge mt-2 bg-success"
                            >
                              {employee.status}
                            </span>
                          )}
                          {employee.status == "inactive" && (
                            <span
                              style={{ fontSize: "12px" }}
                              className="badge mt-2 bg-danger"
                            >
                              {employee.status}
                            </span>
                          )}
                          {employee.status == "suspend" && (
                            <span
                              style={{ fontSize: "12px" }}
                              className="badge mt-2 bg-danger"
                            >
                              {employee.status}
                            </span>
                          )}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={3}>
                      <Paper
                        elevation={0}
                        style={{
                          background: "transparent",
                          color: "#fff",
                          fontWeight: "bold",
                        }}
                      >
                        <Typography variant="body2 ">
                          <span className="mt-3">{employee.date_hired}</span>
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </AccordionSummary>
                {role == "admin" && (
                  <AccordionDetails
                    style={{
                      backgroundColor: "#14181B ",
                      color: "#fff",
                      padding: "16px",
                    }}
                    // className="border border-1 rounded"
                  >
                    <Grid container spacing={3}>
                      <Grid item xs={4}>
                        <Paper
                          elevation={0}
                          style={{
                            backgroundColor: "#14181B",
                            padding: "8px",
                            color: "#fff",
                          }}
                        >
                          <Typography variant="body2">
                            Phone: {employee.mobile}
                          </Typography>
                        </Paper>
                      </Grid>

                      {/* Employee Position */}
                      <Grid item xs={4}>
                        <Paper
                          elevation={0}
                          style={{
                            backgroundColor: "#14181B",
                            padding: "8px",
                            color: "#fff",
                          }}
                        >
                          <Typography variant="body2">
                            Position: {employee.position}
                          </Typography>
                        </Paper>
                      </Grid>

                      {/* Employee Designation */}
                      <Grid item xs={4}>
                        <Paper
                          elevation={0}
                          style={{
                            backgroundColor: "#14181B",
                            padding: "8px",
                            color: "#fff",
                          }}
                        >
                          <Typography variant="body2">
                            Designation: {employee.designation}
                          </Typography>
                        </Paper>
                      </Grid>

                      {/* Employee Salary */}
                      <Grid item xs={4}>
                        <Paper
                          elevation={0}
                          style={{
                            backgroundColor: "#14181B",
                            padding: "8px",
                            color: "#fff",
                          }}
                        >
                          <Typography variant="body2">
                            Salary: ${employee.salary}
                          </Typography>
                        </Paper>
                      </Grid>

                      {/* Employee Address */}
                      <Grid item xs={4}>
                        <Paper
                          elevation={0}
                          style={{
                            backgroundColor: "#14181B",
                            padding: "8px",
                            color: "#fff",
                          }}
                        >
                          <Typography variant="body2">
                            Address: {employee.address}
                          </Typography>
                        </Paper>
                      </Grid>

                      {/* Employee Country */}
                      <Grid item xs={4}>
                        <Paper
                          elevation={0}
                          style={{
                            backgroundColor: "#14181B",
                            padding: "8px",
                            color: "#fff",
                          }}
                        >
                          <Typography variant="body2">
                            Country: {employee.country}
                          </Typography>
                        </Paper>
                      </Grid>

                      {/* Employee State */}
                      <Grid item xs={4}>
                        <Paper
                          elevation={0}
                          style={{
                            backgroundColor: "#14181B",
                            padding: "8px",
                            color: "#fff",
                          }}
                        >
                          <Typography variant="body2">
                            State: {employee.state}
                          </Typography>
                        </Paper>
                      </Grid>

                      {/* Employee Hire Date */}
                      <Grid item xs={4}>
                        <Paper
                          elevation={0}
                          style={{
                            backgroundColor: "#14181B",
                            padding: "8px",
                            color: "#fff",
                          }}
                        >
                          <Typography variant="body2">
                            Hire Date: {employee.date_hired}
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={4}>
                        <Paper
                          elevation={0}
                          style={{
                            backgroundColor: "#14181B",
                            padding: "8px",
                            color: "#fff",
                          }}
                        >
                          <button
                            onClick={() => {
                              deleteEmployees(employee.user_id);
                            }}
                            className="p-2 bg-danger border border-1 rounded text-light text-right"
                          >
                            <RemoveCircleOutlineOutlined /> Remove Employee
                          </button>
                        </Paper>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                )}
              </Accordion>
            ))}
          </CardContent>
        </Card>

        {/* Add Employee Modal */}
        <Dialog open={openModal} onClose={() => setOpenModal(false)}>
          <DialogTitle style={{ background: "#11171D", color: "#fff" }}>
            Add Employee
          </DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit(handleAddEmployee)}>
              <Controller
                name="user_name"
                control={control}
                defaultValue=""
                rules={{ required: "Name is required" }}
                render={({ field }) => (
                  <TextField
                    className="mb-3 mt-2"
                    {...field}
                    label="Name"
                    fullWidth
                    error={!!errors.user_name}
                    helperText={errors.user_name?.message}
                  />
                )}
              />
              <Controller
                name="user_email"
                control={control}
                defaultValue=""
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Email is invalid",
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
                  />
                )}
              />
              <Controller
                name="phone"
                control={control}
                defaultValue=""
                rules={{ required: "Phone number is required" }}
                render={({ field }) => (
                  <TextField
                    className="mb-3 mt-2"
                    {...field}
                    label="Phone"
                    fullWidth
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                  />
                )}
              />
              <Controller
                name="address"
                control={control}
                defaultValue=""
                rules={{ required: "Address is required" }}
                render={({ field }) => (
                  <TextField
                    className="mb-3 mt-2"
                    {...field}
                    label="Address"
                    fullWidth
                    error={!!errors.address}
                    helperText={errors.address?.message}
                  />
                )}
              />
              <Controller
                name="state"
                control={control}
                defaultValue=""
                rules={{ required: "State is required" }}
                render={({ field }) => (
                  <TextField
                    className="mb-3 mt-2"
                    {...field}
                    label="State"
                    fullWidth
                    error={!!errors.state}
                    helperText={errors.state?.message}
                  />
                )}
              />
              <Controller
                name="country"
                control={control}
                defaultValue=""
                rules={{ required: "Country is required" }}
                render={({ field }) => (
                  <TextField
                    className="mb-3 mt-2"
                    {...field}
                    label="Country"
                    fullWidth
                    error={!!errors.country}
                    helperText={errors.country?.message}
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
                      {designations.map((designation) => (
                        <MenuItem
                          key={designation.id}
                          value={designation.title}
                        >
                          {designation.title}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.designation && (
                      <span className="text-danger">
                        {errors.designation.message}
                      </span>
                    )}
                  </FormControl>
                )}
              />
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
                      {positions.map((position) => (
                        <MenuItem key={position.id} value={position.title}>
                          {position.title}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.position && (
                      <span className="text-danger">
                        {errors.position.message}
                      </span>
                    )}
                  </FormControl>
                )}
              />
              <Controller
                name="account_type"
                control={control}
                defaultValue=""
                rules={{ required: "Account type is required" }}
                render={({ field }) => (
                  <FormControl
                    className="mb-3 mt-2"
                    fullWidth
                    error={!!errors.account_type}
                  >
                    <InputLabel>Account Type</InputLabel>
                    <Select {...field}>
                      <MenuItem value="admin">Admin</MenuItem>
                      <MenuItem value="employee">Employee</MenuItem>
                    </Select>
                    {errors.account_type && (
                      <span className="text-danger">
                        {errors.account_type.message}
                      </span>
                    )}
                  </FormControl>
                )}
              />
              <DialogActions
                className="rounded"
                style={{ background: "#11171D", color: "#fff" }}
              >
                <button
                  type="submit"
                  style={{
                    background: "#11171D",
                    color: "#fff",
                    border: "none",
                  }}
                  className="text-light fw-bold w-100 rounded"
                >
                  Add Employee
                </button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
