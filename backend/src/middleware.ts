import { Context, Next } from "hono";
import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

export async function authMiddleware(c: Context, next: Next) {
    const token = c.req.header("Authorization")?.split(" ")[1];

    if (!token) {
        console.log("No token found");
        c.status(401);
        return c.json({token, error: "Sign In required" });
    }
    
    try {
        const payload = await verify(token, c.env?.JWT_SECRET);
        c.set("userId", payload.id);
    } catch (error) {
        c.status(401);
        return c.json({ error: "Unauthorized" });
    }

    await next();
}

export async function prismaMiddleware(c: Context, next: Next) {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());
    c.set("prisma", prisma);
    await next();
}