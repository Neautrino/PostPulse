import { useRecoilState } from "recoil";
import Navbar from "../components/Navbar";
import { userState } from "../utils/atoms";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useFetchUser } from "../hooks/useFetchUser";

function ProfilePage() {
	const [user, setUser] = useRecoilState(userState);
	const [name, setName] = useState(user.name);
	const [prevPassword, setPrevPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const { fetchUser } = useFetchUser();

	const handleSave = async () => {
		try {
			if(newPassword || confirmPassword){
				const response =await axios.post(
					`${import.meta.env.VITE_API_URL}/users/signin`,
					{
						email: user.email,
						password: prevPassword,
					}
				);
		
				if(response.status !== 200){
					toast.error("Incorrect Password");
					return;
				}
		
				if(newPassword!==confirmPassword){
					toast.error("Confirm Password must be same");
					return;
				}
			}
			else{
				if(name === user.name){
					toast.error("No changes to save");
					return;
				}
			}
			
			await toast.promise(
				async ()=>{
					await axios.put(`${import.meta.env.VITE_API_URL}/users/update`, 
						{
							name,
							prevpassword: prevPassword,
							newPassword: newPassword,
						},
						{headers:{
							Authorization: `Bearer ${localStorage.getItem("token")}`,
						}
					});

					setUser({...user, name})
					await fetchUser();
				},	
				{
					pending: "Updating...",
					success: "Profile Updated Successfully",
				}
			)
			
		} catch (error) {
			console.log(error);
			toast.error("Wrong Password");
		}

	};

	return (
		<div>
			<Navbar />
			<div className="bg-gray-700 h-screen">
				<div className="w-full max-w-7xl mx-auto p-10 text-white">
					<h1 className="text-gray-300 text-4xl mb-6 lg:text-5xl text-center font-semibold ml-10 font-">
						Your Profile
					</h1>
					<form className="space-y-6 max-w-3xl mx-auto">
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-300"
							>
								Email
							</label>
							<input
								id="email"
								type="email"
								value={user.email}
								disabled
								className="mt-1 block w-full px-3 py-2 bg-gray-600 border border-gray-400 rounded-md text-white placeholder-gray-300 "
							/>
						</div>
						<div>
							<label
								htmlFor="username"
								className="block text-sm font-medium text-gray-300"
							>
								Username
							</label>
							<input
								id="username"
								type="text"
								placeholder={user.name}
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="mt-1 block w-full px-3 py-2 bg-gray-600 border border-gray-400 rounded-md text-white placeholder-gray-300"
							/>
						</div>
						<div>
							<label
								htmlFor="prevPassword"
								className="block text-sm font-medium text-gray-300"
							>
								Previous Password
							</label>
							<input
								id="prevPassword"
								type="text"
								className="mt-1 block w-full px-3 py-2 bg-gray-600 border border-gray-400 rounded-md text-white placeholder-gray-300"
								onChange={(e) =>
									setPrevPassword(e.target.value)
								}
							/>
						</div>
						<div>
							<label
								htmlFor="newPassword"
								className="block text-sm font-medium text-gray-300"
							>
								New Password
							</label>
							<input
								id="newPassword"
								type="password"
								className="mt-1 block w-full px-3 py-2 bg-gray-600 border border-gray-400 rounded-md text-white placeholder-gray-300"
								onChange={(e) => setNewPassword(e.target.value)}
							/>
						</div>
						<div>
							<label
								htmlFor="confirmPassword"
								className="block text-sm font-medium text-gray-300"
							>
								Confirm Password
							</label>
							<input
								id="confirmPassword"
								type="password"
								className="mt-1 block w-full px-3 py-2 bg-gray-600 border border-gray-400 rounded-md text-white placeholder-gray-300"
								onChange={(e) =>
									setConfirmPassword(e.target.value)
								}
							/>
						</div>
						<div className="w-full flex justify-end">
							<button
								className="bg-gradient-to-tr from-blue-600 to-pink-700 py-2 px-6 rounded-full font-semibold text-md"
								onClick={(e)=>{
									e.preventDefault();
									handleSave();
								}}
							>
								Save
							</button>
						</div>
					</form>
					<ToastContainer position="bottom-right"  />	
				</div>
			</div>
		</div>
	);
}

export default ProfilePage;
