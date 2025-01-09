import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';
import { UserUtils } from "../user.utils";

const ListPatientApp = () => {
  const { patientID } = useParams();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/patients/${UserUtils.curUserId}`);
        setReservations(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reservations:", error.response.data.error);
        setError("Error fetching reservations");
        setLoading(false);
      }
    };

    fetchReservations();
  }, [patientID]);

  return (
    <div>
      <h2>Patient Reservations</h2>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {reservations.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Appointment ID</th>
              <th>Doctor ID</th>
              <th>Slot Day</th>
              <th>Slot Time</th>
              <th>Patient ID</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation.appid}>
                <td>{reservation.appid}</td>
                <td>{reservation.doctorID}</td>
                <td>{reservation.SlotDay}</td>
                <td>{reservation.SlotTime}</td>
                <td>{reservation.patientID}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListPatientApp;
