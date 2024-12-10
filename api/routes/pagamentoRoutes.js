const express = require('express');
const route = express.Router();
const pagamentoController = require('../controllers/pagamentoController');

route.post('/pagamento', pagamentoController.insertPagamentos);
route.get('/pagamento_listen', pagamentoController.listarPagamentos);
route.get('/pagamento_id', pagamentoController.selectPagamentosById);
route.put('/pagamento_update', pagamentoController.updatePagamento);
route.delete('/pagamento_delete', pagamentoController.deletePagamento);

module.exports = route;
