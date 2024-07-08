import { useState } from "react";
import Navbar from "../components/Navbar";
import { CreateBlogInput } from "@neautrino/postpulse";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useFetchPosts } from "../hooks/useFetchPosts";

function CreateBlog() {
	const [blog, setBlog] = useState({
		title: "",
		content: "",
	});

	const { fetchPosts } = useFetchPosts();

	const navigate = useNavigate();

	async function handleSubmit(
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) {
		e.preventDefault();

		if (blog.title === "" || blog.content === "") {
			toast.error("Please fill all fields");
			return;
		}

		const validData = CreateBlogInput.safeParse(blog);
		if (!validData.success) {
			toast.error("Invalid input data");
		}

		await toast.promise(
			async () => {
				const response = await axios.post(
					`${import.meta.env.VITE_API_URL}/posts/new`,
					blog,
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem(
								"token"
							)}`,
						},
					}
				);
				if (response.status === 200) {
					setBlog({ title: "", content: "" });
					fetchPosts();
					setTimeout(() => {
						navigate("/");
					}, 2000);
				}
			},
			{
				pending: "Creating your post...",
				success: "Post created successfully",
				error: "An error occurred. Please try again",
			}
		);
	}

	return (
		<div>
			<Navbar />
			<div className="bg-gray-700 min-h-screen">
				<div className="w-full max-w-7xl mx-auto p-10">
					<h1 className="text-5xl font-bold pb-6 border-b border-b-gray-300">
						<span className="bg-gradient-to-tr from-blue-600 to-pink-700 text-transparent bg-clip-text">
							Create your Post
						</span>
					</h1>
					<form>
						<div className="mt-6">
							<label
								htmlFor="title"
								className="block mb-2 text-2xl font-medium text-white"
							>
								Title
							</label>
							<textarea
								id="title"
								rows={2}
								className="block p-2.5 w-full text-lg rounded-lg border bg-gray-600 border-gray-600 placeholder-gray-300 text-white "
								placeholder="Enter your title here..."
								value={blog.title}
								onChange={(e) => {
									setBlog({ ...blog, title: e.target.value });
								}}
							></textarea>
						</div>
						<div className="mt-6">
							<label
								htmlFor="Content"
								className="block mb-2 text-2xl font-medium text-white"
							>
								Content
							</label>
							<textarea
								id="Content"
								rows={8}
								className="block p-2.5 w-full text-md rounded-lg border bg-gray-600 border-gray-600 placeholder-gray-300 text-white "
								placeholder="Write your thoughts here..."
								value={blog.content}
								onChange={(e) => {
									setBlog({
										...blog,
										content: e.target.value,
									});
								}}
							></textarea>
						</div>
						<div className="mt-6 w-full flex justify-end">
							<button
								type="submit"
								onClick={handleSubmit}
								className="w-36  text-white py-2 rounded-full bg-gradient-to-tr to-pink-700 from-blue-600 hover:bg-gradient-to-tr hover:to-pink-600 hover:from-blue-500 transition duration-200 ease-in-out"
							>
								Create
							</button>
						</div>
					</form>
				</div>
			</div>
			<ToastContainer  position="bottom-right"  />
		</div>
	);
}

export default CreateBlog;
