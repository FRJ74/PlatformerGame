// DOM elements
const startBtn = document.getElementById("start-btn"); // Button to start the game
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
    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
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

// Platform class to define platforms in the game
class Platform {
  constructor(x, y) {
    // Platform's position on the canvas
    this.position = {
      x, // Horizontal position
      y, // Vertical position
    };
    this.width = 200; // Platform's width
    this.height = proportionalSize(40); // Platform's height
  }

  // Draw the platform on the canvas
  draw() {
    ctx.fillStyle = "#acd157"; // Platform's color
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height); // Draw platform as a rectangle
  }
}

class Checkpoint {
  constructor(x, y,z) {
    this.position = {
      x, // Horizontal position
      y, // Vertical position
    };
    this.width =proportionalSize(40); // Checkpoint's width
    this.height = proportionalSize(70); // Checkpoint's height
    this.claimed = false; // Checkpoint state
  }
   draw() {
    ctx.fillStyle = "#f1be32"; // Checkpoint's color
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height); // Draw checkpoint as a rectangle
   }
   claim() {
    Checkpoint.width = 0; // Set checkpoint width to 0 when claimed
    Checkpoint.height = 0; // Set checkpoint height to 0 when claimed
    this.position.y = Infinity; // Move the checkpoint off-screen
    this.claimed = true; // Mark the checkpoint as claimed 
}
  }

// Create a new player instance
const player = new Player();

// Define platform positions
const platformPositions = [
  { x: 500, y: proportionalSize(450) },
  { x: 700, y: proportionalSize(400) },
  { x: 850, y: proportionalSize(350) },
  { x: 900, y: proportionalSize(350) },
  { x: 1050, y: proportionalSize(150) },
  { x: 2500, y: proportionalSize(450) },
  { x: 2900, y: proportionalSize(400) },
  { x: 3150, y: proportionalSize(350) },
  { x: 3900, y: proportionalSize(450) },
  { x: 4200, y: proportionalSize(400) },
  { x: 4400, y: proportionalSize(200) },
  { x: 4700, y: proportionalSize(150) },
];

// Create platform instances based on positions
const platforms = platformPositions.map(
  (platform) => new Platform(platform.x, platform.y)
);

// Create checkpoint instances based on positions
const checkpointsPositions = [ 
  { x: 1170, y: proportionalSize(80), z: 1 },
  { x: 2900, y: proportionalSize(330),z: 2 },
  { x: 4800, y: proportionalSize(80), z: 3 },
] 

const checkpoints = checkpointsPositions.map(checkpoint => new Checkpoint(checkpoint.x, checkpoint.y, checkpoint.z));
// Function to handle checkpoint collision detection


// Animation loop to update the game state
const animate = () => {
  requestAnimationFrame(animate); // Request the next animation frame
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

  platforms.forEach((platform) => {
    platform.draw(); // Draw each platform
  });

  checkpoints.forEach((checkpoint) => {
    checkpoint.draw(); // Draw each checkpoint
  });

  player.update(); // Update the player's position

  // Handle player movement based on key presses
  if (keys.rightKey.pressed && player.position.x < proportionalSize(400)) {
    player.velocity.x = 5; // Move right
  } else if (keys.leftKey.pressed && player.position.x > proportionalSize(100)) {
    player.velocity.x = -5; // Move left
  } else {
    player.velocity.x = 0; // Stop horizontal movement
  }

if (keys.rightKey.pressed && isCheckpointCollisionDetectionActive) {
    platforms.forEach(platform => platform.position.x -= 5)
    checkpoints.forEach(checkpoint => checkpoint.position.x -= 5)
  } else if (keys.leftKey.pressed && isCheckpointCollisionDetectionActive) {
    platforms.forEach(platform => platform.position.x += 5)
    checkpoints.forEach(checkpoint => checkpoint.position.x += 5)
  } // Stop horizontal movement if no keys are pressed
platforms.forEach((platform) => {
  const collisionDetectionRules = [
    // Check for collision with the top of the platform
      player.position.y + player.height + player.velocity.y >= platform.position.y &&
      player.position.y + player.height + player.velocity.y <= platform.position.y + platform.height &&
      player.position.y + player.height + player.velocity.y >= platform.position.y &&
      player.position.x + player.width >= platform.position.x &&
      player.position.x <= platform.position.x + platform.width,
    // Check for collision with the bottom of the platform
    ]
    if (collisionDetectionRules.every((rule) => rule)) {
      player.velocity.y = 0; // Stop vertical movement
      return; // Exit the loop if a collision is detected
    }

    const platformDetectionRules = [ 
      player.position.x >= platform.position.x - player.width /2,
      player.position.x <= platform.position.x + platform.width - player.width / 3,
      player.position.y + player.height >= platform.position.y,
      player.position.y <= platform.position.y + platform.height,
    ];

    if (platformDetectionRules.every((rule) => rule)) {
      player.position.y = platform.position.y + player.height;
      player.velocity.y = gravity;
    }
});// Check for collision with platforms

};

checkpoints.forEach((checkpoint, index, checkpoints) => {
  const checkpointCollisionDetectionRules = [
    player.position.x >= checkpoint.position.x,
  ]
});

// Object to track the state of key presses
const keys = {
  rightKey: {
    pressed: false, // Right arrow key state
  },
  leftKey: {
    pressed: false, // Left arrow key state
  },
};

// Function to handle player movement based on key inputs
const movePlayer = (key, xVelocity, isPressed) => {
  if (!isCheckpointCollisionDetectionActive) {
    player.velocity.x = 0; // Stop horizontal movement
    player.velocity.y = 0; // Stop vertical movement
    return;
  }

  switch (key) {
    case "ArrowLeft":
      keys.leftKey.pressed = isPressed; // Update left key state
      if (xVelocity === 0) {
        player.velocity.x = xVelocity; // Stop horizontal movement
      }
      player.velocity.x -= xVelocity; // Move left
      break;
    case "ArrowUp":
    case " ":
    case "Spacebar":
      player.velocity.y -= 8; // Jump
      break;
    case "ArrowRight":
      keys.rightKey.pressed = isPressed; // Update right key state
      if (xVelocity === 0) {
        player.velocity.x = xVelocity; // Stop horizontal movement
      }
      player.velocity.x += xVelocity; // Move right
  }
};

// Function to start the game
const startGame = () => {
  canvas.style.display = "block"; // Show the canvas
  startScreen.style.display = "none"; // Hide the start screen
  animate(); // Start the animation loop
};

const showCheckpointScreen = (msg) => {
  checkpointScreen.style.display = "block"; // Show the checkpoint screen
  checkpointMessage.textContent = msg; // Set the checkpoint message
  if (isCheckpointCollisionDetectionActive) {
    setTimeout(() => {
      checkpointScreen.style.display = "none"; // Hide the checkpoint screen after a delay
    }, 2000)
  }
};

// Event listener for the start button
startBtn.addEventListener("click", startGame);

// Event listeners for key presses
window.addEventListener("keydown", ({ key }) => {
  movePlayer(key, 8, true); // Handle key down
});

window.addEventListener("keyup", ({ key }) => {
  movePlayer(key, 0, false); // Handle key up
});
