import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

interface Env {
  DATABASE_URL: string;
  // Add other environment variables as needed
}

interface CommentData {
  type: string;
  content: string;
  userId: string;
  postId: number;
}

interface BroadcastComment {
  id: number;
  content: string;
  authorName: string;
  postTitle: string;
  createdAt: Date;
}

export class CommentRoom {
  private state: DurableObjectState;
  private env: Env;
  private sessions: Set<WebSocket>;

  constructor(state: DurableObjectState, env: Env) {
    this.state = state;
    this.env = env;
    this.sessions = new Set();
  }

  handleSession(websocket: WebSocket): void {
    this.sessions.add(websocket);
    websocket.addEventListener("message", async (msg: MessageEvent) => {
      let data: CommentData = JSON.parse(msg.data);
      if (data.type === "comment") {
        const prisma = new PrismaClient({
          datasourceUrl: this.env.DATABASE_URL,
        }).$extends(withAccelerate());

        const comment = await prisma.comment.create({
          data: {
            content: data.content,
            authorId: data.userId,
            postId: data.postId,
          },
          include: {
            author: {
              select: { name: true }
            },
            post: {
              select: { title: true }
            }
          }
        });

        this.broadcast(JSON.stringify({
          type: "newComment",
          comment: {
            id: comment.id,
            content: comment.content,
            authorName: comment.author.name,
            postTitle: comment.post.title,
            createdAt: comment.createdAt
          } as BroadcastComment
        }));
      }
    });

    websocket.addEventListener("close", () => {
      this.sessions.delete(websocket);
    });
  }

  broadcast(message: string): void {
    this.sessions.forEach((session) => session.send(message));
  }
}