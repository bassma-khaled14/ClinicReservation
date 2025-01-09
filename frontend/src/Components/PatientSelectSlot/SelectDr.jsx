import React, { useState } from "react";
import axios from "axios";

const SelectDr = () => {
  const [patientID, setPatientID] = useState("");
  const [doctorID, setDoctorID] = useState("");
  const [message, setMessage] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const handleSelectDoctor = async () => {
    try {
      const response = await axios.post("http://localhost:8000/select-doctor", {
        patientID: patientID,
        doctorID: doctorID,
      });

      setMessage(response.data.message);
      setSelectedDoctor(response.data.selectedDoctor);
    } catch (error) {
      console.error("Error selecting doctor:", error.response.data.error);
      setMessage("Error selecting doctor");
    }
  };

  return (
    <div>
      <h2>Select Doctor</h2>
      <label>
        Patient ID:
        <input
          type="text"
          value={patientID}
          onChange={(e) => setPatientID(e.target.value)}
        />
      </label>
      <br />
      <br></br>
      <label>
        Doctor ID:
        <input
          type="text"
          value={doctorID}
          onChange={(e) => setDoctorID(e.target.value)}
        />
      </label>
      <br />
      <br></br>

      <button onClick={handleSelectDoctor}>Select Doctor</button>
      <br />
      <br></br>

      <p>{message}</p>
      {selectedDoctor && (
        <div>
          <h3>Selected Doctor:</h3>
          <p>Doctor ID: {selectedDoctor.drID}</p>
          <p>User ID: {selectedDoctor.user_id}</p>
          <p>Appointment Doctor ID: {selectedDoctor.appdr_id}</p>
        </div>
      )}
    </div>
  );
};

  export default SelectDr;
