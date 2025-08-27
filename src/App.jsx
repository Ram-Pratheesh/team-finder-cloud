import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupPage from "./SignUp";
import LoginPage from "./Login"; // make sure you have Login.jsx created
import ProfileSetUp from "./ProfileSetUp";
import Dashboard from "./Dashboard";
function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          {/* Default route → Signup */}
          <Route path="/" element={<SignupPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/ProfileSetUp" element={<ProfileSetUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
