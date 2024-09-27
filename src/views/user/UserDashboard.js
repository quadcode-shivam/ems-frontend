import React, { useState } from "react";
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
} from "@mui/material";
import DemoNavbar from "components/Navbars/DemoNavbar";
import { useForm, Controller } from "react-hook-form";

export default function UserDashboard() {
  const [openCheckInModal, setOpenCheckInModal] = useState(false);
  const [openCheckOutModal, setOpenCheckOutModal] = useState(false);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const { control, handleSubmit, formState: { errors }, reset } = useForm();

  const handleCheckInSubmit = (data) => {
    // Perform check-in logic here (API call, etc.)
    setAttendanceMarked(true);
    setOpenCheckInModal(false);
    reset();
  };

  const handleCheckOutSubmit = (data) => {
    // Perform check-out logic here (API call, etc.)
    setOpenCheckOutModal(false);
    reset();
  };

  return (
    <>
      <DemoNavbar size="sm" />
      <div style={{ marginTop: "80px" }}>
        <Card className="p-3" style={{ background: "transparent" }}>
          <CardHeader>
            <Typography variant="h4">Attendance Dashboard</Typography>
          </CardHeader>
          <CardContent>
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
            
            {/* Attendance Table */}
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
                {/* Map through attendance data */}
                <TableRow>
                  <TableCell>12345</TableCell>
                  <TableCell>2024-09-27</TableCell>
                  <TableCell>09:00 AM</TableCell>
                  <TableCell>Checked in for the day</TableCell>
                  <TableCell>06:00 PM</TableCell>
                  <TableCell>Completed tasks</TableCell>
                  <TableCell>Present</TableCell>
                  <TableCell>2024-09-27 09:00 AM</TableCell>
                  <TableCell>2024-09-27 06:00 PM</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Check-In Modal */}
        <Dialog open={openCheckInModal} onClose={() => setOpenCheckInModal(false)}>
          <DialogTitle>Check-In Description</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit(handleCheckInSubmit)}>
              <Controller
                name="checkInDescription"
                control={control}
                defaultValue=""
                rules={{ required: "Description is required", minLength: 10 }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Describe your check-in"
                    fullWidth
                    error={!!errors.checkInDescription}
                    helperText={
                      errors.checkInDescription
                        ? "Please enter at least 10 characters"
                        : ""
                    }
                    multiline
                  />
                )}
              />
              <DialogActions>
                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>

        {/* Check-Out Modal */}
        <Dialog open={openCheckOutModal} onClose={() => setOpenCheckOutModal(false)}>
          <DialogTitle>Check-Out Description</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit(handleCheckOutSubmit)}>
              <Controller
                name="checkOutDescription"
                control={control}
                defaultValue=""
                rules={{ required: "Description is required", minLength: 10 }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Describe your check-out"
                    fullWidth
                    error={!!errors.checkOutDescription}
                    helperText={
                      errors.checkOutDescription
                        ? "Please enter at least 10 characters"
                        : ""
                    }
                    multiline
                  />
                )}
              />
              <DialogActions>
                <Button type="submit" variant="contained" color="secondary">
                  Submit
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
