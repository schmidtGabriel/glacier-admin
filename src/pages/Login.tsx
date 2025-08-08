import React from "react";
import logoImage from "../assets/logo.png";
import LoginForm from "../components/forms/LoginForm";

const Login: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <img src={logoImage} alt="Glacier Logo" className="h-60 w-60" />
        </div>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
          Sign in
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Access your dashboard and manage your profile
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          <LoginForm />
        </div>
      </div>

      <footer className="mt-8 text-center text-sm text-gray-500">
        <p>
          © {new Date().getFullYear()}{" "}
          <a
            href="https://www.tryglacier.com/"
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            Try Glacier
          </a>
          . All rights reserved.
        </p>
        <div className="mt-2 space-x-4">
          <a
            href="#"
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            Terms of Service
          </a>
          <a
            href="#"
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Login;
