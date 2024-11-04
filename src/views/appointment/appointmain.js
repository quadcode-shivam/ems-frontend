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
import { Pagination, Typography } from "@mui/material";
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
  const [totalPages, setTotalPages] = useState(0);
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
  const loadAppointments = async () => {
    try {
      const fetchedAppointments = await fetchAppointments(
        page + 1,
        rowsPerPage
      );
      if (fetchedAppointments.data) {
        setAppointments(fetchedAppointments.data);
        setTotalPages(Math.ceil(fetchedAppointments.total / rowsPerPage));
      } else {
        console.error(
          "Fetched data is not in expected format:",
          fetchedAppointments
        );
      }
    } catch (error) {
      console.error("Error loading appointments:", error);
    }
  };

  useEffect(() => {
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
  
    // Validate form data
    const isFormValid = formData.name && formData.email && formData.date && formData.time && formData.reason;
  
    if (!isFormValid) {
      alert("Please fill in all fields");
      return;
    }
  
    try {
      if (isEditing) {
        // Updating an existing appointment
        await updateAppointment({ ...formData, id: currentAppointmentId });
  
        // Update the local state with the edited appointment
        setAppointments((prevAppointments) =>
          prevAppointments.map((appointment) =>
            appointment.id === currentAppointmentId
              ? { ...appointment, ...formData } // Merge updated data
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
  
      // Close the form/modal after successful submission
      handleClose();
    } catch (error) {
      console.error(
        isEditing ? "Error updating appointment:" : "Error creating appointment:",
        error
      );
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
      console.error("Error updating appointment status:", error);
    }
  };

  const handleEditAppointment = (appointment) => {
    setFormData({
      name: appointment.name,
      email: appointment.email,
      date: appointment.date,
      time: appointment.time,
      reason: appointment.reason || "",
      status: appointment.status || "0", // Set current status
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
    setPage(newPage - 1);
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
    <div className="p-4" style={{ marginTop: "50px", marginBottom: "40px" }}>
      <div className="p-2" style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{fontSize:"25px", marginTop:"10px"}}>Manage Appointments</span>
        <div>
          <button
            size="sm"
            className="btn btn-sm"
            onClick={handleOpen}
            style={{
              color: "#ffffff",
              border: "1px solid #ffffff",
              background:"none"
            }}
          >
            + Create Appointment
          </button>
        </div>
      </div>

      <Table hover responsive className="table table-stripped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Date</th>
            <th>Time</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.id} className="m-2 p-2">
              <td  className=" p-1">{appointment.name}</td>
              <td  className=" p-1">{appointment.email}</td>
              <td  className=" p-1">{appointment.date}</td>
              <td  className=" p-1">{appointment.time}</td>
              <td  className=" p-1">{appointment.reason}</td>
              <td  className=" p-1">
                <Badge color={getStatusColor(appointment.status)}>
                  {getStatusText(appointment.status)}
                </Badge>
              </td>
              <td  className=" p-1">
                <ActionMenu appointment={appointment} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex justify-content-between align-items-center m-0 p-0 ">
      <div className="custom-pagination m-0 p-0"> {/* Apply the custom class here */}
        <Pagination
        className="m-0 p-0"
          count={totalPages}
          page={page + 1}
          onChange={handleChangePage}
          variant="outlined"
          shape="rounded"
          color="warning"
        />
        </div>
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

// Helper Functions
const getStatusText = (status) => {
  switch (status) {
    case "1":
      return "Accepted";
    case "2":
      return "Pending";
    case "3":
      return "Suspended";
    default:
      return "Unknown";
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "1":
      return "success";
    case "2":
      return "warning";
    case "3":
      return "danger";
    default:
      return "secondary";
  }
};
              