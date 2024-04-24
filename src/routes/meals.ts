import { FastifyInstance } from 'fastify'
import { authenticate } from '../middlewares/auth'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'

export async function mealsRoutes(app: FastifyInstance) {
  app.post(
    '/',
    {
      preHandler: [authenticate],
    },
    async (request, reply) => {
      const createMealBodySchema = z.object({
        name: z.string(),
        description: z.string().nullable(),
        createdAt: z.string().nullable(),
        partOfDiet: z.boolean(),
      })

      const { name, description, createdAt, partOfDiet } =
        createMealBodySchema.parse(request.body)

      const userId = request.user.id

      await knex('meals').insert({
        id: randomUUID(),
        user_id: userId,
        name,
        description: description ?? null,
        created_at: createdAt ?? null,
        part_of_diet: partOfDiet,
      })

      return reply.status(201).send()
    },
  )

  app.get(
    '/',
    {
      preHandler: [authenticate],
    },
    async (request, reply) => {
      const userId = request.user.id

      const meals = await knex('meals').select().where({ user_id: userId })

      if (meals.length === 0) {
        return reply.status(404).send()
      }

      return reply.send({ meals })
    },
  )

  app.get(
    '/:id',
    {
      preHandler: [authenticate],
    },
    async (request, reply) => {
      const paramsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = paramsSchema.parse(request.params)

      const userId = request.user.id

      const meal = await knex('meals')
        .select()
        .where({ id, user_id: userId })
        .first()

      if (!meal) {
        return reply.status(404).send({ message: 'Meal not found!' })
      }

      return reply.send({ meal })
    },
  )
}
