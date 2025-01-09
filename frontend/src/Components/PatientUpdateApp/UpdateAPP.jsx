import React, { useState } from "react";
import axios from 'axios';
import { useParams } from "react-router-dom";

const UpdateApp = () => {
  const { appID } = useParams();
  const [formData, setFormData] = useState({
    patientID: 0,
    doctorID: 0,
    SlotDay: '',
    SlotTime: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`http://localhost:8000/appointments/${appID}`, formData);
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error updating appointment');
      console.error('Error updating appointment:', error.response?.data?.error || error.message);
    }
  };

  return (
    <div>
      <h2>Update Appointment</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Patient ID:
          <input type="number" name="patientID" value={formData.patientID} onChange={handleChange} />
        </label>
        <br />
        <label>
          Doctor ID:
          <input type="number" name="doctorID" value={formData.doctorID} onChange={handleChange} />
        </label>
        <br />
        <label>
          Slot Day:
          <input type="text" name="SlotDay" value={formData.SlotDay} onChange={handleChange} />
        </label>
        <br />
        <label>
          Slot Time:
          <input type="text" name="SlotTime" value={formData.SlotTime} onChange={handleChange} />
        </label>
        <br />
        <button type="submit">Update Appointment</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UpdateApp;