import { CreateBlogInput, UpdateBlogInput } from "@neautrino/postpulse";
import { PrismaClient } from "@prisma/client/edge";
import { Hono } from "hono";
import { authMiddleware } from "../middleware";

const postRoutes = new Hono<{
    Variables: {
        prisma: PrismaClient;
        userId: string;
    };
}>();

// get post by title in descending order of createDate and all the comments with the descending order of createDate
postRoutes.get("/search", async (c)=>{
    const title = c.req.query("title");
	const prisma = c.get("prisma");

	try {
		const post = await prisma.post.findMany({
			where: {
				title: {
					contains: title,
					mode: "insensitive",
				}
			},
			orderBy: {
				createdAt: "desc",
			},
			include: {
				comments: {
					orderBy: {
						createdAt: "desc",
					},
				},
			},
		});

		if (!post) {
			c.status(404);
			return c.json({ error: "Post not found" });
		}

		return c.json(post);
	} catch (error) {
		c.status(500);
		return c.json({ error: "Server Error on post fetch" });
	}
});

// get all posts
postRoutes.get("/", async (c)=>{
	console.log("get all posts");
    const prisma = c.get("prisma");

	try {
		const posts = await prisma.post.findMany({
			where: {
				deleted: false,
			},
			orderBy: {
				createdAt: "desc",
			},
			include: {
				author: {
					select: {
						name: true,
					},
				},
				comments: {
					orderBy: {
						createdAt: "desc",
					},
					include:{
						author:{
							select:{
								name: true,
							}
						}
					}
				},
			},
		});

		return c.json({ posts });
	} catch (error) {
		c.status(500);
		return c.json({ error: "Server Error on post fetch" });
	}
});

// get post by id
postRoutes.get("/:id", async (c)=>{
	const postId = c.req.param("id");
	const prisma = c.get("prisma");

	try {
		const post = await prisma.post.findUnique({
			where: {
				id: Number(postId),
			},
			include: {
				comments: {
					orderBy: {
						createdAt: "desc",
					},
					include:{
						author:{
							select:{
								name: true,
							}
						}
					}
				},
			},
		});

		if (!post) {
			c.status(404);
			return c.json({ error: "Post not found" });
		}

		return c.json(post);
	} catch (error) {
		c.status(500);
		return c.json({ error: "Server Error on post fetch" });
	}
});

// create post
postRoutes.post("/new",authMiddleware, async (c)=>{
    const userId = c.get("userId");
	const prisma = c.get("prisma");

	try {
		const body = CreateBlogInput.safeParse(await c.req.json());
		if (!body.success) {
			c.status(400);
			return c.json({ msg: "Wrong Blog input error", error: body.error });
		}

		console.log(body.data);

		const {title, content} = body.data;

		if (!title || !content) {
			c.status(400);
			return c.json({ error: "Title and content are required" });
		}

		const post = await prisma.post.create({
			data: {
				title,
				content,
				authorId: userId,
			},
		});

		return c.json(post);
	} catch (error) {
		c.status(500);
		return c.json({ error: "Server Error on Blog creation" });
	}
});

// update post by id
postRoutes.put("/:id",authMiddleware, async(c)=>{
    const userId = c.get("userId");
	const postId = parseInt(c.req.param("id"));
	const prisma = c.get("prisma");

	try {
		const body = UpdateBlogInput.safeParse(await c.req.json());

		if(!body.success){
			c.status(400);
			return c.json({ msg: "Wrong Blog input error", error: body.error });
		}

		const { title, content } = body.data;

		const post = await prisma.post.findUnique({
			where: {
				id: postId,
				authorId: userId,
			},
		});

		if (!post) {
			c.status(404);
			return c.json({ error: "Post not found" });
		}

		const updatedPost = await prisma.post.update({
			where: {
				id: postId,
			},
			data: {
				title,
				content,
			},
		});

		return c.json({
			message: "Post updated successfully",
			updatedPost,
		});
	} catch (error) {
		c.status(500);
		return c.json({ error: "Server Error on Blog update" });
	}
});

// delete post by id
postRoutes.delete("/:id",authMiddleware, async (c)=>{
    const userId = c.get("userId");
	const postId = c.req.param("id");
	const prisma = c.get("prisma");

	try {
		const post = await prisma.post.findUnique({
			where: {
				id: Number(postId),
				authorId: userId,
			},
		});

		if (!post) {
			c.status(404);
			return c.json({ error: "Post not found" });
		}

		await prisma.post.update({
			where: {
				id: Number(postId),
			},
			data: {
				deleted: true,
			},
		});

		return c.json({ message: "Post deleted successfully" });
	} catch (error) {
		c.status(500);
		return c.json({ error: "Server Error on Blog delete" });
	}
});


export default postRoutes;