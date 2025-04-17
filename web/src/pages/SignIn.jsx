import { useState } from 'react';
import { useNavigate } from "react-router";

function SignIn( { handleLogin } ) {
    
    // Set up state variables
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    // To store error messages
    const [errorMessage, setErrorMessage] = useState('');

    // For navigation after login
    const navigate = useNavigate();

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch("http://localhost:5001/users/sign-in", {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });
            
            // If login is successful, handle token and redirect
            if (response.ok) {
                const returnedData = await response.json();
                localStorage.setItem("jwt-token", returnedData.token); // Save token in localStorage

                // Update authentication state from App and redirect
                handleLogin();
                navigate("/home"); // Redirect to the home page
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || "Login failed. Please check your credentials.");
            }
        } catch (error) {
            console.error("Error during login:", error);
            setErrorMessage("An error occurred during login. Please try again later.");
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
                <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Sign In</h1>
                
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
                    
                    {/* Submit button */}
                    <button
                        type="submit"
                        className="w-full py-2 mt-4 bg-[#F55848] text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-[#F55848]"
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </main>
    );
}

export default SignIn;
