import Dashboards from "views/Dashboards.js";
import EmployeeManagement from "views/EmployeeManagement"; 
import AttendanceManagement from "views/AttendanceManagement"; 
import LeaveManagement from "views/LeaveManagement"; 
import TaskManagement from "views/TaskManagement";
import UserDashboard from "views/UserDashboard";
import AttendanceManage from "views/admin/AttendanceManage";
import Policy from "views/admin/Policy";

const dashRoutes = [
  {
    path: "/dashboards",
    name: "Dashboard",
    icon: "business_briefcase-24",
    component: <Dashboards/>,
    layout: "/admin",
  },
  {
    path: "/employees",
    name: "Employee Management",
    icon: "business_briefcase-24",
    component: <EmployeeManagement/>,
    layout: "/admin",
  },
  {
    path: "/attendance",
    name: "Attendance Management",
    icon: "design-2_ruler-pencil",
    component: <AttendanceManagement/>,
    layout: "/admin",
  },
  {
    path: "/user/dashboard",
    name: "User Attendance",
    icon: "design-2_ruler-pencil",
    component: <UserDashboard/>,
    layout: "/admin",
  },
  {
    path: "/leaves",
    name: "View Leave",
    icon: "design-2_ruler-pencil",
    component: <LeaveManagement/>,
    layout: "/admin",
  },

  {
    path: "/manage-leaves",
    name: "Leave Management",
    icon: "design-2_ruler-pencil",
    component: <AttendanceManage/>,
    layout: "/admin",
  },
  {
    path: "/policy-management",
    name: "Policy Management",
    icon: "design-2_ruler-pencil",
    component: <Policy/>,
    layout: "/admin",
  },
  {
    path: "/tasks",
    name: "Task Management",
    icon: "design-2_ruler-pencil",
    component: <TaskManagement/>,
    layout: "/admin",
  },
];

export default dashRoutes;
