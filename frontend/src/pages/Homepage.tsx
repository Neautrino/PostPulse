import Navbar from "../components/Navbar";
import Posts from "../components/Posts";

function Homepage() {
	return (
		<div className="flex flex-col min-h-screen">
			<Navbar />
			<main className="flex-grow bg-gray-700">
				<Posts />
			</main>
		</div>
	);
}

export default Homepage;
