import React, { useState } from 'react';
import { db } from '../firebase';
import { doc, updateDoc, increment } from "firebase/firestore";

const CreateTask = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [Tasking, setTasking] = useState('');
  const [taskHours, setTaskHours] = useState('');

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const employeeRef = doc(db, 'employees', employeeId);
      await updateDoc(employeeRef, {
        taskHours: increment(parseInt(taskHours, 10)),
      });
      // Optionally reset the form
      setEmployeeId('');
      setTasking('');
      setTaskHours('');
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <div>
      <h2>Create Task</h2>
      <form onSubmit={handleCreateTask}>
        <input
          type="text"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          placeholder="Employee ID"
        />
        <input
          type="text"
          value={Tasking}
          onChange={(e) => setTasking(e.target.value)}
          placeholder="Tasking"
        />
        <select
          value={taskHours}
          onChange={(e) => setTaskHours(e.target.value)}
        >
          <option value="">Select Task Hours</option>
          <option value="1">1 hour</option>
          <option value="2">2 hours</option>
          <option value="4">4 hours</option>
          <option value="8">8 hours</option>
          <option value="16">16 hours</option>
          <option value="24">24 hours</option>
          <option value="48">48 hours</option>
          <option value="96">96 hours</option>
        </select>
        <button type="submit">Create Task</button>
      </form>
    </div>
  );
};

export default CreateTask;
