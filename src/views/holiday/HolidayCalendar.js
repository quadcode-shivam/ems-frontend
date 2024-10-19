import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { fetchHolidayApi } from 'api';
import styled from 'styled-components';

const localizer = momentLocalizer(moment);

const Container = styled.div`
  background-color: #0E1112;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  padding: 20px;
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
  background-color: #34495e;
  border: 1px solid #34495e;
  border-radius: 5px;
  padding: 10px;  /* Adjusted padding */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const StyledCalendar = styled(Calendar)`
  .rbc-month-view .rbc-day-slot {
    height: 100px; /* Set height of date boxes */
    width: 120px;  /* Set width of date boxes */
    border: 1px solid #2c3e50; /* Optional: Add borders for clarity */
  }

  .rbc-event {
    background-color: #e74c3c; /* Example event color */
    color: white;
  }

  /* Optional: Adjust the header and other elements if needed */
  .rbc-header {
    background-color: #34495e;
    color: white;
    text-align: center;
  }
`;

const HolidayCalendar = () => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalHolidays, setTotalHolidays] = useState(0);

  const fetchHoliday = async () => {
    setLoading(true);
    try {
      const response = await fetchHolidayApi();
      setHolidays(response.holidays.map(holiday => ({
        title: holiday.title,
        start: new Date(holiday.start_date),
        end: new Date(holiday.end_date),
      })));
      setTotalHolidays(response.total_records);
    } catch (error) {
      setError("Failed to load holidays. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHoliday();
  }, []);

  const Event = ({ event }) => (
    <EventTooltip>
      <strong>{event.title}</strong>
      <div>{moment(event.start).format('MMMM Do YYYY')}</div>
      <div>{moment(event.end).format('MMMM Do YYYY')}</div>
    </EventTooltip>
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Container>
      <Header>Holiday Calendar</Header>
      <StyledCalendar
        localizer={localizer}
        events={holidays}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '500px', margin: '0' }}
        views={['month']}
        defaultView="month"
        selectable
        popup
        components={{
          event: Event,
        }}
      />
      <div style={{ textAlign: 'center', marginTop: '10px', color: '#ffffff' }}>
        Total Holidays: {totalHolidays}
      </div>
    </Container>
  );
};

export default HolidayCalendar;
