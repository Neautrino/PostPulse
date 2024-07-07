"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCommentInput = exports.BlogActionInput = exports.UpdateBlogInput = exports.CreateBlogInput = exports.SigninInput = exports.SignupInput = void 0;
const zod_1 = require("zod");
// User-related types
exports.SignupInput = zod_1.z.object({
    email: zod_1.z.string().email(),
    name: zod_1.z.string().optional(),
    password: zod_1.z.string().min(6)
});
exports.SigninInput = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6)
});
// Blog-related types
exports.CreateBlogInput = zod_1.z.object({
    title: zod_1.z.string().min(1),
    content: zod_1.z.string().min(1)
});
exports.UpdateBlogInput = zod_1.z.object({
    title: zod_1.z.string().min(1).optional(),
    content: zod_1.z.string().min(1).optional()
});
exports.BlogActionInput = zod_1.z.object({
    action: zod_1.z.enum(["upvote", "downvote", "bookmark"])
});
// Comment-related types
exports.CreateCommentInput = zod_1.z.object({
    content: zod_1.z.string().min(1)
});
