import Dashboard from "views/Dashboard.js";
import EmployeeManagement from "views/EmployeeManagement"; // New
import AttendanceManagement from "views/AttendanceManagement"; // New
import LeaveManagement from "views/LeaveManagement"; // New
import TaskManagement from "views/TaskManagement"; // New
import TaskCommentManagement from "views/TaskCommentManagement"; // New
import SettingManagement from "views/SettingManagement"; // New
import UserDashboard from "views/user/UserDashboard";

var dashRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "design_app",
    component: <Dashboard />,
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
  {
    path: "/task-comments",
    name: "Task Comments",
    icon: "design-2_ruler-pencil",
    component: <TaskCommentManagement />,
    layout: "/admin",
  },
  {
    path: "/settings",
    name: "Settings",
    icon: "design-2_ruler-pencil",
    component: <SettingManagement />,
    layout: "/admin",
  },
  {
    path: "/user",
    name: "Attendance Management",
    icon: "design-2_ruler-pencil",
    component: <UserDashboard />,
    layout: "/admin",
  },
  {
    path: "user/attendance",
    name: "User Attendance",
    icon: "design-2_ruler-pencil",
    component: <UserDashboard />, // Same component
    layout: "/admin",
  },
  {
    path: "user/tasks",
    name: "Tasks",
    icon: "design-2_ruler-pencil",
    component: <UserDashboard />, // Same component
    layout: "/admin",
  },
  {
    path: "user/view-leave",
    name: "View Leave",
    icon: "design-2_ruler-pencil", // Example icon
    component: <UserDashboard />, // Same component
    layout: "/admin",
  }
];

export default dashRoutes;
