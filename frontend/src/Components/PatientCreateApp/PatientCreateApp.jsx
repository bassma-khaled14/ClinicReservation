
import React, { useState } from 'react';
import axios from 'axios';

const PatientCreateApp = () => {
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
      const response = await axios.post('http://localhost:8000/appointments', formData);
      setMessage(response.data.message);
    } catch (error) {
      setMessage('ppointment booked');
      console.error('Error creating appointment:', error.response.data.error);
    }
  };

  return (
    <div>
      <h2>Create Appointment</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Patient ID:
          <input type="number" name="patientID" value={formData.patientID} onChange={handleChange} />
        </label>
        <br />
        <br></br>
        <label>
          Doctor ID:
          <input type="number" name="doctorID" value={formData.doctorID} onChange={handleChange} />
        </label>
        <br></br>
        <br />
        <label>
          Slot Day:
          <input type="text" name="SlotDay" value={formData.SlotDay} onChange={handleChange} />
        </label>
        <br></br>
        <br />
        <label>
          Slot Time:
          <input type="text" name="SlotTime" value={formData.SlotTime} onChange={handleChange} />
        </label>
        <br></br>
        <br />
        <br></br>
        <button type="submit">Create Appointment</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default PatientCreateApp;
