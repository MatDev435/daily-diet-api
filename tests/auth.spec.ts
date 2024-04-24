import { describe, it, beforeAll, beforeEach, afterAll } from 'vitest'
import { app } from '../src/app'
import { execSync } from 'node:child_process'
import request from 'supertest'

describe('🔒 Auth Routes', () => {
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

  it('should be able to sign up', async () => {
    await request(app.server)
      .post('/auth/sign-up')
      .send({
        name: 'Matheus',
        email: 'matheus@example.com',
        password: 'test1234',
      })
      .expect(201)
  })

  it('should be able to sign in', async () => {
    await request(app.server).post('/auth/sign-up').send({
      name: 'Matheus',
      email: 'matheus@example.com',
      password: 'test1234',
    })

    await request(app.server)
      .post('/auth/sign-in')
      .send({
        email: 'matheus@example.com',
        password: 'test1234',
      })
      .expect(200)
  })
})
