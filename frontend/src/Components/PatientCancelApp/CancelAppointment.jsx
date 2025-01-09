import React, { useState } from "react";
import axios from 'axios';

const CancelAppointment = () => {
  const [appID, setAppID] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleDeleteAppointment = async () => {
    try {
      const response = await axios.delete(`http://localhost:8000/appointments/${appID}`);
      setMessage(response.data.message);
    } catch (error) {
      setError(error.response.data.error);
    }
  };

  return (
    <div>
      <h2>Delete Appointment</h2>
      <br></br>
      <label>
        Appointment ID : 
        
        <input
          type="text"
          value={appID}
          onChange={(e) => setAppID(e.target.value)}
        />
      </label>
      <button onClick={handleDeleteAppointment}>Delete Appointment</button>

      {message && <p>{message}</p>}
      <br></br>
      {error && <p>{error}</p>}
    </div>
  );
};
export default CancelAppointment;



