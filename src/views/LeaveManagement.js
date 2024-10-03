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
import Loader from "./Loader/Loader";
import Swal from "sweetalert2";
import { createLeave } from "api";
import { Card, CardFooter, CardHeader, Table } from "reactstrap";
import { fetchLeavesApi } from "api";
import { fetchHolidayApi } from "api";

export default function EmployeeManagement() {
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [holiday, setHolidays] = useState([]);
  const [totalHolidays, setTotalHolidays] = useState(0);
  const [totalLeaveTaken, setTotalLeaveTaken] = useState(0);
  const [totalLate, setTotalLate] = useState(0);
  const [totalHalf, setTotalHalf] = useState(0);
  const [remainingLeaves, setRemainingLeaves] = useState(0);
  const [remainingLate, setRemainingLate] = useState(0);
  const [remainingHalf, setRemainingHalf] = useState(0);
  const [totalleave, settotalleave] = useState(0);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1); // Set to yesterday

  const [rangeDate, setRangeDate] = useState({
    start: yesterday,
    end: yesterday,
  });

  const [leaveType, setLeaveType] = useState("sick");
  const [halfDayFullDay, setHalfDayFullDay] = useState("full");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({}); // State for validation errors

  const handleRangeChange = (e, key) => {
    setRangeDate((prevState) => ({
      ...prevState,
      [key]: new Date(e.target.value), // Ensure this is a Date object
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
      startDate: rangeDate.start.toISOString().split("T")[0], // Format date as string
      endDate: rangeDate.end.toISOString().split("T")[0], // Format date as string
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
      fetchHoliday();
      setRangeDate({
        start: new Date(yesterday), // Reset to Date object
        end: new Date(yesterday), // Reset to Date object
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
      setTotalHolidays(response.total_leave);
      setTotalLeaveTaken(response.total_leave_taken);
      setTotalLate(response.total_late);
      setTotalHalf(response.total_half);
      setRemainingLeaves(response.remaining_leaves);
      setRemainingLate(response.remaining_late);
      setRemainingHalf(response.remaining_half);
      settotalleave(response.total_leave);
    } catch (error) {
      setError("Failed to load designations and positions. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const fetchHoliday = async () => {
    setLoading(true);
    try {
      const response = await fetchHolidayApi();
      setHolidays(response.holidays);
      setTotalHolidays(response.total_records);
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
    } else if (leaveType === "personal") {
      color = "success";
    } else if (leaveType === "other") {
      color = "warning";
    }

    return color;
  };

  useEffect(() => {
    fetchLeaves();
    fetchHoliday();
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
        {loading == true && <Loader />}
      <Typography variant="h4" style={{ color: "#fff" }} gutterBottom>
        Leave Dashboard
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
            xs={8}
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
                {totalRecords === 0 && (
                  <p className="text-light text-center">No leaves found.</p>
                )}
              </CardContent>
              <CardFooter className="bg-primary border border-top-1 border-dark text-light">
                <div>Total :</div>
                <div style={{ marginRight: "40px" }}>{totalRecords}</div>
              </CardFooter>
            </Card>
          </Grid>
          <Grid
            item
            xs={4}
            style={{
              padding: "20px",
              marginTop: "20px",
              background: "#11171D",
            }}
          >
            <Card className="bg-primary border border-1 ">
              <CardHeader className="bg-primary border border-bottom-1 border-dark">
                <Typography
                  style={{
                    fontSize: "20px",
                    color: "#fff",
                    paddingBottom: "10px",
                  }}
                >
                  {"LEAVE POLICY AND LEAVE COUNT"}
                </Typography>
              </CardHeader>
              <CardContent className="p-0 m-0">
                <Table className="rounded ">
                  <TableHead className="bg-secondary text-light rounded fw-bold">
                    <TableRow>
                      <TableCell
                        className="text-light"
                        style={{ fontSize: "14px" }}
                      >
                        POLICY
                      </TableCell>
                      <TableCell
                        className="text-light"
                        style={{ fontSize: "14px" }}
                      >
                        COUNT
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow className={totalleave < 0 ? "bg-danger" : ""}>
                      <TableCell className="text-light">TOTAL LEAVE</TableCell>
                      <TableCell className="text-light">{totalleave}</TableCell>
                    </TableRow>
                    <TableRow className={totalLate < 0 ? "bg-danger" : ""}>
                      <TableCell className="text-light">TOTAL LATE</TableCell>
                      <TableCell className="text-light">{totalLate}</TableCell>
                    </TableRow>
                    <TableRow className={totalHalf < 0 ? "bg-danger" : ""}>
                      <TableCell className="text-light">
                        TOTAL HALFDAY
                      </TableCell>
                      <TableCell className="text-light">{totalHalf}</TableCell>
                    </TableRow>
                    <TableRow className={totalLeaveTaken < 0 ? "bg-danger" : ""}>
                      <TableCell className="text-light">TAKEN LEAVE</TableCell>
                      <TableCell className="text-light">
                        {totalLeaveTaken}
                      </TableCell>
                    </TableRow>
                    <TableRow className={remainingLeaves < 0 ? "bg-danger" : ""}>
                      <TableCell className="text-light">LEFT LEAVE</TableCell>
                      <TableCell className="text-light">
                        {remainingLeaves}
                      </TableCell>
                    </TableRow>
                    <TableRow className={remainingLate < 0 ? "bg-danger" : ""}>
                      <TableCell className="text-light">LEFT LATE</TableCell>
                      <TableCell className="text-light">
                        {remainingLate}
                      </TableCell>
                    </TableRow>
                    <TableRow className={remainingHalf < 0 ? "bg-danger" : ""}>
                      <TableCell className="text-light">LEFT HALFDAY</TableCell>
                      <TableCell className="text-light">
                        {remainingHalf}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Grid>
          <Grid
            item
            xs={8}
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
                  {"UPCOMING HOLIDAY"}
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
                          HOLIDAY
                        </TableCell>
                        <TableCell
                          className="text-light"
                          style={{ fontSize: "14px" }}
                        >
                          DATE
                        </TableCell>
                        <TableCell
                          className="text-light"
                          style={{ fontSize: "14px" }}
                        >
                          DESCRIPTION
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {holiday.map((holiday) => (
                        <TableRow key={holiday.id}>
                         
                          <TableCell className="text-light">
                            {holiday.holiday_name}
                          </TableCell>
                          <TableCell className="text-light">
                            {holiday.holiday_date}
                          </TableCell>
                          <TableCell className="text-light">
                            {holiday.holiday_desc}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                {totalHolidays === 0 && (
                  <p className="text-light text-center">No Holiday found.</p>
                )}
              </CardContent>
              <CardFooter className="bg-primary border border-top-1 border-dark text-light">
                <div>Total :</div>
                <div style={{ marginRight: "40px" }}>{totalHolidays}</div>
              </CardFooter>
            </Card>
          </Grid>
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
            <MenuItem value="personal">Personal Leave</MenuItem>
            <MenuItem value="other">Other Leave</MenuItem>
          </TextField>
          {errors.leave_type && (
            <p style={{ color: "red" }}>{errors.leave_type}</p>
          )}

          <TextField
            fullWidth
            type="date"
            label="Start Date"
            value={""}
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
            value={""}
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
