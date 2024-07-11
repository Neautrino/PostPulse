import { HiOutlinePlus, HiMenu } from "react-icons/hi";
import { FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userState } from "../utils/atoms";
import { useEffect, useRef, useState } from "react";
import { PiSignOutBold } from "react-icons/pi";
import { toast } from "react-toastify";
import { useFetchUser } from "../hooks/useFetchUser";
import Searchbar from "./Searchbar";

function Navbar() {
	const [user, setUser] = useRecoilState(userState);
	const [showPopup, setShowPopup] = useState(false);
	const [showMobileMenu, setShowMobileMenu] = useState(false);
	const popupRef = useRef<HTMLDivElement | null>(null);
	const { fetchUser } = useFetchUser();
	const navigate = useNavigate();

	useEffect(() => {
		fetchUser();
	}, [fetchUser]);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				popupRef.current &&
				!popupRef.current.contains(event.target as Node)
			) {
				setShowPopup(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const togglePopup = () => {
		setShowPopup(!showPopup);
	};

	const toggleMobileMenu = () => {
		setShowMobileMenu(!showMobileMenu);
	};

	const logout = async () => {
		await toast.promise(
			async () => {
				localStorage.clear();
				setUser({
					id: "",
					email: "",
					name: "",
					bookmarks: [],
					createdAt: new Date(),
					isAuth: false,
					posts: [],
				});
			},
			{
				pending: "Logging out...",
				success: "Logged out successfully",
				error: "Failed to logout",
			}
		);

		setTimeout(() => {
			navigate("/");
		}, 2000);
	};

	return (
		<nav className="bg-gray-900 border-b border-gray-700">
			<div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-24">
					<div className="flex items-center gap-8 flex-1">
						<div className="flex-shrink-0">
							<Link
								className="text-3xl font-bold text-stone-200"
								to={"/"}
							>
								PostPulse
							</Link>
						</div>
						<div className="lg:ml-6 flex-1 max-w-xs">
							<Searchbar />
						</div>
					</div>

					{/* Mobile menu button */}
					<div className="lg:hidden">
						<button
							onClick={toggleMobileMenu}
							className="text-white hover:text-gray-300 p-2"
						>
							<HiMenu className="h-6 w-6" />
						</button>
					</div>

					{/* Desktop menu */}
					<div className="hidden lg:flex items-center justify-end ml-4">
						{/* Middle side buttons */}
						<div className="flex items-center mr-4">
							<div className="items-center py-2 overflow-hidden rounded-lg border">
								<Link
									className="border-r px-6 text-base font-medium text-white"
									to={"/"}
								>
									Home
								</Link>
								<Link
									className="px-6 text-base font-medium text-white"
									to={"/dashboard"}
								>
									Dashboard
								</Link>
							</div>
						</div>

						{/* Right side buttons */}
						<div className="flex items-center">
							{localStorage.getItem("isAuth") ? (
								<>
									<Link to={"/new"}>
										<button className="inline-flex items-center px-4 py-2 text-sm gap-1 font-medium rounded-full shadow-sm text-white bg-gradient-to-tr to-pink-700 from-blue-600 hover:bg-gradient-to-tr hover:to-pink-600 hover:from-blue-500 transition duration-200 ease-in-out">
											<HiOutlinePlus />
											Write
										</button>
									</Link>
									<div
										className="relative"
										ref={popupRef}
									>
										<button
											type="button"
											className="ml-3 cursor-pointer flex items-center bg-gray-800 px-4 py-2 rounded-full"
											onClick={togglePopup}
										>
											<FaUserCircle className="h-6 w-6 text-white" />
											<span className="ml-2 text-md font-medium text-white">
												{user.name || "User"}
											</span>
										</button>

										{/* PopUpbar */}
										{showPopup && (
											<div className="absolute right-0 mt-4 w-48 bg-gray-900 border border-gray-200 rounded-lg text-gray-300 overflow-hidden z-10">
												<Link
													to="/profile"
													className="block px-4 py-2  hover:bg-gray-700"
												>
													Profile
												</Link>
												<Link
													to="/dashboard"
													className="block px-4 py-2 hover:bg-gray-700"
												>
													Dashboard
												</Link>
												<button
													onClick={logout}
													className="flex w-full items-center gap-2 text-md text-left px-4 py-2  hover:bg-gray-700"
												>
													<p>Logout</p>
													<PiSignOutBold />
												</button>
											</div>
										)}
									</div>
								</>
							) : (
								<div className="items-center py-2 bg-gradient-to-tr to-pink-700 from-blue-600 hover:bg-gradient-to-tr hover:to-pink-600 hover:from-blue-500 transition duration-200 ease-in-out overflow-hidden rounded-full border">
									<Link
										className="border-r px-6 text-base font-medium text-white "
										to="/signup"
									>
										SignUp
									</Link>
									<Link
										className="px-6 text-base font-medium text-white "
										to="/signin"
									>
										SignIn
									</Link>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Mobile menu */}
			{showMobileMenu && (
				<div className="lg:hidden">
					<div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
						<Link
							to="/"
							className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
						>
							Home
						</Link>
						<Link
							to="/dashboard"
							className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
						>
							Dashboard
						</Link>
						{localStorage.getItem("isAuth") ? (
							<>
								<Link
									to="/new"
									className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
								>
									Write
								</Link>
								<Link
									to="/profile"
									className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
								>
									Profile
								</Link>
								<button
									onClick={logout}
									className="w-full flex  text-left items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
								>
									Logout
									<PiSignOutBold />
								</button>
							</>
						) : (
							<>
								<Link
									to="/signup"
									className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
								>
									SignUp
								</Link>
								<Link
									to="/signin"
									className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
								>
									SignIn
								</Link>
							</>
						)}
					</div>
				</div>
			)}
		</nav>
	);
}

export default Navbar;