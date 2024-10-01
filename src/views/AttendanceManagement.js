import React, { useEffect, useState } from "react";
import { fetchAttendance, createAttendance, actionAttendApi } from "api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import '../assets/css/demo.css'
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
  Badge,
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

const AttendanceManagement = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [employeeId, setEmployeeId] = useState("");
  const [status, setStatus] = useState("");
  const [rangeDate, setRangeDate] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)),
    end: new Date(),
  });
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
      setTotals(response.totals); // Update with response structure
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
  }, [currentPage, itemsPerPage, status]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <DemoNavbar size="sm" />
      {loading == true && <Loader />}
      <div style={{marginTop: "60px", minHeight: "100%", background: "#0F1214"  }}>
        <Card className="p-3 " style={{ background: "transparent" }}>
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
            />
            <PaginationComponent
            className="border border-1 "
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
  <div
    style={{
      display: "flex",
      justifyContent: "space-around",
      marginBottom: "16px",
    }}
  >
    {Object.entries(totals).map(([key, count]) => (
      <SummaryCard
        key={key}
        title={key.charAt(0).toUpperCase() + key.slice(1)}
        count={count}
      />
    ))}
  </div>
);

const SummaryCard = ({ title, count }) => {
  const cardColor = getCardColor(title);
  return (
    <Card
      className={`text-light fw-bold `}
      style={{ backgroundColor: "#11171D", boxShadow:"0px 0px 1px 1px", flex: 1, margin: "0 8px" }}
    >
      <CardContent>
        <Typography variant="h6" style={{ fontSize: "20px" }}>
          {title}
        </Typography>
        <Typography variant="h4" style={{ fontSize: "26px" }}>
          Total: {count}{" "}
          <span style={{ fontSize: "22px" }}>
            ({count === 0 ? "Zero" : numberToWords(count)})
          </span>
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
    <Button
      className="btn bg-secondary border border-2 pt-2 ml-2"
      style={{  minWidth: "100px" }}
      onClick={onReportSearch}
    >
      <span className="text-light fw-bold" style={{ fontSize: "14px" }}>
        Search
      </span>
    </Button>
    <Button
      className="btn w-100 border bg-secondary border-2 pt-2 ml-3"
      onClick={onAddAttendance}
      style={{
        color: "#fff",
        minWidth: "170px",
        fontSize: "14px",
      }}
    >
      Add Attendance
    </Button>
  </div>
);
const AttendanceTable = ({ records, onActionAttend }) => (
  <div style={{  overflow: "hidden" }}>
    <Table className="table-responsive table-striped">
      <TableHead className="bg-secondary rounded">
        <TableRow>
          <TableCell style={{ color: "#fff" }}>Employee ID</TableCell>
          <TableCell style={{ color: "#fff" }}>Check-In Time</TableCell>
          <TableCell style={{ color: "#fff" }}>Check-Out Time</TableCell>
          <TableCell style={{ color: "#fff" }}>Status</TableCell>
          <TableCell style={{ color: "#fff" }}>Action</TableCell>
        </TableRow>
      </TableHead>
      <TableBody >
        {records.map((record) => (
          <TableRow key={record.id}>
            <TableCell style={{ background:"#11171D", color:"white" }}>{record.user_id}</TableCell>
            <TableCell style={{ background:"#11171D", color:"white" }}>
              {record.check_in_time ? record.check_in_time : "----------"}
            </TableCell >
            <TableCell style={{ background:"#11171D", color:"white" }}>
              {record.check_out_time ? record.check_out_time : "----------"}
            </TableCell>
            <TableCell style={{ background:"#11171D", color:"white" }}>
              {record.status == "fullday" && (
                <span className={`badge p-2 fs-2 bg-success`}>
                  {record.status}
                </span>
              )}
              {record.status == "present" && (
                <span className={`badge p-2 fs-2 bg-success`}>
                  {record.status}
                </span>
              )}
              {record.status == "HalfDayPresent" && (
                <span className={`badge p-2 fs-2 bg-warning`}>
                  {record.status}
                </span>
              )}
              {record.status == "absent" && (
                <span className={`badge p-2 fs-2 bg-danger`}>
                  {record.status}
                </span>
              )}
              {record.status == "Late" && (
                <span className={`badge p-2 fs-2 bg-secondary text-light`}>
                  {record.status}
                </span>
              )}
            </TableCell>

            <TableCell style={{ background:"#11171D", color:"white" }}>
              <UncontrolledDropdown>
                <DropdownToggle
                  tag="a"
                  href="#more"
                  onClick={(ev) => ev.preventDefault()}
                  className="btn btn-icon bg-primary btn-sm"
                  style={{ borderRadius: "50px" }}
                >
                  <span
                    style={{
                      fontSize: "20px",
                      fontWeight: "600",
                      lineHeight: "23px",
                    }}
                  >
                    ...
                  </span>
                </DropdownToggle>
                <DropdownMenu right>
                  {["Late", "Present", "Absent", "Halfday", "Fullday"].map(
                    (action) => (
                      <DropdownItem
                        key={action}
                        tag="a"
                        href="#remove"
                        onClick={() =>
                          onActionAttend(record.id, action.toLowerCase())
                        }
                      >
                        <span>{action.toLowerCase()}</span>
                      </DropdownItem>
                    )
                  )}
                </DropdownMenu>
              </UncontrolledDropdown>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

const tableHeadStyle = {
  background: "#343a40",
};

const getBadgeColor = (status) => {
  switch (status) {
    case "present":
      return "success";
    case "absent":
      return "danger";
    case "halfday":
      return "warning";
    case "late":
      return "info";
    default:
      return "secondary";
  }
};

export default AttendanceManagement;
