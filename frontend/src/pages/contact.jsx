import React from "react";
import {
  FaEnvelope,
  FaPhone,
  FaGithub,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";

const Contact = () => {
  const team = [
    { name: "Prince Kumar", role: "Group Leader" },
    { name: "Shashank Shekhar", role: "Developer" },
    { name: "Ankit Raj", role: "Developer" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b bg-zinc-800 flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold text-blue-700 mb-2">Contact Us</h1>
      <p className="text-gray-500 max-w-2xl text-center mb-8">
        Have questions about our Voting App project? Want to collaborate or give
        feedback? Reach out to us through the details below!
      </p>

      <div className="bg-green-400 shadow-xl rounded-2xl p-6 w-full max-w-3xl mb-8">
        <h2 className="text-2xl font-semibold text-blue-600 mb-4 text-center">
          Our Team
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {team.map((member, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-4 bg-gray-50 rounded-xl"
            >
              <div className="w-20 h-20 bg-blue-200 rounded-full flex items-center justify-center text-2xl font-bold text-blue-800 mb-2">
                {member.name.charAt(0)}
              </div>
              <p className="font-medium">{member.name}</p>
              <p className="text-gray-500 text-sm">{member.role}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-3xl mb-8">
        <h2 className="text-2xl font-semibold text-blue-600 mb-4 text-center">
          Contact Info
        </h2>
        <div className="flex flex-col sm:flex-row justify-around text-gray-700">
          <div className="flex items-center mb-4 sm:mb-0">
            <FaEnvelope className="mr-2 text-blue-600" />
            <span>princeshashank034037@gmail.com</span>
          </div>
          <div className="flex items-center">
            <FaPhone className="mr-2 text-blue-600" />
            <span>+91-9060871119</span>
          </div>
        </div>
      </div>

      <div className="flex space-x-4 text-blue-600 text-2xl">
        <a
          href="https://github.com/shashankshekhar2004"
          className="hover:text-blue-800"
        >
          <FaGithub />
        </a>
        <a
          href="www.linkedin.com/in/shashank-shekhar-3b029024b"
          className="hover:text-blue-800"
        >
          <FaLinkedin />
        </a>
        <a href="https://x.com/Shashan65472277" className="hover:text-blue-800">
          <FaTwitter />
        </a>
      </div>
    </div>
  );
};

export default Contact;
