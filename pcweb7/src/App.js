import './App.css';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from "./views/LoginPage";
import HomePage from './views/HomePage';
import SignUpPage from './views/SignUpPage';
import Dashboard from './views/DashBoard';
import CreateTask from './views/CreateTask';
import CreateEmployee from './views/CreateEmployee';
import EmployeePage from './views/EmployeePage';
import Navigation from './components/navigation'; // Import the navigation component
import PrivateRoute from './components/PrivateRoute';
import UpdateEmployee from './views/UpdateEmployee';
// import logo from './assets/build-logo-1.png';

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      {/* <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header> */}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/update-employee/:id" element={<UpdateEmployee />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-task" element={<CreateTask />} />
          <Route path="/create-employee" element={<CreateEmployee />} />
          <Route path="/employees" element={<EmployeePage />} />
          </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
