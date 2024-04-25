import { describe, it, beforeAll, beforeEach, afterAll, expect } from 'vitest'
import { app } from '../src/app'
import { execSync } from 'node:child_process'
import request from 'supertest'

describe('🍴 Meals Routes', () => {
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

  it('sahould be able to create a meal', async () => {
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

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        title: 'Refeição teste',
        description: 'Descrição teste',
        date: '24/04/2024',
        time: '20:00',
        partOfDiet: true,
      })
      .expect(201)
  })

  it('should be able to list all meals', async () => {
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
      title: 'Refeição teste',
      description: 'Descrição teste',
      date: '24/04/2024',
      time: '20:00',
      partOfDiet: true,
    })

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)

    expect(listMealsResponse.body.meals).toEqual([
      expect.objectContaining({
        title: 'Refeição teste',
        description: 'Descrição teste',
      }),
    ])
  })

  it('should be able to get a specific meal', async () => {
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
      title: 'Refeição teste',
      description: 'Descrição teste',
      date: '24/04/2024',
      time: '20:00',
      partOfDiet: true,
    })

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)

    const mealId = listMealsResponse.body.meals[0].id

    const mealResponse = await request(app.server)
      .get(`/meals/${mealId}`)
      .set('Cookie', cookies)

    expect(mealResponse.body.meal).toEqual(
      expect.objectContaining({
        title: 'Refeição teste',
        description: 'Descrição teste',
      }),
    )
  })

  it('should be able to update a meal', async () => {
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
      title: 'Refeição teste',
      description: 'Descrição teste',
      date: '24/04/2024',
      time: '20:00',
      partOfDiet: true,
    })

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)

    const mealId = listMealsResponse.body.meals[0].id

    await request(app.server)
      .put(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .send({
        title: 'Novo título',
        description: 'Nova descrição',
        date: '24/04/2024',
        time: '20:30',
        partOfDiet: false,
      })
      .expect(204)
  })

  it('should be able to delete a meal', async () => {
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
      title: 'Refeição teste',
      description: 'Descrição teste',
      date: '24/04/2024',
      time: '20:00',
      partOfDiet: true,
    })

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)

    const mealId = listMealsResponse.body.meals[0].id

    await request(app.server)
      .delete(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .expect(204)
  })
})
