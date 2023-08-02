import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import React, { Component } from 'react';
import NavBar from './navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import vr_logo from './vr_fish.png'

import Uploader from './uploader';

class App extends Component {

  render(){
  return (
    <React.Fragment>

    <main className="container">
    <Navbar className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="#home" className="d-flex">
          <img
              alt=""
              src={vr_logo}
              width="50"
              height="50"
              className="d-inline-block align-top rounded"
            />
            <span style={{textAlign:'right',marginLeft:"10",paddingLeft:"10px",paddingTop:"5px"}}>
            Zebrafish Data Preparation Pipeline
            </span>
            
          </Navbar.Brand>
        </Container>
      </Navbar>
    <Uploader/>
    </main>

    </React.Fragment>
  );
  }
}

export default App;
