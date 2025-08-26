
// src/pages/Training/Training.jsx
import React from "react";
import Header from "../../components/Navbar";
import Landpage from "./components/Landpage"; // Adjust path based on folder structure
import Courses from "./components/Courses";


const Training = () => {
  return (
    <div>
      <Header />
      <Landpage /> {/* This renders your Landpage component */}
    </div>
  );
};

export default Training;   