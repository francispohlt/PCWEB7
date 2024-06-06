import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './EmployeePage.css'; // Import CSS for styling

const EmployeePage = () => {
  const [employees, setEmployees] = useState([]);
  const [taskings, setTaskings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch employees
        const employeesSnapshot = await getDocs(collection(db, 'employees'));
        const employeesData = employeesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Fetch taskings
        const taskingsSnapshot = await getDocs(collection(db, 'taskings'));
        const taskingsData = taskingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        setEmployees(employeesData);
        setTaskings(taskingsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // Join employees and taskings
  const employeesWithTasks = employees.map(employee => {
    const tasks = taskings.filter(task => task.employeeId === employee.id && task.taskProgress !== 'completed');
    const totalTaskHours = tasks.reduce((sum, task) => sum + task.taskHours, 0);
    return { ...employee, tasks, totalTaskHours };
  });

  return (
    <Container>
      <h2 className="my-4">Employees</h2>
      <Row>
        {employeesWithTasks.map((employee) => (
          <Col key={employee.id} md={4}>
            <Card className="mb-4 employee-card">
              <Card.Img variant="top" src={employee.imageUrl || "https://zca.sg/img/placeholder"} />
              <Card.Body>
                <Card.Title>{employee.name}</Card.Title>
                <Card.Text>
                  <strong>Skills:</strong> {employee.skills}<br />
                  <strong>Total Task Hours:</strong> {employee.totalTaskHours}<br />
                  <strong>Current Tasks:</strong>
                  <ol>
                    {employee.tasks.map((task, index) => (
                      <li key={task.id} className="task-block">
                        <div>
                          <strong>Description:</strong> {task.taskDescription}<br />
                          <strong>Progress:</strong> {task.taskProgress}<br />
                          <strong>Due Date:</strong> {task.dateDue && task.dateDue.seconds ? new Date(task.dateDue.seconds * 1000).toLocaleDateString() : 'N/A'}
                        </div>
                      </li>
                    ))}
                  </ol>
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
