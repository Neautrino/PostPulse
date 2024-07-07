import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { authMiddleware, prismaMiddleware } from './middleware'
import userRoutes from './routes/user.route'
import postRoutes from './routes/post.route'
import commentRoutes from './routes/comment.route'
import actionRoutes from './routes/action.route'
import { cors } from 'hono/cors'

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
    prisma: PrismaClient;
  };
}>().basePath('/api/v1')

app.use(cors(
  {
    origin: '*',
  }
))
app.use(prismaMiddleware)

app.route('/users', userRoutes)
app.route('/posts', postRoutes)
app.route('/posts', commentRoutes)
app.route('/posts', actionRoutes)




export default app