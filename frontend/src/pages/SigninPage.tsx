import { SigninInput } from "@neautrino/postpulse";
import axios from "axios";
import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function SignIn() {

	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const navigate = useNavigate();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({ ...prevData, [name]: value }));
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const { email, password } = formData;

		const validationResult = SigninInput.safeParse({ email, password });

		if (!validationResult.success) {
			toast.error(validationResult.error.errors[0].message);
			return;
		}

		try {
			

			await toast.promise(
				async () => {
					const response = await axios.post(
						`${import.meta.env.VITE_API_URL}/users/signin`,
						{
							email,
							password,
						}
					);
		
					localStorage.setItem("token", response.data.token);					
				},
				{
					pending: "Getting you in...",
					success: "Logged in successfully",
					error: "Failed to log in",
				}
			);

			setTimeout(() => navigate("/"), 2000);
		} catch (error) {
			toast.error("An error occured please try again.");
		}
	};

	return (
		<div className="flex h-screen bg-gray-900">
			<div className="w-1/2 flex items-center justify-center">
				<h1 className="text-4xl font-bold text-white">
					Welcome back to PostPulse
				</h1>
			</div>
			<div className="w-1/2 flex items-center justify-center">
				<form
					onSubmit={handleSubmit}
					className="bg-gray-800 p-8 rounded-lg shadow-md w-[350px]"
				>
					<h2 className="text-2xl font-semibold text-white mb-6">
						Sign In
					</h2>
					{["email", "password"].map((field) => (
						<div
							key={field}
							className="mb-4"
						>
							<input
								type={
									field.includes("password")
										? "password"
										: "email"
								}
								name={field}
								placeholder={
									field.charAt(0).toUpperCase() +
									field.slice(1)
								}
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
						Sign In
					</button>
				</form>
			</div>
			<ToastContainer position="bottom-right" />
		</div>
	);
}

export default SignIn;
