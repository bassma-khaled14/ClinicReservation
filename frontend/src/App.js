import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./Components/SignIn/SignIn";
import SignUp from "./Components/SignUp/SignUp";
import CancelAppointment from "./Components/PatientCancelApp/CancelAppointment";
import Layout from "./Components/Layout/Layout";
import UpdateApp from "./Components/PatientUpdateApp/UpdateAPP";
import PatientCreateApp from "./Components/PatientCreateApp/PatientCreateApp";
import HomePage from "./Components/HomePage/HomePage";
import PatientView from "./Components/PatientView/Patientview";
import DrView from "./Components/DrView/DrView";
import ListPatientApp from "./Components/ListPatientApp/ListPatientApp";
import SelectDr from "./Components/PatientSelectSlot/SelectDr";
import ListDrApp from "./Components/ListDrApp/ListDrApp";
import DrInserSlot from "./Components/DrInsertSlot/DrInsertSlot";
import ListAvailableSlots from "./Components/ListAvaiableSlots/ListAvaiableSlots";
function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="patientview" element={<PatientView/>} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/drview" element={<DrView />} />
        <Route path="/CancelAppointment" element={<CancelAppointment />} />
        <Route path="/appointments/:appID" element={<UpdateApp />} />
        <Route path="/createapp" element={<PatientCreateApp />} />
        <Route path="/patients/:patientID" element={<ListPatientApp />} />
        <Route path="/selectdr" element={<SelectDr />} />
        <Route path="/ListDrApp" element={< ListDrApp />} />
        <Route path="/DrInserSlot" element={<DrInserSlot />} />
        <Route path="/doctors/available-slots" element={<ListAvailableSlots />} />





      </Routes>
    </Router>
  );
}

export default App;
