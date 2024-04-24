import { FastifyInstance } from 'fastify'
import { knex } from '../database'

export async function authRoutes(app: FastifyInstance) {
  app.post('/sign-up', async () => {
    const users = await knex('users').select()

    return users
  })
}
