import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Stylings/Navbar.css";


function Navbar() {
 
  
 

  return (
    <div className="nb-body">
      <div className="nb-content">
       
        
        <div className="nb-links">
          <a className="linko" href="">
            <p>Contact</p>
          </a>
          <Link to="/" className="linko">
            <p>About us</p>
          </Link>
                  
          <div>
            
              {/* <Link to="/"> */}
                <button className="hp-login-button" onClick={()=> window.location.reload(true)}>Login</button>
              {/* </Link> */}

          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
