const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8005;

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: 'bwibwlhviwmvs2e0nfwh-mysql.services.clever-cloud.com',
  user: 'upe09nhacjrgn040',
  password: 'VFfJNOgbjekI6dHLTqRJ',
  database: 'bwibwlhviwmvs2e0nfwh',
  port: '3306',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Endpoint for user sign-in
app.post('/signin', (req, res) => {
  const { username, password } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting MySQL connection:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    connection.query(query, [username, password], (error, results) => {
      connection.release(); // Release the connection back to the pool

      if (error) {
        console.error('Error executing MySQL query:', error);
        return res.status(500).json({ error: 'Database query error' });
      }

      if (results.length > 0) {
        res.json({ message: 'Sign-in successful' });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    });
  });
});

// Endpoint for user signup
app.post('/signup', (req, res) => {
  const { username, password, userType } = req.body;

  if (!username || !password || !userType) {
    return res.status(400).json({ error: 'Username, password, userType are required' });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting MySQL connection:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    const checkUsernameQuery = 'SELECT * FROM users WHERE username = ?';
    connection.query(checkUsernameQuery, [username], (checkErr, checkResults) => {
      if (checkErr) {
        connection.release();
        console.error('Error executing MySQL query:', checkErr);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (checkResults.length > 0) {
        connection.release();
        return res.status(409).json({ error: 'Username already exists!' });
      }

      const insertUserQuery = 'INSERT INTO users (username, password, userType) VALUES (?, ?, ?)';
      connection.query(insertUserQuery, [username, password, userType], (insertErr, results) => {
        if (insertErr) {
          connection.release();
          console.error('Error executing MySQL query:', insertErr);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        const insertedUserId = results.insertId;

        if (userType === 'doctor') {
          const updateDoctorIdQuery = 'INSERT INTO doctors (user_id) VALUES (?)';
          connection.query(updateDoctorIdQuery, [insertedUserId], (updateErr) => {
            connection.release();
            if (updateErr) {
              console.error('Error executing MySQL query:', updateErr);
              return res.status(500).json({ error: 'Internal Server Error' });
            }
            return res.status(201).json({ message: `Welcome Dear Doctor, Your user id is:`, id: insertedUserId });
          });
        } else if (userType === 'patient') {
          const updatePatientIdQuery = 'INSERT INTO patients (user_id) VALUES (?)';
          connection.query(updatePatientIdQuery, [insertedUserId], (updateErr) => {
            connection.release();
            if (updateErr) {
              console.error('Error executing MySQL query:', updateErr);
              return res.status(500).json({ error: 'Internal Server Error' });
            }
            return res.status(201).json({ message: `Welcome Dear Patient, Your user id is:`, id: insertedUserId });
          });
        } else {
          connection.release();
          return res.status(201).json({ message: 'Welcome Dear User, Your user id is:', id: insertedUserId });
        }
      });
    });
  });
});

// Endpoint for patients to select a doctor
app.post('/select-doctor', (req, res) => {
  const { patientID, doctorID } = req.body;

  if (!patientID || !doctorID) {
    return res.status(400).json({ error: 'Patient ID and Doctor ID are required' });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting MySQL connection:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    connection.query('SELECT * FROM doctors WHERE drID = ?', [doctorID], (doctorErr, doctorResults) => {
      if (doctorErr) {
        connection.release();
        console.error('Error checking doctor:', doctorErr);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (doctorResults.length === 0) {
        connection.release();
        return res.status(404).json({ error: 'Doctor not found' });
      }

      const selectedDoctor = doctorResults[0];

      connection.query(
        'UPDATE patients SET selDrID = ? WHERE patientID = ?',
        [selectedDoctor.doctorID, patientID],
        (updateErr, updateResults) => {
          connection.release();
          if (updateErr) {
            console.error('Error updating patient:', updateErr);
            return res.status(500).json({ error: 'Internal Server Error' });
          }

          return res.status(200).json({ message: 'Doctor selected successfully', selectedDoctor });
        }
      );
    });
  });
});

// Endpoint to get a list of appointments from dr_schedule table
app.get('/doctorsappointments', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting MySQL connection:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    connection.query('SELECT appid, slotDay, slotTime FROM dr_schedule', (err, results) => {
      connection.release();
      if (err) {
        console.error('Error getting appointments:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      return res.status(200).json(results);
    });
  });
});

// Endpoint to allow a doctor to set their schedule
app.post('/dr_schedule', (req, res) => {
  const { doctorID, slotDay, slotTime } = req.body;

  if (!doctorID || !slotDay || !slotTime) {
    return res.status(400).json({ error: 'Doctor ID, slotDay, and slotTime are required' });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting MySQL connection:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    connection.query(
      'SELECT * FROM dr_schedule WHERE doctorID = ? AND slotDay = ? AND slotTime = ?',
      [doctorID, slotDay, slotTime],
      (checkErr, checkResults) => {
        if (checkErr) {
          connection.release();
          console.error('Error checking schedule:', checkErr);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (checkResults.length > 0) {
          connection.release();
          return res.status(409).json({ error: 'Slot is already taken' });
        }

        connection.query(
          'INSERT INTO dr_schedule (doctorID, slotDay, slotTime) VALUES (?, ?, ?)',
          [doctorID, slotDay, slotTime],
          (insertErr, insertResults) => {
            connection.release();
            if (insertErr) {
              console.error('Error inserting into schedule:', insertErr);
              return res.status(500).json({ error: 'Internal Server Error' });
            }

            return res.status(201).json({ message: 'Slot inserted successfully' });
          }
        );
      }
    );
  });
});

// Endpoint to list available slots of doctors
app.get('/doctors/:doctorID/available-slots', (req, res) => {
  const doctorID = req.params.doctorID;

  if (!doctorID) {
    return res.status(400).json({ error: 'Doctor ID is required' });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting MySQL connection:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    connection.query(
      'SELECT * FROM dr_schedule WHERE doctorID = ? AND appid IS NULL AND SlotDay IS NOT NULL',
      [doctorID],
      (err, results) => {
        connection.release();
        if (err) {
          console.error('Error getting available slots:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (results.length === 0) {
          return res.status(404).json({ error: 'No available slots for this doctor' });
        }

        const availableSlots = results.map(slot => ({
          SlotDay: slot.SlotDay,
          SlotTime: slot.SlotTime,
        }));

        return res.status(200).json(availableSlots);
      }
    );
  });
});

// Endpoint to create an appointment
app.post('/appointments', (req, res) => {
  const { patientID, doctorID, SlotDay, SlotTime } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting MySQL connection:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    connection.query(
      'INSERT INTO appointments (patientID, doctorID, SlotDay, SlotTime) ' +
      'SELECT ?, ?, ?, ? ' +
      'FROM DUAL ' +
      'WHERE NOT EXISTS (SELECT * FROM appointments WHERE patientID = ? AND doctorID = ? AND SlotDay = ? AND SlotTime = ?)',
      [patientID, doctorID, SlotDay, SlotTime, patientID, doctorID, SlotDay, SlotTime],
      (err, results) => {
        if (err) {
          connection.release();
          console.error('Error creating appointment:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (results.affectedRows === 0) {
          connection.release();
          return res.status(400).json({ error: 'Patient already has an appointment at this slot' });
        }

        const appointmentId = results.insertId;

        connection.query(
          'SELECT * FROM appointments WHERE appid = ?',
          [appointmentId],
          (fetchErr, fetchResults) => {
            if (fetchErr) {
              connection.release();
              console.error('Error fetching appointment data:', fetchErr);
              return res.status(500).json({ error: 'Internal Server Error' });
            }

            if (fetchResults.length === 0) {
              connection.release();
              console.error('No data found for the inserted appointment ID:', appointmentId);
              return res.status(500).json({ error: 'Internal Server Error: No data found for the inserted appointment ID' });
            }

            const fetchedAppointment = fetchResults[0];

            connection.query(
              'INSERT INTO dr_schedule (doctorID, SlotDay, SlotTime, appid, patientID) VALUES (?, ?, ?, ?, ?)',
              [fetchedAppointment.doctorID, fetchedAppointment.SlotDay, fetchedAppointment.SlotTime, fetchedAppointment.appid, fetchedAppointment.patientID],
              (insertErr, insertResults) => {
                connection.release();
                if (insertErr) {
                  console.error('Error inserting data into dr_schedule table:', insertErr);
                  return res.status(500).json({ error: 'Internal Server Error' });
                }

                return res.status(201).json({ message: 'Appointment created successfully', fetchedAppointment });
              }
            );
          }
        );
      }
    );
  });
});

// Endpoint to update a patient's appointment
app.put('/appointments/:appID', (req, res) => {
  const { appID } = req.params;
  const { patientID, doctorID, SlotDay, SlotTime } = req.body;

  console.log('Received data:', { appID, patientID, doctorID, SlotDay, SlotTime });

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting MySQL connection:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    const updateAppointmentQuery = `
      UPDATE appointments 
      SET patientID = ?, doctorID = ?, SlotDay = ?, SlotTime = ? 
      WHERE appID = ?
    `;
    connection.query(
      updateAppointmentQuery,
      [patientID, doctorID, SlotDay, SlotTime, appID],
      (err, results) => {
        if (err) {
          connection.release();
          console.error('Error updating appointment:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (results.affectedRows === 0) {
          connection.release();
          return res.status(404).json({ error: 'Appointment not found' });
        }

        const updateScheduleQuery = `
          UPDATE dr_schedule 
          SET appID = ? 
          WHERE doctorID = ? AND slotDay = ? AND slotTime = ?
        `;
        connection.query(
          updateScheduleQuery,
          [appID, doctorID, SlotDay, SlotTime],
          (updateErr, updateResults) => {
            connection.release();
            if (updateErr) {
              console.error('Error updating doctor schedule:', updateErr);
              return res.status(500).json({ error: 'Internal Server Error' });
            }

            return res.status(200).json({ message: 'Appointment updated successfully' });
          }
        );
      }
    );
  });
});
// Endpoint to delete an appointment
app.delete('/appointments/:appID', (req, res) => {
  const appID = req.params.appID;

  if (!appID) {
    return res.status(400).json({ error: 'Appointment ID is required' });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting MySQL connection:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    connection.query('SELECT * FROM appointments WHERE appID = ?', [appID], (checkErr, checkResults) => {
      if (checkErr) {
        connection.release();
        console.error('Error checking appointment:', checkErr);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (checkResults.length === 0) {
        connection.release();
        return res.status(404).json({ error: 'Appointment not found' });
      }

      const canceledAppointment = checkResults[0];

      connection.query(
        'DELETE FROM dr_schedule WHERE appid = ?',
        [appID],
        (deleteErr, deleteResults) => {
          if (deleteErr) {
            connection.release();
            console.error('Error deleting from doctor schedule:', deleteErr);
            return res.status(500).json({ error: 'Internal Server Error' });
          }

          connection.query(
            'DELETE FROM appointments WHERE appID = ?',
            [appID],
            (deleteAppointmentErr, deleteAppointmentResults) => {
              connection.release();
              if (deleteAppointmentErr) {
                console.error('Error deleting appointment:', deleteAppointmentErr);
                return res.status(500).json({ error: 'Internal Server Error' });
              }

              return res.status(200).json({
                message: 'Appointment canceled successfully',
                canceledAppointment,
              });
            }
          );
        }
      );
    });
  });
});

// Endpoint to get all reservations for a patient
app.get('/patients/:patientID', (req, res) => {
  const patientID = req.params.patientID;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting MySQL connection:', err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    connection.query(
      'SELECT a.* FROM appointments a JOIN patients p ON a.patientID = p.patientID WHERE p.patientID = ?',
      [patientID],
      (err, results) => {
        connection.release();
        if (err) {
          console.error('Error getting patient reservations:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (results.length === 0) {
          return res.status(404).json({ error: 'No reservations found for the specified patientID' });
        }

        return res.status(200).json(results);
      }
    );
  });
});

const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = { app, server };