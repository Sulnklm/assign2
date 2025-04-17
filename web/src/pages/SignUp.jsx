import { useState } from 'react';
import { useNavigate } from 'react-router';

function SignUp() {
  // Navigation hook for redirection
  const navigate = useNavigate();

  // Form data state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });

  // Error message state
  const [errorMessage, setErrorMessage] = useState('');

  // Handles form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    // Email format validation (basic check)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage("Invalid email format");
      return;
    }

    // Make the POST request to register the user
    fetch("http://localhost:5001/users/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Registration failed");
        }
        return response.json();
      })
      .then(returnedJSON => {
        // Redirect to SignIn page after successful sign up
        navigate("/sign-in");
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage("An error occurred while registering. Please try again.");
      });
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Register</h1>
        
        {/* Display error message if there is any */}
        {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
        
        <form onSubmit={handleSubmit}>
          {/* Email input */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder='Email'
              required
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F55848]"
              onChange={(event) => setFormData({ ...formData, email: event.target.value })}
            />
          </div>
          
          {/* Password input */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 font-medium">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder='Password'
              required
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F55848]"
              onChange={(event) => setFormData({ ...formData, password: event.target.value })}
            />
          </div>
          
          {/* Confirm Password input */}
          <div className="mb-4">
            <label htmlFor="confirm-password" className="block text-gray-700 font-medium">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              name="confirm-password"
              placeholder='Retype Password'
              required
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F55848]"
              onChange={(event) => setFormData({ ...formData, confirmPassword: event.target.value })}
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full py-2 mt-4 bg-[#F55848] text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-[#F55848]"
          >
            Register
          </button>
        </form>
      </div>
    </main>
  );
}

export default SignUp;
