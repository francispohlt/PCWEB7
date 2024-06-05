import React from 'react';
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { Container, Nav, Navbar } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

export default function Navigation() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <Navbar variant="dark" bg="dark">
      <Container>
        <Navbar.Brand href="/">Task & Track</Navbar.Brand>
        <Nav>
          <Nav.Link href="/dashboard">Dashboard</Nav.Link>
          <Nav.Link href="/employees">Employees</Nav.Link>
          <Nav.Link href="/create-task">New Task</Nav.Link>
          <Nav.Link onClick={handleSignOut}>Sign Out</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}
