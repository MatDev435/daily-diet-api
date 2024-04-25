import { describe, it, beforeAll, beforeEach, afterAll, expect } from 'vitest'
import { app } from '../src/app'
import { execSync } from 'node:child_process'
import request from 'supertest'

describe('📊 Metrics Routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('pnpm knex migrate:rollback --all')
    execSync('pnpm knex migrate:latest')
  })

  it('should be able to get all metrics', async () => {
    await request(app.server).post('/auth/sign-up').send({
      name: 'Matheus',
      email: 'matheus@example.com',
      password: 'test1234',
    })

    const signInResponse = await request(app.server)
      .post('/auth/sign-in')
      .send({
        email: 'matheus@example.com',
        password: 'test1234',
      })

    const cookies = signInResponse.get('Set-Cookie') as string[]

    await request(app.server).post('/meals').set('Cookie', cookies).send({
      title: 'Refeição teste 1',
      description: 'Descrição teste',
      date: '24/04/2024',
      time: '20:00',
      partOfDiet: true,
    })

    await request(app.server).post('/meals').set('Cookie', cookies).send({
      title: 'Refeição teste 2',
      description: 'Descrição teste',
      date: '24/04/2024',
      time: '20:00',
      partOfDiet: true,
    })

    await request(app.server).post('/meals').set('Cookie', cookies).send({
      title: 'Refeição teste 3',
      description: 'Descrição teste',
      date: '24/04/2024',
      time: '20:00',
      partOfDiet: true,
    })

    await request(app.server).post('/meals').set('Cookie', cookies).send({
      title: 'Refeição teste 4',
      description: 'Descrição teste',
      date: '24/04/2024',
      time: '20:00',
      partOfDiet: false,
    })

    await request(app.server).post('/meals').set('Cookie', cookies).send({
      title: 'Refeição teste 5',
      description: 'Descrição teste',
      date: '24/04/2024',
      time: '20:00',
      partOfDiet: true,
    })

    const metricsResponse = await request(app.server)
      .get('/metrics')
      .set('Cookie', cookies)
      .expect(200)

    expect(metricsResponse.body.metrics).toEqual(
      expect.objectContaining({
        totalMeals: 5,
        mealsWithinTheDiet: 4,
        mealsOutsideTheDiet: 1,
        bestStreak: 3,
      }),
    )
  })
})
