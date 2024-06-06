import { useEffect, useState } from "react";
import { Container, Image, Row, Col } from "react-bootstrap";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Navigation from "../components/navigation";
import logo from '../assets/build-logo-1.png';

export default function HomePage() {
  const [posts, setPosts] = useState([]);

  async function getAllPosts() {
    const query = await getDocs(collection(db, "posts"));
    const posts = query.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    setPosts(posts);
  }

  useEffect(() => {
    getAllPosts();
  }, []);

  return (
    <>
      <Container className="text-center my-5">
        <Image
          src={logo} // Use the imported logo
          alt="Build Logo"
          fluid
        />
        <p className="mt-4">
        Task and Track is designed to offer a clear and immediate overview of employees' tasks and committed task hours. This enables personnel to easily view and manage their current assignments and monitor their progress effectively. The dashboard serves as a Minimum Viable Product (MVP), providing a point of view for supervisors to oversee and manage task distribution and tracking.        </p>
      </Container>
    </>
  );
}
