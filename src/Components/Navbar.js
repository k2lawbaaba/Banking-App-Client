import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Stylings/Navbar.css";


function Navbar() {
 
  
 

  return (
    <div className="nb-body">
      <div className="nb-content">
       
        
        <div className="nb-links">
          <div className="linko">
          <Link to="Contact" className="linko">
            <button>Contact</button>
          </Link>
          </div>
          <Link to="/" className="linko">
            <button>About us</button>
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
