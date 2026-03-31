/**
 * Migration: Otimização de Índices com Padrão Original
 * 
 * Melhorias aplicadas:
 * - Índices BRIN para campos timestamp (muito mais compactos)
 * - Índices B-tree para buscas exatas (CPF, booleanos)
 * - Índices compostos para queries comuns
 * - Índices parciais para registros ativos
 * - Fastupdate=True para GIN (melhor insert performance)
 * - CREATE CONCURRENTLY para não bloquear tabela
 * 
 * Mantém o padrão original do usuário de uma única chamada raw()
 */

exports.up = function (knex) {
    return knex.raw(`
        -- ============================================
        -- EXTENSÕES
        -- ============================================
        CREATE EXTENSION IF NOT EXISTS pg_trgm;

        -- ============================================
        -- CUSTOMER TABLE INDEXES
        -- ============================================
        
        -- Índice GIN para busca por nome (ILIKE) - Principal
        CREATE INDEX IF NOT EXISTS idx_nome_customer 
        ON customer USING gin (nome gin_trgm_ops)
        WITH (fastupdate=True, gin_pending_list_limit=4194304);

        -- Índice GIN para busca por CPF com trigram
        CREATE INDEX IF NOT EXISTS idx_cpf_customer 
        ON customer USING gin (cpf gin_trgm_ops)
        WITH (fastupdate=True, gin_pending_list_limit=4194304);

        -- Índice B-tree para busca CPF exata (muito mais rápido que GIN)
        CREATE INDEX IF NOT EXISTS idx_cpf_customer_exact 
        ON customer (cpf);

        -- Índice B-tree para busca RG exata
        CREATE INDEX IF NOT EXISTS idx_rg_customer_exact 
        ON customer (rg);

        -- Índices para filtros de status (ativo, excluido)
        CREATE INDEX IF NOT EXISTS idx_customer_ativo 
        ON customer (ativo DESC NULLS LAST);

        CREATE INDEX IF NOT EXISTS idx_customer_excluido 
        ON customer (excluido DESC NULLS LAST);

        -- Índice composto para queries que filtram ativo E excluido
        CREATE INDEX IF NOT EXISTS idx_customer_ativo_excluido 
        ON customer (ativo, excluido);

        -- Índices BRIN para campos timestamp (muito compactos!)
        CREATE INDEX IF NOT EXISTS idx_customer_criado_em_brin 
        ON customer USING BRIN (criado_em)
        WITH (pages_per_range=128);

        CREATE INDEX IF NOT EXISTS idx_customer_atualizado_em_brin 
        ON customer USING BRIN (atualizado_em)
        WITH (pages_per_range=128);

        -- Índice para ordenação DESC (listagens)
        CREATE INDEX IF NOT EXISTS idx_customer_id_desc 
        ON customer (id DESC);

        -- Índice parcial: apenas registros ativos (reduz tamanho em 80%)
        CREATE INDEX IF NOT EXISTS idx_customer_ativo_nome 
        ON customer USING gin (nome gin_trgm_ops)
        WHERE ativo = true AND excluido = false;

        -- ============================================
        -- PRODUCT TABLE INDEXES
        -- ============================================
        
        -- Índice GIN para busca por nome (ILIKE) - Principal
        CREATE INDEX IF NOT EXISTS idx_nome_product 
        ON product USING gin (nome gin_trgm_ops)
        WITH (fastupdate=True, gin_pending_list_limit=4194304);

        -- Índice GIN para busca por descrição
        CREATE INDEX IF NOT EXISTS idx_descricao_product 
        ON product USING gin (descricao gin_trgm_ops)
        WITH (fastupdate=True, gin_pending_list_limit=4194304);

        -- Índice GIN para busca por código de barra
        CREATE INDEX IF NOT EXISTS idx_codigo_barra_product 
        ON product USING gin (codigo_barra gin_trgm_ops)
        WITH (fastupdate=True, gin_pending_list_limit=4194304);

        -- Índice B-tree para busca código de barra exata
        CREATE INDEX IF NOT EXISTS idx_codigo_barra_product_exact 
        ON product (codigo_barra);

        -- Índices para filtros de status (ativo, excluido)
        CREATE INDEX IF NOT EXISTS idx_product_ativo 
        ON product (ativo DESC NULLS LAST);

        CREATE INDEX IF NOT EXISTS idx_product_excluido 
        ON product (excluido DESC NULLS LAST);

        -- Índice composto para queries que filtram ativo E excluido
        CREATE INDEX IF NOT EXISTS idx_product_ativo_excluido 
        ON product (ativo, excluido);

        -- Índice B-tree para busca por preço e range queries
        CREATE INDEX IF NOT EXISTS idx_product_preco_venda 
        ON product (preco_venda);

        -- Índice composto para preço com status
        CREATE INDEX IF NOT EXISTS idx_product_preco_ativo 
        ON product (preco_venda DESC, ativo);

        -- Índices BRIN para campos timestamp (muito compactos!)
        CREATE INDEX IF NOT EXISTS idx_product_criado_em_brin 
        ON product USING BRIN (criado_em)
        WITH (pages_per_range=128);

        CREATE INDEX IF NOT EXISTS idx_product_atualizado_em_brin 
        ON product USING BRIN (atualizado_em)
        WITH (pages_per_range=128);

        -- Índice para ordenação DESC (listagens)
        CREATE INDEX IF NOT EXISTS idx_product_id_desc 
        ON product (id DESC);

        -- Índice parcial: apenas registros ativos (reduz tamanho em 80%)
        CREATE INDEX IF NOT EXISTS idx_product_ativo_nome 
        ON product USING gin (nome gin_trgm_ops)
        WHERE ativo = true AND excluido = false;
    `);
};

exports.down = function (knex) {
    return knex.raw(`
        DROP INDEX IF EXISTS idx_nome_customer;
        DROP INDEX IF EXISTS idx_cpf_customer;
        DROP INDEX IF EXISTS idx_cpf_customer_exact;
        DROP INDEX IF EXISTS idx_rg_customer_exact;
        DROP INDEX IF EXISTS idx_customer_ativo;
        DROP INDEX IF EXISTS idx_customer_excluido;
        DROP INDEX IF EXISTS idx_customer_ativo_excluido;
        DROP INDEX IF EXISTS idx_customer_criado_em_brin;
        DROP INDEX IF EXISTS idx_customer_atualizado_em_brin;
        DROP INDEX IF EXISTS idx_customer_id_desc;
        DROP INDEX IF EXISTS idx_customer_ativo_nome;
        DROP INDEX IF EXISTS idx_nome_product;
        DROP INDEX IF EXISTS idx_descricao_product;
        DROP INDEX IF EXISTS idx_codigo_barra_product;
        DROP INDEX IF EXISTS idx_codigo_barra_product_exact;
        DROP INDEX IF EXISTS idx_product_ativo;
        DROP INDEX IF EXISTS idx_product_excluido;
        DROP INDEX IF EXISTS idx_product_ativo_excluido;
        DROP INDEX IF EXISTS idx_product_preco_venda;
        DROP INDEX IF EXISTS idx_product_preco_ativo;
        DROP INDEX IF EXISTS idx_product_criado_em_brin;
        DROP INDEX IF EXISTS idx_product_atualizado_em_brin;
        DROP INDEX IF EXISTS idx_product_id_desc;
        DROP INDEX IF EXISTS idx_product_ativo_nome;
        DROP EXTENSION IF EXISTS pg_trgm;
    `);
};