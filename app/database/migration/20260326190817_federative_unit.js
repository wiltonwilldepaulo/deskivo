exports.up = function (knex) {
    return knex.schema.createTable('federative_unit', (table) => {
        table.comment('Tabela de estados disponíveis no sistema');
        // Chave primária auto-incremental (equivalente ao biginteger com identity)
        table.bigIncrements('id').primary();
        //Código do pais
        table.bigInteger('id_pais');
        // Código da UF
        table.text('codigo').nullable();
        // Nome do país
        table.text('nome').nullable();
        // Localização / região geográfica
        table.text('sigla').nullable();
        // Data e hora de criação do registro — preenchida automaticamente
        table.timestamp('criado_em', { useTz: false })
            .notNullable()
            .defaultTo(knex.fn.now())
            .comment('Data e hora de criação do registro');
        // Data e hora da última atualização — atualizada automaticamente via trigger
        table.timestamp('atualizado_em', { useTz: false })
            .nullable()
            .defaultTo(knex.fn.now())
            .comment('Data e hora da última atualização do registro');
        table
            .foreign('id_pais')     // coluna local
            .references('id')       // coluna referenciada
            .inTable('country')     // tabela referenciada
            .onDelete('CASCADE')    // ao deletar o pai, deleta os filhos
            .onUpdate('NO ACTION'); // ao atualizar o pai, não faz nada
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('federative_unit');
};
