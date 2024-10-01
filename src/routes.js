import Dashboards from "views/Dashboards.js";
import EmployeeManagement from "views/EmployeeManagement"; // New
import AttendanceManagement from "views/AttendanceManagement"; // New
import LeaveManagement from "views/LeaveManagement"; // New
import TaskManagement from "views/TaskManagement";
import UserDashboard from "views/UserDashboard";

var dashRoutes = [
  {
    path: "/dashboards",
    name: "Dashboard",
    icon: "business_briefcase-24",
    component: <Dashboards />,
    layout: "/admin",
  },
  {
    path: "/employees",
    name: "Employee Management",
    icon: "business_briefcase-24",
    component: <EmployeeManagement />,
    layout: "/admin",
  },
  {
    path: "/attendance",
    name: "Attendance Management",
    icon: "design-2_ruler-pencil",
    component: <AttendanceManagement />,
    layout: "/admin",
  },
  {
    path: "/user/dashboard",
    name: "User Attendance",
    icon: "design-2_ruler-pencil",
    component: <UserDashboard />,
    layout: "/admin",
  },
  {
    path: "/leaves",
    name: "Leave Management",
    icon: "design-2_ruler-pencil",
    component: <LeaveManagement />,
    layout: "/admin",
  },
  {
    path: "/tasks",
    name: "Task Management",
    icon: "design-2_ruler-pencil",
    component: <TaskManagement />,
    layout: "/admin",
  },
  
];

export default dashRoutes;
