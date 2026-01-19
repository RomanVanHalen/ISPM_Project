import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Courses.css";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer2";

const modules = [
  { id: 1, domain: "Modules 1", title: "Information Security & Data Privacy", link: "/training/Courses/Ddomain1" },
  { id: 2, domain: "Modules 2", title: "Data Privacy & Protection", link: "/training/Courses/Ddomain2" },
  { id: 3, domain: "Modules 3", title: "Phishing Awareness", link: "/training/Courses/Ddomain3" },
   { id: 4, domain: "Modules 4", title: "Cyber Governance & Compliance", link: "/training/Courses/Ddomain4" },
];


const Courses = () => {
  const navigate = useNavigate();

  const handleClick = (link) => {
    navigate(link); // Navigate to detail page
  };

  return (
    <>
    
      <Navbar />
      <div className="vik-course-container">
        {modules.map((module) => (
          <div
            key={module.id}
            className="vik-course-card"
            onClick={() => handleClick(module.link)}
          >
            <h4 className="vik-course-domain">{module.domain}</h4>
            <p className="vik-course-title">{module.title}</p>
          
          </div>
        ))}
      </div>
      <Footer />
    </>
  );
};

export default Courses;
