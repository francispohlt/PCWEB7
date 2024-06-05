import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './EmployeePage.css'; // Import CSS for styling

const EmployeePage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const employeesData = [];
        const querySnapshot = await getDocs(collection(db, 'employees'));
        querySnapshot.forEach((doc) => {
          employeesData.push({ ...doc.data(), id: doc.id });
        });
        setEmployees(employeesData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching employees:', err);
        setError(err);
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Container>
      <h2 className="my-4">Employees</h2>
      <Row>
        {employees.map((employee) => (
          <Col key={employee.id} md={4}>
            <Card className="mb-4">
              <Card.Img variant="top" src={employee.imageUrl || "https://zca.sg/img/placeholder"} style={{ width: '200px', height: '200px', objectFit: 'cover' }} />
              <Card.Body>
                <Card.Title>{employee.name}</Card.Title>
                <Card.Text>
                  <strong>Tasking:</strong> {employee.Tasking || 'Free to accept new task'}<br />
                  <strong>Skills:</strong> {employee.skills}<br />
                  <strong>Total Task Hours:</strong> {employee.taskProgress !== 'completed' ? employee.taskHours : 0}<br />
                  <strong>Date Joined:</strong> {employee.dateJoined ? new Date(employee.dateJoined.seconds * 1000).toLocaleDateString() : 'N/A'}
                </Card.Text>
                <Button variant="primary" onClick={() => navigate(`/update-employee/${employee.id}`)}>Update</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Button variant="success" className="mt-4" onClick={() => navigate('/create-employee')}>
        Add Employee
      </Button>
    </Container>
  );
};

export default EmployeePage;
