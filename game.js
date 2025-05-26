function saveHistoryEntry(entry) {
  let history = JSON.parse(localStorage.getItem("gameHistory")) || [];
  history.push(entry);
  localStorage.setItem("gameHistory", JSON.stringify(history));
}

let selectedChoice = null;

const balanceSpan = document.getElementById('balance');
const oddBtn = document.getElementById('oddBtn');
const evenBtn = document.getElementById('evenBtn');
const betAmountInput = document.getElementById('betAmount');
const playBtn = document.getElementById('playBtn');
const resultMsg = document.getElementById('resultMsg');
const logoutBtn = document.getElementById('logoutBtn');

let loggedInUser = localStorage.getItem('loggedInUser');
if (!loggedInUser) {
  alert('Please login first.');
  window.location.href = 'login.html';
}

const users = JSON.parse(localStorage.getItem('users')) || {};
if (!users[loggedInUser]) {
  alert('User data not found.');
  window.location.href = 'login.html';
}

function updateBalance() {
  balanceSpan.textContent = users[loggedInUser].balance.toFixed(2);
}
updateBalance();

function clearSelection() {
  selectedChoice = null;
  oddBtn.classList.remove('selected');
  evenBtn.classList.remove('selected');
  betAmountInput.value = '';
}

function updateChoiceHighlight() {
  oddBtn.classList.toggle('selected', selectedChoice === 'odd');
  evenBtn.classList.toggle('selected', selectedChoice === 'even');
}

oddBtn.addEventListener('click', () => {
  selectedChoice = 'odd';
  updateChoiceHighlight();
  resultMsg.textContent = '';
});

evenBtn.addEventListener('click', () => {
  selectedChoice = 'even';
  updateChoiceHighlight();
  resultMsg.textContent = '';
});

playBtn.addEventListener('click', () => {
  const bet = parseFloat(betAmountInput.value);
  const user = users[loggedInUser];

  if (!selectedChoice) {
    resultMsg.style.color = 'red';
    resultMsg.textContent = 'Please choose Odd or Even.';
    return;
  }
  if (isNaN(bet) || bet <= 0) {
    resultMsg.style.color = 'red';
    resultMsg.textContent = 'Enter a valid bet amount.';
    return;
  }
  if (bet > user.balance) {
    resultMsg.style.color = 'red';
    resultMsg.textContent = 'Insufficient balance.';
    return;
  }

  // Generate random number between 1 and 10
  const randomNum = Math.floor(Math.random() * 10) + 1;
  const resultSide = randomNum % 2 === 0 ? 'even' : 'odd';

  let outcome;

  if (selectedChoice === resultSide) {
    // Win: 1.7x payout
    const winnings = bet * 1.7;
    user.balance += winnings - bet; // add net profit
    resultMsg.style.color = 'green';
    resultMsg.textContent = `You won! Number was ${randomNum} (${resultSide}).\nYou earned ₹${winnings.toFixed(2)}.`;
    outcome = 'Win';
  } else {
    // Lose: lose bet
    user.balance -= bet;
    resultMsg.style.color = 'red';
    resultMsg.textContent = `You lost! Number was ${randomNum} (${resultSide}).\nYou lost ₹${bet.toFixed(2)}.`;
    outcome = 'Lose';
  }

  users[loggedInUser] = user;
  localStorage.setItem('users', JSON.stringify(users));
  updateBalance();

  // Save history BEFORE clearing selection
  saveHistoryEntry({
    timestamp: new Date().toLocaleString(),
    choice: selectedChoice,
    generated: randomNum,
    bet: bet,
    outcome: outcome
  });

  clearSelection();
});

// Logout button
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('loggedInUser');
  window.location.href = 'login.html';
});

// Quick bet buttons
document.querySelectorAll('.quick-btn').forEach(button => {
  button.addEventListener('click', () => {
    const increment = parseInt(button.dataset.increment);
    let currentBet = parseFloat(betAmountInput.value) || 0;
    betAmountInput.value = currentBet + increment;
  });
});
