import React from "react";
import { Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { login, register } from "./services/authService";
const App = () => {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Login funcMethod={register} />} />
        <Route path="/login" element={<Login funcMethod={login} />} />
        <Route path="/protected" element={<ProtectedRoute />} />
      </Routes>
    </div>
  );
};

export default App;
