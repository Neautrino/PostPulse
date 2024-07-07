import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

function Dashboard() {
	const [userPosts, setUserPosts] = useState<any[]>([]);

	useEffect(() => {
		const fetchUserPosts = async () => {
			try {
				const response = await axios.get(
					`${import.meta.env.VITE_API_URL}/users/posts/me`,
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem(
								"token"
							)}`,
						},
					}
				);

				setUserPosts(response.data);
			} catch (error) {
				console.log(error);
			}
		};

		fetchUserPosts();
	}, []);

	const handleDelete = async (postId: number) => {
    try {
        const response = await axios.delete(
            `${import.meta.env.VITE_API_URL}/posts/${postId}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );

        if (response.status === 200) {
          setUserPosts(prevPosts => 
              prevPosts.map(post => 
                  post.id === postId 
                      ? { ...post, deleted: true } 
                      : post
              )
          );
          toast.success('Post deleted successfully');
      } else {
          toast.error('Failed to delete post');
      }
      
    } catch (error) {
        console.error("Error deleting post:", error);
        toast.error('An error occurred while deleting the post');
    }
};
	return (
		<div>
			<Navbar />
			<div className="bg-gray-700 min-h-screen">
				<div className="w-full max-w-7xl mx-auto p-10 text-white">
					<h1 className="font-serif text-gray-300 text-5xl text-center font-semibold ml-10 font-md border-b border-gray-400 pb-6">
						Dashboard
					</h1>
          <ToastContainer />
					<div className="p-10">
						<h1 className="text-2xl font-serif">
							Your Posts ({userPosts.length})
						</h1>
						<div className="max-w-5xl mx-auto my-6">
							{userPosts.map((post: any) => {
								return (
									<div
										key={post.id}
										className=" relative bg-gray-800 p-4 cursor-pointer overflow-hidden rounded-lg my-4 "
									>
										<Link to={`/post/${post.id}`}>
											<h1 className="text-xl font-serif">
												{post.title}
											</h1>
											<p className="text-gray-300">
												{post.content}
											</p>
										</Link>
										{!post.deleted && 
											<button
												onClick={(e) => {
													e.preventDefault();
													handleDelete(post.id);
												}}
												className=" text-sm px-2 py-1 rounded-md mt-4 bg-red-600"
											>
												Delete
											</button>
										}
										<div className="text-sm absolute bottom-0 right-0">
											{post.deleted ? (
												<p className="bg-red-600 p-2 text-sm">
													Deleted
												</p>
											) : (
												<p className="bg-green-600 p-2 text-sm">
													Active
												</p>
											)}
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Dashboard;
