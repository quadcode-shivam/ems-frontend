import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Badge,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Icon,
  Link,
} from "@mui/material";
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap"; // Make sure this matches the library you're using

import DemoNavbar from "components/Navbars/DemoNavbar";
import PaginationComponent from "components/pagination/PaginationComponent";
import { fetchEmployees,removeEmployees } from "api"; // Make sure this points to your actual API file

export default function EmployeeManagement() {
  const cellStyle = {
    color: "#fff",
    fontWeight: "bold",
  };
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [rangeDate, setRangeDate] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)), // 30 days ago
    end: new Date(new Date().setDate(new Date().getDate() + 1)), // tomorrow
  });

  const onRangeChange = (dates) => {
    const [start, end] = dates;
    setRangeDate({ start: start, end: end });
  };

  const loadEmployees = async () => {
    try {
      const response = await fetchEmployees(
        currentPage,
        itemsPerPage,
        rangeDate
      );
      setEmployees(response.data);
      setTotalItems(response.total);
      setError(null); // Clear any previous errors
    } catch (error) {
      setError("Failed to load employees. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployees = async (id) => {
    try {
      const response = await removeEmployees(id);
      loadEmployees();
      setError(null); // Clear any previous errors
    } catch (error) {
      setError("Failed to load employees. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, [currentPage, itemsPerPage, rangeDate]);

  const onReportSearch = async () => {
    loadEmployees();
  };

  const filteredEmployees = employees.filter((employee) =>
    employee.user_name.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusLabel = (status) => {
    switch (status) {
      case "active":
        return "Active";
      case "inactive":
        return "Inactive";
      default:
        return "Unknown";
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <DemoNavbar size="sm" />
      <div style={{ marginTop: "80px" }}>
        <Card className="p-3" style={{ background: "transparent" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h4">Add New</Typography>
            
          </div>

          
        </Card>
      </div>
    </>
  );
}
