exports.up = function (knex) {
    return knex.schema.createTable('federative_unit', (table) => {
        table.comment('Tabela com os dados de estado do Brasil');
        table.bigIncrements('id').primary();
        table.bigInteger('id_pais');
        table.text('codigo').nullable();
        table.text('nome').nullable();
        table.text('sigla').nullable();
        // Data e hora de criação do registro — preenchida automaticamente
        table.timestamp('criado_em', { useTz: false })
            .defaultTo(knex.fn.now())
            .comment('Data e hora de criação do registro');
        // Data e hora da última atualização — atualizada automaticamente via trigger
        table.timestamp('atualizado_em', { useTz: false })
            .defaultTo(knex.fn.now())
            .comment('Data e hora da última atualização do registro');

        table.foreign('id_pais').references('id').inTable('country').onDelete('CASCADE').onUpdate('NO ACTION');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('federative_unit');
};
