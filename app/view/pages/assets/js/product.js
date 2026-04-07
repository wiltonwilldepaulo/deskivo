import { SellingPriceCalculator } from "../components/SellingPriceCalculator";

//import { SellingPriceCalculator } from "../components/SellingPriceCalculator.js";
const Action = document.getElementById('action');
const Id = document.getElementById('id');
const totalTax = document.getElementById('total_imposto');
Inputmask("currency", {
    radixPoint: ',',
    inputtype: "text",
    prefix: 'R$ ',
    autoGroup: true,
    groupSeparator: '.',
    rightAlign: false,
    onBeforeMask: function (value) {
        return String(value).replace('.', ',');
    }
}).mask("#preco_venda, #preco_compra");
Inputmask("currency", {
    radixPoint: ',',
    inputtype: "text",
    prefix: '% ',
    autoGroup: true,
    groupSeparator: '.',
    rightAlign: false,
    onBeforeMask: function (value) {
        return String(value).replace('.', ',');
    }
}).mask("#total_imposto, #margem_lucro, #custo_operacional");

totalTax.addEventListener('keydown', () => {
    const tax = String(totalTax.value).replace('%', '').replace(',', '.');
    const result =SellingPriceCalculator.create()
        .addTotalTax(tax)
        .getData();
    document.getElementById('total_importo_value').innerHTML = `${result.total_imposto}`;
});

//  CARREGA DADOS DE EDIÇÃO (se existirem)
(async () => {
    const editData = await api.temp.get('product:edit');
    if (editData) {
        // Modo edição
        Action.value = editData.action || 'e';
        Id.value = editData.id || '';
        // Preenche todos os campos pelo atributo name
        for (const [key, value] of Object.entries(editData)) {
            const field = form.querySelector(`[name="${key}"]`);
            if (!field) continue;

            if (field.type === 'checkbox') {
                field.checked = value === true || value === 'true';
            } else {
                field.value = value || '';
            }
        }
    } else {
        // Modo cadastro novo
        Action.value = 'c';
        Id.value = '';
    }
})();