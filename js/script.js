let reminders = [];

function addReminder() {
  const input = document.getElementById("reminder-input");
  let reminderText = input.value.trim();
  const [textBeforeSlash, afterSlash] = reminderText.split("/").map(s => s.trim());

  let remainingTime = 25 * 60 * 60 * 1000;
  if (afterSlash && !isNaN(parseInt(afterSlash))) {
    remainingTime = (parseInt(afterSlash) + 1) * 60 * 60 * 1000;
  }

  const reminder = {
    text: reminderText,
    time: new Date().getTime(), // Save the time as a timestamp
    remainingTime: remainingTime,
    expired: false,
    timerId: null,
  };

  reminders.push(reminder);
  input.value = "";
  saveReminders(); // Save the reminders to localStorage
  displayReminders();
}

function displayReminders() {
  const reminderList = document.getElementById("reminder-list");
  reminderList.innerHTML = "";

  reminders.forEach((reminder) => {
    const listItem = document.createElement("li");
    const reminderText = document.createElement("span");
    const timerText = document.createElement("span");

    [reminderText.textContent] = reminder.text.split("/");
    timerText.style.float = "right";

    listItem.addEventListener("click", () => {
      clearInterval(reminder.timerId);
      reminders.splice(reminders.indexOf(reminder), 1);
      saveReminders(); // Save the reminders to localStorage
      displayReminders();
    });

    listItem.appendChild(reminderText);
    listItem.appendChild(timerText);
    reminderList.appendChild(listItem);

    reminder.timerId = setInterval(() => {
      const timeDiff = new Date().getTime() - reminder.time; // Calculate the time difference from the timestamp
      const remainingTime = reminder.remainingTime - timeDiff;
      const hours = Math.floor(remainingTime / (60 * 60 * 1000));
      const minutes = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000));
      const seconds = Math.floor((remainingTime % (60 * 1000)) / 1000);

      if (remainingTime <= 0) {
        reminder.expired = true;
        listItem.style.textDecoration = "line-through";
        timerText.textContent = "Expired";
        clearInterval(reminder.timerId);
      } else if (hours > 24) {
        timerText.textContent = "more than 24h";
      } else if (hours > 0) {
        timerText.textContent = `${hours}h`;
      } else {
        timerText.textContent = `${minutes}ms`;
      }
    }, 1000);
  });
}

function saveReminders() {
  localStorage.setItem("reminders", JSON.stringify(reminders)); // Save the reminders as a JSON string
}

function loadReminders() {
  const savedReminders = localStorage.getItem("reminders");
  if (savedReminders) {
    reminders = JSON.parse(savedReminders); // Parse the JSON string to an object
    displayReminders();
  }
}

document.getElementById("reminder-form").addEventListener("submit", (event) => {
  event.preventDefault();
  addReminder();
});

// Load the reminders from localStorage when the page is loaded
window.addEventListener("load", () => {
  loadReminders();
});
