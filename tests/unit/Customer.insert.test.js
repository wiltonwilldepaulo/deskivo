import { describe, it, expect, vi, beforeEach } from 'vitest';
import Customer from '../../app/controller/Customer.js';
import connection from '../../app/database/Connection.js';

vi.mock('../../app/database/Connection.js', () => ({
    default: vi.fn(),
}));

describe('Customer.insert', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('deve retornar erro quando o nome estiver vazio e não acessar o banco', async () => {
        const payload = {
            nome: '   ',
            cpf: '12345678901',
            action: 'create',
        };

        const result = await Customer.insert(payload);

        expect(result).toStrictEqual({
            status: false,
            msg: 'O campo nome é obrigatório',
            id: null,
            data: [],
        });

        expect(connection).not.toHaveBeenCalled();
    });

    it('deve inserir com sucesso quando os dados forem válidos', async () => {
        const insertedRow = {
            id: 1,
            nome: 'Maria Souza',
            cpf: '12345678901',
        };

        const returningMock = vi.fn().mockResolvedValue([insertedRow]);
        const insertMock = vi.fn().mockReturnValue({
            returning: returningMock,
        });

        connection.mockReturnValue({
            insert: insertMock,
        });

        const payload = {
            nome: 'Maria Souza',
            cpf: '12345678901',
            action: 'c',
            id: '',
        };

        const result = await Customer.insert(payload);

        expect(connection).toHaveBeenCalledWith('customer');
        expect(insertMock).toHaveBeenCalledWith({
            nome: 'Maria Souza',
            cpf: '12345678901',
        });
        expect(returningMock).toHaveBeenCalledWith('*');

        expect(result).toStrictEqual({
            status: true,
            msg: 'Salvo com sucesso!',
            id: 1,
            data: [insertedRow],
        });
    });
});