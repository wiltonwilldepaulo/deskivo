export function up(knex) {
    return knex.schema.createTable('customer', (table) => {
        table.bigIncrements('id').primary();
        table.text('nome').notNullable();
        table.text('cpf');
        table.boolean('ativo').defaultTo(true);
        table.timestamps(true, true);
    });
}

export function down(knex) {
    return knex.schema.dropTable('customer');
}