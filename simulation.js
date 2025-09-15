let canvas = document.getElementById("simCanvas");
let ctx = canvas.getContext("2d");

const carWidth = 250;
const carHeight = 120;
const roadY = canvas.height - carHeight - 5;

let speed = 0;
let friction = 0;
let tailwind = 0;
let air = 0;
let velocity = 0;
let position = 0;
let isRunning = false;

let carImage = new Image();
carImage.src = "car3.png";

carImage.onload = () => {
  drawCar();
};

function changeCar() {
  const selectedCar = document.getElementById("carSelector").value;
  carImage.src = selectedCar;
  carImage.onload = () => drawCar();
}

const background = new Image();
background.src = "city.png";

background.onload = () => {
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  drawCar();
};

function drawCar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(carImage, position, roadY, carWidth, carHeight);
}

function resetSim() {
  isRunning = false;
  position = 0;
  drawCar();
}

function startSim() {
  speed = parseFloat(document.getElementById("speedSlider").value);
  friction = parseFloat(document.getElementById("frictionSlider").value);
  tailwind = parseFloat(document.getElementById("tailwindSlider").value);
  air = parseFloat(document.getElementById("airSlider").value);

  velocity = calculateNetVelocity();

  document.getElementById("speedVal").innerText = speed;
  document.getElementById("tailwindVal").innerText = tailwind;
  document.getElementById("frictionVal").innerText = friction;
  document.getElementById("airVal").innerText = air;
  document.getElementById("velocityVal").innerText = velocity.toFixed(2);

  if (velocity > 0) {
    isRunning = true;
    animate();
  } else {
    alert("The car will not move since the net velocity is zero due to the opposing forces.");
  }
}

function calculateNetVelocity() {
  return (speed + tailwind) - (friction + air);
}

function animate() {
  if (isRunning) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(carImage, position, roadY, carWidth, carHeight);
    position += velocity;
    requestAnimationFrame(animate);
  }
}

// Quiz logic
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

let currentQuestion = 0;

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

  q.options.forEach(option => {
    const btn = document
