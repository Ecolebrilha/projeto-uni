const pagarServices = require("../services/pagamentoServices");

class pagamentoController {
    async insertPagamentos(req, res) {
        const {
            credor,
            descricao,
            num_documento,
            num_parcela,
            dat_vencimento,
            dat_pagamento,
            vlr_pago
        } = req.body;

        console.log(credor,
            descricao,
            num_documento,
            num_parcela,
            dat_vencimento,
            dat_pagamento,
            vlr_pago)
        try {
            if (new Date(dat_pagamento) > new Date(dat_vencimento)) {
                const valorComJuros = vlr_pago * 1.2;
                await pagarServices.insertPagamento({
                    credor,
                    descricao,
                    num_documento,
                    num_parcela,
                    dat_vencimento,
                    dat_pagamento,
                    vlr_pago
                });
                return res.status(200).json({
                    message: `Boleto gerado com sucesso com acréscimo de juros. Valor total: ${valorComJuros}`,
                    valorComJuros
                });
            } else if (new Date(dat_pagamento) < new Date(dat_vencimento)) {
                const valorComDesconto = vlr_pago * 0.9;
                await pagarServices.insertPagamento({
                    credor,
                    descricao,
                    num_documento,
                    num_parcela,
                    dat_vencimento,
                    dat_pagamento,
                    vlr_pago
                });
                return res.status(200).json({
                    message: `Boleto gerado com sucesso com desconto. Valor total: ${valorComDesconto}`,
                    valorComDesconto
                });
            }

            await pagarServices.insertPagamento({
                credor,
                descricao,
                num_documento,
                num_parcela,
                dat_vencimento,
                dat_pagamento,
                vlr_pago
            });

            res.status(201).json({
                message: "Pagamento registrado com sucesso!"
            });
        } catch (error) {
            console.error("Erro ao aprovar pagamento:", error);
            res.status(400).json({ message: "Erro interno ao processar pagamento." });
        }
    }

    async listarPagamentos(req, res) {
        try {
            const pagamentos = await pagarServices.selectAllPagamentos();
            res.status(200).json(pagamentos);
        } catch (error) {
            console.error("Erro ao listar pagamentos:", error);
            res.status(400).json({ message: "Erro ao listar pagamentos." });
        }
    }

    async selectPagamentosById(req, res) {
        const { id } = req.params;
        try {
            const pagamento = await pagarServices.selectPagamentoById(id);
            if (!pagamento) {
                return res.status(404).json({ message: "Pagamento não encontrado." });
            }
            res.status(200).json(pagamento);
        } catch (error) {
            console.error("Erro ao buscar pagamento:", error);
            res.status(400).json({ message: "Erro interno ao buscar pagamento." });
        }
    }

    async updatePagamento(req, res) {
        const { id } = req.params;
        const {
            credor,
            descricao,
            num_documento,
            num_parcela,
            dat_vencimento,
            dat_pagamento,
            vlr_pago
        } = req.body;

        try {
            const updatedPagamento = await pagarServices.updatePagamento(id, {
                credor,
                descricao,
                num_documento,
                num_parcela,
                dat_vencimento,
                dat_pagamento,
                vlr_pago
            });

            if (!updatedPagamento) {
                return res.status(404).json({ message: "Pagamento não encontrado." });
            }

            res.status(200).json({
                message: "Pagamento atualizado com sucesso!",
                updatedPagamento
            });
        } catch (error) {
            console.error("Erro ao atualizar pagamento:", error);
            res.status(400).json({ message: "Erro interno ao atualizar pagamento." });
        }
    }

    async deletePagamento(req, res) {
        const { id } = req.params;

        try {
            const deletedPagamento = await pagarServices.deletePagamento(id);

            if (!deletedPagamento) {
                return res.status(404).json({ message: "Pagamento não encontrado." });
            }

            res.status(200).json({ message: "Pagamento deletado com sucesso!" });
        } catch (error) {
            console.error("Erro ao deletar pagamento:", error);
            res.status(400).json({ message: "Erro interno ao deletar pagamento." });
        }
    }
}

module.exports = new pagamentoController();
