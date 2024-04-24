// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      name: string
      email: string
      password: string
    }

    meals: {
      id: string
      user_id: string
      title: string
      description?: string | null
      date: string | null
      time: string
      part_of_diet: boolean
    }
  }
}
