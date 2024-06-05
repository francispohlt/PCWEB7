import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, storage } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Container, Form, Button, Image } from 'react-bootstrap';

const UpdateEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [skills, setSkills] = useState('');
  const [dateJoined, setDateJoined] = useState('');

  useEffect(() => {
    const fetchEmployee = async () => {
      const docRef = doc(db, 'employees', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setEmployee(data);
        setName(data.name);
        setPreviewImage(data.imageUrl);
        setSkills(data.skills);

        // Convert Firebase timestamp to ISO string for input type="date"
        if (data.dateJoined) {
          const date = new Date(data.dateJoined.seconds * 1000); // Assuming dateJoined is a Firestore Timestamp
          setDateJoined(date.toISOString().split('T')[0]);
        } else {
          setDateJoined('');
        }
      } else {
        console.log('No such document!');
      }
    };
    fetchEmployee();
  }, [id]);

  const handleUpdateEmployee = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = previewImage;
      if (image) {
        const imageRef = ref(storage, `employee_images/${image.name}`);
        const response = await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(response.ref);
      }

      const employeeRef = doc(db, 'employees', id);
      await updateDoc(employeeRef, {
        name,
        skills,
        imageUrl,
        dateJoined: new Date(dateJoined) // Store as a JavaScript Date object
      });

      navigate('/employees');
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  if (!employee) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <h2>Update Employee</h2>
      <Form onSubmit={handleUpdateEmployee}>
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
        <Form.Group className="mb-3" controlId="dateJoined">
          <Form.Label>Date Joined</Form.Label>
          <Form.Control
            type="date"
            value={dateJoined}
            onChange={(e) => setDateJoined(e.target.value)}
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
        <Button variant="primary" type="submit">Update Employee</Button>
      </Form>
    </Container>
  );
};

export default UpdateEmployee;
