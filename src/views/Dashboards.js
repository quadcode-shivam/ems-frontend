import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Loader from "./Loader/Loader";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Paper,
  Chip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useForm, Controller } from "react-hook-form";
import { Line, Bar } from "react-chartjs-2";
import DemoNavbar from "components/Navbars/DemoNavbar";
import { CardHeader, CardBody, Row, Col } from "reactstrap";
import Swal from "sweetalert2";

// Dummy chart data
const chartExample1 = {
  data1: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
    datasets: [
      {
        label: "Sales",
        data: [30, 70, 80, 50, 100, 130, 80, 70, 60],
        fill: false,
        backgroundColor: "rgba(75,192,192,1)",
        borderColor: "rgba(75,192,192,1)",
      },
    ],
  },
  data2: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
    datasets: [
      {
        label: "Purchases",
        data: [90, 60, 70, 100, 120, 110, 90, 70, 50],
        fill: false,
        backgroundColor: "rgba(255,99,132,1)",
        borderColor: "rgba(255,99,132,1)",
      },
    ],
  },
  data3: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
    datasets: [
      {
        label: "Sessions",
        data: [50, 60, 80, 100, 60, 50, 40, 30, 20],
        fill: false,
        backgroundColor: "rgba(153,102,255,1)",
        borderColor: "rgba(153,102,255,1)",
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
};

const chartExample2 = {
  data: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Shipments",
        data: [100, 200, 150, 300, 250, 400, 350],
        backgroundColor: "rgba(75,192,192,1)",
        borderColor: "rgba(75,192,192,1)",
      },
    ],
  },
  options: chartExample1.options,
};

const chartExample3 = {
  data: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Sales",
        data: [1000, 1500, 1300, 1700, 1200, 1400, 1600],
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
      },
    ],
  },
  options: chartExample1.options,
};

const chartExample4 = {
  data: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Completed Tasks",
        data: [200, 180, 220, 210, 240, 250, 230],
        backgroundColor: "rgba(255, 206, 86, 0.5)",
        borderColor: "rgba(255, 206, 86, 1)",
      },
    ],
  },
  options: chartExample1.options,
};

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [bigChartData, setBgChartData] = useState("data1"); // Manage chart state

  const [rangeDate, setRangeDate] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)),
    end: new Date(),
  });

  const onRangeChange = (dates) => {
    const [start, end] = dates;
    setRangeDate({ start, end });
  };

  return (
    <>
      <DemoNavbar size="sm" />
      {loading && <Loader />}
      <div
        style={{
          marginTop: "80px",
          marginBottom: "80px",
          marginLeft: "20px",
          width: "97%",
          background: "#0F1214",
        }}
      >
        <Row style={{ background: "#0F1214" }}>
          <Col xs="12">
            <Card
              className="card-chart  m-1 mb-3"
              style={{ background: "#0F1214", border: "1px solid #4BC0C0" }}
            >
              <CardHeader>
                <Row>
                  <Col className="text-left" sm="6">
                    <h5 className="card-category " style={{ color: "#4BC0C0" }}>
                      Total Shipments
                    </h5>
                    <h2 className="card-title text-light">Performance</h2>
                  </Col>
                  <Col sm="6">
                    <ButtonGroup
                      className="btn-group-toggle float-right"
                      data-toggle="buttons"
                    >
                      <Button
                        tag="label"
                        className={bigChartData === "data1" ? "active" : ""}
                        color="info"
                        id="0"
                        size="sm"
                        onClick={() => setBgChartData("data1")}
                      >
                        Accounts
                      </Button>
                      <Button
                        color="info"
                        id="1"
                        size="sm"
                        tag="label"
                        className={bigChartData === "data2" ? "active" : ""}
                        onClick={() => setBgChartData("data2")}
                      >
                        Purchases
                      </Button>
                      <Button
                        color="info"
                        id="2"
                        size="sm"
                        tag="label"
                        className={bigChartData === "data3" ? "active" : ""}
                        onClick={() => setBgChartData("data3")}
                      >
                        Sessions
                      </Button>
                    </ButtonGroup>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <div
                  className="chart-area text-light"
                  style={{ height: "300px" }}
                >
                  <Line
                    data={chartExample1[bigChartData]}
                    options={chartExample1.options}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col lg="4">
            <Card
              className="card-chart"
              style={{ background: "#0F1214", border: "1px solid #4BC0C0" }}
            >
              <CardHeader>
                <h5 className="card-category" style={{ color: "#4BC0C0" }}>
                  Total Shipments
                </h5>
                <h3 className="card-title text-light">
                  <i className="tim-icons icon-bell-55 text-info" /> 763,215
                </h3>
              </CardHeader>
              <CardBody>
                <div className="chart-area" style={{ height: "300px" }}>
                  <Line
                    data={chartExample2.data}
                    options={chartExample2.options}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg="4">
            <Card
              className="card-chart"
              style={{ background: "#0F1214", border: "1px solid #4BC0C0" }}
            >
              <CardHeader>
                <h5 className="card-category" style={{ color: "#4BC0C0" }}>
                  Daily Sales
                </h5>
                <h3 className="card-title text-light">
                  <i className="tim-icons icon-delivery-fast text-primary" />{" "}
                  3,500€
                </h3>
              </CardHeader>
              <CardBody>
                <div className="chart-area" style={{ height: "300px" }}>
                  <Bar
                    data={chartExample3.data}
                    options={chartExample3.options}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg="4">
            <Card
              className="card-chart"
              style={{ background: "#0F1214", border: "1px solid #4BC0C0" }}
            >
              <CardHeader>
                <h5 className="card-category" style={{ color: "#4BC0C0" }}>
                  Completed Tasks
                </h5>
                <h3 className="card-title text-light">
                  <i className="tim-icons icon-send text-success" /> 12,100K
                </h3>
              </CardHeader>
              <CardBody>
                <div className="chart-area" style={{ height: "300px" }}>
                  <Line
                    data={chartExample4.data}
                    options={chartExample4.options}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}
