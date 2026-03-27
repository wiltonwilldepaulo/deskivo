//Url da API do IBG para caturar todos os estados brasileiros.
const URL_UFS = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados';
exports.seed = async function (knex) {
    //Recebemos o JSON com os dados dos estado Brasileiros
    const response = await fetch(URL_UFS);
    if (!response.ok) {
        throw new Error(`Restrição : ${response.statusText} `);
    }
    //Convertemos a resposta para o format JSON.
    const UFS = await response.json();
    //Apaga todos os dados da tabela: federative_unit
    await knex('federative_unit').del();
    //Selecionamos o id do Pais BR
    const pais = await knex('country')
        .select('id')
        .where('codigo', 'BR')
        .first();
    const dados = UFS.map((UF) => ({
        id_pais: pais.id,
        codigo: UF?.id,
        sigla: UF?.sigla,
        nome: UF?.nome
    }));
    //INSERE TODOS OS 27 ESTADOS DE UMA VEZ
    await knex('federative_unit').insert(dados);
    console.log(`Todos os estado brasileiros foram importado com sucesso: ${dados.length}`)
};