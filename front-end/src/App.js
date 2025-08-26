import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PoliciesHome from "./pages/Policies/PoliciesHome";
import Policies from "./pages/Policies/Policies";
import Training from "./pages/Training/Training";
import Reports from "./pages/Reports/Reports";
import Login from "./pages/Login/Login";
import Register from "./pages/Login/Register";
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminUsers from './pages/Admin/adminComponents/AdminUsers';
import AccountSettings from './pages/Admin/adminComponents/AccountSettings';
import EmployeeDashboard from "./pages/Emp/EmployeeDashboard";
import WelcomePage from "./pages/Welcome/WelcomePage"; // ✅ Added
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/welcome" element={<WelcomePage />} />  {/* ✅ Added */}

        <Route path="/policies" element={<PoliciesHome />} />       
        <Route path="/policies/docs" element={<Policies />} />       

        <Route path="/training" element={<Training />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard routes */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} /> 
        <Route path="/account-settings" element={<AccountSettings />} />
        <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
        <Route path="/empdashboard" element={<EmployeeDashboard />} /> {/* ✅ Alias added */}
      </Routes>
    </Router>
  );
}

export default App;
