import Dashboards from "views/Dashboards.js";
import EmployeeManagement from "views/EmployeeManagement"; 
import AttendanceManagement from "views/AttendanceManagement"; 
import LeaveManagement from "views/LeaveManagement"; 
import TaskManagement from "views/TaskMangement/TaskManagement";
import UserDashboard from "views/UserDashboard";
import AttendanceManage from "views/admin/AttendanceManage";
import Policy from "views/admin/Policy";
import HolidayCalendar from "views/holiday/HolidayCalendar"; // Import your HolidayCalendar component
import Appointmain from "views/appointment/appointmain";

const dashRoutes = [
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
    name: "View Leave",
    icon: "design-2_ruler-pencil",
    component: <LeaveManagement />,
    layout: "/admin",
  },
  {
    path: "/manage-leaves",
    name: "Leave Management",
    icon: "design-2_ruler-pencil",
    component: <AttendanceManage />,
    layout: "/admin",
  },
  {
    path: "/policy-management",
    name: "Policy Management",
    icon: "design-2_ruler-pencil",
    component: <Policy />,
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
    path: "/holiday-calendar",  // New route for Holiday Calendar
    name: "Holiday Calendar",
    icon: "design-2_ruler-pencil",
    component: <HolidayCalendar />, // Component for the holiday calendar
    layout: "/admin",
  },
  {
    path: "/appointment",  // New route for Holiday Calendar
    name: "Appointment",
    icon: "design-2_ruler-pencil",
    component: <Appointmain />, // Component for the holiday calendar
    layout: "/admin",
  },
];

export default dashRoutes;
