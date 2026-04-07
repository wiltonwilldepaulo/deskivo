import { describe, it, expect } from 'vitest';
import { SellingPriceCalculator } from '../../app/view/pages/assets/components/SellingPriceCalculator';

describe('SellingPriceCalculator', () => {
    // create()
    describe('create()', () => {
        it('deve retornar uma instância de SellingPriceCalculator', () => {
            const calculator = SellingPriceCalculator.create();
            expect(calculator).toBeInstanceOf(SellingPriceCalculator);
        });
        it('cada chamada deve retornar uma instância nova e independente', () => {
            const a = SellingPriceCalculator.create();
            const b = SellingPriceCalculator.create();
            expect(a).not.toBe(b);
        });
    });
    // Testa o erro de – divisão por zero getData()
    describe('getData() – divisão por zero', () => {
        it('deve lançar um erro quando o divisor for igual a zero', () => {
            // taxRate=1.00 | marginRate=0 | opRate=0 → divisor = 1 - 1 = 0
            expect(() =>
                SellingPriceCalculator
                    .create()
                    .addPurchasePrice(0)
                    .addTotalTax(0)
                    .addProfitMargin(0)
                    .addOperatingCost(0)
                    .getData()

            ).toThrow('A soma de impostos, margem de lucro e custo operacional não pode ser 0');
        });
    });
});