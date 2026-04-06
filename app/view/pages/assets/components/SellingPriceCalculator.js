export default class SellingPriceCalculator {
    static create() {
        return new SellingPriceCalculator();
    }
    addPurchasePrice(purchasePrice) {
        return this;
    }

    addTotalTax(totalTax = 0) {
        return this;
    }

    addProfitMargin(profitMargin = 0) {
        return this;
    }

    operatingCost(operatingCost = 0) {
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