import './App.css';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth } from './firebase';
import LoginPage from "./views/LoginPage";
import HomePage from './views/HomePage';
import SignUpPage from './views/SignUpPage';
import Dashboard from './views/Dashboard';
import CreateTask from './views/CreateTask';
import CreateEmployee from './views/CreateEmployee';
import EmployeePage from './views/EmployeePage';
import Navigation from './components/navigation'; // Import the navigation component
import PrivateRoute from './components/PrivateRoute';
import UpdateEmployee from './views/UpdateEmployee';
import Footer from './components/Footer';
import Chat from './views/Chat';
function App() {

  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/update-employee/:id" element={<UpdateEmployee />} />
        <Route path="/chat" element={<Chat />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-task" element={<CreateTask />} />
          <Route path="/create-employee" element={<CreateEmployee />} />
          <Route path="/employees" element={<EmployeePage />} />
        </Route>
      </Routes>
      <Footer /> 
    </BrowserRouter>
  );
}

export default App;
