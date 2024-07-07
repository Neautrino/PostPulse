import { z } from "zod";
export declare const SignupInput: z.ZodObject<{
    email: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    name?: string | undefined;
}, {
    email: string;
    password: string;
    name?: string | undefined;
}>;
export declare const SigninInput: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const CreateBlogInput: z.ZodObject<{
    title: z.ZodString;
    content: z.ZodString;
}, "strip", z.ZodTypeAny, {
    title: string;
    content: string;
}, {
    title: string;
    content: string;
}>;
export declare const UpdateBlogInput: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    content: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    title?: string | undefined;
    content?: string | undefined;
}, {
    title?: string | undefined;
    content?: string | undefined;
}>;
export declare const BlogActionInput: z.ZodObject<{
    action: z.ZodEnum<["upvote", "downvote", "bookmark"]>;
}, "strip", z.ZodTypeAny, {
    action: "upvote" | "downvote" | "bookmark";
}, {
    action: "upvote" | "downvote" | "bookmark";
}>;
export declare const CreateCommentInput: z.ZodObject<{
    content: z.ZodString;
}, "strip", z.ZodTypeAny, {
    content: string;
}, {
    content: string;
}>;
export type SignupInput = z.infer<typeof SignupInput>;
export type SigninInput = z.infer<typeof SigninInput>;
export type CreateBlogInput = z.infer<typeof CreateBlogInput>;
export type UpdateBlogInput = z.infer<typeof UpdateBlogInput>;
export type BlogActionInput = z.infer<typeof BlogActionInput>;
export type CreateCommentInput = z.infer<typeof CreateCommentInput>;
