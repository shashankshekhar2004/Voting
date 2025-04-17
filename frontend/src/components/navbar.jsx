import React, { useState } from "react";
import {
  Menu,
  X,
  ListChecks,
  Hourglass,
  History,
  UserSquare,
  Plus,
  Phone,
  LogOut,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const SlidingNavbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="relative">
      {/* Hamburger Button */}
      <button
        onClick={() => setOpen(true)}
        className="text-white p-3 fixed top-4 left-4 z-50 bg-gray-800 rounded-lg shadow-lg"
      >
        <Menu size={24} />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-opacity-0 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg z-50 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col justify-between h-full">
          <div>
            {/* Close Button */}
            <div className="flex justify-between items-center p-4 border-b border-gray-300 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                Menu
              </h2>
              <button onClick={() => setOpen(false)}>
                <X className="text-gray-700 dark:text-white" />
              </button>
            </div>

            {/* Links */}
            <nav
              onClick={() => setOpen(false)}
              className="flex flex-col p-4 space-y-4 text-gray-700 dark:text-white"
            >
              <Link
                to="/allpolls"
                className="flex items-center gap-2 hover:text-blue-500"
              >
                <ListChecks size={18} /> All Polls
              </Link>
              <Link
                to="/"
                className="flex items-center gap-2 hover:text-blue-500"
              >
                <Hourglass size={18} /> Live Polls
              </Link>
              <Link
                to="/expiredpolls"
                className="flex items-center gap-2 hover:text-blue-500"
              >
                <History size={18} /> Expired Polls
              </Link>
              <Link
                to="/viewyourpolls"
                className="flex items-center gap-2 hover:text-blue-500"
              >
                <UserSquare size={18} /> View Your Polls
              </Link>
              <Link
                to="/createpoll"
                className="flex items-center gap-2 hover:text-blue-500"
              >
                <Plus size={18} /> Create Poll
              </Link>
              <Link
                to="#"
                className="flex items-center gap-2 hover:text-blue-500"
              >
                <Phone size={18} /> Contact
              </Link>
            </nav>
          </div>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-300 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 text-red-600 dark:text-red-400 hover:text-red-700"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlidingNavbar;
