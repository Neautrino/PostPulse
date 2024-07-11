import { SigninInput } from "@neautrino/postpulse";
import axios from "axios";
import React, { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
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
				}
			);

			setTimeout(() => navigate("/"), 2000);
		} catch (error: any) {
			if (error?.response.status === 401)
				toast.error("Invalid email or password");
			else toast.error("An error occured please try again.");
		}
	};

	return (
		<div className="flex flex-col lg:flex-row justify-center items-center h-screen bg-gray-900">
			<div className="hidden w-1/2 lg:flex flex-col gap-4 items-center justify-center">
				<h1 className="text-4xl font-bold text-white mb-4">
					Welcome back to PostPulse
				</h1>
				<p className="text-gray-400 text-lg text-center max-w-lg">
					Your go-to platform for sharing thoughts, connecting with
					others, and staying updated on the latest trends.
				</p>
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
					<Link to={"/signup"}>
						<p className="text-gray-300 text-center mt-4">
							Don't have an account?{" "}
							<span className="bg-gradient-to-tr font-semibold from-blue-400 to-pink-500 text-transparent bg-clip-text">
								SignUp
							</span>
						</p>
					</Link>
				</form>
			</div>
			<ToastContainer position="bottom-right" />
		</div>
	);
}

export default SignIn;
