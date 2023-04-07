
let reminders = [];

function addReminder() {
  let input = document.getElementById("reminder-input");
  let reminderText = input.value.trim();

  if (reminderText !== "") {
    let reminder = {
      text: reminderText,
      time: new Date(),
      expired: false,
      timerId: null
    };
    reminders.push(reminder);

    // Clear the input field
    input.value = "";

    // Display the reminder list
    displayReminders();
  }
}

function displayReminders() {
  let reminderList = document.getElementById("reminder-list");
  reminderList.innerHTML = "";

  reminders.forEach(function(reminder) {
    let listItem = document.createElement("li");

    // Create the reminder text
    let reminderText = document.createElement("span");
    reminderText.textContent = reminder.text;
    listItem.appendChild(reminderText);

    // Create the timer text
    let timerText = document.createElement("span");
    timerText.style.float = "right";
    listItem.appendChild(timerText);

    // Add event listener to remove reminder on click
    listItem.addEventListener("click", function() {
      clearInterval(reminder.timerId);
      reminders = reminders.filter(function(r) {
        return r !== reminder;
      });
      displayReminders();
    });

    reminderList.appendChild(listItem);

    // Start the timer
    reminder.timerId = setInterval(function() {
        let timeDiff = new Date() - reminder.time;
        let remainingTime = 24 * 60 * 60 * 1000 - timeDiff;
      
        let hours = Math.floor(remainingTime / (60 * 60 * 1000));
        let minutes = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000));
        let secs = Math.floor((remainingTime % (60 * 1000)) / 1000);

      
        if (hours < 0) {
          reminder.expired = true;
          listItem.style.textDecoration = "line-through";
          timerText.textContent = "Expired";
          clearInterval(reminder.timerId);
        } else if (hours < 1 && minutes < 1) {
            timerText.textContent = `${secs}s`;
        } else if (hours < 1 && minutes > 0) {
          timerText.textContent = `${minutes}m`;
        }else{
            timerText.textContent = `${hours}h`;
        }
      }, 1000); // Update the timer every second
      
  });
}

// Add event listener for form submission
document.getElementById("reminder-form").addEventListener("submit", function(event) {
  event.preventDefault();
  addReminder();
});
