import React, { useEffect, useState } from "react";
import { IoMdSearch } from "react-icons/io";
import { useDebounce } from "../hooks/useDebounce";
import { useRecoilState } from "recoil";
import { searchQueryState } from "../utils/atoms";

function Searchbar() {
	const [searchInput, setSearchInput] = useState("");
	const debouncedSearchQuery = useDebounce(searchInput, 300);
	const [, setSearchQuery] = useRecoilState(searchQueryState);

	useEffect(() => {
		setSearchQuery(debouncedSearchQuery);
	}, [debouncedSearchQuery, setSearchQuery]);

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchInput(e.target.value);
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// Perform search action here
	};

	return (
		<form onSubmit={handleSubmit} className="w-full">
			<div className="relative">
				<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
					<IoMdSearch className="text-gray-600" />
				</div>
				<input
					id="search"
					name="search"
					className="block w-full pl-10 pr-3 py-2 border font-medium border-gray-200 rounded-full leading-5 bg-gray-100 placeholder-gray-600 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 sm:text-md"
					placeholder="Search"
					type="search"
					value={searchInput}
					onChange={handleSearch}
				/>
				<button
					type="submit"
					className="absolute inset-y-0 right-0 pr-3 flex items-center"
				>
					<span className="sr-only">Search</span>
				</button>
			</div>
		</form>
	);
}

export default Searchbar;