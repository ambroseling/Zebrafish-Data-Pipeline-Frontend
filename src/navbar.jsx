import React, { Component } from 'react';
import { NavLink,Link } from 'react-router-dom';
import "./App.css"


const NavBar = (props) => {
    return ( 
        <nav className="navbar navbar-expand-lg bg-light">
    {/* <h1 className="navbar-brand" to="/">Zebrafish Data PipeLine</h1>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarNav">
      <div className="navbar-nav">
          <li><NavLink className="nav-item nav-link" to="/movies">Upload</NavLink></li>
          

        <li><NavLink className="nav-item nav-link" to="/customers">Label</NavLink></li>
         
        <li><NavLink className="nav-item nav-link" to="/rentals">Save</NavLink></li>


      </div>
    </div> */}
  
</nav>
     );
}
 
export default (NavBar);
