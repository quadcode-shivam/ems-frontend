import React, { useEffect, useState } from "react";
import { fetchMainVendors } from "api";
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
  Icon,
  CardContent,
  Typography,
} from "@mui/material";
import DemoNavbar from "components/Navbars/DemoNavbar";
import { CardHeader } from "reactstrap";
import PaginationComponent from "components/pagination/PaginationComponent";
import zIndex from "@mui/material/styles/zIndex";

export default function MainVendor() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [openTools, setOpenTools] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [rangeDate, setRangeDate] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 7)),
    end: new Date(),
  });

  const onRangeChange = (dates) => {
    const [start, end] = dates;
    setRangeDate({ start: start, end: end });
  };
  const loadVendors = async () => {
    const response = await fetchMainVendors(
      currentPage,
      itemsPerPage,
      rangeDate
    );
    if (response.error) {
      setError(response.error);
    } else {
      setVendors(response.data);
    }
    setLoading(false);
  };

  const onReportSearch = async () => {
    loadVendors(currentPage, itemsPerPage, rangeDate);
  };
  useEffect(() => {
    loadVendors(currentPage, itemsPerPage, rangeDate);
  }, [currentPage, itemsPerPage, rangeDate]);

  const getStatusLabel = (status) => {
    switch (status) {
      case 1:
        return "Hold";
      case 2:
        return "Suspend";
      case 3:
        return "Active";
      default:
        return "Unknown";
    }
  };

  const isOpen = (vendor) => {
    const currentTime = new Date();
    const currentDay = currentTime.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  
    // Create an array to check if the vendor is closed today
    const daysOff = [
      vendor.sunday_off,
      vendor.monday_off,
      vendor.tuesday_off,
      vendor.wednesday_off,
      vendor.thursday_off,
      vendor.friday_off,
      vendor.saturday_off,
    ];
  
    // Determine if the vendor is closed today
    if (daysOff[currentDay] === 1) return false;
  
    // Check open and close times
    const [openHour, openMinute] = vendor.opening_time.split(':').map(Number);
    const [closeHour, closeMinute] = vendor.closing_time.split(':').map(Number);
    
    const openTime = new Date(currentTime);
    openTime.setHours(openHour, openMinute, 0);
  
    const closeTime = new Date(currentTime);
    closeTime.setHours(closeHour, closeMinute, 0);
  
    // If closing time is earlier than opening time, it means it closes after midnight
    if (closeTime < openTime) {
      closeTime.setDate(closeTime.getDate() + 1); // Add a day for overnight closing
    }
  
    return currentTime >= openTime && currentTime <= closeTime;
  };
  

  const filteredVendors = vendors.filter((vendor) =>
    vendor.shop_name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(event.target.value);
    setCurrentPage(1); // Reset to first page whenever items per page changes
  };

  return (
    <>
      <DemoNavbar size="sm" />
      <div style={{ marginTop: "80px" }}>
        <Card className="p-3" style={{ background: "transparent" }}>
          <CardHeader
            style={{
              background: "transparent",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h4">Main Vendors List</Typography>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ position: "relative", marginRight: "16px" }}>
                <DatePicker
                  selected={rangeDate.start}
                  startDate={rangeDate.start}
                  onChange={onRangeChange}
                  endDate={rangeDate.end}
                  selectsRange
                  className="form-control date-picker"
                  dateFormat="dd-M-yyyy"
                  maxDate={new Date()}
                />
              </div>
              <Button className="btn w-75" style={{background:"#12131A", minHeight:"40px"}} onClick={onReportSearch}>
                <span className="text-light ">Search</span>
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <div
              style={{
                borderRadius: "20px",
                overflow: "hidden",
              }}
            >
              <Table className="table-responsive ">
                <TableHead
                  style={{
                    borderRadius: "20px 20px 20px 20px",
                    background: "#12131A",
                    overflow: "hidden",
                  }}
                >
                  <TableRow>
                    <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                      Shop Name
                    </TableCell>
                    <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                      Shopkeeper Name
                    </TableCell>
                    <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                      Location
                    </TableCell>
                    <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                      Email
                    </TableCell>
                    <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                      Service Type
                    </TableCell>
                    <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                      Status
                    </TableCell>
                    <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                      Open
                    </TableCell>
                    <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredVendors.map((vendor) => (
                    <TableRow key={vendor.id}>
                      <TableCell>
                        {vendor.shop_name}
                        <p className="text-center">
                          <Badge
                            style={{ zIndex: "0" }}
                            color="primary"
                            badgeContent={vendor.shop_id}
                          />
                        </p>
                      </TableCell>
                      <TableCell>{vendor.shopkeeper_name}</TableCell>
                      <TableCell>{vendor.location}</TableCell>
                      <TableCell>
                        {vendor.email}
                        <br />
                        {vendor.contact_number}
                      </TableCell>
                      <TableCell>{vendor.service_type}</TableCell>
                      <TableCell>
                        <Badge
                          color={
                            vendor.status === 3
                              ? "success"
                              : vendor.status === 2
                              ? "warning"
                              : "error"
                          }
                          style={{ zIndex: "0" }}
                          badgeContent={getStatusLabel(vendor.status)}
                        />
                      </TableCell>
                      <TableCell>
                        <Badge
                          style={{ zIndex: "0" }}
                          color={isOpen(vendor) ? "success" : "error"}
                          badgeContent={isOpen(vendor) ? "Open" : "Closed"}
                        />
                      </TableCell>
                      <TableCell>
                        <Button variant="outlined">Actions</Button>
                        {/* Add Dropdown or Menu for actions here */}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardContent>
            <PaginationComponent
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
