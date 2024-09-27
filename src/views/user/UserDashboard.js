import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  CircularProgress,
  Grid,
  Paper,
  Divider
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import DemoNavbar from "components/Navbars/DemoNavbar";
import axios from "axios";
import { toast } from "react-toastify";

export default function UserDashboard() {
  const [openCheckInModal, setOpenCheckInModal] = useState(false);
  const [openCheckOutModal, setOpenCheckOutModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Fetch user data from local storage or API
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);
  const { control, handleSubmit, formState: { errors }, reset } = useForm();

  const handleCheckInSubmit = async (data) => {
    setLoading(true);
    try {
      await axios.post('/check-ins/mark', {
        user_id: data.user_id,
        checkin_description: data.checkin_description,
      });
      toast.success("Check-in successful!");
      setAttendanceMarked(true);
      setOpenCheckInModal(false);
      reset();
    } catch (error) {
      toast.error("Failed to mark check-in.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOutSubmit = async (data) => {
    setLoading(true);
    try {
      await axios.post('/check-outs/mark', {
        user_id: data.user_id,
        check_out_time: data.check_out_time,
        check_out_description: data.check_out_description,
      });
      toast.success("Check-out successful!");
      setOpenCheckOutModal(false);
      reset();
    } catch (error) {
      toast.error("Failed to mark check-out.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DemoNavbar size="sm" />
      <div style={{ marginTop: "80px" }}>
        <Card style={{ padding: "20px", marginBottom: "20px", background: "#f4f4f4" }}>
          <CardHeader title="Attendance Dashboard" />
          <CardContent>
            <Grid container spacing={2} alignItems="center" justifyContent="space-between">
              <Grid item>
                {!attendanceMarked ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setOpenCheckInModal(true)}
                  >
                    Mark Attendance (Check-In)
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => setOpenCheckOutModal(true)}
                  >
                    Check-Out
                  </Button>
                )}
              </Grid>
              <Grid item>
                <Typography variant="h6">Welcome, {userData?.name || 'User'}!</Typography>
              </Grid>
            </Grid>
            <Divider style={{ margin: "20px 0" }} />
            <Grid container spacing={2}>
              {[1, 2, 3, 4].map((item) => (
                <Grid item xs={12} sm={6} md={3} key={item}>
                  <Paper style={{ padding: "16px", textAlign: "center", background: "#fff" }}>
                    <Typography variant="h6">Card {item}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
            <Divider style={{ margin: "20px 0" }} />
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User ID</TableCell>
                  <TableCell>Attendance Date</TableCell>
                  <TableCell>Check-In Time</TableCell>
                  <TableCell>Check-In Description</TableCell>
                  <TableCell>Check-Out Time</TableCell>
                  <TableCell>Check-Out Description</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Updated At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendanceData.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.user_id}</TableCell>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.check_in_time}</TableCell>
                    <TableCell>{record.check_in_description}</TableCell>
                    <TableCell>{record.check_out_time}</TableCell>
                    <TableCell>{record.check_out_description}</TableCell>
                    <TableCell>{record.status}</TableCell>
                    <TableCell>{record.created_at}</TableCell>
                    <TableCell>{record.updated_at}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Check-In Modal */}
        <Dialog open={openCheckInModal} onClose={() => setOpenCheckInModal(false)}>
          <DialogTitle>Check-In</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit(handleCheckInSubmit)}>
              <Controller
              disabled
                name="user_id"
                control={control}
                defaultValue={userData?.user_id}
                rules={{ required: "Employee ID is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Employee ID"
                    fullWidth
                    margin="normal"
                    error={!!errors.user_id}
                    helperText={errors.user_id?.message}
                  />
                )}
              />
              <Controller
                name="checkin_description"
                control={control}
                defaultValue=""
                rules={{ required: "Description is required", minLength: 10 }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Check-In Description"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={4}
                    error={!!errors.checkin_description}
                    helperText={errors.checkin_description?.message}
                  />
                )}
              />
              <DialogActions>
                <Button type="submit" variant="contained" color="primary" disabled={loading}>
                  {loading ? <CircularProgress size={24} /> : "Submit"}
                </Button>
                <Button onClick={() => setOpenCheckInModal(false)} color="default">
                  Cancel
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>

        {/* Check-Out Modal */}
        <Dialog open={openCheckOutModal} onClose={() => setOpenCheckOutModal(false)}>
          <DialogTitle>Check-Out</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit(handleCheckOutSubmit)}>
              <Controller
                name="user_id"
                control={control}
                defaultValue=""
                rules={{ required: "User ID is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="User ID"
                    fullWidth
                    margin="normal"
                    error={!!errors.user_id}
                    helperText={errors.user_id?.message}
                  />
                )}
              />
              <Controller
                name="check_out_time"
                control={control}
                defaultValue=""
                rules={{ required: "Check-out time is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Check-Out Time"
                    type="datetime-local"
                    fullWidth
                    margin="normal"
                    error={!!errors.check_out_time}
                    helperText={errors.check_out_time?.message}
                  />
                )}
              />
              <Controller
                name="check_out_description"
                control={control}
                defaultValue=""
                rules={{ required: "Description is required", minLength: 10 }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Check-Out Description"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={4}
                    error={!!errors.check_out_description}
                    helperText={errors.check_out_description?.message}
                  />
                )}
              />
              <DialogActions>
                <Button type="submit" variant="contained" color="secondary" disabled={loading}>
                  {loading ? <CircularProgress size={24} /> : "Submit"}
                </Button>
                <Button onClick={() => setOpenCheckOutModal(false)} color="default">
                  Cancel
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
