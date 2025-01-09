import React from "react";
import { Link } from "react-router-dom";
import './HomePage.css'
//import cssimg from 'C:\Users\L E G I O N\Downloads\S3_20216027_20216144_20206089_Ahmed_Hassan\toolsphase1\cssimg.jpg';

const HomePage = () => {
  return (
  <div>
    <div className="home-page">
      <h1>Welcome to our Clinic Reservation</h1>
      <div className="button-container">
        {/* Sign In Button */}
        <Link to="/signin"rel="noopener noreferrer">

          <button className="sign-in-button">Sign In</button>
        </Link>

        {/* Sign Up Button */}
        <Link to="/signup"rel="noopener noreferrer">
          <button className="sign-up-button">Sign Up</button>
        </Link>
      </div>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <div>
      <h1 className="my-heading">Because <br></br> your health <br></br> matters :)</h1>
    </div>
    </div>

      <br></br>
      <br></br>
     
   
     
    </div>
  );
};

export default HomePage;
