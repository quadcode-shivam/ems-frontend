# Quad Pulse EMS - Admin Portal

**Quad Pulse EMS - Admin Portal** is a comprehensive management system designed for administrators in IT companies. This portal allows admins to manage employee data, monitor attendance, approve leaves, assign tasks, and handle salary management for the entire organization. The admin interface is developed using **ReactJS**, **Reactstrap**, and **Material-UI (MUI)** for a modern, responsive user experience.

This README file focuses on setting up and using the **Admin Portal** frontend.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Installation](#installation)
5. [API Documentation](#api-documentation)
6. [Frontend Project Structure](#frontend-project-structure)
7. [Usage](#usage)
8. [Contributing](#contributing)
9. [License](#license)

---

## Project Overview

The **Admin Portal** provides IT company admins with a centralized dashboard to manage and monitor employee activities. Admins can:

- Manage employee data (add, edit, delete employees).
- Track and monitor employee attendance.
- Approve or reject leave requests.
- Assign and manage tasks for employees.
- Monitor and handle salary information.

The frontend is built with **ReactJS** to ensure a smooth and dynamic experience, with **Reactstrap** and **Material-UI (MUI)** for modern UI components.

---

## Features

- **Login/Logout**: Admins can securely log in and log out of the portal.
- **Dashboard**: Overview of key metrics like total employees, pending leave requests, and attendance summary.
- **Employee Management**: Add, update, and delete employee profiles.
- **Attendance Management**: View employee attendance, mark attendance, and make adjustments.
- **Leave Management**: Approve or reject leave requests for employees.
- **Task Management**: Assign tasks to employees, update task statuses, and track progress.
- **Salary Management**: View and manage employee salary details, generate salary slips.
- **Notifications**: Receive alerts for pending actions like leave requests or task updates.

---

## Tech Stack

- **Frontend**: React, Reactstrap, Material-UI (MUI), Axios, React Router
- **Backend**: Laravel (PHP)
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens) for secure API communication

---

## Installation

To set up the **Admin Portal** locally, follow these steps:

### Prerequisites

- Node.js and npm
- PHP (for backend setup, if you want to set up the complete system)
- MySQL or MariaDB (for backend database)

### Steps to Run the Project

1. **Clone the Repository:**

    ```bash
    git clone https://github.com/quadcode-shivam/quad-pulse-ems-admin.git
    ```

2. **Navigate to the frontend directory:**

    ```bash
    cd quad-pulse-ems-admin
    ```

3. **Install the required npm packages:**

    ```bash
    npm install
    ```

4. **Start the React development server:**

    ```bash
    npm start
    ```

    This will start the frontend on `http://localhost:3000`.

---

## API Documentation

The **Admin Portal** communicates with the backend via RESTful APIs. Below are the main API endpoints the frontend interacts with.

### Authentication

- **POST** `/api/admin/login`: Logs in an admin and returns a JWT token.
- **POST** `/api/admin/register`: Registers a new admin (for demo purposes, this endpoint may not be used in the portal).

### Employee Management

- **GET** `/api/employees`: Retrieves the list of all employees.
- **POST** `/api/employees`: Adds a new employee.
- **PUT** `/api/employees/{id}`: Updates employee details.
- **DELETE** `/api/employees/{id}`: Deletes an employee.

### Attendance Management

- **GET** `/api/attendance`: Retrieves the attendance records of all employees.
- **PUT** `/api/attendance/{id}`: Updates an employee's attendance (clock in/clock out).

### Leave Management

- **GET** `/api/leaves`: Retrieves the leave requests for all employees.
- **PUT** `/api/leaves/{id}`: Approves or rejects a leave request.

### Task Management

- **GET** `/api/tasks`: Retrieves the list of tasks assigned to employees.
- **POST** `/api/tasks`: Assigns a new task to an employee.
- **PUT** `/api/tasks/{id}`: Updates task status or other details.

### Salary Management

- **GET** `/api/salaries`: Retrieves the salary information for all employees.
- **POST** `/api/salaries`: Generates and updates salary slips for employees.

---

## Frontend Project Structure

The **frontend** project is organized as follows:

