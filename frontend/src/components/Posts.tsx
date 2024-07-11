import {
	FaArrowAltCircleDown,
	FaArrowAltCircleUp,
	FaRegCommentDots,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useRecoilState, useRecoilValue } from "recoil";
import {
	filteredPostsSelector,
	postsLoadingState,
	postState,
} from "../utils/atoms";
import { useFetchPosts } from "../hooks/useFetchPosts";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Posts() {
	const [, setPosts] = useRecoilState(postState);
	const filteredPosts = useRecoilValue(filteredPostsSelector);
	const isLoading = useRecoilValue(postsLoadingState);
	const { fetchPosts } = useFetchPosts();
	const navigate = useNavigate();

	useEffect(() => {
		fetchPosts();
	}, [fetchPosts]);

	const handleAction = async (postId: number, action: string) => {
		try {
			const response = await axios.post(
				`${import.meta.env.VITE_API_URL}/posts/${postId}/action`,
				{
					action,
				},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem(
							"token"
						)}`,
					},
				}
			);

			if (response.status === 200) {
				toast.success("Action successful");
				// Update the local state to reflect the change
				setPosts((prevPosts) =>
					prevPosts.map((post) =>
						post.id === postId
							? {
									...post,
									upvotes: response.data.post.upvotes,
									downvotes: response.data.post.downvotes,
							  }
							: post
					)
				);
			}
		} catch (error) {
			toast.error("Please login to perform action");
		}
	};

	return (
		<div className="bg-gray-700 min-h-full">
			<div className="w-full max-w-5xl mx-auto p-4 lg:p-10">
				{isLoading ? (
					<div
						role="status"
						className="max-w-xl animate-pulse h-screen"
					>
						<div className="h-2.5 bg-gray-400 rounded-full w-48 mb-4"></div>
						<div className="h-2 bg-gray-400 rounded-full max-w-[500px] mb-4"></div>
						<div className="h-2 bg-gray-400 rounded-full mb-4"></div>
						<div className="h-2 bg-gray-400 rounded-full max-w-[330px] mb-4"></div>
						<div className="h-2 bg-gray-400 rounded-full max-w-[300px] mb-4"></div>
						<div className="h-2 bg-gray-400 rounded-full max-w-[360px] mb-8"></div>
						<div className="h-4 bg-gray-400 rounded-full w-48 mb-4"></div>
						<div className="h-2 bg-gray-400 rounded-full max-w-[500px] mb-4"></div>
						<div className="h-2 bg-gray-400 rounded-full mb-4"></div>
						<div className="h-2 bg-gray-400 rounded-full max-w-[330px] mb-4"></div>
						<div className="h-2 bg-gray-400 rounded-full max-w-[300px] mb-4"></div>
						<div className="h-2 bg-gray-400 rounded-full max-w-[360px]"></div>
						<span className="sr-only">Loading...</span>
					</div>
				) : (
					<ul>
						{filteredPosts.map((post) => (
							<li key={post.id}>
								<div className="w-full border border-gray-500 cursor-pointer bg-gray-800 text-white mb-6 lg:mb-10 rounded-lg">
									<div className="w-full px-4 lg:px-8 py-4 lg:py-6">
										<div
											onClick={(e) => {
												e.preventDefault();
												navigate(`/post/${post.id}`);
											}}
										>
											<div className="flex flex-col lg:flex-row lg:items-center gap-2 mb-4">
												<h2 className="text-xl lg:text-2xl font-semibold">
													{post.title.length > 50
														? `${post.title[0].toUpperCase()}${post.title.slice(
																1,
																20
														  )}...`
														: `${post.title[0].toUpperCase()}${post.title.slice(
																1
														  )}`}
												</h2>
												<span className="hidden lg:inline text-2xl text-gray-500">
													.
												</span>
												<p className="text-sm lg:text-base">
													<span className="rounded-full py-1 px-2 bg-gray-600 mr-2 text-white">
														{post.author.name[0]}
													</span>
													{post.author.name}
												</p>
											</div>
											<p className="text-sm lg:text-md text-gray-300">
												{post.content.length > 200
													? post.content.slice(0, 200)
													: post.content}
												...
											</p>
										</div>
										<div className="mt-6 lg:mt-8 flex flex lg:flex-row justify-between w-full gap-4 lg:gap-8">
											<div className="flex justify-center items-center gap-2">
												<FaRegCommentDots className="text-lg lg:text-xl" />
												<p className="text-sm lg:text-base">
													Latest Comments...
												</p>
											</div>
											<div className="flex justify-center lg:justify-end gap-6 lg:gap-10">
												<button
													className="flex justify-center items-center gap-2"
													onClick={(e) => {
														e.preventDefault();
														handleAction(
															post.id,
															"upvote"
														);
													}}
												>
													<FaArrowAltCircleUp className="text-lg lg:text-xl" />
													<p>{post.upvotes}</p>
												</button>
												<button
													onClick={(e) => {
														e.preventDefault();
														handleAction(
															post.id,
															"downvote"
														);
													}}
													className="flex justify-center items-center gap-2"
												>
													<FaArrowAltCircleDown className="text-lg lg:text-xl" />
													<p>{post.downvotes}</p>
												</button>
											</div>

											
										</div>
										<div>
										<ul>
												{post.comments
													?.slice(0, 2)
													.map((comment) => (
														<div
															key={comment?.id}
															className="mt-2 ml-2 text-sm lg:text-base"
														>
															{
																comment.author
																	.name
															}{" "}
															:
															<li className="ml-4">
																{
																	comment?.content
																}
															</li>
														</div>
													))}
											</ul>
										</div>
									</div>
								</div>
							</li>
						))}
					</ul>
				)}
			</div>
			<ToastContainer position="bottom-right" />
		</div>
	);
}

export default Posts;
