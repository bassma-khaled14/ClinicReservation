import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

// ... (imports remain unchanged)

const ListAvailableSlots = () => {
  const { state } = useLocation();
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log(state);
    const fetchAvailableSlots = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8000/doctors/${state.doctorID}/available-slots`);
        console.log(response);
        
        setAvailableSlots(response.data);
      } catch (error) {
        console.error('Error fetching available slots:', error);
        setError('Error fetching available slots');
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableSlots();
  }, []); 
  return (
    <div>
      <h2>Available Slots for Doctor</h2>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {availableSlots.length > 0 && (
        <ul>
          {availableSlots.map((slot, index) => (
            <li key={index}>
              <strong>Day:</strong> {slot.SlotDay}, <strong>Time:</strong> {slot.SlotTime}
            </li>
          ))}
        </ul>
      )}
      {availableSlots.length === 0 && <p>No available slots for this doctor</p>}
    </div>
  );
};

export default ListAvailableSlots;
