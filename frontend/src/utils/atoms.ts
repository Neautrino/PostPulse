import { atom, selector } from "recoil";

interface Comment {
	id: number;
	content: string;
	createdAt: Date;
	deleted: boolean;
	deletedAt: Date;
	authorId: string;
	postId: number;
	author: {name : ""};
}

interface Post {
	id: number;
	title: string;
	content: string;
	createdAt: Date;
	deleted: boolean;
	deletedAt: Date;
	authorId: string;
	upvotes: number;
	downvotes: number;
	votes: any;
	comments: Comment[];
	author: {name : ""};
}

export const userState = atom({
	key: "userState",
	default: {
		id: "",
		email: "",
		name: "",
		bookmarks: [] as number[],
		isAuth: false,
		createdAt: new Date(),
		posts: [] as Post[],
		
	},
});

export const commentState = atom<Comment>({
	key: "commentState",
	default: {
		id: 0,
		content: "",
		createdAt: new Date(),
		deleted: false,
		deletedAt: new Date(),
		authorId: "",
		postId: 0,
		author: { name: "" },
	},
});

export const postsLoadingState = atom({
	key: "postsLoadingState",
	default: false,
});

export const postState = atom<Post[]>({
	key: "postState",
	default: [],
});

export const searchQueryState = atom({
	key: "searchQueryState",
	default: "",
});

export const filteredPostsSelector = selector({
	key: "filteredPostsSelector",
	get: ({ get }) => {
		const posts = get(postState);
		const searchQuery = get(searchQueryState);

		if (!Array.isArray(posts)) {
			console.error("Posts is not an array:", posts);
			return [];
		}

		if (!searchQuery.trim()) {
			return posts;
		}

		return posts.filter((post) =>
			post.title.toLowerCase().includes(searchQuery.toLowerCase())
		);
	},
});
