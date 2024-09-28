import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Badge,
  Card,
  CardContent,
  Typography,
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
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import DemoNavbar from "components/Navbars/DemoNavbar";
import {
  fetchEmployees,
  removeEmployees,
  createEmployee,
  fetchDesignationsAndPositionsApi,
} from "api";
import { toast } from "react-toastify";

export default function EmployeeManagement() {
  const cellStyle = {
    color: "#fff",
    fontWeight: "bold",
  };

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [rangeDate, setRangeDate] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)),
    end: new Date(),
  });
  const [designations, setDesignations] = useState([]);
  const [positions, setPositions] = useState([]);

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
      const response = await fetchEmployees(currentPage, itemsPerPage, rangeDate);
      setEmployees(response.data);
      setTotalItems(response.total);
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
    if (window.confirm("Are you sure you want to delete this employee?")) {
      setLoading(true);
      try {
        await removeEmployees(id);
        loadEmployees();
      } catch (error) {
        setError("Failed to remove employee. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAddEmployee = async (data) => {
    console.log("Form Data:", data); // Log submitted data
    setLoading(true);
    try {
      await createEmployee(data);
      toast.success("Employee added successfully!");
      loadEmployees();
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
  }, [currentPage, itemsPerPage]);

  const filteredEmployees = employees.filter((employee) =>
    employee.user_name.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusLabel = (status) => {
    return status === "active" ? "Active" : "Inactive";
  };

  if (loading) return <CircularProgress />;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <DemoNavbar size="sm" />
      <div style={{ marginTop: "80px" }}>
        <Card className="p-3" style={{ background: "transparent" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h4">Employee Management</Typography>
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
                className="form-control date-picker bg-light"
              />
              <DatePicker
                selected={rangeDate.start}
                onChange={onRangeChange}
                selectsRange
                startDate={rangeDate.start}
                endDate={rangeDate.end}
                className="form-control date-picker bg-light fw-bold"
                dateFormat="dd-M-yyyy"
                maxDate={new Date()}
                style={{ marginRight: "16px" }}
              />
              <Button
                className="btnborder border-2 pt-2 ml-1"
                style={{ background: "#080B0F", color: "#fff", minWidth:"100px" }}
                onClick={loadEmployees}
              >
                <span className="fw-bold" style={{ fontSize: "14px" }}>
                  Search
                </span>
              </Button>
              <Button
                className="btn w-100 border border-2 pt-2 ml-4"
                style={{ background: "#080B0F", color: "#fff" }}
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
            <Table className="table-responsive">
              <TableHead style={{ background: "#080B0F", color: "#fff" }}>
                <TableRow>
                  <TableCell style={cellStyle}>Name</TableCell>
                  <TableCell style={cellStyle}>Email</TableCell>
                  <TableCell style={cellStyle}>Phone</TableCell>
                  <TableCell style={cellStyle}>Position</TableCell>
                  <TableCell style={cellStyle}>Department</TableCell>
                  <TableCell style={cellStyle}>Hire Date</TableCell>
                  <TableCell style={cellStyle}>Status</TableCell>
                  <TableCell style={cellStyle}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>{employee.user_name}</TableCell>
                    <TableCell>{employee.user_email}</TableCell>
                    <TableCell>{employee.phone || "N/A"}</TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>
                      {new Date(employee.hire_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        color={employee.status === "active" ? "success" : "error"}
                        badgeContent={getStatusLabel(employee.status)}
                      />
                    </TableCell>
                    <TableCell>
                      <Button onClick={() => deleteEmployees(employee.id)}>Remove</Button>
                      <Button onClick={() => console.log(`View data for employee ID: ${employee.id}`)}>View Data</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>

          {/* Add Employee Modal */}
          <Dialog open={openModal} onClose={() => setOpenModal(false)}>
            <DialogTitle>Add Employee</DialogTitle>
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
                          <MenuItem key={designation.id} value={designation.title}>
                            {designation.title}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.designation && <span className="text-danger">{errors.designation.message}</span>}
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
                      {errors.position && <span className="text-danger">{errors.position.message}</span>}
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
                      {errors.account_type && <span className="text-danger">{errors.account_type.message}</span>}
                    </FormControl>
                  )}
                />
                <DialogActions>
                  <Button type="submit" className="bg-primary text-light fw-bold pt-2">
                    Add Employee
                  </Button>
                </DialogActions>
              </form>
            </DialogContent>
          </Dialog>
        </Card>
      </div>
    </>
  );
}
