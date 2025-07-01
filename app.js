const express = require('express');
const app = express();
const dragones = require('./data/dragones.json');
const clases = require('./data/class.json');
const cors = require('cors'); // Añade esta línea


// Middlewares
app.use(cors());
app.use(express.json());

// Cache para mejorar rendimiento
const dragonCache = new Map();
dragones.forEach(dragon => dragonCache.set(dragon.id, dragon));

// Endpoint raíz 
app.get('/', (req, res) => {
  res.json({
    message: "🐉 Bienvenido a la API de Dragones",
    version: "2.0.0",
    totalDragones: dragones.length,
    totalClases: clases.length,
    endpoints: {
      todosLosDragones: {
        path: "/dragones",
        method: "GET",
        parameters: {
          page: "number?",
          limit: "number?",
          clase: "string? (ej: Mystery)"
        }
      },
      dragonAleatorio: "/dragones/random",
      dragonPorId: "/dragones/:id",
      clases: "/clases",
      clasePorNombre: "/clases/:nombre"
    }
  });
});

// Endpoint para dragones con filtros 
app.get('/dragones', (req, res) => {
  const { page = 1, limit = 10, clase, caracteristica } = req.query;
  let resultados = [...dragones];

  // Filtros
  if (clase) resultados = resultados.filter(d => d.class === clase);
  if (caracteristica) {
    resultados = resultados.filter(d => 
      d.features.some(f => f.toLowerCase().includes(caracteristica.toLowerCase()))
    );
  }

  // Paginación
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginados = resultados.slice(startIndex, endIndex);

  res.json({
    total: resultados.length,
    pagina: parseInt(page),
    resultadosPorPagina: parseInt(limit),
    totalPaginas: Math.ceil(resultados.length / limit),
    data: paginados
  });
});

// Endpoint para dragón aleatorio
app.get('/dragones/random', (req, res) => {
  const randomIndex = Math.floor(Math.random() * dragones.length);
  res.json(dragones[randomIndex]);
});

// Endpoint para dragón por ID 
app.get('/dragones/:id', (req, res) => {
  const id = parseInt(req.params.id);
  
  if (isNaN(id)) {
    return res.status(400).json({
      error: 'ID inválido',
      message: 'El ID debe ser un número'
    });
  }

  const dragon = dragonCache.get(id);
  
  if (!dragon) {
    return res.status(404).json({
      error: 'Dragón no encontrado',
      message: `No existe un dragón con ID ${id}`,
      sugerencia: `IDs válidos entre 1 y ${dragones.length}`
    });
  }
  
  // Buscar información completa de la clase
  const claseCompleta = clases.find(c => c.class === dragon.class);
  res.json({ ...dragon, claseInfo: claseCompleta });
});

// Endpoint para todas las clases
app.get('/clases', (req, res) => {
  res.json(clases);
});

// Nuevo endpoint: Clase por nombre
app.get('/clases/:nombre', (req, res) => {
  const nombreClase = req.params.nombre;
  const clase = clases.find(c => c.class.toLowerCase() === nombreClase.toLowerCase());
  
  if (!clase) {
    return res.status(404).json({
      error: 'Clase no encontrada',
      clasesDisponibles: clases.map(c => c.class)
    });
  }
  
  // Obtener dragones de esta clase
  const dragonesClase = dragones.filter(d => d.class === clase.class);
  
  res.json({
    ...clase,
    totalDragones: dragonesClase.length,
    dragonesEjemplo: dragonesClase.slice(0, 3).map(d => ({
      id: d.id,
      species: d.species,
      image: d.image
    }))
  });
});

// Middleware para rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    message: `La ruta ${req.path} no existe`,
    acciones: [
      'Verifica la URL',
      'Consulta / para ver los endpoints disponibles'
    ]
  });
});

// Middleware para manejo de errores
app.use((err, req, res, next) => {
  console.error('Error en el servidor:', err.stack);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: 'Los dragones han causado un problema inesperado'
  });
});

// Configuración del puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`
  API de Dragones iniciada!
  http://localhost:${PORT}
  Total dragones: ${dragones.length}
  Total clases: ${clases.length}
  Cache inicializada para ${dragonCache.size} dragones
  `);
});