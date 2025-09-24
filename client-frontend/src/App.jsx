import React from "react";
import './index.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {Login} from "./components/Auth/Login.jsx";
import Register from "./components/Auth/Register.jsx";



const App = () => {

 return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />}/>
          <Route path="/register" element={<Register />}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
