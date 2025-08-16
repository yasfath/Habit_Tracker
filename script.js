const habitInput = document.getElementById("habitInput");
const addHabitBtn = document.getElementById("addHabitBtn");
const habitList = document.getElementById("habitList");
const toggleThemeBtn = document.getElementById("toggleTheme");
const quoteBox = document.getElementById("quoteBox");


let habits = JSON.parse(localStorage.getItem("habits")) || [];


const quotes = [
  "🔥 Small steps every day create big results!",
  "✨ Consistency is the key to success.",
  "💪 Don’t break the chain — you’re doing amazing!",
  "🌱 Your habits shape your future.",
  "🚀 Keep pushing, you’re unstoppable!"
];

// Save habits
function saveHabits() {
  localStorage.setItem("habits", JSON.stringify(habits));
}


function renderHabits() {
  habitList.innerHTML = "";
  habits.forEach((habit, index) => {
    const col = document.createElement("div");
    col.className = "habit-box";

    col.innerHTML = `
      <div class="habit-header">
        <h5 class="habit-name">${habit.name}</h5>
        <span class="habit-streak">🔥 ${habit.streak} days</span>
      </div>
      <p class="habit-text">Keep going! Don’t break the chain.</p>
      <div class="habit-buttons">
        <button class="done-btn" onclick="markDone(${index})">✔ Done</button>
        <button class="delete-btn" onclick="deleteHabit(${index})">🗑 Delete</button>
      </div>
    `;
    habitList.appendChild(col);
  });
}


addHabitBtn.addEventListener("click", () => {
  const habitName = habitInput.value.trim();
  if (habitName !== "") {
    if (habits.some(h => h.name.toLowerCase() === habitName.toLowerCase())) {
      alert("This habit already exists!");
      return;
    }
    habits.push({ name: habitName, streak: 0, lastDone: null });
    habitInput.value = "";
    saveHabits();
    renderHabits();
    showQuote();
    sendNotification("New Habit Added 🌟", `${habitName} has been added!`);
  }
});


function markDone(index) {
  const today = new Date().toDateString();
  if (habits[index].lastDone !== today) {
    habits[index].streak++;
    habits[index].lastDone = today;
    saveHabits();
    renderHabits();
    showQuote();
    sendNotification("Habit Updated ✅", `${habits[index].name} streak: ${habits[index].streak} days`);

    
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  } else {
    sendNotification("Already Logged ⚡", `You already marked "${habits[index].name}" today.`);
  }
}

function deleteHabit(index) {
  const habitName = habits[index].name;
  habits.splice(index, 1);
  saveHabits();
  renderHabits();
  sendNotification("Habit Removed ❌", `${habitName} has been deleted.`);
}


toggleThemeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  toggleThemeBtn.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
});


function showQuote() {
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  quoteBox.textContent = randomQuote;
}


if ("Notification" in window) {
  Notification.requestPermission();
}
function sendNotification(title, body) {
  if (Notification.permission === "granted") {
    new Notification(title, { body });
  }
}

setInterval(() => {
  if (habits.length > 0) {
    sendNotification("⏰ Habit Reminder", "Don’t forget to update your habits today!");
  }
}, 24 * 60 * 60 * 1000);

renderHabits();