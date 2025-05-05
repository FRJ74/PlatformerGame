// DOM elements
const startBtn = document.getElementById("start-btn"); // Start button to begin the game
const canvas = document.getElementById("canvas"); // Canvas element for rendering the game
const startScreen = document.querySelector(".start-screen"); // Start screen overlay
const checkpointScreen = document.querySelector(".checkpoint-screen"); // Checkpoint screen overlay
const checkpointMessage = document.querySelector(".checkpoint-screen > p"); // Message displayed on the checkpoint screen

// Canvas setup
const ctx = canvas.getContext("2d"); // Canvas rendering context
canvas.width = innerWidth; // Set canvas width to the window's inner width
canvas.height = innerHeight; // Set canvas height to the window's inner height

// Game constants
const gravity = 0.5; // Gravity constant for player movement
let isCheckpointCollisionDetectionActive = true; // Flag to enable/disable checkpoint collision detection

// Utility function to calculate proportional sizes based on screen height
const proportionalSize = (size) => {
    return innerHeight < 500 ? Math.ceil((size / 500) * innerHeight) : size;
};

// Player class to define the player character
class Player {
    constructor() {
        // Player's position on the canvas
        this.position = {
           x: proportionalSize(10), // Initial x position
           y: proportionalSize(400), // Initial y position
        };
        // Player's velocity for movement
        this.velocity = {
            x: 0, // Horizontal velocity
            y: 0, // Vertical velocity
        };
        // Player's dimensions
        this.width = proportionalSize(40); // Player's width
        this.height = proportionalSize(40); // Player's height
    }

    // Draw the player on the canvas
    draw() {
        ctx.fillStyle = "#99c9ff"; // Player's color
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height); // Draw player as a rectangle
    }

    // Update the player's position and handle collisions
    update() {
        this.draw(); // Draw the player
        this.position.x += this.velocity.x; // Update horizontal position
        this.position.y += this.velocity.y; // Update vertical position

        // Apply gravity and prevent the player from falling below the canvas
        if (this.position.y + this.velocity.y + this.height <= canvas.height) {
            if (this.position.y < 0) { // Prevent the player from moving above the canvas
                this.position.y = 0;
                this.velocity.y = gravity;
            }
            this.velocity.y += gravity; // Apply gravity
        } else {
            this.velocity.y = 0; // Stop vertical movement when hitting the ground
        }

        // Prevent the player from moving off the left side of the canvas
        if (this.position.x < this.width) {
            this.position.x = this.width;
        }

        // Prevent the player from moving off the right side of the canvas
        if (this.position.x >= canvas.width - this.width * 2) {
            this.position.x = canvas.width - this.width * 2;
        }
    }
}

class Platform {
    constructor({ x, y, width, height }) {
        this.position = { x, y }; // Platform's position
        this.width = width; // Platform's width
        this.height = height; // Platform's height
    }

    // Draw the platform on the canvas
    draw() {
        ctx.fillStyle = "#ffcc99"; // Platform's color
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height); // Draw platform as a rectangle
    }
}

// Create a new player instance
const player = new Player();

const platformPositions = [
    { x: proportionalSize(10), y: proportionalSize(400), width: proportionalSize(100), height: proportionalSize(20) }, // Platform 1
    { x: proportionalSize(200), y: proportionalSize(300), width: proportionalSize(100), height: proportionalSize(20) }, // Platform 2
    { x: proportionalSize(400), y: proportionalSize(200), width: proportionalSize(100), height: proportionalSize(20) }, // Platform 3
    { x: proportionalSize(600), y: proportionalSize(100), width: proportionalSize(100), height: proportionalSize(20) }, // Platform 4
    { x: proportionalSize(800), y: proportionalSize(50), width: proportionalSize(100), height: proportionalSize(20) }, // Platform 5
    { x: proportionalSize(1000), y: proportionalSize(400), width: proportionalSize(100), height: proportionalSize(20) }, // Platform 6
    { x: proportionalSize(1200), y: proportionalSize(300), width: proportionalSize(100), height: proportionalSize(20) }, // Platform 7
    { x: proportionalSize(1400), y: proportionalSize(200), width: proportionalSize(100), height: proportionalSize(20) }, // Platform 8
    { x: proportionalSize(1600), y: proportionalSize(100), width: proportionalSize(100), height: proportionalSize(20) }, // Platform 9
]; // Array to store platform positions

// Animation loop to update the game state
const animate = () => {
    requestAnimationFrame(animate); // Request the next animation frame
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    player.update(); // Update the player's position

    // Handle player movement based on key presses
    if (keys.rightKey.pressed && player.position.x < proportionalSize(400)) {
        player.velocity.x = 5; // Move right
    } else if (keys.leftKey.pressed && player.position.x > proportionalSize(400)) {
        player.velocity.x = -5; // Move left
    } else {
        player.velocity.x = 0; // Stop horizontal movement
    }
};

// Object to track the state of key presses
const keys = {
    rightKey: { pressed: false }, // Right arrow key state
    leftKey: { pressed: false }, // Left arrow key state
};

// Function to handle player movement based on key presses
const movePlayer = (key, xVelocity, isPressed) => {
    if (!isCheckpointCollisionDetectionActive) {
        player.velocity.x = 0;
        player.velocity.y = 0;
        return
    } // If checkpoint collision detection is not active, do nothing
    switch (key) {
        case "ArrowLeft":
            keys.leftKey.pressed = isPressed; // Update left key state
            if (xVelocity === 0) {
                player.velocity.x = xVelocity;
              } // Set horizontal velocity based on key state
              player.velocity.x -= xVelocity; // Move left
                break;
        case "ArrowUp":  
        case " ":            
        case "Spacebar":
                player.velocity.y -= 8;
                break;
        case "ArrowRight":
                keys.rightKey.pressed = isPressed; // Update right key state
                  if (xVelocity === 0) {
                       player.velocity.x = xVelocity;
                     } // Set horizontal velocity based on key state
                     player.velocity.x += xVelocity; // Move right
                     break;
  }        
};

// Function to start the game
const startGame = () => {
    canvas.style.display = "block"; // Show the canvas
    startScreen.style.display = "none"; // Hide the start screen
   animate(); // Start the animation loop
    isCheckpointCollisionDetectionActive = true; // Enable checkpoint collision detection
    player.position.x = proportionalSize(10); // Reset player position
    player.position.y = proportionalSize(400); // Reset player position
    player.velocity.x = 0; // Reset horizontal velocity
    player.velocity.y = 0; // Reset vertical velocity
    checkpointScreen.style.display = "none"; // Hide the checkpoint screen
    checkpointMessage.innerText = ""; // Clear the checkpoint message
};

// Event listener for the start button
startBtn.addEventListener("click", startGame); // Start the game when the button is clicked

window.addEventListener('keydown', ({ key }) => {
    movePlayer(key, 8, true); // Handle keydown events for player movement
}); // Handle keydown events

window.addEventListener("keyup", ({key}) => { 
    movePlayer(key, 0, false); // Handle keyup events for player movement
});

