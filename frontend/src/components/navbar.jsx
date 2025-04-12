import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const SlidingNavbar = () => {
  const [open, setOpen] = useState(false);

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
          className="fixed inset-0   bg-opacity-0 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg z-50 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
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
          className="flex flex-col  p-4 space-y-3 text-gray-700 dark:text-white"
        >
          <Link to="/" className="hover:text-blue-500">
            All Polls
          </Link>
          <Link to="/livepolls" className="hover:text-blue-500">
            Live Polls
          </Link>
          <Link to="/expiredpolls" className="hover:text-blue-500">
            Expired Polls
          </Link>
          <Link to="/viewyourpolls" className="hover:text-blue-500">
            View Your Polls
          </Link>
          <Link to="/createpoll" className="hover:text-blue-500">
            create poll
          </Link>
          <Link to="#" className="hover:text-blue-500">
            Contact
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default SlidingNavbar;
