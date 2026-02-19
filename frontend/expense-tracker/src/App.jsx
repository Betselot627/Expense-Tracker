import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";


  
import SignUp from "./pages/Auth/SignUp";
import Income from "./pages/Dashboard/Income";
import Home from "./pages/Dashboard/Home";
import Login from "./pages/Auth/login";
import Expense from "./pages/Dashboard/Expense";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signUp" element={<SignUp/>} />
        <Route path="/dashboard" element={<Home/>} />
        <Route path="/income" element={<Income />} />
        <Route path="/expense" element={<Expense />} />

      </Routes>
    </Router>
  );
};

export default App;

const Root = () => {
  const isAuthenticated = !!localStorage.getItem("token");
  // Redirect to dashboard if authenticated, otherwise to login
  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />
  );
};