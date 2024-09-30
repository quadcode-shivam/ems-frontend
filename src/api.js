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
    const response = await api.post("checkrecord", params); // Adjust endpoint as needed
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
  const res = await api.post("admin/leaves/create", data);
  return res.data;
};

const fetchLeaves = async (currentPage, itemsPerPage, status) => {
  try {
    const response = await api.post("admin/leaves/fetch", {
      page: currentPage,
      limit: itemsPerPage,
      status: status,
    });
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

// Task Comment API Calls
const fetchTaskComments = async (currentPage, itemsPerPage) => {
  try {
    const response = await api.post("admin/task-comments/fetch", {
      page: currentPage,
      limit: itemsPerPage,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching task comments:", error);
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
  fetchLeaves,
  fetchNotifications,
  createTask,
  fetchTasks,
  fetchTaskComments,
  fetchSettings,
};
