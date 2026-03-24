import { faker } from '@faker-js/faker/locale/pt_BR';

export async function seed(knex) {
  await knex('customer').del();

  const batchSize = 1000;
  const total = 100000;

  for (let i = 0; i < total; i += batchSize) {
    
    const batch = Array.from({ length: batchSize }, () => ({
      nome: faker.person.fullName(),
      cpf: faker.string.numeric(11),
      ativo: faker.datatype.boolean(),
    }));

    await knex('customer').insert(batch);
  }
}