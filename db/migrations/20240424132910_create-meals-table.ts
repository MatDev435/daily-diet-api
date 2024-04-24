import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    table.uuid('id').primary()
    table.uuid('user_id').notNullable()
    table.foreign('user_id').references('id').inTable('users')
    table.text('title').notNullable()
    table.text('description')
    table.text('date').notNullable()
    table.text('time').notNullable()
    table.boolean('part_of_diet').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals')
}
