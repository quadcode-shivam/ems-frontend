import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Table,
  Badge,
} from "reactstrap";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import "../../assets/css/demo.css";
import { Pagination } from "@mui/material";

import {
  createAppointment,
  fetchAppointments,
  removeAppointment,
  updateAppointmentStatus,
  updateAppointment,
} from "api";

const ITEM_HEIGHT = 48;

const AppointmentForm = () => {
  const [appointments, setAppointments] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date: null,
    time: null,
    reason: "",
    user_id: "",
    status: "Pending", // Default status
  });
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAppointmentId, setCurrentAppointmentId] = useState(null);
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const [timeSlots, setTimeSlots] = useState([]);
  const [role, setRole] = useState();

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Function to generate half-hour intervals between 10 AM and 6 PM
  const generateTimeSlots = () => {
    const slots = [];
    let hour = 10;
    let minute = 0;

    while (hour < 18) {
      const time = `${hour}:${minute === 0 ? "00" : "30"}`;
      slots.push(time);
      minute += 30;
      if (minute === 60) {
        hour += 1;
        minute = 0;
      }
    }

    return slots;
  };

  useEffect(() => {
    const loadAppointments = async () => {
      const fetchedAppointments = await fetchAppointments(
        page + 1,
        rowsPerPage
      );
      if (fetchedAppointments.data) {
        setAppointments(fetchedAppointments.data);
      } else {
        console.error(
          "Fetched data is not in expected format:",
          fetchedAppointments
        );
      }
    };

    loadAppointments();
  }, [page, rowsPerPage]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setRole(user.role);
    setTimeSlots(generateTimeSlots());
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleTimeSelect = (time) => {
    setFormData((prevData) => ({ ...prevData, time }));
    closeTimePicker();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      formData.name &&
      formData.email &&
      formData.date &&
      formData.time &&
      formData.reason
    ) {
      try {
        if (isEditing) {
          await updateAppointment(currentAppointmentId, formData);
          setAppointments((prevAppointments) =>
            prevAppointments.map((appointment) =>
              appointment.id === currentAppointmentId
                ? { ...appointment, ...formData }
                : appointment
            )
          );
        } else {
          const newAppointment = await createAppointment({
            ...formData,
            user_id: role,
          });
          setAppointments((prevAppointments) => [
            ...prevAppointments,
            newAppointment,
          ]);
        }
        handleClose();
      } catch (error) {
        console.error(
          isEditing
            ? "Error updating appointment:"
            : "Error creating appointment:",
          error
        );
      }
    } else {
      alert("Please fill in all fields");
    }
  };

  const handleRemoveAppointment = async (appointmentId) => {
    try {
      await removeAppointment(appointmentId);
      setAppointments((prevAppointments) =>
        prevAppointments.filter(
          (appointment) => appointment.id !== appointmentId
        )
      );
    } catch (error) {
      console.error("Error removing appointment:", error);
    }
  };
  const onStatusChange = async (appointmentId, newStatus) => {
    try {
      await updateAppointmentStatus(appointmentId, newStatus);
    } catch (error) {
      console.error("Error removing appointment:", error);
    }
  };

  const handleEditAppointment = (appointment) => {
    setFormData({
      name: appointment.name,
      email: appointment.email,
      date: appointment.date,
      time: appointment.time,
      reason: appointment.reason || "",
      status: appointment.status || "Pending", // Set current status
    });
    setCurrentAppointmentId(appointment.id);
    setIsEditing(true);
    handleOpen();
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsEditing(false);
    setFormData({
      name: "",
      email: "",
      date: null,
      time: null,
      reason: "",
      status: "Pending",
    });
  };

  const openTimePicker = () => {
    setTimePickerOpen(true);
  };

  const closeTimePicker = () => {
    setTimePickerOpen(false);
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page
  };

  // Dropdown Menu Component for Actions
  const ActionMenu = ({ appointment }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleEdit = () => {
      handleEditAppointment(appointment);
      handleClose();
    };

    const handleRemove = () => {
      handleRemoveAppointment(appointment.id);
      handleClose();
    };

    const handleStatusChange = (newStatus) => {
      onStatusChange(appointment.id, newStatus);
      handleClose();
    };

    return (
      <div>
        <IconButton
          aria-label="more"
          id="long-button"
          aria-controls={open ? "long-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          onClick={handleClick}
          style={{ color: "#1976d2", border: "1px solid #1976d2" }} // Change the color here
          size="sm"
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="long-menu"
          MenuListProps={{
            "aria-labelledby": "long-button",
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: "20ch",
            },
          }}
        >
          <MenuItem onClick={handleEdit}>Edit</MenuItem>
          <MenuItem onClick={handleRemove}>Remove</MenuItem>
          {appointment.status !== "2" && (
            <MenuItem onClick={() => handleStatusChange("1")}>Accept</MenuItem>
          )}
          {appointment.status !== "3" && (
            <MenuItem onClick={() => handleStatusChange("3")}>Suspend</MenuItem>
          )}
          {appointment.status !== "1" && (
            <MenuItem onClick={() => handleStatusChange("2")}>Pending</MenuItem>
          )}
        </Menu>
      </div>
    );
  };

  return (
    <div className="p-4" style={{ marginTop: "50px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h4>Manage Appointments</h4>
        <div>
          <button
            size="sm"
            className="btn btn-sm"
            onClick={handleOpen}
            style={{
              color: "#1976d2",
              border: "1px solid #1976d2",
              background: "var(--primary-bg-color)",
            }}
          >
            Create Appointment
          </button>
        </div>
      </div>

      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Date</th>
            <th>Time</th>
            <th>Reason</th>
            <th>Status</th> {/* New Status Column */}
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.id}>
              <td>{appointment.name}</td>
              <td>{appointment.email}</td>
              <td>{appointment.date}</td>
              <td>{appointment.time}</td>
              <td>{appointment.reason}</td>
              <td>
                {appointment.status == 1 && (
                  <span className="badge bg-success">Accept</span>
                )}
                {appointment.status == 2 && (
                  <span className="badge bg-warning">Pending</span>
                )}
                {appointment.status == 3 && (
                  <span className="badge bg-danger">Suspend</span>
                )}
              </td>
              <td>
                <ActionMenu appointment={appointment} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination */}
      <div>
        <Pagination
          count={Math.ceil(appointments.length / rowsPerPage)}
          page={page + 1}
          onChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          variant="outlined"
          shape="rounded"
        />
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        PaperProps={{
          style: {
            backgroundColor: "var(--primary-bg-color)",
            color: "var(--text-color)",
            borderRadius: "8px",
            minWidth: "500px",
          },
        }}
      >
        <DialogTitle
          id="form-dialog-title"
          style={{
            backgroundColor: "var(--secondary-bg-color)",
            color: "var(--text-color)",
          }}
        >
          Create Appointment
        </DialogTitle>
        <DialogContent
          style={{
            backgroundColor: "var(--secondary-bg-color)",
            color: "var(--text-color)",
          }}
        >
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                style={{
                  backgroundColor: "var(--task-card-bg)",
                  color: "var(--text-color)",
                }}
              />
            </FormGroup>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                style={{
                  backgroundColor: "var(--task-card-bg)",
                  color: "var(--text-color)",
                }}
              />
            </FormGroup>
            <FormGroup>
              <Label for="date">Date</Label>
              <Input
                type="date"
                name="date"
                id="date"
                value={formData.date ? formData.date.split("T")[0] : ""}
                onChange={handleInputChange}
                required
                style={{
                  backgroundColor: "var(--task-card-bg)",
                  color: "var(--text-color)",
                }}
              />
            </FormGroup>
            <FormGroup>
              <Label for="time">Time</Label>
              <Input
                type="text"
                name="time"
                id="time"
                value={formData.time}
                onClick={openTimePicker}
                readOnly
                placeholder="Select a time"
                required
                className="pointer"
                style={{
                  backgroundColor: "var(--task-card-bg)",
                  color: "var(--text-color)",
                }}
              />
              {timePickerOpen && (
                <div
                  style={{
                    position: "absolute",
                    zIndex: 10,
                    backgroundColor: "var(--primary-bg-color)",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    padding: "10px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)", // 4 columns
                    gap: "10px", // space between grid items
                  }}
                >
                  {timeSlots.map((time) => (
                    <div
                      key={time}
                      onClick={() => handleTimeSelect(time)}
                      style={{
                        cursor: "pointer",
                        padding: "15px", // Increased padding for better touch target
                        border: "1px solid transparent",
                        borderRadius: "8px",
                        textAlign: "center", // Center align text
                        transition: "background-color 0.3s, border 0.3s",
                        backgroundColor: "var(--primary-bg-color)", // Default background color
                        fontSize: "16px", // Adjust font size
                        fontWeight: "bold", // Make text bold
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)", // Light shadow for elevation
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          "var(--primary-bg-color)"; // Light blue on hover
                        e.currentTarget.style.border = "1px solid #0056b3"; // Change border color on hover
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor =
                          "var(--primary-bg-color)"; // Reset background
                        e.currentTarget.style.border = "1px solid transparent"; // Reset border
                      }}
                    >
                      {time}
                    </div>
                  ))}
                </div>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="reason">Reason</Label>
              <Input
                type="textarea"
                name="reason"
                id="reason"
                value={formData.reason}
                onChange={handleInputChange}
                required
                style={{
                  backgroundColor: "var(--task-card-bg)",
                  color: "var(--text-color)",
                }}
              />
            </FormGroup>
            <DialogActions>
              <Button onClick={handleClose} color="secondary">
                Cancel
              </Button>
              <Button type="submit" color="primary">
                {isEditing ? "Update Appointment" : "Create Appointment"}
              </Button>
            </DialogActions>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppointmentForm;
