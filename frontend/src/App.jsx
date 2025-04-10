import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LogInWithOTP from "./pages/login";
import SignupWithOTP from "./pages/signUp";
import SlidingNavbar from "./components/navbar";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLogin } from "./redux/authSlice";
import Home from "./pages/Home";
function AppContent() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  console.log(isLoggedIn);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");
    if (token && id) {
      dispatch(setLogin({ token, id }));
    }
    setLoading(false);
  }, []);
  if (loading) return <div className="loader">Loading...</div>;

  return (
    <>
      <SlidingNavbar />
      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <Home /> : <Navigate to="/login" />}
        />
        <Route path="/signup" element={<SignupWithOTP />} />
        <Route path="/login" element={<LogInWithOTP />} />
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
