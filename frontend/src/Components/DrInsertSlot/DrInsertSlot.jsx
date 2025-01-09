import React, { useState } from "react";
const DrInserSlot = () => {
  const [schedule, setSchedule] = useState([]);
  const [newSlot, setNewSlot] = useState({ day: "", time: "" });

  const insertSlot = () => {
    if (newSlot.day && newSlot.time) {
      const updatedSchedule = [...schedule, newSlot];
      updatedSchedule.sort((a, b) =>
        a.day + a.time > b.day + b.time ? 1 : -1
      );
      setSchedule(updatedSchedule);
      setNewSlot({ day: "", time: "" });
    }
  };
  return (
    <div>
      <h2>Doctor Schedule</h2>
      <div>
        <label>
          Day:
          <input
            type="text"
            value={newSlot.day}
            onChange={(e) => setNewSlot({ ...newSlot, day: e.target.value })}
          />
        </label>
        <label>
          Time:
          <input
            type="text"
            value={newSlot.time}
            onChange={(e) => setNewSlot({ ...newSlot, time: e.target.value })}
          />
        </label>
        <button onClick={insertSlot}>Insert Slot</button>
      </div>
      <div>
        <h3>Schedule:</h3>
        <ul>
          {schedule.map((slot, index) => (
            <li key={index}>{`${slot.day} - ${slot.time}`}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DrInserSlot;
