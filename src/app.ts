import fastify from 'fastify'
import cookies from '@fastify/cookie'
import { authRoutes } from './routes/auth'

export const app = fastify()

app.register(cookies)

app.register(authRoutes, {
  prefix: 'auth',
})
