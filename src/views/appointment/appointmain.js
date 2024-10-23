import React, { useState, useEffect } from "react";
import { Button, Form, FormGroup, Label, Input, Table } from "reactstrap";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import "../../assets/css/demo.css";

import {
  createAppointment,
  fetchAppointments,
  removeAppointment,
  updateAppointmentStatus,
  updateAppointment,
} from "api"; 

const AppointmentForm = () => {
  const [appointments, setAppointments] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date: null,
    time: null,
    reason: "",
  });
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAppointmentId, setCurrentAppointmentId] = useState(null);

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const fetchedAppointments = await fetchAppointments(1, 10);
        if (fetchedAppointments && fetchedAppointments.data) {
          setAppointments(fetchedAppointments.data);
        } else {
          console.error(
            "Fetched data is not in expected format:",
            fetchedAppointments
          );
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    loadAppointments();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
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
        const appointmentData = {
          ...formData,
          date: formData.date.toISOString(),
          time: formData.time.toISOString(),
        };

        if (isEditing) {
          await updateAppointment(currentAppointmentId, appointmentData);
          setAppointments((prevAppointments) =>
            prevAppointments.map((appointment) =>
              appointment.id === currentAppointmentId
                ? { ...appointment, ...appointmentData }
                : appointment
            )
          );
        } else {
          const newAppointment = await createAppointment({
            ...appointmentData,
            status: "Pending",
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

  const handleEditAppointment = (appointment) => {
    setFormData({
      name: appointment.name,
      email: appointment.email,
      date: appointment.date,
      time: appointment.time,
      reason: appointment.reason || "",
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
    setFormData({ name: "", email: "", date: null, time: null, reason: "" });
  };

  return (
    <div className="p-4" style={{marginTop:"70px"}}>
      <h2 >Take And Make Appointments</h2>
      <Button color="primary" onClick={handleOpen}>
        Create Appointment
      </Button>

      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Date</th>
            <th>Time</th>
            <th>Reason</th>
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
                <Button
                  color="danger"
                  onClick={() => handleRemoveAppointment(appointment.id)}
                >
                  Remove
                </Button>
                <Button
                  color="info"
                  onClick={() => handleEditAppointment(appointment)}
                >
                  Edit
                </Button>
                <Button
                  color="info"
                  onClick={() => handleEditAppointment(appointment)}
                >
                  Suspend
                </Button>
                <Button
                  color="info"
                  onClick={() => handleEditAppointment(appointment)}
                >
                  Pending
                </Button>
                <Button
                  color="info"
                  onClick={() => handleEditAppointment(appointment)}
                >
                  Accept
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
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
                type="time"
                name="time"
                id="time"
                value={
                  formData.time ? formData.time.split("T")[1].slice(0, 5) : ""
                }
                onChange={handleInputChange}
                required
                style={{
                  backgroundColor: "var(--task-card-bg)",
                  color: "var(--text-color)",
                }}
              />
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
          </Form>
        </DialogContent>
        <DialogActions style={{ backgroundColor: "var(--secondary-bg-color)" }}>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AppointmentForm;
