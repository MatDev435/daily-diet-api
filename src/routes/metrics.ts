import { FastifyInstance } from 'fastify'
import { authenticate } from '../middlewares/auth'
import { knex } from '../database'

export async function metricsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authenticate)

  app.get('/', async (request, reply) => {
    const userId = request.user.id

    const meals = await knex('meals')
      .select()
      .where({ user_id: userId })
      .orderBy('created_at', 'asc')

    const totalMeals = meals.length

    const totalMealsWithinDiet = meals.filter((meal) => meal.part_of_diet)

    const totalMealsOutsideDiet = meals.filter((meal) => !meal.part_of_diet)

    let bestStreak = 0
    let currentStreak = 0

    for (const meal of meals) {
      if (meal.part_of_diet) {
        currentStreak += 1

        if (currentStreak > bestStreak) {
          bestStreak = currentStreak
        }
      } else {
        currentStreak = 0
      }
    }

    console.log(totalMealsWithinDiet)

    return reply.send({
      totalMeals,
      mealsWithinTheDiet: totalMealsWithinDiet.length,
      mealsOutsideTheDiet: totalMealsOutsideDiet.length,
      bestStreak,
    })
  })
}
