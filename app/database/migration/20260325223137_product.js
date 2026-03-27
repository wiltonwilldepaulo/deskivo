exports.up = function (knex) {
    return knex.schema.createTable('product', (table) => {
        table.comment('Armazena os dados cadastrais dos produtos.');
        table.bigIncrements('id').primary();
        table.text('nome').notNullable();
        table.text('codigo_barra');
        table.text('unidade');
        table.decimal('preco_compra', 18, 4).defaultTo(0);
        table.decimal('preco_venda', 18, 4).defaultTo(0);
        table.text('descricao');
        table.boolean('ativo').defaultTo(true);
        table.boolean('excluido').defaultTo(false)
        // Data e hora de criação do registro — preenchida automaticamente
        table.timestamp('criado_em', { useTz: false })
            .defaultTo(knex.fn.now())
            .comment('Data e hora de criação do registro');
        // Data e hora da última atualização — atualizada automaticamente via trigger
        table.timestamp('atualizado_em', { useTz: false })
            .defaultTo(knex.fn.now())
            .comment('Data e hora da última atualização do registro');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('product');
};
