const express = require('express');
const app = express();
const dragones = require('./data/dragones.json');
const clases = require('./data/class.json');
const cors = require('cors'); // Añade esta línea

app.use(cors());

// Agrega esto antes de los otros endpoints
app.get('/', (req, res) => {
  const serverTime = new Date().toLocaleString();
  const dragonCount = dragones.length;
  const classCount = clases.length;
  
  // Obtener 3 dragones aleatorios para mostrar
  const randomDragons = [];
  const usedIndices = new Set();
  while (randomDragons.length < 3 && randomDragons.length < dragones.length) {
    const randomIndex = Math.floor(Math.random() * dragones.length);
    if (!usedIndices.has(randomIndex)) {
      usedIndices.add(randomIndex);
      const dragon = dragones[randomIndex];
      randomDragons.push({
        id: dragon.id,
        species: dragon.species,
        class: dragon.class,
        image: dragon.image,
        stats: dragon.stats
      });
    }
  }

  // Obtener 3 clases aleatorias para mostrar
  const randomClasses = [];
  while (randomClasses.length < 3 && randomClasses.length < clases.length) {
    const randomIndex = Math.floor(Math.random() * clases.length);
    if (!randomClasses.some(c => c.class === clases[randomIndex].class)) {
      randomClasses.push(clases[randomIndex]);
    }
  }

  // Generar HTML con estilo profesional
  const html = `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>API de Dragones | Documentación</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
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
        --accent-light: #ff8c5a;
        --text: #f0f0f0;
        --text-light: #c0c0c0;
        --highlight: #4facfe;
        --highlight-light: #6bc0ff;
        --card-bg: rgba(30, 41, 59, 0.7);
        --success: #4caf50;
        --warning: #ff9800;
        --danger: #f44336;
      }
      
      body {
        background: linear-gradient(135deg, var(--primary), var(--secondary));
        color: var(--text);
        line-height: 1.6;
        min-height: 100vh;
        padding: 2rem;
        position: relative;
        overflow-x: hidden;
      }
      
      body::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image: url('https://www.transparenttextures.com/patterns/dragon-scales.png');
        opacity: 0.1;
        z-index: -1;
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
        position: relative;
      }
      
      .logo {
        font-size: 4rem;
        margin-bottom: 1rem;
        text-shadow: 0 0 15px rgba(255, 107, 53, 0.5);
        animation: pulse 2s infinite;
      }
      
      h1 {
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
        background: linear-gradient(45deg, var(--accent), var(--highlight));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        position: relative;
        display: inline-block;
      }
      
      h1::after {
        content: "";
        position: absolute;
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%);
        width: 80%;
        height: 3px;
        background: linear-gradient(90deg, transparent, var(--accent), transparent);
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
        position: relative;
        overflow: hidden;
      }
      
      .stat-card::before {
        content: "";
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
        pointer-events: none;
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
      
      .examples-section {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        margin-bottom: 3rem;
      }
      
      .example-card {
        background: var(--card-bg);
        border-radius: 12px;
        padding: 1.5rem;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .example-card h3 {
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid var(--accent);
        display: flex;
        align-items: center;
        gap: 10px;
      }
      
      .dragon-item {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 10px;
        margin-bottom: 10px;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        transition: transform 0.2s ease;
      }
      
      .dragon-item:hover {
        transform: translateX(5px);
        background: rgba(79, 172, 254, 0.1);
      }
      
      .dragon-image {
        width: 60px;
        height: 60px;
        border-radius: 8px;
        object-fit: cover;
        border: 2px solid var(--accent);
      }
      
      .dragon-info h4 {
        color: var(--accent-light);
      }
      
      .dragon-info p {
        font-size: 0.9rem;
        color: var(--text-light);
      }
      
      .class-item {
        padding: 12px;
        margin-bottom: 10px;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 15px;
      }
      
      .class-icon {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid var(--highlight);
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
      
      .endpoint-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 1.5rem;
      }
      
      .endpoint-card {
        background: var(--card-bg);
        border-radius: 10px;
        padding: 1.5rem;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        transition: all 0.3s ease;
      }
      
      .endpoint-card:hover {
        border-color: var(--accent);
        box-shadow: 0 5px 15px rgba(255, 107, 53, 0.2);
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
        position: relative;
      }
      
      .description::before {
        content: "•";
        position: absolute;
        left: 0;
        color: var(--accent);
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
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      
      .api-status {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: rgba(76, 175, 80, 0.2);
        padding: 5px 15px;
        border-radius: 20px;
      }
      
      .status-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: var(--success);
        animation: pulse 1.5s infinite;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes pulse {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.05); opacity: 0.8; }
        100% { transform: scale(1); opacity: 1; }
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
        
        .endpoint-grid {
          grid-template-columns: 1fr;
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
      
      <div class="examples-section">
        <div class="example-card card" style="animation-delay: 0.2s">
          <h3><i class="fas fa-dragon"></i> Dragones de ejemplo</h3>
          ${randomDragons.map(dragon => `
            <a href="/dragones/${dragon.id}" class="dragon-item">
              <img src="${dragon.image}" alt="${dragon.species}" class="dragon-image">
              <div class="dragon-info">
                <h4>${dragon.species}</h4>
                <p>${dragon.class} | Ataque: ${dragon.stats.attack}</p>
              </div>
            </a>
          `).join('')}
        </div>
        
        <div class="example-card card" style="animation-delay: 0.3s">
          <h3><i class="fas fa-layer-group"></i> Clases de ejemplo</h3>
          ${randomClasses.map(clase => `
            <a href="/class/${clase.class}" class="class-item">
              <img src="${clase.icon}" alt="${clase.class}" class="class-icon">
              <div>
                <h4>${clase.class}</h4>
              </div>
            </a>
          `).join('')}
        </div>
      </div>
      
      <div class="endpoints-section">
        <h2 class="section-title"><i class="fas fa-plug"></i> Endpoints Disponibles</h2>
        
        <div class="endpoint-grid">
          <div class="endpoint-card card" style="animation-delay: 0.1s">
            <div>
              <span class="method">GET</span>
              <span class="path">/dragones</span>
            </div>
            <p class="description">Obtiene todos los dragones disponibles.</p>
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
              <span class="path">/class</span>
            </div>
            <p class="description">Obtiene todas las clases de dragones disponibles.</p>
          </div>
          
          <div class="endpoint-card card" style="animation-delay: 0.5s">
            <div>
              <span class="method">GET</span>
              <span class="path">/class/:nombre</span>
            </div>
            <p class="description">Obtiene información sobre una clase específica.</p>
            <div class="params">
              <div class="param-item">
                <span class="param-name">Ejemplo</span>
                <span><a href="/class/Mystery" style="color: var(--highlight);">/class/Mystery</a></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <footer>
        <div class="api-status">
          <span class="status-dot"></span>
          <span>Estado: Operativo</span>
        </div>
        <p>🕒 Hora del servidor: ${serverTime}</p>
        <p>Versión API: 2.5.0 | Última actualización: 15 Junio 2025</p>
        <p>© 2025 API de Dragones - Todos los derechos reservados</p>
      </footer>
    </div>
    
    <script>
      // Actualizar la hora cada minuto
      function updateServerTime() {
        const now = new Date();
        const timeString = now.toLocaleString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        });
        
        document.querySelector('footer p:nth-child(2)').textContent = '🕒 Hora del servidor: ' + timeString;
      }
      
      setInterval(updateServerTime, 1000);
      
      // Efecto de scroll suave
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
          e.preventDefault();
          document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
          });
        });
      });
    </script>
  </body>
  </html>
  `;
  
  res.send(html);
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

app.get('/class/:nombre', (req, res) => {
  const nombreClase = req.params.nombre;
  
  // Buscar la clase ignorando mayúsculas/minúsculas y espacios
  const clase = clases.find(c => 
    c.class.toLowerCase().replace(/\s+/g, '') === 
    nombreClase.toLowerCase().replace(/\s+/g, '')
  );
  
  if (!clase) {
    return res.status(404).json({
      error: 'Clase no encontrada',
      message: `La clase '${nombreClase}' no existe en nuestro bestiario`,
      clasesDisponibles: clases.map(c => c.class)
    });
  }
  
  // Devolver solo el objeto de clase sin modificaciones
  res.json(clase);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
});