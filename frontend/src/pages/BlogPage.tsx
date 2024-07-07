import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import {
	FaArrowAltCircleDown,
	FaArrowAltCircleUp,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import { IoMdSend } from "react-icons/io";


function BlogPage() {
	const url = window.location.href;
	const postId = url.split("/")[url.split("/").length - 1];
	const [post, setPost] = useState({});
	const [comments, setComments] = useState([]);

	useEffect(() => {
		const fetchPost = async () => {
			try {
				const res = await axios.get(
					`${import.meta.env.VITE_API_URL}/posts/${postId}`
				);
				setPost(res.data);
				setComments(res.data.comments || []);
			} catch (error) {
				console.error("Error fetching post:", error);
				toast.error("Failed to load post");
			}
		};
		fetchPost();
	}, [postId]);

	async function handleAction(postId: Number, action: string) {
		try {
			const response = await axios.post(
				`${import.meta.env.VITE_API_URL}/posts/${postId}/vote`,
				{
					action,
				}
			);

			console.log(response.data);

			if (response.status !== 200) {
				console.log("Error in action response");
			}

			const updatedPost = response.data;
			setPost(updatedPost);
		} catch (error) {
			toast.error("An error occured on updating action");
		}
	}

	return (
		<div className="h-auto bg-gray-900">
			<Navbar />
			<div className="max-w-5xl py-10 mx-auto">
				<div className=" rounded-lg p-10 bg-gray-700 mb-4 rounded-bl-none rounded-br-none	">
					<h1 className="text-4xl text-gray-200  font-semibold text-center underline">
						{post.title}
					</h1>
					<p className="text-xl text-gray-400 mt-10 mx-6">
						Lorem ipsum dolor sit amet consectetur adipisicing elit.
						Delectus nemo in iste consectetur quasi dolor placeat
						maiores qui sint nesciunt animi fuga ipsa aspernatur,
						tenetur voluptates sunt harum illo est labore numquam
						ducimus explicabo pariatur! Ad incidunt possimus,
						officiis temporibus eius nam expedita, dolorem ullam
						nisi, id dicta mollitia ipsum.
					</p>
					<p className="text-xl text-gray-400 mt-10 mx-6">
						Lorem ipsum dolor sit amet consectetur adipisicing elit.
						Delectus nemo in iste consectetur quasi dolor placeat
						maiores qui sint nesciunt animi fuga ipsa aspernatur,
						tenetur voluptates sunt harum illo est labore numquam
						ducimus explicabo pariatur! Ad incidunt possimus,
						officiis temporibus eius nam expedita, dolorem ullam
						nisi, id dicta mollitia ipsum.
					</p>
					<p className="text-xl text-gray-400 mt-10 mx-6">
						{post.content}
					</p>
				</div>
				<div className="bg-gray-700 w-full gap-8 px-10 py-2  rounded-lg rounded-tl-none rounded-tr-none text-white">
					<div className=" flex justify-between gap-4 ">
						<button
							className="flex justify-center items-center gap-2"
							onClick={(e) => {
								e.preventDefault();
								handleAction(post.id, "upvote");
							}}
						>
							<FaArrowAltCircleUp className="text-xl" />
							<p>{post.upvotes}</p>
						</button>
						<button
							onClick={(e) => {
								e.preventDefault();
								handleAction(post.id, "downvote");
							}}
							className="flex justify-center items-center gap-2"
						>
							<FaArrowAltCircleDown className="text-xl" />
							<p>{post.downvotes}</p>
						</button>
						<form className="flex items-center w-full">
							<textarea
								id="chat"
								rows={1}
								className="block mx-4 p-2.5 w-full text-md rounded-lg border dark:bg-gray-800 border-gray-600 placeholder-gray-400 text-white "
								placeholder="Your comment..."
							></textarea>
							<button
								type="submit"
								className="inline-flex justify-center rounded-full cursor-pointer text-2xl"
							>
								<IoMdSend />
							</button>
						</form>
					</div>
					<div className="ml-10 mb-10">
							{comments.length > 0 && (
								<ul className="mt-4">
									{comments.map((comment) => (
										<li
											key={comment.id}
											className="mb-2"
										>
											<h3 className="font-bold text-lg">
												{comment.author || "User"} :
											</h3>
											<p className="ml-6 ">{comment.content}</p>
										</li>
									))}
								</ul>
							)}
					</div>
				</div>
				<ToastContainer />
			</div>
		</div>
	);
}

export default BlogPage;
