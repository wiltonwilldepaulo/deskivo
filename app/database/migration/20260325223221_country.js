export function up(knex) {
    return knex.schema.createTable('country', (table) => {
        table.comment('Tabela de países disponíveis no sistema');
        // Chave primária auto-incremental (equivalente ao biginteger com identity)
        table.bigIncrements('id').primary();
        // Código do país (ex: BR, US, PT)
        table.text('codigo').nullable();
        // Nome do país
        table.text('nome').nullable();
        // Localização / região geográfica
        table.text('localizacao').nullable();
        // Língua oficial do país
        table.text('lingua').nullable();
        // Moeda utilizada no país
        table.text('moeda').nullable();
        // Data e hora de criação do registro — preenchida automaticamente
        table.timestamp('criado_em', { useTz: false })
            .defaultTo(knex.fn.now())
            .comment('Data e hora de criação do registro');
        // Data e hora da última atualização — atualizada automaticamente via trigger
        table.timestamp('atualizado_em', { useTz: false })
            .defaultTo(knex.fn.now())
            .comment('Data e hora da última atualização do registro');
    });
}

export function down(knex) {
    return knex.schema.dropTable('country');
}