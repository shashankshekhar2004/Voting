import "./App.css";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import LogInWithOTP from "./pages/login";
import SignupWithOTP from "./pages/signUp";
import SlidingNavbar from "./components/navbar";
import Home from "./pages/Home";
import LivePolls from "./pages/livePoll";
import ExpirePolls from "./pages/expirePoll";
import ViewYourPolls from "./pages/viewYourPolls";
import CreatePoll from "./pages/createPoll";

function AppContent() {
  const location = useLocation();
  const hideNavbarRoutes = ["/login", "/signup"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <SlidingNavbar />}
      <Routes>
        <Route path="/createpoll" element={<CreatePoll />} />
        <Route path="/signup" element={<SignupWithOTP />} />
        <Route path="/login" element={<LogInWithOTP />} />
        {/* Add more routes here */}
        <Route path="/" element={<Home />} />
        <Route path="/livepolls" element={<LivePolls />} />
        <Route path="/expiredpolls" element={<ExpirePolls />} />
        <Route path="/viewyourpolls" element={<ViewYourPolls />} />
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
