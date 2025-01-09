const request = require('supertest');
const { app, server } = require('./server'); // Adjust the path if needed

describe('API Endpoints', () => {
  let patientID;
  let doctorID;

  beforeAll(async () => {
    // Insert test patient
    const patientRes = await request(app)
      .post('/signup')
      .send({
        username: `testpatient_${Date.now()}`,
        password: 'testpassword',
        userType: 'patient',
      });
    patientID = patientRes.body.id;

    // Insert test doctor
    const doctorRes = await request(app)
      .post('/signup')
      .send({
        username: `testdoctor_${Date.now()}`,
        password: 'testpassword',
        userType: 'doctor',
      });
    doctorID = doctorRes.body.id;

    // Insert test appointment
    await request(app)
      .post('/appointments')
      .send({
        patientID: patientID,
        doctorID: doctorID,
        SlotDay: 'Monday',
        SlotTime: '10:00:00', // Use 24-hour format
      });
  });

  afterAll((done) => {
    server.close(done);
  });

  it('should sign up a user with valid data', async () => {
    const uniqueUsername = `newuser_${Date.now()}`;
    const res = await request(app)
      .post('/signup')
      .send({
        username: uniqueUsername,
        password: 'newpassword',
        userType: 'patient',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('id');
  });

  it('should not sign up a user with missing data', async () => {
    const res = await request(app)
      .post('/signup')
      .send({
        username: 'newuser',
        password: 'newpassword',
        // Missing userType
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error', 'Username, password, userType are required');
  });

  it('should not sign up a user with an existing username', async () => {
    // First, sign up a user
    await request(app)
      .post('/signup')
      .send({
        username: 'existinguser',
        password: 'password',
        userType: 'patient',
      });

    // Try to sign up with the same username
    const res = await request(app)
      .post('/signup')
      .send({
        username: 'existinguser',
        password: 'newpassword',
        userType: 'patient',
      });
    expect(res.statusCode).toEqual(409);
    expect(res.body).toHaveProperty('error', 'Username already exists!');
  });

  it('should sign in a user with valid credentials', async () => {
    // Ensure the user exists
    await request(app)
      .post('/signup')
      .send({
        username: 'testuser',
        password: 'testpassword',
        userType: 'patient',
      });

    const res = await request(app)
      .post('/signin')
      .send({
        username: 'testuser',
        password: 'testpassword',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Sign-in successful');
  });

  it('should not sign in a user with invalid credentials', async () => {
    const res = await request(app)
      .post('/signin')
      .send({
        username: 'invaliduser',
        password: 'invalidpassword',
      });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('error', 'Invalid credentials');
  });

  it('should not allow a patient to select a doctor with missing data', async () => {
    const res = await request(app)
      .post('/select-doctor')
      .send({
        patientID: 1,
        // Missing doctorID
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error', 'Patient ID and Doctor ID are required');
  });

  it('should not allow a patient to select a non-existent doctor', async () => {
    const res = await request(app)
      .post('/select-doctor')
      .send({
        patientID: 1,
        doctorID: 999, // Assuming this doctorID does not exist
      });
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('error', 'Doctor not found');
  });

  it('should get a list of appointments', async () => {
    const res = await request(app).get('/doctorsappointments');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('appid');
    expect(res.body[0]).toHaveProperty('slotDay');
    expect(res.body[0]).toHaveProperty('slotTime');
  });

  it('should allow a doctor to set their schedule', async () => {
    const res = await request(app)
      .post('/dr_schedule')
      .send({
        doctorID: doctorID,
        slotDay: 'Monday',
        slotTime: '10:00:00',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'Slot inserted successfully');
  });

  it('should not allow a doctor to set a schedule with missing data', async () => {
    const res = await request(app)
      .post('/dr_schedule')
      .send({
        doctorID: doctorID,
        slotDay: 'Monday',
        // Missing slotTime
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error', 'Doctor ID, slotDay, and slotTime are required');
  });

  it('should not allow a doctor to set a schedule for an already taken slot', async () => {
    // Ensure the slot is taken
    await request(app)
      .post('/dr_schedule')
      .send({
        doctorID: doctorID,
        slotDay: 'Monday',
        slotTime: '10:00:00',
      });

    const res = await request(app)
      .post('/dr_schedule')
      .send({
        doctorID: doctorID,
        slotDay: 'Monday',
        slotTime: '10:00:00',
      });
    expect(res.statusCode).toEqual(409);
    expect(res.body).toHaveProperty('error', 'Slot is already taken');
  });
});
