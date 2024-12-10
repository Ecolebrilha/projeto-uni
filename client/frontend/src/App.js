import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [payments, setPayments] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    numeroBoleto: '',
    valor: '',
    status: 'pendente',
    vencimento: '',
  });

  const loadPayments = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/pagamento_listen');
      setPayments(response.data);
    } catch (error) {
      console.error('Erro ao carregar pagamentos:', error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {

        await axios.put(`http://localhost:3000/api/pagamento_id${formData.id}`, formData);
      } else {

        await axios.post('http://localhost:3000/api/pagamento_update', formData);
      }
      setFormData({ id: '', numeroBoleto: '', valor: '', status: 'pendente', vencimento: '' });
      loadPayments();
    } catch (error) {
      console.error('Erro ao salvar pagamento:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/pagamento_delete/${id}`);
      loadPayments();
    } catch (error) {
      console.error('Erro ao deletar pagamento:', error);
    }
  };

  const handleEdit = (payment) => {
    setFormData(payment);
  };

  useEffect(() => {
    loadPayments();
  }, []);

  return (
    <div className="App">
      <h1>Gerenciamento de Pagamentos</h1>
      
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          placeholder="Número do Boleto"
          value={formData.numeroBoleto}
          onChange={(e) => setFormData({ ...formData, numeroBoleto: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Valor"
          value={formData.valor}
          onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
          required
        />
        <input
          type="date"
          placeholder="Vencimento"
          value={formData.vencimento}
          onChange={(e) => setFormData({ ...formData, vencimento: e.target.value })}
          required
        />
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        >
          <option value="pendente">Pendente</option>
          <option value="pago">Pago</option>
          <option value="atrasado">Atrasado</option>
        </select>
        <button type="submit">{formData.id ? 'Atualizar Pagamento' : 'Adicionar Pagamento'}</button>
      </form>

      <h2>Lista de Pagamentos</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Número do Boleto</th>
            <th>Valor</th>
            <th>Status</th>
            <th>Vencimento</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td>{payment.id}</td>
              <td>{payment.numeroBoleto}</td>
              <td>R$ {payment.valor}</td>
              <td>{payment.status}</td>
              <td>{payment.vencimento}</td>
              <td>
                <button onClick={() => handleEdit(payment)}>Editar</button>
                <button onClick={() => handleDelete(payment.id)}>Deletar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
