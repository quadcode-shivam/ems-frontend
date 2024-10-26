import axios from "axios";
//hello
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

// Employee API Calls
const createEmployee = async (data) => {
  const res = await api.post("admin/employees/create", data);
  return res.data;
};

const registerUser = async (data) => {
  try {
    const res = await api.post("register", data); // Assuming the register route is /api/register
    return res.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error; // Rethrow the error for handling in the calling function
  }
};

const loginUser = async (data) => {
  try {
    const res = await api.post("login", data); // Assuming the login route is /api/login
    return res.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error; // Rethrow the error for handling in the calling function
  }
};

const checkIn = async (employeeId) => {
  try {
    const res = await api.post("/check-in", { user_id: employeeId });
    return res.data;
  } catch (error) {
    console.error("Error during check-in:", error);
    throw error;
  }
};

// Check-Out API Call
const checkOut = async (employeeId) => {
  try {
    const res = await api.post("/check-out", { user_id: employeeId });
    return res.data;
  } catch (error) {
    console.error("Error during check-out:", error);
    throw error;
  }
};

// In your API file
const fetchCheckInRecords = async (params) => {
  try {
    const response = await api.post("checkrecord", {
      user_id: params,
    }); // Adjust endpoint as needed
    return response.data;
  } catch (error) {
    console.error("Error fetching check-in records:", error);
    throw error;
  }
};

const fetchEmployees = async (currentPage, itemsPerPage, rangeDate) => {
  try {
    const response = await api.post("admin/employees/fetch", {
      page: currentPage,
      limit: itemsPerPage,
      start_date: rangeDate.start,
      end_date: rangeDate.end,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};

const removeEmployees = async (id) => {
  try {
    const response = await api.post("admin/employees/remove", {
      id: id,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};

const taskDetailUpdate = async (data) => {
  try {
    const response = await api.post("tasks/update", data);
    return response.data;
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};
const taskHistryFetch = async (data) => {
  try {
    const response = await api.post("task-history", { task_id: data });
    return response.data;
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};

const fetchTaskComments = async (taskId) => {
  try {
    const response = await api.post(`/comments-fetch`, { task_id: taskId });
    return response.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};

// Create a new comment

const createTaskComment = async (data) => {
  try {
    const response = await api.post("/comments-create", data);
    return response.data;
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
};

// Update an existing comment (based on your POST route)

const updateTaskComment = async (data) => {
  try {
    const response = await api.post("/comments-update", data); // POST for update
    return response.data;
  } catch (error) {
    console.error("Error updating comment:", error);
    throw error;
  }
};

// Delete a comment (based on your POST route)
const deleteTaskComment = async (taskId) => {
  try {
    const response = await api.post("/comments-delete", { task_id: taskId }); // POST for delete
    return response.data;
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};

const actionAttendApi = async (id, action) => {
  try {
    const response = await api.post("admin/attendance/action", {
      id: id,
      action: action,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};

const fetchDesignationsAndPositionsApi = async () => {
  try {
    const response = await api.get("designations-and-positions");
    return response.data;
  } catch (error) {
    console.error("Error fetching designations and positions:", error);
    throw error;
  }
};

// Attendance API Calls
const createAttendance = async (data) => {
  try {
    const res = await api.post("admin/attendance/create", data);
    return res.data;
  } catch (error) {
    console.error("Error creating attendance:", error);
    throw error;
  }
};

const fetchAttendance = async (
  currentPage,
  itemsPerPage,
  status,
  startDate,
  endDate
) => {
  try {
    const response = await api.post("admin/attendance/fetch", {
      page: currentPage,
      limit: itemsPerPage,
      status: status,
      startDate: startDate,
      endDate: endDate,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching attendance:", error);
    throw error; // Rethrow the error for handling in the calling function
  }
};
// Leave API Calls
const createLeave = async (data) => {
  try {
    // Prepare the data object with the required keys
    const leaveData = {
      employee_id: data.employeeId, // Employee ID
      leave_type: data.leaveType, // Type of leave (e.g., sick, vacation)
      start_date: data.startDate, // Leave start date
      end_date: data.endDate, // Leave end date
      description: data.description || null, // Optional leave description
      half_day_full_day: data.leaveDuration, // Whether it’s a full day or half day leave
    };

    // Make the API request to submit the leave
    const response = await api.post("apply-leave", leaveData);

    // Return the response data
    return response.data;
  } catch (error) {
    console.error("Error creating leave:", error);
    throw error; // Re-throw the error for further handling if needed
  }
};

const fetchLeavesApi = async (user_id) => {
  try {
    const response = await api.post("leaves/fetch", {
      user_id: user_id,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching leaves:", error);
    throw error;
  }
};

const fetchLeavesApiAdmin = async () => {
  try {
    const response = await api.post("leaves/fetchAdmin"); // Adjust if API expects a body or params
    console.log("Leaves data fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching leaves:", error.response || error);
    throw new Error("Failed to fetch leaves data. Please try again later.");
  }
};
// Fetch Leave Policies API
const fetchLeavePoliciesApi = async () => {
  try {
    const response = await api.get("/leave-policies"); // Adjust the endpoint
    console.log("Leave policies fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching leave policies:", error.response || error);
    throw new Error(
      "Failed to fetch leave policies data. Please try again later."
    );
  }
};

// Update Policy API
const updatePolicyApi = async (request) => {
  try {
    const response = await api.put(`/leave-policies/${request.id}`, request); // Adjust the endpoint
    console.log("Leave policy updated successfully:", response.data);
    return response.data; // Return the updated data if needed
  } catch (error) {
    console.error("Error updating leave policy:", error.response || error);
    throw new Error("Failed to update leave policy. Please try again later.");
  }
};

// Fetch Company Policies API

const fetchCompanyPoliciesApi = async () => {
  try {
    const response = await api.get("/company-policies"); // Adjust the endpoint
    console.log("Company policies fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching company policies:", error.response || error);
    throw new Error(
      "Failed to fetch company policies data. Please try again later."
    );
  }
};

const updateCompanyPolicyApi = async (policy) => {
  try {
    const response = await api.put(`/company-policies/${policy.id}`, policy); // Adjust the endpoint
    console.log("Company policy updated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating company policy:", error.response || error);
    throw new Error("Failed to update company policy. Please try again later.");
  }
};

// Create Company Policy API
const createCompanyPolicyApi = async (request) => {
  try {
    const response = await api.post("/company-policies", request); // Adjust the endpoint
    console.log("Company policy created successfully:", response.data);
    return response.data; // Return the created data if needed
  } catch (error) {
    console.error("Error creating company policy:", error.response || error);
    throw new Error("Failed to create company policy. Please try again later.");
  }
};

const updateLeaveStatusApi = async (request) => {
  try {
    const response = await api.post("leaves/updateStatus", request);
    return response.data; // Return the updated data if needed
  } catch (error) {
    console.error("Error updating leave status:", error.response || error);
    throw new Error("Failed to update leave status. Please try again later.");
  }
};

const fetchHolidayApi = async (user_id) => {
  try {
    const response = await api.post("all-holiday");
    return response.data;
  } catch (error) {
    console.error("Error fetching leaves:", error);
    throw error;
  }
};

// Notification API Calls
const fetchNotifications = async (currentPage, itemsPerPage) => {
  try {
    const response = await api.post("admin/notifications/fetch", {
      page: currentPage,
      limit: itemsPerPage,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

// Task API Calls
const createTask = async (data) => {
  const res = await api.post("admin/tasks/create", data);
  return res.data;
};

const fetchTasks = async (currentPage, itemsPerPage, status) => {
  try {
    const response = await api.post("admin/tasks/fetch", {
      page: currentPage,
      limit: itemsPerPage,
      status: status,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

// Setting API Calls
const fetchSettings = async (currentPage, itemsPerPage) => {
  try {
    const response = await api.post("admin/settings/fetch", {
      page: currentPage,
      limit: itemsPerPage,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching settings:", error);
    throw error;
  }
};

// Create Appointment
const createAppointment = async (data) => {
  try {
    const response = await api.post("appointments/store", data); // Endpoint for storing appointments
    return response.data;
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw error;
  }
};

// Fetch Appointments
const fetchAppointments = async (data) => {
  try {
    const response = await api.post("appointments", { page: data }); // Endpoint for fetching appointments
    return response.data;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw error;
  }
};

// Update Appointment
const updateAppointment = async (data) => {
  try {
    const response = await api.post("appointments/update", data); // Endpoint for updating appointments
    return response.data;
  } catch (error) {
    console.error("Error updating appointment:", error);
    throw error;
  }
};

// Remove Appointment
const removeAppointment = async (appointmentId) => {
  try {
    const response = await api.post("appointments/remove", {
      id: appointmentId, // Send appointment ID in the request body
    });
    return response.data;
  } catch (error) {
    console.error("Error removing appointment:", error);
    throw error;
  }
};

// Update Appointment Status
const updateAppointmentStatus = async (appointmentId, status) => {
  try {
    const response = await api.post("appointments/status", {
      id: appointmentId, // Send appointment ID in the request body
      status: status, // Send the new status in the request body
    });
    return response.data;
  } catch (error) {
    console.error("Error updating appointment status:", error);
    throw error;
  }
};

const createBacklink = async (data) => {
  try {
    const response = await api.post("backlinks/store", data); // Endpoint for storing backlinks
    return response.data;
  } catch (error) {
    console.error("Error creating backlink:", error);
    throw error;
  }
};

// Fetch Backlinks
const fetchBacklinks = async (data) => {
  try {
    const response = await api.post("backlinks", data); // Endpoint for fetching backlinks
    return response.data;
  } catch (error) {
    console.error("Error fetching backlinks:", error);
    throw error;
  }
};

// Update Backlink
const updateBacklink = async (data) => {
  try {
    const response = await api.post("backlinks/update", data); // Endpoint for updating backlinks
    return response.data;
  } catch (error) {
    console.error("Error updating backlink:", error);
    throw error;
  }
};

// Remove Backlink
const removeBacklink = async (backlinkId) => {
  try {
    const response = await api.post("backlinks/remove", {
      id: backlinkId, // Send backlink ID in the request body
    });
    return response.data;
  } catch (error) {
    console.error("Error removing backlink:", error);
    throw error;
  }
};

// Update Backlink Status
const updateBacklinkStatus = async (backlinkId, status) => {
  try {
    const response = await api.post("backlinks/status", {
      id: backlinkId, // Send backlink ID in the request body
      status: status, // Send the new status in the request body
    });
    return response.data;
  } catch (error) {
    console.error("Error updating backlink status:", error);
    throw error;
  }
};

// Update Checked Status
const updateCheckedStatus = async (data) => {
  try {
    const response = await api.post("backlinks/update-checked",data);
    return response.data;
  } catch (error) {
    console.error("Error updating checked status:", error);
    throw error;
  }
};

export {
  loginUser,
  registerUser,
  checkIn,
  checkOut,
  fetchCheckInRecords,
  fetchDesignationsAndPositionsApi,
  createEmployee,
  fetchEmployees,
  removeEmployees,
  createAttendance,
  actionAttendApi,
  fetchAttendance,
  createLeave,
  fetchLeavesApi,
  fetchHolidayApi,
  fetchNotifications,
  createTask,
  fetchTasks,
  fetchTaskComments,
  deleteTaskComment,
  updateTaskComment,
  createTaskComment,
  fetchSettings,
  updateLeaveStatusApi,
  fetchLeavesApiAdmin,
  fetchLeavePoliciesApi,
  updatePolicyApi,
  createCompanyPolicyApi,
  fetchCompanyPoliciesApi,
  taskDetailUpdate,
  taskHistryFetch,
  updateCompanyPolicyApi,
  createAppointment,
  updateAppointmentStatus,
  removeAppointment,
  fetchAppointments,
  updateAppointment,
  updateCheckedStatus,
  updateBacklinkStatus,
  removeBacklink,
  updateBacklink,
  fetchBacklinks,
  createBacklink,
};
