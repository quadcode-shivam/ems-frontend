import React, { useEffect, useState } from "react";
import DemoNavbar from "components/Navbars/DemoNavbar";
import { checkIn, checkOut, fetchCheckInRecords } from "../api"; // Adjust the import path accordingly
import "../assets/css/demo.css"; // Import the CSS file
import { Button, Card, CardFooter, CardHeader } from "reactstrap";
import { CardContent } from "@mui/material";
import { ToastContainer, toast } from "react-toastify"; // Import ToastContainer and toast
import "react-toastify/dist/ReactToastify.css"; // Import CSS for Toast
import Logo from "../assets/img/bg3.jpg"; // Ensure the image path is correct
// Import Material-UI icons
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import BadgeIcon from "@mui/icons-material/Badge";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DownloadIcon from "@mui/icons-material/Download";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

// Import jsPDF library
import jsPDF from "jspdf";
import "jspdf-autotable"; // Import jspdf-autotable plugin for table generation
import Swal from "sweetalert2";

const UserDashboard = () => {
  const [checkInRecords, setCheckInRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [averageCheckInTime, setAverageCheckInTime] = useState(null);
  const [averageCheckOutTime, setAverageCheckOutTime] = useState(null);
  const [lastCheckOutTime, setLastCheckOutTime] = useState(null);

  const fetchCheckInData = async () => {
    try {
      const employeeId = user?.user_id;
      const response = await fetchCheckInRecords(employeeId.toString());
      setCheckInRecords(response.check_ins);
      setAverageCheckInTime(response.average_check_in_time);
      setAverageCheckOutTime(response.average_check_out_time);
      setLastCheckOutTime(response.last_check_out_time);
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

  const handleCheckOut = async () => {
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

  // Function to convert checkInRecords to PDF
  const downloadInfoAsPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Employee Check-In Records", 14, 22); // Title

    const tableColumn = [
      "Employee ID",
      "Check In Time",
      "Check Out Time",
      "Status",
      "Role",
    ];
    const tableRows = [];

    checkInRecords.forEach((record) => {
      const rowData = [
        record.employee_id,
        new Date(record.check_in_time).toLocaleString(),
        record.check_out_time
          ? new Date(record.check_out_time).toLocaleString()
          : "N/A",
        record.status,
        record.role,
      ];
      tableRows.push(rowData);
    });

    // Add table to the PDF
    doc.autoTable({
      startY: 30,
      head: [tableColumn],
      body: tableRows,
    });

    // Save the PDF
    doc.save("check_in_records.pdf");
  };

  return (
    <>
      <DemoNavbar size="sm" />
      <div
        className="dashboard-container"
        style={{
          marginTop: "50px",
          marginBottom: "30px",
          background: "#3B3E44",
          color: "#ffffff",
        }}
      >
        <Card
          className="text-light"
          style={{
            padding: "10px",
            marginTop: "20px",
            background: "#12131A",
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
              onClick={downloadInfoAsPDF} // Download the records as PDF when clicked
            >
              <DownloadIcon className="mr-2" />
              DOWNLOAD INFO
            </Button>
          </CardHeader>
          <CardContent
            style={{
              padding: "10px",
            }}
            className="mb-3"
          >
            <div style={{ display: "flex" }}>
              <div
                style={{
                  padding: "10px",
                  borderRadius: "5px",
                  width: "120px",
                }}
                className="mx-4 mb-3"
              >
                <img
                  style={{
                    minWidth: "100px",
                    minHeight: "100px",
                    borderRadius: "50%",
                  }}
                  src={Logo} // Corrected from href to src
                  alt="User Logo"
                />
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "15px",
                  fontSize: "20px",
                  background:""
                }}
              >
                <div
                  style={{
                    padding: "10px",
                    borderRadius: "5px",
                    display: "flex",
                  }}
                  className="my-auto"
                >
                  <div>
                    <AccountCircleIcon
                      style={{
                        fontSize: "50px",
                        marginTop: "10px",
                        marginRight: "5px",
                      }}
                    />
                  </div>
                  <div>
                    <span style={{ fontSize: "14px" }}>Name</span>
                    <br />
                    {user?.name}
                  </div>
                </div>
                <div
                  style={{
                    padding: "10px",
                    borderRadius: "5px",
                    display: "flex",
                  }}
                  className="my-auto"
                >
                  <div>
                    <AccountCircleIcon
                      style={{
                        fontSize: "50px",
                        marginTop: "10px",
                        marginRight: "5px",
                      }}
                    />
                  </div>
                  <div>
                    <span style={{ fontSize: "14px" }}>Employee Id</span>
                    <br />
                    {user?.user_id}
                  </div>
                  {/* {
                    <span
                      className="badge bg-danger p-1"
                      style={{ fontSize: "10px" }}
                    >
                      {user?.role}
                    </span>
                  } */}
                </div>
                <div
                  style={{
                    padding: "10px",
                    borderRadius: "5px",
                    display: "flex",
                  }}
                  className="my-auto"
                >
                  <div>
                    <PhoneIcon
                      style={{
                        fontSize: "50px",
                        marginTop: "10px",
                        marginRight: "5px",
                      }}
                    />
                  </div>
                  <div>
                    <span style={{ fontSize: "14px" }}>Contact No.</span>
                    <br />
                    {user?.mobile}
                  </div>
                </div>
                <div
                  style={{
                    padding: "10px",
                    borderRadius: "5px",
                    display: "flex",
                  }}
                  className="my-auto w-100"
                >
                  <div>
                    <EmailIcon
                      style={{
                        fontSize: "50px",
                        marginTop: "10px",
                        marginRight: "5px",
                      }}
                    />
                  </div>
                  <div>
                    <span style={{ fontSize: "14px" }}>Email Adress</span>
                    <br />
                    {user?.email}
                  </div>
                </div>
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
                className="px-3"
                style={{
                  paddingTop: "25px",
                  background: "#3b3e44",
                  borderRadius: "5px",
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "20px",
                }}
              >
                <p>Average Check Ins :</p>
                <p>{averageCheckInTime}</p>
              </div>
              <div
                className="px-3"
                style={{
                  paddingTop: "25px",
                  background: "#3b3e44",
                  borderRadius: "5px",
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "20px",
                }}
              >
                <p>Average Check Outs :</p>
                <p>{averageCheckOutTime}</p>{" "}
              </div>
              <div
                style={{
                  padding: "4px",
                  background: "green",
                  borderRadius: "5px",
                }}
              >
                <Button
                  className="w-100 h-100 m-0 p-0 bg-secondary text-success "
                  style={{ fontSize: "24px", fontWeight:"600" }}
                  onClick={handleCheckIn}
                >
                  <CheckCircleIcon style={{ fontSize:"30px" }} /> CHECK IN
                </Button>
              </div>
              <div
                style={{
                  padding: "4px",
                  background: "red",
                  borderRadius: "5px",
                  textAlign: "center",
                }}
              >
                <Button
                  className="w-100 h-100 m-0 p-0 bg-secondary text-danger"
                  style={{ fontSize: "24px" }}
                  onClick={() => {
                    Swal.fire({
                      title: "Are you sure?",
                      text: "You won't be able to revert this!",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonColor: "#3085d6",
                      cancelButtonColor: "#d33",
                      confirmButtonText: "Yes, check out!",
                      cancelButtonText: "No, cancel",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        handleCheckOut(); // Call your function if confirmed
                      }
                    });
                  }}
                >
                 <CheckCircleIcon style={{ fontSize:"30px" }} />  CHECK OUT
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
                  <Card className="record-card border-0 p-1 h-100">
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
                    <CardFooter
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "10px",
                      }}
                    >
                      <p>
                        <div
                          className="badge"
                          style={{
                            color: "white",
                            padding: "5px 10px",
                            borderRadius: "5px",
                          }}
                          class="bg-secondary mr-2"
                        >
                          <span>Check In: </span>
                          {new Date(record.check_in_time).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </div>
                      </p>
                      <p>
                        {record.check_out_time == null ? (
                          <><AccessTimeIcon/></>
                        ) : (
                          <div
                            className="badge"
                            style={{
                              color: "white",
                              padding: "5px 10px",
                              borderRadius: "5px",
                            }}
                            class="bg-secondary"
                          >
                            <span>Check Out: </span>
                            {new Date(record.check_out_time).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </div>
                        )}
                      </p>
                    </CardFooter>
                  </Card>
                </div>
              ))
            )}
          </div>
        )}
        <ToastContainer />
      </div>
    </>
  );
};

export default UserDashboard;
