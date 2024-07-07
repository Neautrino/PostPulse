import { z } from "zod";

// User-related types
export const SignupInput = z.object({
    email: z.string().email(),
    name: z.string().optional(),
    password: z.string().min(6,{message: "Password should atleast 6 character"})
});

export const SigninInput = z.object({
    email: z.string().email(),
    password: z.string().min(6, {message: "Password should atleast 6 character"})
});

// Blog-related types
export const CreateBlogInput = z.object({
    title: z.string().min(1),
    content: z.string().min(1)
});

export const UpdateBlogInput = z.object({
    title: z.string().min(1).optional(),
    content: z.string().min(1).optional()
});

export const BlogActionInput = z.object({
    action: z.enum(["upvote", "downvote"], { message: "Invalid action" }),
});

// Comment-related types
export const CreateCommentInput = z.object({
    content: z.string().min(1)
});

// Export the inferred types
export type SignupInput = z.infer<typeof SignupInput>;
export type SigninInput = z.infer<typeof SigninInput>;
export type CreateBlogInput = z.infer<typeof CreateBlogInput>;
export type UpdateBlogInput = z.infer<typeof UpdateBlogInput>;
export type BlogActionInput = z.infer<typeof BlogActionInput>;
export type CreateCommentInput = z.infer<typeof CreateCommentInput>;