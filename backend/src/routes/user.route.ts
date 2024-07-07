import { sign, verify } from "hono/jwt";
import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { PrismaClient } from "@prisma/client/edge";
import { SigninInput, SignupInput } from "@neautrino/postpulse";
import { authMiddleware } from "../middleware";

const userRoutes = new Hono<{
	Bindings: {
		JWT_SECRET: string;
	};
	Variables: {
		prisma: PrismaClient;
		userId: string;
	};
}>();

// get current user details
userRoutes.get("/me",authMiddleware, async (c) => {

	const userId = c.get("userId");
	const prisma = c.get("prisma");

	try {
		const user = await prisma.user.findUnique({
			where: { id: userId },

			include: {
				posts: {
					select: {
						id: true,
						title: true,
						content: true,
						deleted: true,
					}
				}
			}
		});

		if (!user) {
			c.status(404);
			return c.json({ error: "User not found" });
		}
		const {password, ...rest} = user;
		return c.json(rest);

	} catch (error) {
		c.status(500);
		return c.json({ error: "Internal server error fetching user" });
	}
});

// get user posts
userRoutes.get("/posts/me", authMiddleware, async (c) => {
	const userId = c.get("userId");
	const prisma = c.get("prisma");

	try {
		const user = await prisma.user.findUnique({
			where: { id: userId },
			include: { posts: true },
		});

		if (!user) {
			c.status(404);
			return c.json({ error: "User not found" });
		}

		return c.json(user.posts);
	} catch (error) {
		c.status(500);
		return c.json({ error: "Internal server error fetching user posts" });
	}
});

// signup user
userRoutes.post("/signup", async (c) => {
	const prisma = c.get("prisma");

	try {
		const body = SignupInput.safeParse(await c.req.json());

		if (!body.success) {
			c.status(400);
			return c.json({
				msg: "Signup is invalid",
				error: body.error.errors,
			});
		}

		const { email, name, password } = body.data;

		if (!email || !password) {
			c.status(400);
			return c.json({ error: "Email and password are required" });
		}

		const existingUser = await prisma.user.findUnique({
			where: { email },
		});

		if (existingUser) {
			c.status(409);
			return c.json({ error: "User with this email already exists" });
		}

		const user = await prisma.user.create({
			data: {
				email: email,
				name: name || null,
				password: password,
			},
		});

		const token = await sign(
			{
				id: user.id,
				email: user.email,
				name: user.name,
			},
			c.env?.JWT_SECRET
		);

		setCookie(c, "token", token);

		return c.json({
			message: "User created successfully",
			token,
		});
	} catch (error) {
		console.error("Error in /signup:", error);
		if (error instanceof SyntaxError) {
			c.status(400);
			return c.json({ error: "Invalid JSON in request body" });
		}
		c.status(500);
		return c.json({ error: "Internal server error" });
	}
});

// signin user
userRoutes.post("/signin", async (c) => {
	const body = SigninInput.safeParse(await c.req.json());
	const prisma = c.get("prisma");

	try {
		if (!body.success) {
			c.status(400);
			return c.json({
				msg: "Signin is invalid",
				error: body.error.errors,
			});
		}

		const { email, password } = body.data;

		if (!email || !password) {
			c.status(400);
			return c.json({ error: "Email and password are required" });
		}

		const user = await prisma.user.findUnique({
			where: { email },
		});

		if (!user) {
			c.status(404);
			return c.json({ error: "User not found" });
		}

		if (password !== user.password) {
			c.status(401);
			return c.json({ error: "Invalid password" });
		}

		const token = await sign(
			{
				id: user.id,
				email: user.email,
				name: user.name,
			},
			c.env?.JWT_SECRET
		);

		setCookie(c, "token", token);

		return c.json({
			message: "Sign in successful",
			token,
		});
	} catch (error) {
		console.error("Error in /signin:", error);
		if (error instanceof SyntaxError) {
			c.status(400);
			return c.json({ error: "Invalid JSON in request body" });
		}
		c.status(500);
		return c.json({ error: "Internal server error" });
	}
});

userRoutes.put('/update', authMiddleware, async (c) => {
	const userId = c.get("userId");
	const prisma = c.get("prisma");

	try {
		const body = await c.req.json();
		const { name, prevpassword, newPassword } = body

		if (!prevpassword || !newPassword) {
			await prisma.user.update({
				where: {id: userId},
				data: {name}
			})
		}else {
			const user = await prisma.user.findUnique({where: {id: userId}});
			if (user?.password !== prevpassword) {
			  c.status(400);
			  return c.json({ error: "Incorrect previous password" });
			}
			await prisma.user.update({
			  where: {id: userId},
			  data: {name, password: newPassword}
			});
		  }

		
		return c.json({
			message: "User updated successfully"
		});
	} catch (error) {
		console.error("Error in /update:", error);
		if (error instanceof SyntaxError) {
			c.status(400);
			return c.json({ error: "Invalid JSON in request body" });
		}
		c.status(500);
		return c.json({ error: "Internal server error" });
	}
	
});

export default userRoutes;
