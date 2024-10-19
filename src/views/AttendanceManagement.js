import React, { useEffect, useState } from "react";
import { fetchAttendance, createAttendance, actionAttendApi } from "api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../assets/css/demo.css";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import DemoNavbar from "components/Navbars/DemoNavbar";
import {
  CardHeader,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import PaginationComponent from "components/pagination/PaginationComponent";
import Loader from "./Loader/Loader";
import { More, MoreHoriz } from "@mui/icons-material";

const AttendanceManagement = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [employeeId, setEmployeeId] = useState("");
  const [status, setStatus] = useState("");
  const [rangeDate, setRangeDate] = useState({
    start: new Date(),
    end: new Date(),
  });
  const [role, setRole] = useState();
  const [totals, setTotals] = useState({
    absent: 0,
    halfDayPresent: 0,
    fullDayPresent: 0,
    late: 0,
    active: 0,
  });

  const onRangeChange = (dates) => {
    const [start, end] = dates;
    setRangeDate({ start, end });
  };

  const loadAttendance = async () => {
    setLoading(true);
    try {
      const response = await fetchAttendance(
        currentPage,
        itemsPerPage,
        status,
        rangeDate.start,
        rangeDate.end
      );
      setAttendanceRecords(response.data);
      setTotalItems(response.total);
      setTotals(response.totals);
    } catch (error) {
      setError("Failed to fetch attendance records.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAttendance = async () => {
    if (!employeeId || !status) {
      setError("Please provide both Employee ID and Status.");
      return;
    }

    const attendanceData = {
      employee_id: employeeId,
      status,
      date: new Date(),
    };

    try {
      await createAttendance(attendanceData);
      loadAttendance();
      resetForm();
    } catch {
      setError("Failed to add attendance.");
    }
  };

  const resetForm = () => {
    setEmployeeId("");
    setStatus("");
  };

  const actionAttend = async (id, action) => {
    try {
      await actionAttendApi(id, action);
      loadAttendance();
      setError(null);
    } catch {
      setError("Failed to update attendance.");
    }
  };

  useEffect(() => {
    loadAttendance();
    const user = JSON.parse(localStorage.getItem("user"));
    setRole(user.role);
  }, [currentPage, itemsPerPage, status]);

  if (loading) return <Loader />;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <DemoNavbar size="sm" />
      <div style={{ marginTop: "60px", minHeight: "100%", background: "#0F1214" }}>
        <Card className="p-3" style={{ background: "transparent" }}>
          <CardHeader style={headerStyle}>
            <Typography variant="h4" className="text-light" style={{ fontSize: "30px" }}>
              Manage Attendance
            </Typography>
            <SearchAndAddSection
              employeeId={employeeId}
              setEmployeeId={setEmployeeId}
              status={status}
              setStatus={setStatus}
              rangeDate={rangeDate}
              onRangeChange={onRangeChange}
              onReportSearch={loadAttendance}
              onAddAttendance={handleAddAttendance}
            />
          </CardHeader>
          <CardContent>
            <SummaryCards totals={totals} />
            <AttendanceTable
              records={attendanceRecords}
              onActionAttend={actionAttend}
              role={role} // Pass the role to the AttendanceTable
            />
            <PaginationComponent
              className="border border-1"
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={(e) => {
                setItemsPerPage(e.target.value);
                setCurrentPage(1);
              }}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

const headerStyle = {
  background: "transparent",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const SummaryCards = ({ totals }) => (
  <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "16px" }}>
    {Object.entries(totals).map(([key, count]) => (
      <SummaryCard key={key} title={key.charAt(0).toUpperCase() + key.slice(1)} count={count} />
    ))}
  </div>
);

const SummaryCard = ({ title, count }) => {
  const cardColor = getCardColor(title);
  return (
    <Card className={`text-light fw-bold`} style={{ backgroundColor: "#11171D", boxShadow: "0px 0px 1px 1px", flex: 1, margin: "0 8px" }}>
      <CardContent>
        <Typography variant="h6" style={{ fontSize: "20px" }}>
          {title}
        </Typography>
        <Typography variant="h4" style={{ fontSize: "26px" }}>
          Total: {count} <span style={{ fontSize: "22px" }}>({count === 0 ? "Zero" : numberToWords(count)})</span>
        </Typography>
      </CardContent>
    </Card>
  );
};

const getCardColor = (title) => {
  switch (title) {
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

const numberToWords = (num) => {
  const words = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
    "Twenty",
    "Twenty one",
    "Twenty two",
    "Twenty three",
    "Twenty four",
    "Twenty five",
    "Twenty six",
    "Twenty seven",
    "Twenty eight",
    "Twenty nine",
    "Thirty",
  ];
  return num < 31 ? words[num] : "more than thirty";
};

const SearchAndAddSection = ({
  employeeId,
  setEmployeeId,
  status,
  setStatus,
  rangeDate,
  onRangeChange,
  onReportSearch,
  onAddAttendance,
}) => (
  <div style={{ display: "flex", alignItems: "center" }}>
    <input
      type="text"
      placeholder="Employee ID"
      value={employeeId}
      onChange={(e) => setEmployeeId(e.target.value)}
      style={{ marginRight: "16px" }}
      className="form-control date-picker bg-secondary border border-1 text-light"
    />
    <select
      value={status}
      onChange={(e) => setStatus(e.target.value)}
      style={{ marginRight: "16px" }}
      className="form-control date-picker bg-secondary border border-1 text-light"
    >
      <option value="">All</option>
      <option value="present">Present</option>
      <option value="absent">Absent</option>
      <option value="halfday">Half-Day</option>
      <option value="fullday">Full-Day</option>
      <option value="late">Late</option>
    </select>
    <DatePicker
      selected={rangeDate.start}
      onChange={onRangeChange}
      selectsRange
      startDate={rangeDate.start}
      endDate={rangeDate.end}
      className="form-control date-picker bg-secondary border border-1 text-light fw-bold"
      dateFormat="dd-M-yyyy"
      maxDate={new Date()}
      style={{ marginRight: "16px" }}
    />
   
    <Button className="ml-2 p-2 px-4 w-50" color="secondary" variant="contained" onClick={onReportSearch}>
      Search
    </Button>
  </div>
);

const AttendanceTable = ({ records, onActionAttend, role }) => (
  <Table>
    <TableHead>
      <TableRow className="bg-secondary text-light">
        <TableCell className="text-light">Employee ID</TableCell>
        <TableCell className="text-light"> Employee Details</TableCell>
        <TableCell className="text-light">Status</TableCell>
        <TableCell className="text-light">Date</TableCell>
        {role === "admin" && <TableCell className="text-light">Action</TableCell>} {/* Conditional rendering for Action column */}
      </TableRow>
    </TableHead>
    <TableBody>
      {records.map((record) => (
        <TableRow key={record.id}>
          <TableCell className="text-light fw-bold">{record.user_id}</TableCell>
          <TableCell className="text-light">{record.user_name}<br/> <span className="badge badge-primarys border border-1 border-light p-1 mt-2" style={{fontSize:"14px"}}>{record.user_email}</span></TableCell>
          <TableCell className="text-light">{record.status}</TableCell>
          <TableCell className="text-light">{new Date(record.date).toLocaleDateString()}</TableCell>
          {role === "admin" && ( 
            <TableCell>
              <UncontrolledDropdown>
                <DropdownToggle className="p-1"  style={{ fontSize:"24px", background:"transparent"}}>
                  <More/>
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem onClick={() => onActionAttend(record.id, "update")}>Update</DropdownItem>
                  <DropdownItem onClick={() => onActionAttend(record.id, "delete")}>Delete</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </TableCell>
          )}
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default AttendanceManagement;
