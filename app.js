const express = require('express');
const app = express();
const dragones = require('./data/dragones.json');
const clases = require('./data/class.json');
const cors = require('cors'); // Añade esta línea

app.use(cors());

// Agrega esto antes de los otros endpoints
app.get('/', (req, res) => {
  res.json({
    message: "Bienvenido a la API de Dragones",
    endpoints: {
      todosLosDragones: "/dragones",
      dragonAleatorio: "/dragones/random",
      dragonPorId: "/dragones/:id",
      class: "/class"
    }
  });
});

app.get('/dragones', (req, res) => {
  res.json(dragones);
});

app.get('/dragones/random', (req, res) => {
  const randomQuote = dragones[Math.floor(Math.random() * dragones.length)];
  res.json(randomQuote);
});

app.get('/dragones/:id', (req, res) => {
  const quote = dragones.find(q => q.id === parseInt(req.params.id));
  if (!quote) return res.status(404).send('Quote not found');
  res.json(quote);
});

app.get('/class', (req, res) => {
  res.json(clases);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
});