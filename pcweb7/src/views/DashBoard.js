import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './Dashboard.css'; // Import CSS for styling
import Navigation from "../components/navigation";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [taskings, setTaskings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Prepare chart data for all employees
  const chartData = {
    labels: employeesWithTasks.map(emp => emp.name),
    datasets: [{
      label: 'Task Hours',
      data: employeesWithTasks.map(emp => emp.totalTaskHours),
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    }],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <>
      <div className="dashboard">
        <h2>Dashboard</h2>
        <div className="chart-container">
          <Bar data={chartData} options={chartOptions} />
        </div>
        <table className="employee-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Tasking</th>
              <th>Task Progress</th>
              <th>Due Date</th>
              <th>Task Hours</th>
            </tr>
          </thead>
          <tbody>
            {employeesWithTasks.map((employee) => {
              const taskCount = employee.tasks.length;
              return employee.tasks.map((task, index) => (
                <tr key={`${employee.id}-${task.id}`}>
                  {index === 0 && (
                    <td rowSpan={taskCount}>{employee.name}</td>
                  )}
                  <td>{task.taskDescription}</td>
                  <td>{task.taskProgress}</td>
                  <td>{task.dateDue && task.dateDue.seconds ? new Date(task.dateDue.seconds * 1000).toLocaleDateString() : 'N/A'}</td>
                  <td>{task.taskHours}</td>
                </tr>
              ));
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Dashboard;
