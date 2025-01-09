import React, { useState, useEffect } from "react";
import axios from "axios";

const ListDrApp = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get("http://localhost:8000/doctorsappointments");
        setAppointments(response.data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []); // The empty dependency array ensures that this effect runs only once, similar to componentDidMount

  return (
    <div>
      <h2>Doctor's Appointments</h2>
      <ul>
        {appointments.map((appointment) => (
          <li key={appointment.appid}>
            <strong>Appointment ID:</strong> {appointment.appid}<br />
            <strong>Slot Day:</strong> {appointment.slotDay}<br />
            <strong>Slot Time:</strong> {appointment.slotTime}<br />
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListDrApp;
