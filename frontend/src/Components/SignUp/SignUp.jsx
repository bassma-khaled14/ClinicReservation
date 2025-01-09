import React, { useState } from "react";
import "./SignUp.css";
import axios from 'axios';
import { UserUtils } from "../user.utils";
import "react-toastify/dist/ReactToastify.css";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const navv = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());

    try {
      const response = await axios.post('http://localhost:8000/signup', {
        "username": formJson["name"],
        "password": formJson["password"],
        "userType": formJson["myRadio"]
      });

      UserUtils.curUserId = response.data["id"];
      UserUtils.curUserRole = response.data["role"];

      if (formJson["myRadio"] === "patient") {
        navv('/patientview');
      } else {
        navv('/drview');
      }
    } catch (error) {
      console.error('An error occurred during sign-in:', error.message);
    }
  };

  return (
    <div className="signup">
      <h1>Sign Up</h1>
      <form method="post" onSubmit={handleSubmit}>
        <label>
          User Name:
          <input placeholder="username" name="name" type="text" />
        </label>
        <br />
        <label>
          Email:
          <input placeholder="email" type="email" name="email" />
        </label>
        <br />
        <label>
          Password:
          <input placeholder="password" type="password" name="password" />
        </label>
        Role:
        <label><input type="radio" className="radioButton" name="myRadio" value="patient" />Patient</label>
        <label><input type="radio" className="radioButton" name="myRadio" value="doctor" /> Doctor</label>
        <br />
        <button type="submit">Sign Up</button>
        <br />
        <br />
        <p>Already have an account? <Link to="/signin">Sign in</Link></p>
      </form>
    </div>
  );
};

export default SignUp;
