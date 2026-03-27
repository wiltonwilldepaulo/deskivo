exports.up = function (knex) {
    return knex.schema.createTable('city', (table) => {
        table.comment('Tabela com os dados de todos os municípios do pais');
        table.bigIncrements('id').primary();
        table.bigInteger('id_uf');
        table.text('codigo').nullable();
        table.text('nome').nullable();
        // Data e hora de criação do registro — preenchida automaticamente
        table.timestamp('criado_em', { useTz: false })
            .defaultTo(knex.fn.now())
            .comment('Data e hora de criação do registro');
        // Data e hora da última atualização — atualizada automaticamente via trigger
        table.timestamp('atualizado_em', { useTz: false })
            .defaultTo(knex.fn.now())
            .comment('Data e hora da última atualização do registro');
        table.foreign('id_uf').references('id').inTable('federative_unit').onDelete('CASCADE').onUpdate('NO ACTION');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('city');
};
