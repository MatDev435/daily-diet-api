import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import bcrypt from 'bcryptjs'

export async function authRoutes(app: FastifyInstance) {
  app.post('/sign-up', async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string().min(2),
      email: z.string().email(),
      password: z.string().min(8),
    })

    const { name, email, password } = createUserBodySchema.parse(request.body)

    const user = await knex('users').where({ email }).first()

    if (user) {
      return reply.status(409).send({ message: 'User already exists.' })
    }

    const salt = await bcrypt.genSalt(10)

    const hashedPassword = await bcrypt.hash(password, salt)

    await knex('users').insert({
      id: randomUUID(),
      name,
      email,
      password: hashedPassword,
    })

    return reply.status(201).send()
  })

  app.post('/sign-in', async (request, reply) => {
    const signInBodySchema = z.object({
      email: z.string().email(),
      password: z.string().min(8),
    })

    const { email, password } = signInBodySchema.parse(request.body)

    const user = await knex('users')
      .where({
        email,
      })
      .returning(['password', 'id'])
      .first()

    if (!user) {
      return reply.status(404).send()
    }

    const matchedPassword = await bcrypt.compare(password, user.password)

    if (!matchedPassword) {
      return reply.status(401).send({ message: 'Invalid credencials.' })
    }

    const token = app.jwt.sign({ id: user.id })

    reply.setCookie('auth', token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return reply.send()
  })
}
