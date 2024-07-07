import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { BlogActionInput } from "@neautrino/postpulse";
import { authMiddleware } from "../middleware";

const actionRoutes = new Hono<{
	Variables: {
		prisma: PrismaClient;
		userId: string;
	};
}>();

actionRoutes.use(authMiddleware);

// upvote or downvote a post
actionRoutes.post("/:id/action", async (c) => {
    const userId = c.get("userId");
    const postId = parseInt(c.req.param("id"));
    const prisma = c.get("prisma");

    try {
        const body = BlogActionInput.safeParse(await c.req.json());

        if(!body.success){
            c.status(400);
            return c.json({ msg: "wrong Action", error: body.error.errors});
        }

        const {action} = body.data;

        const post = await prisma.post.findUnique({
            where: { id: postId },
        });

        if (!post) {
            c.status(404);
            return c.json({ error: "Post not found" });
        }

        const votes = post.votes ? JSON.parse(post.votes as string) : {};
        const userVote = votes[userId];

        if (userVote === action) {
            // User is trying to vote the same way again, so remove their vote
            delete votes[userId];
        } else {
            // Set or change the user's vote
            votes[userId] = action;
        }

        const upvotes = Object.values(votes).filter(v => v === "upvote").length;
        const downvotes = Object.values(votes).filter(v => v === "downvote").length;

        const updatedPost = await prisma.post.update({
            where: { id: postId },
            data: {
                votes: JSON.stringify(votes),
                upvotes: upvotes,
                downvotes: downvotes,
            },
        });

        return c.json({
            message: `Vote processed successfully`,
            post: updatedPost,
        });
    } catch (error) {
        console.error("Error processing vote:", error);
        c.status(500);
        return c.json({ error: "Server Error processing vote" });
    }
});

// bookmark a post
actionRoutes.post("/:id/bookmark", async (c) => {
    const userId = c.get("userId");
    const postId = Number(c.req.param("id"));
    const prisma = c.get("prisma");

    try {

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            c.status(404);
            return c.json({ error: "User not found" });
        }

        const post = await prisma.post.findUnique({
            where: { id: postId },
        });

        if (!post) {
            c.status(404);
            return c.json({ error: "Post not found" });
        } 

        let bookmarks = user.bookmarks || [];
        
        if (bookmarks.includes((postId))) {
            // Remove the bookmark if it exists
            bookmarks = bookmarks.filter(id => id !== postId);
        } else {
            // Add the bookmark if it doesn't exist
            bookmarks.push(postId);
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                bookmarks: bookmarks,
            },
        });

        return c.json({
            message: `Bookmark processed successfully`,
            user: updatedUser,
        });
    } catch (error) {
        c.status(500);
        return c.json({ error: "Server Error processing bookmark" });
    }
});


export default actionRoutes;
