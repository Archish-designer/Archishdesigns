// === Canvas Setup ===
const canvas = document.getElementById("simCanvas"); // GUI canvas element for simulation
const ctx = canvas.getContext("2d"); // 2D rendering context for drawing

// === Constants ===
const CAR_WIDTH = 250; // Width of car image in pixels (integer)
const CAR_HEIGHT = 120; // Height of car image in pixels (integer)
const ROAD_Y = canvas.height - CAR_HEIGHT - 5; // Y-position of car on canvas (integer)

// === Class: AeroLabSimulation ===
// Encapsulates all simulation logic and state
class AeroLabSimulation {
  // === Private Properties ===
  #speed = 0;           // Speed input from user (float)
  #friction = 0;        // Friction force (float)
  #tailwind = 0;        // Tailwind force (float)
  #airResistance = 0;   // Air resistance force (float)
  #velocity = 0;        // Net velocity (float)
  #position = 0;        // Car's horizontal position (float)
  #isRunning = false;   // Animation state (boolean)

  constructor() {
    // === Load Car Image ===
    this.carImage = new Image(); // Object: HTMLImageElement
    this.carImage.src = "car3.png";
    this.carImage.onload = () => this.drawCar();

    // === Load Background Image ===
    this.background = new Image(); // Object: HTMLImageElement
    this.background.src = "city.png";
    this.background.onload = () => this.drawCar();
  }

  // === Getters ===
  get velocity() {
    return this.#velocity;
  }

  get position() {
    return this.#position;
  }

  // === Setters with Validation ===
  set speed(val) {
    if (val !== undefined && !isNaN(val)) {
      this.#speed = Math.max(0, parseFloat(val)); // Range check: must be ≥ 0
    }
  }

  set friction(val) {
    if (val !== undefined && !isNaN(val)) {
      this.#friction = Math.max(0, parseFloat(val));
    }
  }

  set tailwind(val) {
    if (val !== undefined && !isNaN(val)) {
      this.#tailwind = Math.max(0, parseFloat(val));
    }
  }

  set airResistance(val) {
    if (val !== undefined && !isNaN(val)) {
      this.#airResistance = Math.max(0, parseFloat(val));
    }
  }

  // === Method: Change Car Image ===
  changeCar(src) {
    this.carImage.src = src;
    this.carImage.onload = () => this.drawCar();
  }

  // === Method: Draw Car and Background ===
  drawCar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(this.background, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(this.carImage, this.#position, ROAD_Y, CAR_WIDTH, CAR_HEIGHT);
  }

  // === Method: Reset Simulation ===
  reset() {
    this.#isRunning = false;
    this.#position = 0;
    this.drawCar();
  }

  // === Method: Start Simulation ===
  start() {
    // === Read and Validate Inputs ===
    this.speed = document.getElementById("speedSlider").value;
    this.friction = document.getElementById("frictionSlider").value;
    this.tailwind = document.getElementById("tailwindSlider").value;
    this.airResistance = document.getElementById("airSlider").value;

    // === Calculate Net Velocity ===
    this.#velocity = this.calculateNetVelocity();

    // === Update GUI Force Panel ===
    document.getElementById("speedVal").innerText = this.#speed;
    document.getElementById("tailwindVal").innerText = this.#tailwind;
    document.getElementById("frictionVal").innerText = this.#friction;
    document.getElementById("airVal").innerText = this.#airResistance;
    document.getElementById("velocityVal").innerText = this.#velocity.toFixed(2);

    // === Branching: Check if car should move ===
    if (this.#velocity > 0) {
      this.#isRunning = true;
      this.animate();
    } else {
      alert("The car will not move since the net velocity is zero due to the opposing forces.");
    }
  }

  // === Method: Calculate Net Velocity ===
  calculateNetVelocity() {
    return (this.#speed + this.#tailwind) - (this.#friction + this.#airResistance);
  }

  // === Method: Animate Car Movement ===
  animate() {
    // === Loop: Continue while simulation is running ===
    if (this.#isRunning) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(this.background, 0, 0, canvas.width, canvas.height);
      ctx.drawImage(this.carImage, this.#position, ROAD_Y, CAR_WIDTH, CAR_HEIGHT);
      this.#position += this.#velocity;
      requestAnimationFrame(() => this.animate());
    }
  }
}

// === Instantiate Simulation Object ===
const sim = new AeroLabSimulation(); // Global object controlling simulation

// === Event Handlers ===
function changeCar() {
  const selectedCar = document.getElementById("carSelector").value;
  sim.changeCar(selectedCar);
}

function startSim() {
  sim.start();
}

function resetSim() {
  sim.reset();
}

// === Quiz Logic ===
// Array of quiz questions (object collection)
const quizData = [
  {
    question: "Which force helps the car move forward?",
    options: ["Tailwind", "Friction", "Air Resistance"],
    correct: "Tailwind"
  },
  {
    question: "Which force opposes motion due to contact with the road?",
    options: ["Tailwind", "Friction", "Speed"],
    correct: "Friction"
  },
  {
    question: "What happens if opposing forces are greater than helpful forces?",
    options: ["The car speeds up", "The car stops or slows down", "The car flies"],
    correct: "The car stops or slows down"
  }
];

let currentQuestion = 0; // Local variable tracking quiz progress

function startQuiz() {
  currentQuestion = 0;
  document.getElementById("quizBox").style.display = "block";
  document.getElementById("quizFeedback").innerText = "";
  showQuestion();
}

function showQuestion() {
  const q = quizData[currentQuestion];
  document.getElementById("quizQuestion").innerText = q.question;

  const optionsDiv = document.getElementById("quizOptions");
  optionsDiv.innerHTML = "";

  // === Loop: Create buttons for each option ===
  q.options.forEach(option => {
    const btn = document.createElement("button");
    btn.innerText = option;
    btn.onclick = function () {
      handleAnswer(option);
    };
    optionsDiv.appendChild(btn);
  });
}

function handleAnswer(selected) {
  const q = quizData[currentQuestion];
  const feedback = document.getElementById("quizFeedback");

  // === Branching: Check answer correctness ===
  if (selected === q.correct) {
    feedback.innerText = "✅ Correct!";
    feedback.style.color = "green";
  } else {
    feedback.innerText = "❌ Incorrect. Try again.";
    feedback.style.color = "red";
    return;
  }

  // === Branching: Move to next question or finish ===
  currentQuestion++;
  if (currentQuestion < quizData.length) {
    setTimeout(() => {
      feedback.innerText = "";
      showQuestion();
    }, 1000);
  } else {
    feedback.innerText = "🎉 Quiz complete!";
    feedback.style.color = "blue";
  }
}

