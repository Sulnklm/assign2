import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'; // react-router-dom import
import Header from './components/Header';
import Footer from './components/Footer';

// Import our authentication HOC
import authRequired from './authRequired';

import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Home from './pages/Home';
import AllItems from './components/AllItems';
import Card from './components/Card';

const ProtectedAllItems = authRequired(AllItems);
const ProtectedCard = authRequired(Card);
const ProtectedHome = authRequired(Home); // Protect Home page as well

function App() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Passed into the header to log out
  const handleLogout = () => {
    localStorage.removeItem("jwt-token");
    setIsAuthenticated(false);
    navigate("/sign-in");
  };

  // Passed into the header to Sign-in page to login
  const handleLogin = () => {
    setIsAuthenticated(true);
    navigate("/home"); // redirect to /home after successful login
  };

  // When the page loads, check if the user has a token
  useEffect(() => {
    const jwtToken = localStorage.getItem("jwt-token");

    if (jwtToken) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <div>
      <Header handleLogout={handleLogout} isAuthenticated={isAuthenticated} />
      
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} /> {/* Redirect to /home */}
        <Route path="/home" element={<ProtectedHome />} /> {/* Protect Home page */}
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn handleLogin={handleLogin} />} />
        <Route path="/cards" element={<ProtectedAllItems />} />
        <Route path="/cards/:id" element={<ProtectedCard />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
