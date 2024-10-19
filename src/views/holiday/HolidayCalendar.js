import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { fetchHolidayApi, fetchLeavesApi } from "api"; // Ensure this is correctly imported
import styled from "styled-components";

const localizer = momentLocalizer(moment);

const Container = styled.div`
  background-color: #0e1112;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  margin: 20px;
`;

const Header = styled.div`
  background-color: #34495e;
  color: white;
  padding: 15px;
  text-align: center;
  font-size: 1.8rem;
  font-weight: bold;
  border-radius: 8px 8px 0 0;
`;

const EventTooltip = styled.div`
  padding: 5px;
`;

const StyledCalendar = styled(Calendar)`
  .rbc-event {
    background-color: ${(props) =>
      props.isLeave
        ? "#e74c3c"
        : "#2ecc71"}; /* Red for leaves, green for holidays */
    color: white;
    border-radius: 4px;
    padding: 2px 5px;
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

    &:hover {
      transform: scale(1.05);
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
    }
  }

  .rbc-month-header,
  .rbc-header {
    background-color: #11171d;
    color: white;
    text-align: center;
    font-weight: bold;
    animation: fadeIn 0.5s ease-in-out;
    height: 30px;
    font-size: 18px;
  }

  .rbc-current-month {
    background: linear-gradient(
      135deg,
      rgba(52, 152, 219, 0.1),
      rgba(41, 128, 185, 0.2)
    );
    animation: pulse 2s infinite;
    &:hover {
      background: rgba(41, 128, 185, 0.5);
      cursor: pointer;
    }
  }
  .rbc-btn-group {
    background: #11171d;
    color: white;
  }
  button {
    color: white;
  }

  

  @keyframes pulse {
    0% {
      background-color: rgba(41, 128, 185, 0.2);
    }
    50% {
      background-color: rgba(41, 128, 185, 0.3);
    }
    100% {
      background-color: rgba(41, 128, 185, 0.2);
    }
  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;

const LeaveCardsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
`;

const LeaveCard = styled.div`
  background-color: #11171d;
  color: white;
  border-radius: 2px;
  padding: 10px;
  width: 200px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
  border:1px solid white;
`;

const HolidayCalendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalHolidays, setTotalHolidays] = useState(0);
  const [totalLeaveTaken, setTotalLeaveTaken] = useState(0);
  const [totalLate, setTotalLate] = useState(0);
  const [totalHalf, setTotalHalf] = useState(0);
  const [remainingLeaves, setRemainingLeaves] = useState(0);
  const [remainingLate, setRemainingLate] = useState(0);
  const [remainingHalf, setRemainingHalf] = useState(0);
  const [totalleave, settotalleave] = useState(0);
  // Fetch Holidays
  const fetchHoliday = async () => {
    setLoading(true);
    try {
      const response = await fetchHolidayApi(); // Ensure your API call works correctly
      const holidays = response.holidays.map((holiday) => ({
        title: holiday.title,
        start: new Date(holiday.start_date),
        end: new Date(holiday.end_date),
        type: "holiday", // Add event type for holiday
      }));
      setEvents((prevEvents) => [...prevEvents, ...holidays]);
      setTotalHolidays(response.total_records);
    } catch (error) {
      setError("Failed to load holidays. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Leaves
  const fetchLeaves = async () => {
    setLoading(true);
    const storedUser = JSON.parse(localStorage.getItem("user")); // Ensure the user is stored properly
    try {
      const response = await fetchLeavesApi(storedUser.user_id);
      setTotalLeaveTaken(response.total_leave_taken);
      setTotalLate(response.total_late);
      setTotalHalf(response.total_half);
      setRemainingLeaves(response.remaining_leaves);
      setRemainingLate(response.remaining_late);
      setRemainingHalf(response.remaining_half);
      settotalleave(response.total_leave);
      const leaves = response.leaves.map((leave) => ({
        title: leave.leave_type + " leave",
        start: new Date(leave.start_date),
        end: new Date(leave.end_date),
        type: "leave", // Add event type for leave
      }));
      setEvents((prevEvents) => [...prevEvents, ...leaves]);
    } catch (error) {
      setError("Failed to load leaves. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHoliday();
    fetchLeaves();
  }, []);

  // Tooltip for Event
  const Event = ({ event }) => (
    <EventTooltip>
      <strong>{event.title}</strong>
      <div>{moment(event.start).format("MMMM Do YYYY")}</div>
      <div>{moment(event.end).format("MMMM Do YYYY")}</div>
    </EventTooltip>
  );

  // Loading and Error Handling
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Container style={{ marginTop: "80px" }}>
      <Header>Holiday Calendar</Header>
      <LeaveCardsContainer
        style={{ display: "flex", justifyContent: "space-between", padding:"10px", }}
      >
        <span
          style={{
            backgroundColor: "#11171d",
            color: "white",
            borderRadius: "2px",
            padding: "10px",
            width: "200px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
            textAlign: "center",
            marginTop:"10px",
          }}
          className="col-4 text-success border rounded d-flex justify-content-between p-2"
        >
          <strong> Holidays</strong>
          <span>{totalHolidays}</span>
        </span>

        <span           style={{
            backgroundColor: "#11171d",
            color: "white",
            borderRadius: "2px",
            padding: "10px",
            width: "200px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
            textAlign: "center",
            marginTop:"10px",
          }} className="col-4 text-danger border rounded d-flex justify-content-between p-2">
          <strong> Leaves</strong>
          <span>{totalleave}</span>
        </span>
        <span           style={{
            backgroundColor: "#11171d",
            color: "white",
            borderRadius: "2px",
            padding: "10px",
            width: "200px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
            textAlign: "center",
            marginTop:"10px",
          }} className="col-3 text-danger border rounded d-flex justify-content-between p-2">
          <strong>Total Leaves</strong>
          <span>{totalleave + totalHolidays}</span>
        </span>
      </LeaveCardsContainer>
      <LeaveCardsContainer>
        <LeaveCard>
          <strong>Leaves Taken</strong>
          <p>{totalLeaveTaken}</p>
        </LeaveCard>
        <LeaveCard>
          <strong>Late Days</strong>
          <p>{totalLate}</p>
        </LeaveCard>
        <LeaveCard>
          <strong>Half Days</strong>
          <p>{totalHalf}</p>
        </LeaveCard>
        <LeaveCard>
          <strong>Remaining Leaves</strong>
          <p>{remainingLeaves}</p>
        </LeaveCard>
        <LeaveCard>
          <strong>Remaining Late</strong>
          <p>{remainingLate}</p>
        </LeaveCard>
        <LeaveCard>
          <strong>Remaining Half Days</strong>
          <p>{remainingHalf}</p>
        </LeaveCard>
      </LeaveCardsContainer>

      <StyledCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "525px", margin: "0" }}
        views={["month"]}
        defaultView="month"
        selectable
        popup
        components={{
          event: Event,
        }}
        eventPropGetter={(event) => ({
          className: "",
          style: {
            backgroundColor: event.type === "leave" ? "#F17934" : "#08A50E", // Red for leaves, green for holidays
            color: "white",
            borderRadius: "4px",
            padding: "2px 5px",
          },
        })}
      />
    </Container>
  );
};

export default HolidayCalendar;
