// Tempo real do evento (em ms)
const HORA_INICIO = 9 * 3600000 + 30 * 60000;   // 09:30
const HORA_FIM = 12 * 3600000 + 30 * 60000;     // 12:30
const DURACAO_TOTAL = HORA_FIM - HORA_INICIO;

// SIMULAÇÃO
const SIM_DURACAO = 5000;

// Cores
const COR_FUNDO = '#0D0D2E';
const COR_TEXTO_PRIMARIO = '#FFFFFF';
const COR_CAIXA_FUNDO = '#3C3C3C';
const COR_BARRA_INICIO = '#1A4D80';
const COR_BARRA_FIM = '#3A86FF';
const COR_BARRA_FUNDO = '#D9D9D9';
const COR_STROKE_CAIXA = '#3A86FF';

let corInicioGradiente, corFimGradiente;

// ----------------------------------------------------
// Respiração
// ----------------------------------------------------
let smallCircle = { x: 117.5, y: 117.5, w: 215, h: 215 };
let bigCircle   = { x: 63.25,  y: 63.25,  w: 322.5, h: 322.5 };
let extraSmall  = { x: 143.88, y: 143.88, w: 161.25, h: 161.25 };
let animProgress = 0;
let duration = 180;
let breathingIn = true;

let mostrarAlertaAnsiedade = false;
let simInicio;

// ----------------------------------------------------
// PARTÍCULAS
// ----------------------------------------------------
let particles = [];
const NUM_PARTICLES = 220;

function initParticles() {
  particles = [];
  for (let i = 0; i < NUM_PARTICLES; i++) {
    let size = random(1, 3);
    if (random() < 0.12) size = random(3.5, 5);

    particles.push({
      x: random(width),
      y: random(height),
      size: size,
      speedX: random(-0.25, 0.25),
      speedY: random(-0.25, 0.25),
      alpha: random(140, 255),
      wobble: random(0.001, 0.01),
      phase: random(TWO_PI)
    });
  }
}

function particulasFundo() {
  noStroke();

  for (let p of particles) {
    p.phase += p.wobble;
    let pulse = 1 + 0.12 * sin(p.phase);

    fill(255, p.alpha);
    circle(p.x, p.y, p.size * pulse);

    p.x += p.speedX * pulse;
    p.y += p.speedY * pulse;

    if (p.x < 0) { p.x = 0; p.speedX *= -1; }
    if (p.x > width) { p.x = width; p.speedX *= -1; }
    if (p.y < 0) { p.y = 0; p.speedY *= -1; }
    if (p.y > height) { p.y = height; p.speedY *= -1; }
  }
}

// ----------------------------------------------------

function setup() {
  var myCanvas = createCanvas(450, 450);
  myCanvas.parent("processingCanvas");
  simInicio = millis();

  textFont("Inter")
  textStyle(BOLD); 

  initParticles();
}

function draw() {

  let g = drawingContext.createLinearGradient(0, 0, 0, height);
  g.addColorStop(0, "#000007");
  g.addColorStop(1, "#000016");
  drawingContext.fillStyle = g;
  noStroke();
  rect(0, 0, width, height);

  particulasFundo();

  if (mostrarAlertaAnsiedade) {
    alertaAnsiedade();
  } else {
    watchFace();
  }
}


function watchFace() {
  textFont("Inter");
  textStyle(BOLD);  
  textAlign(LEFT, TOP);

  fill(COR_TEXTO_PRIMARIO);

  corInicioGradiente = color(COR_BARRA_INICIO);
  corFimGradiente = color(COR_BARRA_FIM);

  let elapsed = millis() - simInicio;
  let simProgresso = constrain(elapsed / SIM_DURACAO, 0, 1);

  let tempoSimulado = HORA_INICIO + simProgresso * DURACAO_TOTAL;

  let h = floor(tempoSimulado / 3600000);
  let m = floor((tempoSimulado % 3600000) / 60000);

  let displayHora = nf(h, 2) + ":" + nf(m, 2);

  let dias = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"];
  let hoje = new Date();
  let dataDisplay = dias[hoje.getDay()] + ", " + nf(hoje.getDate(), 2);

  // Data
  textSize(20);
  text(dataDisplay, 48, 37);

  // Hora principal
  textSize(64);
  text(displayHora, 48, 82);

  // Caixa 1 (igual ao original)
  noStroke();
  fill(COR_CAIXA_FUNDO);
  rect(48, 168, 354, 143, 10);

  stroke(COR_STROKE_CAIXA);
  strokeWeight(2);
  noFill();
  rect(48, 168, 354, 143, 10);

  noStroke();
  fill(COR_TEXTO_PRIMARIO);

  // HORÁRIO 1 → REGULAR
  textSize(18);
  textStyle(NORMAL);
  text("9:30 - 12:30", 72, 185);

  // Texto principal caixa 1 → BOLD
  textSize(24);
  textStyle(BOLD);
  text("Penúltima aula antes da\nentrega final de Projeto", 72, 222);

  // Barra de progresso
  let bx = 72, by = 285, bw = 306, bh = 11;
  let progressoW = bw * simProgresso;

  fill(COR_BARRA_FUNDO);
  rect(bx, by, bw, bh, 5);

  for (let x = 0; x < progressoW; x++) {
    let amt = map(x, 0, progressoW, 0, 1);
    let grad = lerpColor(corInicioGradiente, corFimGradiente, amt);
    stroke(grad);
    line(bx + x, by, bx + x, by + bh);
  }

  noStroke();

  // ----------------------------------------------------
  // SEGUNDA CAIXA
  // ----------------------------------------------------
  let cx = 72, cy = 319, cw = 306, ch = 105;

  fill(COR_CAIXA_FUNDO);
  rect(cx, cy, cw, ch, 10);

  fill(COR_TEXTO_PRIMARIO);

  
  textSize(18);
  textStyle(NORMAL);
  text("14:00 - 15:30", cx + 24, cy + 16);

 
  textSize(24);
  textStyle(BOLD);
  text("Entrevistar Designer", cx + 24, cy + 52);
}

// ----------------------------------------------------
// ALERTA
// ----------------------------------------------------
function alertaAnsiedade() {
  textFont("Inter");
  textSize(40);
  textStyle(BOLD); 
  fill(COR_TEXTO_PRIMARIO);

  animProgress++;

  if (animProgress > duration) {
    animProgress = 0;
    breathingIn = !breathingIn;
  }

  let t = animProgress / duration;

  let cx, cy, cw, ch;

  if (breathingIn) {
    cx = lerp(smallCircle.x, bigCircle.x, t);
    cy = lerp(smallCircle.y, bigCircle.y, t);
    cw = lerp(smallCircle.w, bigCircle.w, t);
    ch = lerp(smallCircle.h, bigCircle.h, t);
  } else {
    if (t < 0.5) {
      let tt = t * 2;
      cx = lerp(bigCircle.x, smallCircle.x, tt);
      cy = lerp(bigCircle.y, smallCircle.y, tt);
      cw = lerp(bigCircle.w, smallCircle.w, tt);
      ch = lerp(bigCircle.h, smallCircle.h, tt);
    } else {
      let tt = (t - 0.5) * 2;
      cx = lerp(smallCircle.x, extraSmall.x, tt);
      cy = lerp(smallCircle.y, extraSmall.y, tt);
      cw = lerp(smallCircle.w, extraSmall.w, tt);
      ch = lerp(smallCircle.h, extraSmall.h, tt);
    }
  }

  
  fill(COR_CAIXA_FUNDO);
  stroke("#FFFFFF");
  strokeWeight(4);

  ellipseMode(CORNER);
  ellipse(cx, cy, cw, ch);

  let label = breathingIn ? "INSPIRAR" : "EXPIRAR";
  textAlign(CENTER, CENTER);
  noStroke();
  fill("#FFFFFF");
  text(label, width / 2, height / 2);
}

// ----------------------------------------------------
function keyPressed() {
  mostrarAlertaAnsiedade = !mostrarAlertaAnsiedade;
}




