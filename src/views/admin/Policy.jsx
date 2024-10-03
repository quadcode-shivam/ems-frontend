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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import DemoNavbar from "components/Navbars/DemoNavbar";
import {
  updatePolicyApi,
  fetchLeavePoliciesApi,
  fetchCompanyPoliciesApi,
  updateCompanyPolicyApi,
  createCompanyPolicyApi,
} from "api"; // Adjust the API imports
import Swal from "sweetalert2";
import { CardHeader } from "reactstrap";

export default function Policy() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [leavePolicies, setLeavePolicies] = useState([]);
  const [companyPolicies, setCompanyPolicies] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editPolicy, setEditPolicy] = useState(null);
  const [totalRecords, setTotalRecords] = useState(0);

  // State for editing company policy
  const [openCompanyEditModal, setOpenCompanyEditModal] = useState(false);
  const [editCompanyPolicy, setEditCompanyPolicy] = useState(null);

  // State for user role
  const [userRole, setUserRole] = useState(null);

  const fetchLeavePolicies = async () => {
    setLoading(true);
    try {
      const response = await fetchLeavePoliciesApi();
      setLeavePolicies(response.policies);
      setTotalRecords(response.total_records);
    } catch (error) {
      setError("Failed to load leave policies. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanyPolicies = async () => {
    setLoading(true);
    try {
      const response = await fetchCompanyPoliciesApi(); // Fetch company policies
      setCompanyPolicies(response.policies);
    } catch (error) {
      setError("Failed to load company policies. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Get user role from local storage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUserRole(storedUser.role);
    }

    fetchLeavePolicies();
    fetchCompanyPolicies(); // Fetch company policies on mount
  }, []);

  const handleEditClick = (policy) => {
    setEditPolicy(policy);
    setOpenModal(true);
  };

  const handleUpdatePolicy = async () => {
    try {
      await updatePolicyApi(editPolicy); // Update leave policy with the API
      Swal.fire("Success", "Leave policy updated successfully", "success");
      fetchLeavePolicies(); // Re-fetch leave policies after updating
      setOpenModal(false);
    } catch (error) {
      Swal.fire(
        "Error",
        "Failed to update leave policy. Please try again.",
        "error"
      );
    }
  };

  const handleChange = (e) => {
    setEditPolicy({ ...editPolicy, [e.target.name]: e.target.value });
  };

  // Add Company Policy
  const [openCompanyModal, setOpenCompanyModal] = useState(false);
  const [newCompanyPolicy, setNewCompanyPolicy] = useState({
    title: "",
    description: "",
    category: "",
  });

  const handleCompanyChange = (e) => {
    setNewCompanyPolicy({
      ...newCompanyPolicy,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddCompanyPolicy = async () => {
    try {
      await createCompanyPolicyApi(newCompanyPolicy); // Create new company policy
      Swal.fire("Success", "Company policy added successfully", "success");
      fetchCompanyPolicies(); // Re-fetch company policies
      setOpenCompanyModal(false);
      setNewCompanyPolicy({ title: "", description: "", category: "" }); // Reset form
    } catch (error) {
      Swal.fire(
        "Error",
        "Failed to add company policy. Please try again.",
        "error"
      );
    }
  };

  // Handle editing company policy
  const handleEditCompanyClick = (policy) => {
    setEditCompanyPolicy(policy);
    setOpenCompanyEditModal(true);
  };

  const handleUpdateCompanyPolicy = async () => {
    try {
      await updateCompanyPolicyApi(editCompanyPolicy); // Update company policy
      Swal.fire("Success", "Company policy updated successfully", "success");
      fetchCompanyPolicies(); // Re-fetch company policies after updating
      setOpenCompanyEditModal(false);
    } catch (error) {
      Swal.fire(
        "Error",
        "Failed to update company policy. Please try again.",
        "error"
      );
    }
  };

  const handleCompanyEditChange = (e) => {
    setEditCompanyPolicy({
      ...editCompanyPolicy,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) return <CircularProgress />;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <DemoNavbar size="sm" />
      <div
        style={{ marginTop: "60px", minHeight: "100%", background: "#0F1214" }}
      >
        {/* Leave Policies Table */}
        <Card className="p-3 px-4" style={{ background: "#0F1214" }}>
          <Typography variant="h4" className="text-light">
            Manage Leave Policies
          </Typography>
          <CardContent style={{ overflowY: "hidden" }}>
            <TableContainer>
              <Table>
                <TableHead className="bg-secondary text-light rounded fw-bold">
                  <TableRow>
                    <TableCell className="text-light">Created At</TableCell>
                    <TableCell className="text-light">Updated At</TableCell>
                    <TableCell className="text-light">Total Leave</TableCell>
                    <TableCell className="text-light">Total Half Day</TableCell>
                    <TableCell className="text-light">Total Late</TableCell>
                    {userRole === "admin" && (
                      <TableCell className="text-light">Actions</TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {leavePolicies.map((policy) => (
                    <TableRow key={policy.id}>
                      <TableCell className="text-light">
                        {new Date(policy.created_at).toLocaleDateString()}{" "}
                        <br />
                        {new Date(policy.created_at).toLocaleTimeString()}
                      </TableCell>
                      <TableCell className="text-light">
                        {new Date(policy.updated_at).toLocaleDateString()}{" "}
                        <br />
                        {new Date(policy.updated_at).toLocaleTimeString()}
                      </TableCell>
                      <TableCell className="text-light">
                        {policy.total_leave}
                      </TableCell>
                      <TableCell className="text-light">
                        {policy.total_half_day}
                      </TableCell>
                      <TableCell className="text-light">
                        {policy.total_late}
                      </TableCell>
                      {userRole === "admin" && (
                        <TableCell>
                          <Button onClick={() => handleEditClick(policy)}  style={{ background:"#7289DA", color:"#fff" }}>
                            Edit
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {totalRecords === 0 && (
              <p className="text-light text-center">No leave policies found.</p>
            )}
          </CardContent>
        </Card>

        

        {/* Company Policies Table */}
        <Card
          className="p-3 px-4"
          style={{ background: "#0F1214", marginTop: "20px" }}
        >
            <CardHeader style={{ display:"flex", justifyContent:"space-between" }}>

          <Typography variant="h4" className="text-light">
            Manage Company Policies
          </Typography>
          {/* Add Company Policy Button */}
        {userRole === "admin" && (
            <Button
            onClick={() => setOpenCompanyModal(true)}
            style={{ background:"#7289DA", color:"#fff" }}
            >
            Add Company Policy
          </Button>
        )}
        </CardHeader>
          <CardContent>
            <TableContainer>
              <Table>
                <TableHead className="bg-secondary text-light rounded fw-bold">
                  <TableRow>
                    <TableCell className="text-light">Title</TableCell>
                    <TableCell className="text-light">Description</TableCell>
                    <TableCell className="text-light">Category</TableCell>
                    {userRole === "admin" && (
                      <TableCell className="text-light">Actions</TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {companyPolicies.map((policy) => (
                    <TableRow key={policy.id}>
                      <TableCell className="text-light">
                        {policy.title}
                      </TableCell>
                      <TableCell className="text-light">
                        {policy.description}
                      </TableCell>
                      <TableCell className="text-light">
                        {policy.category}
                      </TableCell>
                      {userRole === "admin" && (
                        <TableCell>
                          <Button
                            onClick={() => handleEditCompanyClick(policy)}
                            style={{ background:"#7289DA", color:"#fff" }}
                          >
                            Edit
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {companyPolicies.length === 0 && (
              <p className="text-light text-center">
                No company policies found.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Edit Leave Policy Modal */}
        <Dialog open={openModal} onClose={() => setOpenModal(false)}>
          <DialogTitle>Edit Leave Policy</DialogTitle>
          <DialogContent>
            <TextField
              label="Total Leave"
              name="total_leave"
              value={editPolicy?.total_leave || ""}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Total Half Day"
              name="total_half_day"
              value={editPolicy?.total_half_day || ""}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Total Late"
              name="total_late"
              value={editPolicy?.total_late || ""}
              onChange={handleChange}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenModal(false)} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleUpdatePolicy} color="primary">
              Update
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Company Policy Modal */}
        <Dialog
          open={openCompanyModal}
          onClose={() => setOpenCompanyModal(false)}
        >
          <DialogTitle>Add Company Policy</DialogTitle>
          <DialogContent>
            <TextField
              label="Title"
              name="title"
              value={newCompanyPolicy.title}
              onChange={handleCompanyChange}
              fullWidth
            />
            <TextField
              label="Description"
              name="description"
              value={newCompanyPolicy.description}
              onChange={handleCompanyChange}
              fullWidth
            />
            <TextField
              label="Category"
              name="category"
              value={newCompanyPolicy.category}
              onChange={handleCompanyChange}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenCompanyModal(false)}
              color="secondary"
            >
              Cancel
            </Button>
            <Button onClick={handleAddCompanyPolicy} color="primary">
              Add
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Company Policy Modal */}
        <Dialog
          open={openCompanyEditModal}
          onClose={() => setOpenCompanyEditModal(false)}
        >
          <DialogTitle>Edit Company Policy</DialogTitle>
          <DialogContent>
            <TextField
              label="Title"
              name="title"
              value={editCompanyPolicy?.title || ""}
              onChange={handleCompanyEditChange}
              fullWidth
            />
            <TextField
              label="Description"
              name="description"
              value={editCompanyPolicy?.description || ""}
              onChange={handleCompanyEditChange}
              fullWidth
            />
            <TextField
              label="Category"
              name="category"
              value={editCompanyPolicy?.category || ""}
              onChange={handleCompanyEditChange}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenCompanyEditModal(false)}
              color="secondary"
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateCompanyPolicy} color="primary">
              Update
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}
