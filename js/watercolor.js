const palette = [
    [148, 0, 211, 15],   // Roxo (Alpha bem baixo para fluidez)
    [154, 255, 0, 15],   
    [64, 224, 208, 15],  
    [230, 190, 255, 15], 
    [0, 0, 156, 15]      
];

let particles = [];

class WatercolorParticle {
    constructor(x, y, color, size) {
        this.pos = createVector(x, y);
        this.vel = createVector(random(-0.5, 0.5), random(-0.5, 0.5));
        this.color = color;
        this.baseSize = size;
        this.size = size;
        this.alpha = color[3];
        this.noiseOffset = random(1000);
        this.life = 1.0; // 1.0 (nova) a 0.0 (seca)
    }

    update() {
        if (this.life <= 0) return;

        // 1. Interação Fluida com o Rato
        let mousePos = createVector(mouseX, mouseY);
        let d = p5.Vector.dist(mousePos, this.pos);
        
        if (d < 120) {
            // O rato "empurra" a velocidade para as partículas
            let mouseVel = createVector(mouseX - pmouseX, mouseY - pmouseY);
            let proximity = map(d, 0, 120, 1, 0);
            
            // Adiciona a velocidade do rato à partícula (o "arrasto")
            this.vel.add(mouseVel.mult(0.1 * proximity));
        }

        // 2. Movimento de Expansão (Bleeding)
        // Usamos noise para um movimento orgânico "tremido"
        let n = noise(this.pos.x * 0.01, this.pos.y * 0.01, this.noiseOffset);
        let angle = n * TWO_PI * 2;
        this.vel.add(p5.Vector.fromAngle(angle).mult(0.05));

        this.pos.add(this.vel);
        // "water" feel less like syrup and more like liquid
        this.vel.mult(0.97);
        this.vel.add(p5.Vector.fromAngle(this.noiseOffset).mult(0.01));
        

        // 3. Crescimento e Secagem
        if (this.vel.mag() > 0.1) {
            this.size += this.vel.mag() * 0.5; // Growth is now tied to speed
            this.life -= 0.005; // Slightly faster drying to prevent over-saturation
        } else {
            this.life -= 0.01; // Seca mais rápido se parar
        }
    }

    display() {
        // Only draw if it's actually moving (saving CPU cycles)
        if (this.vel.mag() < 0.01) return;

        // Move blendMode OUTSIDE the for-loop if you have one
        blendMode(MULTIPLY); 
        noStroke();
        
        let c = color(this.color[0], this.color[1], this.color[2], this.alpha * this.life);
        fill(c);

        // Draw only ONE ellipse instead of 3. 
        // We rely on the fact that we don't clear the background to create the "layers"
        ellipse(this.pos.x, this.pos.y, this.size, this.size);
        
        blendMode(BLEND); 
    }
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(250, 249, 245);
    pixelDensity(1); // Melhora performance em ecrãs Retina
    
    // Manchas iniciais
    for (let i = 0; i < 6; i++) {
        let x = width / 2 + random(-250, 250);
        let y = height / 2 + random(-200, 200);
        spawnWatercolor(x, y);
    }
}

function spawnWatercolor(x, y) {
    let col = random(palette);
    for (let i = 0; i < 25; i++) {
        particles.push(new WatercolorParticle(
            x + random(-40, 40), 
            y + random(-40, 40), 
            col, 
            random(10, 40)
        ));
    }
}

function brushWatercolor(x, y) {
    let col = random(palette);
    for (let i = 0; i < 10; i++) {
        particles.push(new WatercolorParticle(
            x + random(-40, 40), 
            y + random(-40, 40), 
            col, 
            random(3, 8)
        ));
    }
}

function draw() {
    // Importante: Não limpar o fundo para a tinta acumular
    
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].display();
        
        if (particles[i].vel.mag() < 0.05 || particles[i].life <= 0) {
                particles.splice(i, 1);
            }
    }
}

function mousePressed() {
    brushWatercolor(mouseX, mouseY);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    background(250, 249, 245);
}