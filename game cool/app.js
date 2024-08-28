let currentPlayer = 1;
let round = 1;
let minPercentage = 0;
let maxPercentage = 20;
let nextPlayerIncrease = [0, 0];
let accumulatedLower = 0;
let accumulatedIncrease = [0, 0];
let extraTurns = [0, 0];

const button = document.getElementById("explosion-button");
const cardContainers = [
  document.querySelector("#player1 .cards"),
  document.querySelector("#player2 .cards"),
];

function updateButton() {
  let percentage =
    Math.floor(Math.random() * (maxPercentage - minPercentage + 1)) +
    minPercentage;
  button.textContent = `${percentage}%`;
  return percentage;
}

function createCard(player) {
  const card = document.createElement('div');
  card.classList.add('card');
  const randomNum = Math.random();
  let cardType;

  if (randomNum < 0.30) {
    // No card is created
    return;
  } else if (randomNum < 0.55) {
    cardType = 'lower';
    card.textContent = 'Lower %';
  } else if (randomNum < 0.60) {
    cardType = 'skip';
    card.textContent = 'Skip Turn';
  } else if (randomNum < 0.70) {
    cardType = 'increase';
    card.textContent = 'Increase %';
  } else if (randomNum < 0.80) {
    cardType = 're-randomize';
    card.textContent = 'Re-randomize';
  } else if (randomNum < 0.90) {
    cardType = 'half';
    card.textContent = 'Half %';
  } else if (randomNum < 0.95) {
    cardType = 'double-turn';
    card.textContent = 'Double Turn';
  } else {
    cardType = 'swap';
    card.textContent = 'Swap %';
  }

  card.addEventListener('click', () => useCard(card, cardType, player));
  cardContainers[player - 1].appendChild(card);
}

function useCard(card, type, player) {
  const amount = Math.floor(Math.random() * (round * 8)) + 1;
  const nextPlayer = player === 1 ? 2 : 1;

  switch (type) {
    case "lower":
      let currentPercentage = parseInt(button.textContent);
      currentPercentage = Math.max(currentPercentage - amount, minPercentage);
      button.textContent = `${currentPercentage}%`;
      break;
    case "skip":
      switchPlayer();
      break;
    case "increase":
      nextPlayerIncrease[nextPlayer - 1] += amount;
      break;
    case "re-randomize":
      updateButton();
      break;
    case "half":
      let halfPercentage = Math.floor(parseInt(button.textContent) / 2);
      button.textContent = `${Math.max(halfPercentage, minPercentage)}%`;
      break;
    case "double-turn":
      extraTurns[nextPlayer - 1] += 1;
      break;
    case "swap":
      let currentValue = parseInt(button.textContent);
      let swappedValue = 100 - currentValue;
      button.textContent = `${Math.max(swappedValue, minPercentage)}%`;
      break;
  }

  card.remove();
}

function switchPlayer() {
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  if (extraTurns[currentPlayer - 1] > 0) {
    extraTurns[currentPlayer - 1]--;
    currentPlayer = currentPlayer === 1 ? 2 : 1;
  }
  document.querySelector("#player1").classList.toggle("current-player");
  document.querySelector("#player2").classList.toggle("current-player");
  document.querySelector('#player1').classList.toggle('disabled');
  document.querySelector('#player2').classList.toggle('disabled');
}

function nextRound() {
  round++;
  minPercentage += 3;
  maxPercentage = Math.min(maxPercentage + 3, 100);
  document.getElementById("round-number").textContent = round;
  updateButton();
  createCard(1);
  createCard(2);
}

button.addEventListener("click", () => {
  let percentage = updateButton();
  percentage = Math.max(percentage - accumulatedLower, minPercentage);
  button.textContent = `${percentage}%`;

  setTimeout(() => {
    if (Math.random() * 100 < percentage) {
      alert(`Player ${currentPlayer} exploded! Game Over!`); //fuck
      location.reload();
    } else {
      accumulatedLower = 0;
      switchPlayer();
      if (currentPlayer === 1) {
        nextRound();
      }
    }
  }, 1000);
});

// Initialize the game
updateButton();
createCard(1);
createCard(2);
document.querySelector("#player1").classList.add("current-player");
document.querySelector("#player2").classList.add("disabled");