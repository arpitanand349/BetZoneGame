let balance = parseFloat(localStorage.getItem("balance")) || 0;
let history = JSON.parse(localStorage.getItem("history")) || [];


function updateBalanceDisplay() {
  document.getElementById("balance").innerText = `Balance: ₹${balance}`;
  localStorage.setItem("balance", balance);

}

function depositMoney() {
  const amount = parseFloat(document.getElementById("depositAmount").value);
  if (isNaN(amount) || amount <= 0) return alert("Enter valid deposit amount");
  balance += amount;
  updateBalanceDisplay();
  document.getElementById("depositAmount").value = "";
}

function addMoney() {
  const add = prompt("Enter amount to add:");
  const amount = parseFloat(add);
  if (isNaN(amount) || amount <= 0) return alert("Invalid amount");
  balance += amount;
  updateBalanceDisplay();
}

function withdrawMoney() {
  const withdraw = prompt("Enter amount to withdraw:");
  const amount = parseFloat(withdraw);
  if (isNaN(amount) || amount <= 0 || amount > balance) return alert("Invalid amount");
  balance -= amount;
  updateBalanceDisplay();
}

function setBet(amount) {
  document.getElementById("betAmount").value = amount;
}

function playGame() {
  const bet = parseFloat(document.getElementById("betAmount").value);
  const choice = document.getElementById("choice").value;
  const resultDiv = document.getElementById("result");

  if (isNaN(bet) || bet <= 0) return alert("Enter valid bet amount");
  if (bet > balance) return alert("Insufficient balance");

  const randomNum = Math.floor(Math.random() * 100);
  const outcome = randomNum % 2 === 0 ? "even" : "odd";

  const isWin = choice === outcome;

  let sound;
  if (isWin) {
    const winnings = Math.floor(bet * 1.7);
    balance += winnings - bet;
    resultDiv.innerText = `You won! Random: ${randomNum} (${outcome}).\nYou got ₹${winnings}`;
    sound = document.getElementById("winSound");
  } else {
    balance -= bet;
    resultDiv.innerText = `You lost! Random: ${randomNum} (${outcome}).\nYou lost ₹${bet}`;
    sound = document.getElementById("loseSound");
  }

  sound.play();
  updateBalanceDisplay();
  addToHistory(bet, choice, outcome, isWin);
}

function addToHistory(bet, choice, outcome, win) {
  const entry = `Bet: ₹${bet}, Chose: ${choice}, Result: ${outcome}, ${win ? "Won" : "Lost"}`;
  history.unshift(entry);
  const list = document.getElementById("historyList");
  list.innerHTML = "";
  history.forEach(h => {
    const li = document.createElement("li");
    li.textContent = h;
    list.appendChild(li);
  });
  localStorage.setItem("history", JSON.stringify(history));

}

function toggleTheme() {
  document.body.classList.toggle("dark-mode");
}

function toggleHistory() {
  const historySec = document.getElementById("historySection");
  historySec.classList.toggle("hidden");
}
document.addEventListener("DOMContentLoaded", () => {
  const betInput = document.getElementById('betAmount');
  const quickButtons = document.querySelectorAll('.quick-btn');

  quickButtons.forEach(button => {
    button.addEventListener('click', () => {
      const increment = parseInt(button.getAttribute('data-increment'));
      const currentValue = parseInt(betInput.value) || 0;
      betInput.value = currentValue + increment;
    });
  });
});
