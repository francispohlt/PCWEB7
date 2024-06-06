import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Bar } from 'react-chartjs-2';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './Dashboard.css'; // Import CSS for styling
import Navigation from "../components/navigation";
import CustomToolbar from '../components/CustomToolbar'; // Correct import path

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const localizer = momentLocalizer(moment);

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [taskings, setTaskings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);
  const [employeeColors, setEmployeeColors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch employees
        const employeesSnapshot = await getDocs(collection(db, 'employees'));
        const employeesData = employeesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Fetch taskings
        const taskingsSnapshot = await getDocs(collection(db, 'taskings'));
        const taskingsData = taskingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Assign random colors to employees
        const colors = {};
        employeesData.forEach(employee => {
          colors[employee.id] = getRandomColor();
        });
        setEmployeeColors(colors);
        setEmployees(employeesData);
        setTaskings(taskingsData);
        setLoading(false);

        // Create calendar events
        const eventsData = taskingsData
          .filter(task => task.taskProgress !== 'completed')
          .map(task => {
            const dateDue = task.dateDue?.seconds ? new Date(task.dateDue.seconds * 1000) : null;
            return {
              title: employeesData.find(emp => emp.id === task.employeeId)?.name || 'Unknown Employee',
              start: dateDue,
              end: dateDue,
              allDay: true,
              employeeId: task.employeeId,
              color: colors[task.employeeId],
            };
          })
          .filter(event => event.start !== null);

        setEvents(eventsData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

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
      backgroundColor: employeesWithTasks.map(emp => employeeColors[emp.id]),
      borderColor: employeesWithTasks.map(emp => employeeColors[emp.id]),
      borderWidth: 1,
    }],
  };

  const chartOptions = {
    scales: {
      x: {
        ticks: {
          font: {
            size: 16, // Increase font size for x-axis labels
          },
        },
      },
      y: {
        ticks: {
          font: {
            size: 16, // Increase font size for y-axis labels
          },
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          font: {
            size: 16, // Increase font size for legend
          },
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  // Define custom year view
  const CustomYearView = ({ date }) => {
    const start = new Date(date.getFullYear(), 0, 1);
    return (
      <div>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          defaultView={Views.MONTH}
          views={[Views.MONTH]}
          style={{ height: '80vh' }}
          toolbar={false}
          date={start}
        />
      </div>
    );
  };

  CustomYearView.range = (date) => {
    return {
      start: new Date(date.getFullYear(), 0, 1),
      end: new Date(date.getFullYear(), 11, 31),
    };
  };

  CustomYearView.navigate = (date, action) => {
    switch (action) {
      case 'PREV':
        return new Date(date.getFullYear() - 1, 0, 1);
      case 'NEXT':
        return new Date(date.getFullYear() + 1, 0, 1);
      default:
        return date;
    }
  };

  CustomYearView.title = (date) => {
    return `${date.getFullYear()}`;
  };

  return (
    <>
      <div className="dashboard">
        <div className="container">
          <h2 className="section-title">Tasked Man Hours</h2>
          <div className="chart-container">
            <Bar data={chartData} options={chartOptions} />
          </div>
          <h2 className="section-title">Due Dates</h2>
          <div className="calendar-container">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 700}}
              popup
              showMultiDayTimes
              views={{ month: true, week: true, year: CustomYearView }}
              components={{
                toolbar: CustomToolbar,
              }}
              eventPropGetter={(event) => {
                const backgroundColor = event.color;
                return { style: { backgroundColor } };
              }}
            />
          </div>
          <h2 className="section-title">Tasked Manpower</h2>
          <div className="employee-table-container">
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
                      <td>{task.dateDue?.seconds ? new Date(task.dateDue.seconds * 1000).toLocaleDateString() : 'N/A'}</td>
                      <td>{task.taskHours}</td>
                    </tr>
                  ));
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
