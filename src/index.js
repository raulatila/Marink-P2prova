const express = require('express');
const { sequelize, Profile, Contract, Job, Deposit } = require('./models');

const app = express();
app.use(express.json());

// 1. Listar todos os Contracts de um Profile
app.get('/profiles/:id/contracts', async (req, res) => {
  const { id } = req.params;

  try {
    const contracts = await Contract.findAll({
      where: { clientId: id },
    });

    if (!contracts.length) {
      return res.status(404).json({ error: 'No contracts found for this profile' });
    }

    res.json(contracts);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// 2. Realizar Deposit
app.post('/profiles/:id/deposit', async (req, res) => {
  const { id } = req.params;
  const { depositValue } = req.body;

  if (!depositValue || depositValue <= 0) {
    return res.status(400).json({ error: 'Invalid deposit value' });
  }

  try {
    const profile = await Profile.findByPk(id);
    if (!profile) return res.status(404).json({ error: 'Profile not found' });

    // Atualiza saldo do perfil
    profile.balance += depositValue;
    await profile.save();

    // Cria registro do depósito
    await Deposit.create({
      clientId: id,
      depositValue,
      operationDate: new Date(),
    });

    res.json({ message: 'Deposit successful', profile });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// 3. Listar Jobs de um Contract que não foram pagos integralmente
app.get('/contracts/:id/jobs/unpaid', async (req, res) => {
  const { id } = req.params;

  try {
    const jobs = await Job.findAll({
      where: { contractId: id, paid: false },
    });

    if (!jobs.length) {
      return res.status(404).json({ error: 'No unpaid jobs found for this contract' });
    }

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// Inicializar o servidor
app.listen(3000, async () => {
  try {
    await sequelize.sync(); // Sincroniza modelos com o banco de dados
    console.log('API rodando na porta 3000!');
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error.message);
  }
});
