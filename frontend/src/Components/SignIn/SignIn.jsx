import React, { useState } from "react";
import axios from 'axios';
import { UserUtils } from "../user.utils";
import './SignIn.css'
import { Link } from 'react-router-dom'; // or the appropriate import for your library
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
 
  const [UserName, setName] = useState("");
  const [Password, setPassword] = useState("");
  const navv=useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", UserName, Password);

    const form = e.target;

    const formData = new FormData(form);

    const formJson = Object.fromEntries(formData.entries());

    console.log(formJson);

    try {

      const response = await axios.post('http://localhost:8000/signin', {


      username: UserName,
      password: Password
      });
      

      console.log(response.data);

      UserUtils.curUserId = response.data["id"];
      UserUtils.curUserRole = response.data["role"];
      if (UserUtils.curUserRole === 'patient') {
        // Redirect to the patient view page
        navv('/patientview');
      } else {
          navv('/drview');
      }

      console.log(UserUtils.curUserId);
      console.log(UserUtils.curUserRole);

  } catch (error) {
    console.error('An error occurred during sign-in:', error.message);
    // Handle sign-in errors
  }
  console.log("Form submitted:");


  };


  return (
    <div className="signin">
    <h1>Sign In</h1>
    <form onSubmit={handleSubmit} className="customizeform">
      <label>
        User Name:
        <input
          type="text"
          placeholder="Username"
          value={UserName}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <br />
      <label>
        Password:
        <input
           type="password"
           placeholder="Password"
           value={Password}
           onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <br />
      <br />
      <button className="btn btn-outline-success" type="submit">
        Sign In
      </button>
      <br></br>
      <br></br>
      <p>Don't't have an account ?  <Link to="/signup">Sign Up</Link> </p>
    </form>
    </div>

  );
};

export default SignIn;