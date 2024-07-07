import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { authMiddleware } from "../middleware";

const commentRoutes = new Hono<{
    Variables: {
        prisma: PrismaClient;
        userId: string;
    };

}>();

commentRoutes.use(authMiddleware);

// get all the comments on a post by id
commentRoutes.get("/:id/comments", async(c)=>{
    const prisma = c.get("prisma");
    const postId = c.req.param("id");

    try {
        const post = await prisma.post.findUnique({
            where: {
                id: Number(postId)
            },
            include: { 
                comments: true
            }
        })

        if(!post){
            c.status(404);
            return c.json({error: "Post not found"});
        }

        return c.json(post.comments);
    } catch (error) {
        c.status(500);
        return c.json({error: "Server Error on comment fetch"});
    }
});

// create comment on a post 
commentRoutes.post("/:id/comments", async(c)=>{
    const userId = c.get("userId");
    const postId = parseInt(c.req.param("id"));
    const prisma = c.get("prisma");
    try {
        const { content } = await c.req.json();

        if (!content) {
            c.status(400);
            return c.json({ error: "Comment content is required" });
        }

        const post = await prisma.post.findUnique({
            where: { id: postId },
            select: { title: true }
        });

        if (!post) {
            c.status(404);
            return c.json({ error: "Post not found" });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { name: true }
        });

        if (!user) {
            c.status(404);
            return c.json({ error: "User not found" });
        }

        const comment = await prisma.comment.create({
            data: {
                content,
                authorId: userId,
                postId,
            },
            include: {
                author: {
                    select: { name: true }
                }
            }
        });

        return c.json(
            {comment, message: "Comment created successfully"}
        );
    } catch (error) {
        console.error("Error creating comment:", error);
        c.status(500);
        return c.json({ error: "Server Error on Comment creation" });
    }
});

// delete comment on a post
commentRoutes.delete("/:id/comments/:commentId", async(c)=>{
    const userId = c.get("userId");
	const postId = parseInt(c.req.param("id"));
	const commentId = parseInt(c.req.param("commentId"));
	const prisma = c.get("prisma");

	try {
		const comment = await prisma.comment.findUnique({
			where: {
				id: commentId,
				authorId: userId,
			},
		});

		if (!comment) {
			c.status(404);
			return c.json({ error: "Comment not found" });
		}

		await prisma.comment.delete({
			where: {
				id: commentId,
			},
		});

		return c.json({ message: "Comment deleted successfully" });
	} catch (error) {
		c.status(500);
		return c.json({ error: "Server Error on Comment delete" });
	}
});

// Implement the handler functions here

export default commentRoutes;