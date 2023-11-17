let particles;
let bg;
let zoomInput;
let angular;
let mouseYPrev;
let scrollingDown;

function setup() {
  createCanvas(windowWidth, windowHeight);
  particles = [];

  zoomInput = createInput(100, "number");
  zoomInput.position(10, height - 58);
  zoomInput.size(80);
  zoomInput.changed(regen);

  angular = createCheckbox("Angular", false);
  angular.position(120, height - 46);

  // Crear 4000 partículas
  for (let i = 0; i < 4000; i++) {
    let p = new Particle(random(width), random(height));
    particles.push(p);
  }
  regen();
  background(0);

  // Inicializar la posición previa del mouse
  mouseYPrev = mouseY;
  scrollingDown = false;
}

function regen() {
  let r = 5;
  bg = createGraphics(width, height);
  for (let y = 0; y < height; y += r) {
    for (let x = 0; x < width; x += r) {
      let n = noise(x / zoomInput.value(), y / zoomInput.value()) * 255;
      bg.fill(n);
      bg.noStroke();
      bg.rect(x, y, r, r);
    }
  }
}

function draw() {
  blendMode(SCREEN);

  // Obtener la dirección del movimiento de la barra de desplazamiento
  if (mouseY > mouseYPrev) {
    scrollingDown = true;
  } else if (mouseY < mouseYPrev) {
    scrollingDown = false;
  }

  // Si la barra de desplazamiento está bajando, mover las partículas hacia abajo
  // Si está subiendo, moverlas hacia arriba
  if (scrollingDown) {
    for (let p of particles) {
      p.fall();
    }
  } else {
    for (let p of particles) {
      p.rise();
    }
  }

  // Actualizar la posición previa de la barra de desplazamiento
  mouseYPrev = mouseY;

  // Dibujar las partículas
  for (let p of particles) {
    p.draw();
  }

  blendMode(BLEND);
  noStroke();
  fill(0, 10);
  rect(0, 0, width, height);
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.angle = PI / 2; // Ángulo para la caída hacia abajo
    this.speed = random(0.5, 2); // Velocidad de caída más lenta
    this.size = random(2, 5);
    this.col = color(getColor()); // Uso la paleta de colores intensos

    this.reset();
  }

  reset() {
    this.x = random(width);
    this.y = scrollingDown ? random(-height, 0) : random(height, height * 2);
  }

  fall() {
    this.y += this.speed;

    // Reiniciar en la parte superior cuando la partícula alcanza la parte inferior
    if (this.y > height) {
      this.reset();
    }
  }

  rise() {
    this.y -= this.speed;

    // Reiniciar en la parte inferior cuando la partícula alcanza la parte superior
    if (this.y < 0) {
      this.reset();
    }
  }

  draw() {
    fill(this.col);
    noStroke();
    ellipse(this.x, this.y, this.size, this.size);
  }
}

function getColor() {
  // Solo retorna negro o gris
  return random() > 0.5 ? color(150) : color(0);
}
