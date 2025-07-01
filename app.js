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
  const serverTime = new Date().toLocaleString();
  const dragonCount = dragones.length;
  const classCount = clases.length;
  
  // Generar HTML con estilo profesional
  const html = `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>API de Dragones | Documentación</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }
      
      :root {
        --primary: #0f1a2a;
        --secondary: #1a2b3c;
        --accent: #ff6b35;
        --text: #f0f0f0;
        --highlight: #4facfe;
        --card-bg: rgba(30, 41, 59, 0.7);
      }
      
      body {
        background: linear-gradient(135deg, var(--primary), var(--secondary));
        color: var(--text);
        line-height: 1.6;
        min-height: 100vh;
        padding: 2rem;
      }
      
      .container {
        max-width: 1200px;
        margin: 0 auto;
      }
      
      header {
        text-align: center;
        padding: 2rem 0;
        margin-bottom: 2rem;
        animation: fadeIn 1s ease;
      }
      
      .logo {
        font-size: 4rem;
        margin-bottom: 1rem;
      }
      
      h1 {
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
        background: linear-gradient(45deg, var(--accent), var(--highlight));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      
      .subtitle {
        font-size: 1.2rem;
        opacity: 0.8;
        max-width: 800px;
        margin: 0 auto;
      }
      
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 1.5rem;
        margin-bottom: 3rem;
      }
      
      .stat-card {
        background: var(--card-bg);
        border-radius: 12px;
        padding: 1.5rem;
        text-align: center;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      
      .stat-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
      }
      
      .stat-card h3 {
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
        color: var(--accent);
      }
      
      .endpoints-section {
        margin-bottom: 3rem;
      }
      
      .section-title {
        font-size: 1.8rem;
        margin-bottom: 1.5rem;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid var(--accent);
        display: inline-block;
      }
      
      .endpoint-card {
        background: var(--card-bg);
        border-radius: 10px;
        padding: 1.5rem;
        margin-bottom: 1.5rem;
        border-left: 4px solid var(--highlight);
      }
      
      .method {
        display: inline-block;
        padding: 0.3rem 0.8rem;
        border-radius: 4px;
        font-weight: bold;
        margin-right: 1rem;
        background: var(--highlight);
        color: var(--primary);
      }
      
      .path {
        font-family: monospace;
        font-size: 1.1rem;
        color: var(--accent);
      }
      
      .description {
        margin: 1rem 0;
        padding-left: 2rem;
      }
      
      .params {
        background: rgba(0, 0, 0, 0.2);
        padding: 1rem;
        border-radius: 8px;
        margin-top: 1rem;
        font-size: 0.9rem;
      }
      
      .param-item {
        margin-bottom: 0.5rem;
        display: flex;
      }
      
      .param-name {
        font-weight: bold;
        min-width: 120px;
        color: var(--accent);
      }
      
      footer {
        text-align: center;
        margin-top: 3rem;
        padding-top: 2rem;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        opacity: 0.7;
        font-size: 0.9rem;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      .card {
        animation: fadeIn 0.5s ease backwards;
      }
      
      @media (max-width: 768px) {
        body {
          padding: 1rem;
        }
        
        .logo {
          font-size: 3rem;
        }
        
        h1 {
          font-size: 2rem;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <header>
        <div class="logo">🐉</div>
        <h1>API de Dragones</h1>
        <p class="subtitle">Explora el mundo mágico de dragones a través de nuestra API. Descubre especies, clases, habilidades y estadísticas.</p>
      </header>
      
      <div class="stats-grid">
        <div class="stat-card card" style="animation-delay: 0.1s">
          <h3>${dragonCount}</h3>
          <p>Dragones registrados</p>
        </div>
        
        <div class="stat-card card" style="animation-delay: 0.2s">
          <h3>${classCount}</h3>
          <p>Clases diferentes</p>
        </div>
        
        <div class="stat-card card" style="animation-delay: 0.3s">
          <h3>${Math.max(...dragones.map(d => d.stats.attack))}</h3>
          <p>Máximo ataque</p>
        </div>
        
        <div class="stat-card card" style="animation-delay: 0.4s">
          <h3>${Math.max(...dragones.map(d => d.stats.speed))}</h3>
          <p>Máxima velocidad</p>
        </div>
      </div>
      
      <div class="endpoints-section">
        <h2 class="section-title">Endpoints Disponibles</h2>
        
        <div class="endpoint-card card" style="animation-delay: 0.1s">
          <div>
            <span class="method">GET</span>
            <span class="path">/dragones</span>
          </div>
          <p class="description">Obtiene una lista paginada de todos los dragones disponibles.</p>
          <div class="params">
            <div class="param-item">
              <span class="param-name">page</span>
              <span>Número de página (default: 1)</span>
            </div>
            <div class="param-item">
              <span class="param-name">limit</span>
              <span>Resultados por página (default: 10)</span>
            </div>
            <div class="param-item">
              <span class="param-name">clase</span>
              <span>Filtrar por clase (ej: 'Mystery')</span>
            </div>
          </div>
        </div>
        
        <div class="endpoint-card card" style="animation-delay: 0.2s">
          <div>
            <span class="method">GET</span>
            <span class="path">/dragones/random</span>
          </div>
          <p class="description">Obtiene un dragón aleatorio del repositorio.</p>
        </div>
        
        <div class="endpoint-card card" style="animation-delay: 0.3s">
          <div>
            <span class="method">GET</span>
            <span class="path">/dragones/:id</span>
          </div>
          <p class="description">Busca un dragón específico por su ID único.</p>
          <div class="params">
            <div class="param-item">
              <span class="param-name">Ejemplo</span>
              <span><a href="/dragones/1" style="color: var(--highlight);">/dragones/1</a></span>
            </div>
          </div>
        </div>
        
        <div class="endpoint-card card" style="animation-delay: 0.4s">
          <div>
            <span class="method">GET</span>
            <span class="path">/clases</span>
          </div>
          <p class="description">Obtiene todas las clases de dragones disponibles.</p>
        </div>
        
        <div class="endpoint-card card" style="animation-delay: 0.5s">
          <div>
            <span class="method">GET</span>
            <span class="path">/clases/:nombre</span>
          </div>
          <p class="description">Obtiene información detallada sobre una clase específica y sus dragones asociados.</p>
          <div class="params">
            <div class="param-item">
              <span class="param-name">Ejemplo</span>
              <span><a href="/clases/Mystery" style="color: var(--highlight);">/clases/Mystery</a></span>
            </div>
          </div>
        </div>
      </div>
      
      <footer>
        <p>🕒 Hora del servidor: ${serverTime}</p>
        <p>Versión API: 2.5.0 | Última actualización: 15 Junio 2025</p>
        <p>© 2025 API de Dragones - Todos los derechos reservados</p>
      </footer>
    </div>
  </body>
  </html>
  `;
  
  res.send(html);
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