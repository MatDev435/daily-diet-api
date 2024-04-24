import fastify from 'fastify'
import cookies from '@fastify/cookie'
import { authRoutes } from './routes/auth'
import jwt from '@fastify/jwt'
import { env } from './env'
import { mealsRoutes } from './routes/meals'
import { metricsRoutes } from './routes/metrics'

export const app = fastify()

app.register(cookies)
app.register(jwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'auth',
  },
})

app.register(authRoutes, {
  prefix: 'auth',
})

app.register(mealsRoutes, {
  prefix: 'meals',
})

app.register(metricsRoutes, {
  prefix: 'metrics',
})
