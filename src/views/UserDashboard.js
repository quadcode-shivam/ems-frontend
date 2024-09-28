import React, { useEffect, useState } from "react";
import DemoNavbar from "components/Navbars/DemoNavbar";
import { checkIn, checkOut, fetchCheckInRecords } from "../api"; // Adjust the import path accordingly
import "../assets/css/demo.css"; // Import the CSS file
import { Button, Card, CardFooter, CardHeader } from "reactstrap";
import { CardContent } from "@mui/material";
import { ToastContainer, toast } from "react-toastify"; // Import ToastContainer and toast
import "react-toastify/dist/ReactToastify.css"; // Import CSS for Toast
import Logo from "../assets/img/bg3.jpg"; // Ensure the image path is correct

const UserDashboard = () => {
  const [checkInRecords, setCheckInRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const fetchCheckInData = async () => {
    try {
      const employeeId = user?.user_id;
      const response = await fetchCheckInRecords(employeeId.toString());
      setCheckInRecords(response.check_ins);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching check-in records:", error);
      setError("Failed to load check-in records.");
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  useEffect(() => {
    if (user) {
      fetchCheckInData();
    }
  }, [user]);

  const handleCheckIn = async () => {
    try {
      const employeeId = user?.user_id;
      const response = await checkIn(employeeId);

      if (response.message === "Please check out first.") {
        toast.warning(response.message);
      } else {
        toast.success(response.message);
      }

      fetchCheckInData();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Check-in failed. Please try again."
      );
    }
  };

  const handleCheckOut = async (record) => {
    try {
      const employeeId = user?.user_id;
      const response = await checkOut(employeeId);
      toast.success(response.message);
      fetchCheckInData();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Check-out failed. Please try again."
      );
    }
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "Absent":
        return "#d32f2f";
      case "HalfDayPresent":
        return "#ff9800";
      case "FullDayPresent":
        return "#388e3c";
      case "Late":
        return "#1976d2";
      case "Active":
        return "#388e3c";
      default:
        return "#9e9e9e";
    }
  };

  const isToday = (date) => {
    const today = new Date().toISOString().split("T")[0];
    return new Date(date).toISOString().split("T")[0] === today;
  };

  return (
    <>
      <DemoNavbar size="sm" />
      <div
        className="dashboard-container"
        style={{ marginTop: "70px", background: "#080B0F", color: "#ffffff" }}
      >
        <Card
          className="text-light"
          style={{
            padding: "10px",
            marginTop: "20px",
            background: "#212327",
            borderRadius: "20px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            cursor: "pointer",
          }}
        >
          <CardHeader
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "15px 20px",
              // background: "#23272a",
              borderRadius: "20px",
            }}
          >
            <div style={{ fontSize: "18px", fontWeight: "600" }}>
              Employee Detail
            </div>
            <Button
              style={{
                background: "#7289da",
                color: "#ffffff",
                padding: "8px 16px",
                borderRadius: "5px",
                fontWeight: "bold",
              }}
            >
              Download Info
            </Button>
          </CardHeader>

          <CardContent
            style={{
              padding: "20px",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "15px",
              }}
            >
              <div
                style={{
                  padding: "10px",
                  borderRadius: "5px",
                  width:"120px"
                }}
              >
                <img
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                  }}
                  src={Logo} // Corrected from href to src
                  alt="User Logo"
                />
              </div>
              <div
                style={{
                  padding: "10px",
                  borderRadius: "5px",
                }}
              >
                <span>Name</span>
                <br />
                {user?.name}
              </div>
              <div
                style={{
                  padding: "10px",
                  borderRadius: "5px",
                }}
              >
                <span>Phone Number</span>
                <br />
                {user?.user_id}{" "}
                {<span className="badge bg-danger p-2 fs-2">{user?.role}</span>}
              </div>
              <div
                style={{
                  padding: "10px",
                  borderRadius: "5px",
                }}
              >
                <span>Email Adress</span>
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "15px",
              }}
            >
              <div
                style={{
                  padding: "10px",
                  background: "#3b3e44",
                  borderRadius: "5px",
                }}
              >
                Card 1
              </div>
              <div
                style={{
                  padding: "10px",
                  background: "#3b3e44",
                  borderRadius: "5px",
                }}
              >
                Card 2
              </div>
              <div
                style={{
                  padding: "10px",
                  background: "#3b3e44",
                  borderRadius: "5px",
                }}
              >
                Card 3
              </div>
              <div
                style={{
                  padding: "10px",
                  background: "#3b3e44",
                  borderRadius: "5px",
                  textAlign: "center",
                }}
              >
                <Button
                  style={{
                    background: "#43b581",
                    color: "#ffffff",
                    padding: "10px",
                    fontWeight: "bold",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                  onClick={handleCheckIn}
                >
                  Check In
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <p className="loading">Loading...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <div className="card-grid">
            {checkInRecords.length === 0 ? (
              <p className="no-records">No check-in records found.</p>
            ) : (
              checkInRecords.map((record, index) => (
                <div key={index}>
                  <Card className="record-card">
                    <CardHeader
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      {record.employee_id}
                      <span
                        className="badge"
                        style={{
                          backgroundColor: getStatusBadgeStyle(record.status),
                          color: "white",
                          padding: "5px 10px",
                          borderRadius: "5px",
                        }}
                      >
                        {record.status || "N/A"}
                      </span>
                    </CardHeader>
                    <CardContent className="card-content">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <p>Role: {record.role || "N/A"}</p>
                        <p>
                          {new Date(record.check_in_time).toLocaleDateString()}
                        </p>
                      </div>
                    </CardContent>
                    {isToday(record.check_in_time) && (
                      <CardFooter>
                        <Button
                          style={{
                            backgroundColor: "#ff4f4f",
                            color: "#fff",
                            padding: "10px 20px",
                            borderRadius: "5px",
                          }}
                          onClick={() => handleCheckOut(record)}
                        >
                          Check Out
                        </Button>
                      </CardFooter>
                    )}
                  </Card>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      <ToastContainer />
    </>
  );
};

export default UserDashboard;
