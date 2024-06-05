import React, { useEffect, useState } from 'react';
import { db, storage } from '../firebase';
import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Container, Form, Button, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CreateEmployee = () => {
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("https://zca.sg/img/placeholder");
  const [skills, setSkills] = useState('');
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

  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = '';
      if (image) {
        const imageReference = ref(storage, `employee_images/${image.name}`);
        const response = await uploadBytes(imageReference, image);
        imageUrl = await getDownloadURL(response.ref);
      }
      await addDoc(collection(db, 'employees'), {
        name,
        taskHours: 0,
        Tasking: '', // Set tasking to an empty string
        taskProgress: 'Not Started',
        skills,
        dateJoined: Timestamp.fromDate(new Date()), // Store dateJoined as Firestore Timestamp
        imageUrl,
      });
      // Redirect to EmployeePage
      navigate('/employees');
    } catch (error) {
      console.error('Error creating employee:', error);
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
      <h2>Create Employee</h2>
      <Form onSubmit={handleCreateEmployee}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Employee Name</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Employee Name"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="skills">
          <Form.Label>Skills</Form.Label>
          <Form.Control
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="Skills"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="image">
          <Form.Label>Employee Image</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => {
              const imageFile = e.target.files[0];
              const previewImage = URL.createObjectURL(imageFile);
              setImage(imageFile);
              setPreviewImage(previewImage);
            }}
          />
          <Image
            src={previewImage}
            style={{ objectFit: 'cover', width: '10rem', height: '10rem', marginTop: '10px' }}
          />
        </Form.Group>
        <Button variant="primary" type="submit">Create Employee</Button>
      </Form>
    </Container>
  );
};

export default CreateEmployee;
