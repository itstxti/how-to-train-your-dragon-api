const express = require('express');
const app = express();
const dragones = require('./data/dragones.json');
const clases = require('./data/class.json');
const cors = require('cors'); // Añade esta línea

app.use(cors());

// Agrega esto antes de los otros endpoints
app.get('/', (req, res) => {
  const serverTime = new Date().toLocaleString('en-US');
  const dragonCount = dragones.length;
  const classCount = clases.length;
  
  
  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HTTYD API</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }
      
      :root {
        --primary: #0a1128;
        --secondary: #1c3144;
        --accent: #e63946;
        --accent-light: #ff6b6b;
        --text: #f1faee;
        --text-light: #a8dadc;
        --highlight: #457b9d;
        --highlight-light: #a8dadc;
        --card-bg: rgba(28, 49, 68, 0.7);
        --success: #2a9d8f;
        --warning: #e9c46a;
        --danger: #e76f51;
      }
      
      body {
        background: #0a1128;
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
        background-image: url('https://www.transparenttextures.com/patterns/black-scales.png');
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
      
    
      
      h1 {
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
        background: #e63946;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        position: relative;
        display: inline-block;
        font-weight: 800;
        letter-spacing: 1px;
      }
      
      h1::after {
        content: "";
        position: absolute;
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%);
        width: 80%;
        height: 3px;
        background: #e63946;
;
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
      
      .endpoints-section {
        margin-bottom: 3rem;
      }
      
      .section-title {
        font-size: 1.8rem;
        margin-bottom: 1.5rem;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid var(--accent);
        display: inline-block;
        color: var(--highlight-light);
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
        box-shadow: 0 5px 15px rgba(229, 57, 70, 0.2);
      }
      
      .method {
        display: inline-block;
        padding: 0.3rem 0.8rem;
        border-radius: 4px;
        font-weight: bold;
        margin-right: 1rem;
        background: var(--highlight);
        color: var(--text);
      }
      
      .path {
        font-family: monospace;
        font-size: 1.1rem;
        color: var(--accent-light);
      }
      
      .description {
        margin: 1rem 0;
        position: relative;
        color: var(--text-light);
      }
      
      .description::before {
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
        color: var(--accent-light);
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
        color: var(--text-light);
      }
      
      .api-status {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: rgba(42, 157, 143, 0.2);
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
        <h1>How to Train Your Dragon API</h1>
      </header>
      
      <div class="stats-grid">
        <div class="stat-card card" style="animation-delay: 0.1s">
          <h3>${dragonCount}</h3>
          <p>Registered Dragons</p>
        </div>
        
        <div class="stat-card card" style="animation-delay: 0.2s">
          <h3>${classCount}</h3>
          <p>Dragon Classes</p>
        </div>
        
        
      </div>
      
      <div class="endpoints-section">
        <h2 class="section-title"><i class="fas fa-plug"></i> API Endpoints</h2>
        
        <div class="endpoint-grid">
          <div class="endpoint-card card" style="animation-delay: 0.1s">
            <div>
              <span class="method">GET</span>
              <span class="path">/dragones</span>
            </div>
            <p class="description">Get all dragons in the HTTYD universe</p>
          </div>
          
          <div class="endpoint-card card" style="animation-delay: 0.2s">
            <div>
              <span class="method">GET</span>
              <span class="path">/dragones/random</span>
            </div>
            <p class="description">Get a random dragon from Berk's dragon registry</p>
          </div>
          
          <div class="endpoint-card card" style="animation-delay: 0.3s">
            <div>
              <span class="method">GET</span>
              <span class="path">/dragones/:id</span>
            </div>
            <p class="description">Find a dragon by its unique ID</p>
            <div class="params">
              <div class="param-item">
                <span class="param-name">Example</span>
                <span><a href="/dragones/1" style="color: var(--highlight-light);">/dragones/1</a></span>
              </div>
            </div>
          </div>
          
          <div class="endpoint-card card" style="animation-delay: 0.4s">
            <div>
              <span class="method">GET</span>
              <span class="path">/class</span>
            </div>
            <p class="description">Get all dragon classes from the Dragon Manual</p>
          </div>
          
          <div class="endpoint-card card" style="animation-delay: 0.5s">
            <div>
              <span class="method">GET</span>
              <span class="path">/class/:name</span>
            </div>
            <p class="description">Get information about a specific dragon class</p>
            <div class="params">
              <div class="param-item">
                <span class="param-name">Example</span>
                <span><a href="/class/Mystery" style="color: var(--highlight-light);">/class/Mystery</a></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <footer>
        <div class="api-status">
          <span class="status-dot"></span>
          <span>Status: Operational</span>
        </div>
        <p>🕒 Server Time: ${serverTime}</p>
        <p>API Version: 1.0.0 | Dragon Database Updated: 2025-06-15</p>
        <p>© 2025 Berk Dragon Archives - All rights reserved</p>
      </footer>
    </div>
    
    <script>
      // Update server time every second
      function updateServerTime() {
        const now = new Date();
        const timeString = now.toLocaleString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
        
        document.querySelector('footer p:nth-child(2)').textContent = '🕒 Server Time: ' + timeString;
      }
      
      setInterval(updateServerTime, 1000);
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