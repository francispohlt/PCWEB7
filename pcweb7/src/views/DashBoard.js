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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Process employees to reduce task hours for completed tasks
  const processedEmployees = employees.map(employee => {
    if (employee.taskProgress === 'completed') {
      return { ...employee, taskHours: 0 };
    }
    return employee;
  });

  // Prepare chart data for all employees
  const chartData = {
    labels: processedEmployees.map(emp => emp.name),
    datasets: [{
      label: 'Task Hours',
      data: processedEmployees.map(emp => emp.taskHours),
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
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.name}</td>
                <td>{employee.Tasking}</td>
                <td>{employee.taskProgress === 'completed' ? 'Task Completed' : `${employee.taskProgress}`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Dashboard;
