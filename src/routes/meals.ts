import { FastifyInstance } from 'fastify'
import { authenticate } from '../middlewares/auth'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'
import { createDeflate } from 'node:zlib'

export async function mealsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authenticate)

  app.post('/', async (request, reply) => {
    const createMealBodySchema = z.object({
      title: z.string(),
      description: z.string().nullable(),
      date: z.string(),
      time: z.string(),
      partOfDiet: z.boolean(),
    })

    const { title, description, date, time, partOfDiet } =
      createMealBodySchema.parse(request.body)

    const userId = request.user.id

    await knex('meals').insert({
      id: randomUUID(),
      user_id: userId,
      title,
      description,
      date,
      time,
      part_of_diet: partOfDiet,
    })

    return reply.status(201).send()
  })

  app.get('/', async (request, reply) => {
    const userId = request.user.id

    const meals = await knex('meals').select().where({ user_id: userId })

    if (meals.length === 0) {
      return reply.status(404).send()
    }

    return reply.send({ meals })
  })

  app.get('/:id', async (request, reply) => {
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
  })

  app.put('/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string(),
    })

    const updateMealBodySchema = z.object({
      title: z.string(),
      description: z.string().nullable(),
      date: z.string(),
      time: z.string(),
      partOfDiet: z.boolean(),
    })

    const { id } = paramsSchema.parse(request.params)

    const userId = request.user.id

    const { title, description, date, time, partOfDiet } =
      updateMealBodySchema.parse(request.body)

    const meal = await knex('meals').where({ id, user_id: userId }).first()

    if (!meal) {
      return reply.status(404).send({ message: 'Meal not found.' })
    }

    await knex('meals').select().where({ id, user_id: userId }).update({
      title,
      description,
      date,
      time,
      part_of_diet: partOfDiet,
    })

    return reply.status(204).send()
  })

  app.delete('/:id', async (request, reply) => {
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
      return reply.status(404).send({ message: 'Meal not found.' })
    }

    await knex('meals').select().where({ id, user_id: userId }).first().delete()

    return reply.status(204).send()
  })
}
