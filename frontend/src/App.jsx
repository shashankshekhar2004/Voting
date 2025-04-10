import './App.css';
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import LogInWithOTP from './pages/login';
import SignupWithOTP from './pages/signUp';
import SlidingNavbar from './components/navbar';

function AppContent() {
  const location = useLocation();
  const hideNavbarRoutes = ['/login', '/signup'];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <SlidingNavbar />}
      <Routes>
        <Route path="/signup" element={<SignupWithOTP />} />
        <Route path="/login" element={<LogInWithOTP />} />
        {/* Add more routes here */}
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
 