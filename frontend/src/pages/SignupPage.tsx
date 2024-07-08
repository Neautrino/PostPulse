import { SignupInput } from '@neautrino/postpulse';
import axios from 'axios';
import React, { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SignUp() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, username, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const validationResult = SignupInput.safeParse({ email, name: username, password });

    if (!validationResult.success) {
      toast.error(validationResult.error.errors[0].message);
      return;
    }

    try {
      
      
      await toast.promise(
        async ()=>{
          const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/signup`, {
            email,
            name: username,
            password
          });
    
          localStorage.setItem('token', response.data.token)
        }
      
        ,
        {
          pending: "Creating account...",
          success: "Account created successfully",
          error: "An error occurred. Please try again",
        }
      );

      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      toast.error("An error occurred.");
      
      setFormData({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
      });
    }
  };

  return (
    <div className="flex h-screen bg-gray-900">
      <div className="w-1/2 flex flex-col items-center justify-center gap-4">
        <h1 className="text-4xl font-bold text-white mb-4 text-center">
          Welcome to PostPulse
        </h1>
        <p className="text-gray-400 text-lg text-center max-w-xl">
          Join our community and start sharing your thoughts, ideas, and experiences. Connect with like-minded individuals and discover exciting content tailored just for you.
        </p>
      </div>
      <div className="w-1/2 flex items-center justify-center">
        <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-md w-[350px]">
          <h2 className="text-2xl font-semibold text-white mb-6">Sign Up</h2>
          {['email', 'username', 'password', 'confirmPassword'].map((field) => (
            <div key={field} className="mb-4">
              <input
                type={field.toLowerCase().includes('password') ? 'password' : field === 'email' ? 'email' : 'text'}
                name={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={formData[field as keyof typeof formData]}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded"
                required
              />
            </div>
          ))}
          <button
            type="submit"
            className="w-full text-white py-2 rounded bg-gradient-to-tr to-pink-700 from-blue-600 hover:bg-gradient-to-tr hover:to-pink-600 hover:from-blue-500 transition duration-200 ease-in-out"
          >
            Sign Up
          </button>
          <Link to={'/signin'}>
						<p className="text-gray-300 text-center mt-4">
							Already have an account?{" "}
							<span className="bg-gradient-to-tr font-semibold from-blue-400 to-pink-500 text-transparent bg-clip-text">SignIn</span>
						</p>
					</Link>
        </form>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default SignUp;