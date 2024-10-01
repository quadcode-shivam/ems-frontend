import React, { useEffect, useState } from "react";
import {
  Button,
  Chip,
  Grid,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CardContent,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import Swal from "sweetalert2";
import { createLeave } from "api";
import { Card, CardFooter, CardHeader, Table } from "reactstrap";
import { fetchLeavesApi } from "api";

export default function EmployeeManagement() {
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [employees] = useState([
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Alice Johnson" },
  ]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [rangeDate, setRangeDate] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)),
    end: new Date(),
  });
  const [leaveType, setLeaveType] = useState("sick");
  const [halfDayFullDay, setHalfDayFullDay] = useState("full");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({}); // State for validation errors

  const handleRangeChange = (e, key) => {
    setRangeDate((prevState) => ({
      ...prevState,
      [key]: e.target.value,
    }));
  };

  const handleLeaveTypeChange = (type) => {
    setLeaveType(type);
  };

  const handleApplyLeave = (employeeId) => {
    setSelectedEmployeeId(employeeId);
    setOpenDialog(true);
  };

  const handleSubmitLeave = async () => {
    setLoading(true);
    setErrors({}); // Reset previous errors

    // Validation
    const validationErrors = {};
    if (!leaveType) {
      validationErrors.leave_type = "The leave type field is required.";
    }
    if (!rangeDate.start) {
      validationErrors.start_date = "The start date field is required.";
    }
    if (!rangeDate.end) {
      validationErrors.end_date = "The end date field is required.";
    }
    if (!halfDayFullDay) {
      validationErrors.half_day_full_day =
        "The half day full day field is required.";
    }

    // Check if there are validation errors
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return; // Stop further processing
    }

    const leaveData = {
      employeeId: user, // Use the logged-in user's ID
      startDate: rangeDate.start,
      endDate: rangeDate.end,
      leaveType: leaveType,
      leaveDuration: halfDayFullDay,
      description,
    };

    try {
      const response = await createLeave(leaveData);
      setLoading(false);
      setOpenDialog(false);
      Swal.fire("Success", "Leave applied successfully!", "success");
      console.log("Leave applied for employee:", response);
      fetchLeaves();
      setRangeDate({
        start: new Date(new Date().setDate(new Date().getDate() - 30)),
        end: new Date(),
      });
      setLeaveType("sick");
      setHalfDayFullDay("full");
      setDescription("");
    } catch (error) {
      setLoading(false);

      // Handle backend validation errors
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        Swal.fire("Error", "Failed to apply leave. Please try again.", "error");
        console.error("Error applying leave:", error);
      }
    }
  };
  const fetchLeaves = async () => {
    setLoading(true);
    const storedUser = JSON.parse(localStorage.getItem("user"));
    try {
      const response = await fetchLeavesApi(storedUser.user_id);
      setLeaves(response.leaves);
      setTotalRecords(response.total_records);
    } catch (error) {
      setError("Failed to load designations and positions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getBadgeColorDay = (dayType) => {
    let color = "default";
    // Leave type badges
    if (dayType === "half") {
      color = "info"; // Could override the color
    } else if (dayType === "full") {
      color = "success"; // Regular color for full days
    }

    return color;
  };
  const getBadgeColorStatus = (status) => {
    let color = "default";

    if (status === "pending") {
      color = "warning";
    } else if (status === "suspended") {
      color = "error";
    } else if (status === "approved") {
      color = "success";
    }

    return color;
  };
  const getBadgeColor = (leaveType) => {
    let color = "default";
    // Leave type badges
    if (leaveType === "sick") {
      color = "error";
    } else if (leaveType === "casual") {
      color = "primary";
    } else if (leaveType === "paid") {
      color = "success";
    } else if (leaveType === "unpaid") {
      color = "warning";
    }

    return color;
  };

  useEffect(() => {
    fetchLeaves();
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser.user_id);
  }, []);

  return (
    <div
      style={{
        marginTop: "60px",
        padding: "20px",
        background: "#0F1214",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h4" style={{ color: "#fff" }} gutterBottom>
        Leave Management
      </Typography>

      <Paper
        className="border border-1"
        style={{ padding: "20px", marginTop: "20px", background: "#11171D" }}
      >
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={6}>
            <Typography style={{ fontSize: "20px", color: "#fff" }}>
              {"APPLY YOUR LEAVE"}
            </Typography>
          </Grid>
          <Grid item xs={6} style={{ textAlign: "right" }}>
            <Button
              variant="outlined"
              className="border-1 border text-light"
              onClick={() => handleApplyLeave(user?.id)}
            >
              Apply Leave
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper
        style={{ padding: "20px", marginTop: "20px", background: "#11171D" }}
      >
        <Grid container alignItems="center" spacing={2}>
          <Grid
            item
            xs={6}
            style={{
              padding: "20px",
              marginTop: "20px",
              background: "#11171D",
            }}
          >
            <Card className="bg-primary border border-1">
              <CardHeader className="bg-primary border border-bottom-1 border-dark">
                <Typography
                  style={{
                    fontSize: "20px",
                    color: "#fff",
                    paddingBottom: "10px",
                  }}
                >
                  {"PREVIOUS LEAVE"}
                </Typography>
              </CardHeader>
              <CardContent className="p-0 m-0">
                <TableContainer>
                  <Table className="rounded m-0 p-0">
                    <TableHead className="bg-secondary text-light rounded fw-bold pl-2">
                      <TableRow>
                        <TableCell
                          className="text-light"
                          style={{ fontSize: "14px" }}
                        >
                          TYPE
                        </TableCell>
                        <TableCell
                          className="text-light"
                          style={{ fontSize: "14px" }}
                        >
                          FROM
                        </TableCell>
                        <TableCell
                          className="text-light"
                          style={{ fontSize: "14px" }}
                        >
                          TO
                        </TableCell>
                        <TableCell
                          className="text-light"
                          style={{ fontSize: "14px" }}
                        >
                          STATUS
                        </TableCell>
                        <TableCell
                          className="text-light"
                          style={{ fontSize: "14px" }}
                        >
                          DAY
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {leaves.map((leave) => (
                        <TableRow key={leave.id}>
                          <TableCell>
                            <Chip
                              label={leave.leave_type}
                              color={getBadgeColor(leave.leave_type)}
                            />
                          </TableCell>
                          <TableCell className="text-light">
                            {new Date(leave.start_date).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-light">
                            {new Date(leave.end_date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={leave.status}
                              color={getBadgeColorStatus(leave.status)}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={leave.half_day_full_day}
                              color={getBadgeColorDay(leave.half_day_full_day)}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                {totalRecords === 0 && <p>No leaves found.</p>}
              </CardContent>
              <CardFooter className="bg-primary border border-top-1 border-dark text-light">
                <div>Total :</div>
                <div style={{ marginRight: "40px" }}>{totalRecords}</div>
              </CardFooter>
            </Card>
          </Grid>
          <Grid
            item
            xs={6}
            style={{
              padding: "20px",
              marginTop: "20px",
              background: "#11171D",
            }}
          ></Grid>
        </Grid>
      </Paper>

      <Dialog
        PaperProps={{
          style: {
            width: "600px",
            maxWidth: "600px",
            backgroundColor: "#11171D",
            border: "1px solid #191E27",
          },
        }}
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      >
        <DialogTitle style={{ color: "#fff" }}>Apply Leave</DialogTitle>
        <DialogContent
          className="bg-light text-dark"
          style={{
            borderLeft: "3px solid black",
            borderRight: "3px solid black",
          }}
        >
          <TextField
            fullWidth
            select
            label="Leave Type"
            value={leaveType}
            onChange={(e) => handleLeaveTypeChange(e.target.value)}
            margin="normal"
            error={Boolean(errors.leave_type)}
          >
            <MenuItem value="sick">Sick Leave</MenuItem>
            <MenuItem value="casual">Casual Leave</MenuItem>
            <MenuItem value="paid">Paid Leave</MenuItem>
            <MenuItem value="unpaid">Unpaid Leave</MenuItem>
          </TextField>
          {errors.leave_type && (
            <p style={{ color: "red" }}>{errors.leave_type}</p>
          )}

          <TextField
            fullWidth
            type="date"
            label="Start Date"
            value={rangeDate.start.toISOString().split("T")[0]}
            onChange={(e) => handleRangeChange(e, "start")}
            margin="normal"
            error={Boolean(errors.start_date)}
          />
          {errors.start_date && (
            <p style={{ color: "red" }}>{errors.start_date}</p>
          )}

          <TextField
            fullWidth
            type="date"
            label="End Date"
            value={rangeDate.end.toISOString().split("T")[0]}
            onChange={(e) => handleRangeChange(e, "end")}
            margin="normal"
            error={Boolean(errors.end_date)}
          />
          {errors.end_date && <p style={{ color: "red" }}>{errors.end_date}</p>}

          <FormControl fullWidth margin="normal">
            <InputLabel
              style={{ color: "#fff" }}
              id="half-full-day-select-label"
            >
              Half/Full Day
            </InputLabel>
            <Select
              labelId="half-full-day-select-label"
              value={halfDayFullDay}
              onChange={(e) => setHalfDayFullDay(e.target.value)}
              error={Boolean(errors.half_day_full_day)}
            >
              <MenuItem value="full">Full Day</MenuItem>
              <MenuItem value="half">Half Day</MenuItem>
            </Select>
            {errors.half_day_full_day && (
              <p style={{ color: "red" }}>{errors.half_day_full_day}</p>
            )}
          </FormControl>

          <TextField
            fullWidth
            label="Description"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleSubmitLeave}
            color="primary"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
