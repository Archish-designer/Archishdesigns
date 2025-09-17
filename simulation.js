// Canvas setup
const canvas = document.getElementById("simCanvas");
const ctx = canvas.getContext("2d");

// Constants for car dimensions and road position
const carWidth = 250; // Width of the car image 
const carHeight = 120; // Height of the car image 
const roadY = canvas.height - carHeight - 5; // position of where the car sits

// Class representing the simulation logic
class AeroLabSimulation {
  // Encapsulated properties
  #speed = 0;       // Speed input (must be a number)
  #friction = 0;    // Friction force (must be a number)
  #tailwind = 0;    // Tailwind force (must be a number)
  #airResistance = 0; // Air resistance force (must be a number)
  #velocity = 0;    // Net velocity (calculated)
  #position = 0;    // Car's horizontal position
  #isRunning = false; // Flag to control animation loop

  constructor() {
    // Load  car image
    this.carImage = new Image();
    this.carImage.src = "car3.png";
    this.carImage.onload = () => this.drawCar();

    // Load background image
    this.background = new Image();
    this.background.src = "city.png";
    this.background.onload = () => this.drawCar();
  }

  // Getters
  get velocity() {
    return this.#velocity;
  }

  get position() {
    return this.#position;
  }

  // Setters
  set speed(val) {
    this.#speed = parseFloat(val);
  }

  set friction(val) {
    this.#friction = parseFloat(val);
  }

  set tailwind(val) {
    this.#tailwind = parseFloat(val);
  }

  set airResistance(val) {
    this.#airResistance = parseFloat(val);
  }

  // Method to change car image
  changeCar(src) {
    this.carImage.src = src;
    this.carImage.onload = () => this.drawCar();
  }

  // Method to draw car and background
  drawCar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(this.background, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(this.carImage, this.#position, roadY, carWidth, carHeight);
  }

  // Method to reset simulation
  reset() {
    this.#isRunning = false;
    this.#position = 0;
    this.drawCar();
  }

  // Method to start simulation
  start() {
    // Read values from sliders
    this.speed = document.getElementById("speedSlider").value;
    this.friction = document.getElementById("frictionSlider").value;
    this.tailwind = document.getElementById("tailwindSlider").value;
    this.airResistance = document.getElementById("airSlider").value;

    // Calculate net velocity
    this.#velocity = this.calculateNetVelocity();

    // Update force breakdown panel
    document.getElementById("speedVal").innerText = this.#speed;
    document.getElementById("tailwindVal").innerText = this.#tailwind;
    document.getElementById("frictionVal").innerText = this.#friction;
    document.getElementById("airVal").innerText = this.#airResistance;
    document.getElementById("velocityVal").innerText = this.#velocity.toFixed(2);

    // If velocity is positive, start animation
    if (this.#velocity > 0) {
      this.#isRunning = true;
      this.animate();
    } else {
      alert("The car will not move since the net velocity is zero due to the opposing forces.");
    }
  }

  // Method to calculate net velocity
  calculateNetVelocity() {
    // arithmatic method
    return (this.#speed + this.#tailwind) - (this.#friction + this.#airResistance);
  }

  // Animation loop
  animate() {
    // While simulation is running, update position and redraw
    if (this.#isRunning) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(this.background, 0, 0, canvas.width, canvas.height);
      ctx.drawImage(this.carImage, this.#position, roadY, carWidth, carHeight);
      this.#position += this.#velocity;
      requestAnimationFrame(() => this.animate());
    }
  }
}

const sim = new AeroLabSimulation();

// Event bindings
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

// ----------------------
// Quiz Logic
// ----------------------

// Array of quiz questions (collection of objects)
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

let currentQuestion = 0; // Tracks which question is being shown

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

  // Loop through options and create buttons
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

  // If answer is correct
  if (selected === q.correct) {
    feedback.innerText = "✅ Correct!";
    feedback.style.color = "green";
  } else {
    feedback.innerText = "❌ Incorrect. Try again.";
    feedback.style.color = "red";
    return; // Exit early if wrong
  }

  // Move to next question
  currentQuestion++;
  if (currentQuestion < quizData.length) {
    // Wait before showing next question
    setTimeout(() => {
      feedback.innerText = "";
      showQuestion();
    }, 1000);
  } else {
    feedback.innerText = "🎉 Quiz complete!";
    feedback.style.color = "blue";
  }
}
