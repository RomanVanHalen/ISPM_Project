import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import Policies from "./pages/Policies/Policies";
import Training from "./pages/Training/Training";
import Reports from "./pages/Analytics&Reports/Analytics&Reports";
import Login from "./pages/Login/Login";
import Register from "./pages/Login/Register";
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminUsers from './pages/Admin/adminComponents/AdminUsers';
import AccountSettings from './pages/Admin/adminComponents/AccountSettings';
import EmployeeDashboard from "./pages/Emp/EmployeeDashboard";
import NotificationsPage from "./components/Notifications";
import Guest from "./components/Unregister";

import NotificationsPage from "./components/Notifications"; 
import ForgotPassword from './pages/Login/ForgotPassword';
import VerifyOTP from './pages/Login/VerifyOTP';
import "./App.css";

// Courses
import Courses from "./pages/Training/components/Courses";
import Ddomain1 from "./pages/Training/components/Ddomain1";
import Ddomain2 from "./pages/Training/components/Ddomain2";
import Ddomain3 from "./pages/Training/components/Ddomain3";

// Progress tracking
import ProgressTracking from "./pages/Analytics&Reports/Components/ProgressTracking";

// ❌ You’re using these but forgot to import them
import ForgotPassword from "./pages/Login/ForgotPassword";
import VerifyOTP from "./pages/Login/VerifyOTP";

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <Router>
        <ScrollToTop /> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/policies" element={<Policies />} />
          <Route path="/training" element={<Training />} />
          <Route path="/reports&analytics" element={<Reports />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/notifications" element={<NotificationsPage />} />
        
          {/* Admin */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} /> 
          <Route path="/account-settings" element={<AccountSettings />} />

          {/* Employee */}
          <Route path="/employee-dashboard" element={<EmployeeDashboard />} />

          {/* Courses */}
          <Route path="/training/Courses" element={<Courses />}/>
          <Route path="/training/Courses/Ddomain1" element={<Ddomain1 />} />
          <Route path="/training/Courses/Ddomain2" element={<Ddomain2 />} />
          <Route path="/training/Courses/Ddomain3" element={<Ddomain3 />} />

          {/* Progress Tracking */}
          <Route path="/reports&analytics/ProgressTracking" element={<ProgressTracking />} />

          {/* Unregister */}
          <Route path="/unregister" element={<Guest />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
