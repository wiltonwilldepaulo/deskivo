export default class SellingPriceCalculator {
    static create() {
        return new SellingPriceCalculator();
    }
    addPurchasePrice(purchasePrice) {
        return this;
    }

    addTotalTax(totalTax) {
        return this;
    }

    addProfitMargin(profitMargin) {
        return this;
    }

    operatingCost(operatingCost) {
        return this;
    }

    getData() {
        return {
            valor_venda_sugerido: '',
            valor_total_imposto: '',
            valor_margem_lucro: ''
        };
    }
}