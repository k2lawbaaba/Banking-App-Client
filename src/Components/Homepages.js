import React, { useState } from "react";
import "../Stylings/Homepage.css";
import Navbar from "./Navbar";
import Login from "./Login";
import SignUp from "./SignUp";

const HomePage=()=>{

    const [newUser, setNewUser]= useState(false);
    const handleNewUser=(e)=>{
        e.preventDefault();
        setNewUser(!newUser)
    }

    return<div className="home-page">
    <div className="home-header">
    {/* <Navbar /> */}
        {/* <h1 className="welcome-text">Welcome to Abbay Bank Plc</h1>; */}

    </div>
    <div className="home-section">
        <div className="image-text">
            <img src={require("../images/e-banking-2.webp")} alt="e-banking-image" id="home-image"/>
            {/* <h3>A Bank just for you</h3> */}
        </div>
        <div className="home-action">
        {/* to determine if it is an existing user */}
        {
            !newUser?<Login /> : <SignUp />
        }
        
        <p class= {newUser?"home-create-acct2" :"home-create-acct" }>
          <a id="create-account" href="" onClick={handleNewUser}>
            {
                newUser?"Already have a account?":"Don't have any account yet?"
            }
            {/* Create an Account? */}
          </a>

          {/* <a href="" class="forget-pwd">
                Forget Password
              </a> */}
        </p>
            {/* <button type="submit" class="btn btn-primary">Sign Up Now!</button> */}
        </div>

    </div>
        <footer>

        </footer>
    </div>
}
export default HomePage;