import { toast, ToastContainer } from "react-toastify";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaArrowAltCircleDown, FaArrowAltCircleUp } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";

function BlogPage() {
	const url = window.location.href;
	const postId = url.split("/")[url.split("/").length - 1];
	const [post, setPost] = useState({
		title: "",
		content: "",
		upvotes: 0,
		downvotes: 0,
		id: 0,
		comments: [{id: "", content: "", author: {name: ""}}],
	  });
	  const [comment, setComment] = useState({});

	  useEffect(() => {
		const fetchPost = async () => {
			try {
				const res = await axios.get(
					`${import.meta.env.VITE_API_URL}/posts/${postId}`
				);
				console.log(res.data.comments)
				setPost(res.data);
			} catch (error) {
				console.error("Error fetching post:", error);
				toast.error("Failed to load post");
			}
		};
		fetchPost();
	}, [postId ]);

	async function addComment(){
		try {
			const response = await axios.post(`${import.meta.env.VITE_API_URL}/posts/${postId}/comments`, {
				content: comment,
			}, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});
			if(response.status === 200){
				toast.success("Comment added successfully");
				setPost({...post, comments: [...post.comments, response.data.comment]})
				setComment("");
			}
		} catch (error: any) {
			console.error("Error adding comment:", error);
			if(error?.response.status === 401){
				toast.error("Please login first to comment");
			}
			else{
				toast.error("Failed to add comment");
			}
		}
	}

	async function handleAction(postId: Number, action: string) {
		try {
			const response = await axios.post(
				`${import.meta.env.VITE_API_URL}/posts/${postId}/action`,
				{
					action,
				},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				}
			);

			if (response.status !== 200) {
				console.log("Error in action response");
			}

			const updatedPost = response.data.post;
			setPost(prevPost => ({...prevPost, upvotes: updatedPost.upvotes, downvotes: updatedPost.downvotes}));
		} catch (error: any) {
			console.log("Error in action:", error);
			if(error?.response.status === 401){
				toast.error("Please login first to vote");
			}
			else{
				toast.error("Failed to perform action");
			}
		}
	}

	

	return (
		<div className="h-full bg-gray-900">
			<Navbar />
			<div className="max-w-5xl min-h-screen py-10 mx-auto">
				<div className=" rounded-lg p-10 bg-gray-700 mb-4 rounded-bl-none rounded-br-none	">
					<h1 className="text-4xl text-gray-200  font-semibold text-center underline">
						{post.title}
					</h1>
					<p className="text-xl text-gray-400 mt-10 mx-6" style={{ whiteSpace: 'pre-wrap' }}>
  {post.content.replace(/\n/g, '\n\n')}
</p>
				</div>
				<div className="bg-gray-700 w-full gap-8 px-10 py-2  rounded-lg rounded-tl-none rounded-tr-none text-white">
					{/* buttons section */}
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
								onChange={(e) => setComment(e.target.value)}
							></textarea>
							<button
								type="submit"
								className="inline-flex justify-center rounded-full cursor-pointer text-2xl"
								onClick={(e) => {
									e.preventDefault();
									addComment();
								}}
							>
								<IoMdSend />
							</button>
						</form>
					</div>
					{/* // comment section */}
					<div className="ml-10 mb-10">
						{post.comments.length > 0 && (
							<ul className="mt-4">
								{post.comments.map((comment) => (
									<li
										key={comment.id}
										className="mb-2"
									>
										<h3 className="font-bold text-lg">
											{comment.author?.name || "User"} :
										</h3>
										<p className="ml-6 ">
											{comment.content}
										</p>
									</li>
								))}
							</ul>
						 )} 
					</div>
				</div>
				<ToastContainer  position="bottom-right"  />
			</div>
		</div>
	);
}

export default BlogPage;
