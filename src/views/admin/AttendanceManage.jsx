import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Loader from "views/Loader/Loader";
import {
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
} from "@mui/material";
import DemoNavbar from "components/Navbars/DemoNavbar";
import { updateLeaveStatusApi } from "api"; // Import the updateLeaveStatus API
import Swal from "sweetalert2";
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";
import { fetchLeavesApiAdmin } from "api";

export default function AttendanceManage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [search, setSearch] = useState("");
  const [totalRecords, setTotalRecords] = useState(0);
  const [rangeDate, setRangeDate] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)),
    end: new Date(),
  });

  const onRangeChange = (dates) => {
    const [start, end] = dates;
    setRangeDate({ start, end });
  };

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const response = await fetchLeavesApiAdmin();
      setLeaves(response.leaves);
      setTotalRecords(response.total_records);
    } catch (error) {
      setError("Failed to load leaves. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleStatusChange = async (userId, newStatus) => {
    try {
      const request = {
        user_id: userId, // Use the logged-in user's ID
        status: newStatus, // Status selected from the dropdown
      };
      await updateLeaveStatusApi(request); // Call API to update status
      Swal.fire("Success", "Status updated successfully", "success");
      fetchLeaves(); // Re-fetch the leaves after updating the status
    } catch (error) {
      Swal.fire("Error", "Failed to update status. Please try again.", "error");
    }
  };

  const getBadgeColor = (type) => {
    switch (type) {
      case "sick":
        return "primary";
      case "casual":
        return "secondary";
      case "personal":
        return "warning";
      case "others":
        return "default";
      default:
        return "default";
    }
  };

  const getBadgeColorStatus = (status) => {
    switch (status) {
      case "approved":
        return "success";
      case "suspended":
        return "error";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  const getBadgeColorDay = (dayType) => {
    return dayType === "full" ? "warning" : "info";
  };

  if (loading) return <CircularProgress />;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <DemoNavbar size="sm" />
      {loading && <Loader />}
      <div style={{ marginTop: "60px", minHeight: "100%", background: "#0F1214" }}>
        <Card className="p-3 px-4" style={{ background: "#0F1214" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} className="px-3">
            <Typography variant="h4" className="text-light">Manage Leaves</Typography>
            <div className="p-1" style={{ display: "flex", alignItems: "center" }}>
              <input
                type="text"
                placeholder="Search by Name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ marginRight: "4px" }}
                className="form-control date-picker border border-1"
              />
              <DatePicker
                selected={rangeDate.start}
                onChange={onRangeChange}
                selectsRange
                startDate={rangeDate.start}
                endDate={rangeDate.end}
                className="form-control date-picker border border-1 text-light fw-bold"
                dateFormat="dd-M-yyyy"
                maxDate={new Date()}
                style={{ marginRight: "16px" }}
              />
              <Button
                className="btn border border-2 pt-2 ml-1"
                style={{ background: "#080B0F", color: "#fff", minWidth: "100px" }}
                onClick={fetchLeaves}
              >
                <span className="fw-bold" style={{ fontSize: "14px" }}>Search</span>
              </Button>
            </div>
          </div>

          <CardContent style={{ overflowY: "hidden" }}>
            <TableContainer>
              <Table className="">
                <TableHead className="bg-secondary text-light rounded fw-bold pl-2">
                  <TableRow>
                    <TableCell className="text-light" style={{ fontSize: "14px" }}>EMPLOYEE</TableCell>
                    <TableCell className="text-light" style={{ fontSize: "14px" }}>CONTACT</TableCell>
                    <TableCell className="text-light" style={{ fontSize: "14px" }}>TYPE</TableCell>
                    <TableCell className="text-light" style={{ fontSize: "14px" }}>FROM</TableCell>
                    <TableCell className="text-light" style={{ fontSize: "14px" }}>TO</TableCell>
                    <TableCell className="text-light" style={{ fontSize: "14px" }}>STATUS</TableCell>
                    <TableCell className="text-light" style={{ fontSize: "14px" }}>DAY</TableCell>
                    <TableCell className="text-light" style={{ fontSize: "14px" }}>ACTIONS</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {leaves.map((leave) => (
                    <TableRow key={leave.id}>
                      <TableCell className="text-light"> 
                        {leave.name}<br/>
                        <Chip label={leave.employee_id} color="info" style={{ fontSize:"10px" }} />
                      </TableCell>
                      <TableCell className="text-light"> 
                        {leave.employee_id}<br/>
                        <Chip label={leave.email} className="bg-secondary text-light"/>
                      </TableCell>
                      <TableCell>
                        <Chip label={leave.leave_type} color={getBadgeColor(leave.leave_type)} />
                      </TableCell>
                      <TableCell className="text-light">
                        {new Date(leave.start_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-light">
                        {new Date(leave.end_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Chip label={leave.status} color={getBadgeColorStatus(leave.status)} />
                      </TableCell>
                      <TableCell>
                        <Chip label={leave.half_day_full_day} color={getBadgeColorDay(leave.half_day_full_day)} />
                      </TableCell>
                      <TableCell>
                        <UncontrolledDropdown>
                          <DropdownToggle
                            tag="a"
                            href="#more"
                            onClick={(ev) => ev.preventDefault()}
                            className="btn btn-icon bg-primary btn-sm"
                            style={{ borderRadius: "50px" }}
                          >
                            <span style={{ fontSize: "20px", fontWeight: "600", lineHeight: "23px" }}>...</span>
                          </DropdownToggle>
                          <DropdownMenu right>
                            {["pending", "approved", "suspended"].map((action) => (
                              <DropdownItem
                                key={action}
                                tag="a"
                                href="#remove"
                                onClick={() =>
                                  handleStatusChange(leave.employee_id, action.toLowerCase())
                                }
                              >
                                <span>{action.toLowerCase()}</span>
                              </DropdownItem>
                            ))}
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {totalRecords === 0 && <p className="text-light text-center">No leaves found.</p>}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
