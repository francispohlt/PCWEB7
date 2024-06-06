import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './EmployeePage.css'; // Reusing the CSS from EmployeePage

const CreateTask = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [taskHours, setTaskHours] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [dateDue, setDateDue] = useState('');
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

        // Join employees and taskings
        const employeesWithTasks = employeesData.map(employee => {
          const tasks = taskingsData.filter(task => task.employeeId === employee.id && task.taskProgress !== 'completed');
          const totalTaskHours = tasks.reduce((sum, task) => sum + task.taskHours, 0);
          return { ...employee, tasks, totalTaskHours };
        });

        setEmployees(employeesWithTasks);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCheckboxChange = (employeeId) => {
    setSelectedEmployees((prevSelected) => {
      if (prevSelected.includes(employeeId)) {
        return prevSelected.filter((id) => id !== employeeId);
      } else {
        return [...prevSelected, employeeId];
      }
    });
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (selectedEmployees.length === 0 || !taskHours || !taskDescription || !dateDue) {
      alert('Please select employees, task hours, provide a task description, and set a due date');
      return;
    }
    try {
      const dateTasked = new Date();
      const tasks = selectedEmployees.map((employeeId) => ({
        employeeId,
        taskDescription,
        taskHours: parseInt(taskHours, 10),
        dateTasked,
        dateDue: new Date(dateDue),
        taskProgress: 'Assigned',
      }));
      await Promise.all(
        tasks.map((task) => addDoc(collection(db, 'taskings'), task))
      );
      navigate('/employees'); // Redirect to EmployeePage after task assignment
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Container>
      <h2>Create Task</h2>
      <Form onSubmit={handleCreateTask}>
        <Row>
          {employees.map((employee) => (
            <Col key={employee.id} md={4}>
              <Card className="mb-4">
                <Card.Img variant="top" src={employee.imageUrl || "https://zca.sg/img/placeholder"} style={{ width: '200px', height: '200px', objectFit: 'cover' }} />
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
                  <Form.Check
                    type="checkbox"
                    value={employee.id}
                    onChange={() => handleCheckboxChange(employee.id)}
                    label="Select"
                    checked={selectedEmployees.includes(employee.id)}
                  />
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <Form.Group className="mb-3" controlId="taskDescription">
          <Form.Label>Task Description</Form.Label>
          <Form.Control
            type="text"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            placeholder="Describe the task"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="taskHours">
          <Form.Label>Task Hours</Form.Label>
          <Form.Control as="select" value={taskHours} onChange={(e) => setTaskHours(e.target.value)}>
            <option value="">Select Task Hours</option>
            <option value="1">1 hour</option>
            <option value="2">2 hours</option>
            <option value="4">4 hours</option>
            <option value="8">8 hours</option>
            <option value="16">16 hours</option>
            <option value="24">24 hours</option>
            <option value="48">48 hours</option>
            <option value="96">96 hours</option>
          </Form.Control>
        </Form.Group>
        <Form.Group className="mb-3" controlId="dateDue">
          <Form.Label>Due Date</Form.Label>
          <Form.Control
            type="date"
            value={dateDue}
            onChange={(e) => setDateDue(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">Create Task</Button>
      </Form>
    </Container>
  );
};

export default CreateTask;
