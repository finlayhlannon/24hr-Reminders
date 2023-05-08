let reminders = [];

function addReminder() {
  let input = document.getElementById("reminder-input");
  let reminderText = input.value.trim();

  if (reminderText.includes("/")) {
    let parts = reminderText.split("/");
    let afterSlash = parseInt(parts[1].trim()) + 1;

    if (!isNaN(afterSlash)) {
      let reminder = {
        text: reminderText,
        time: new Date(),
        remainingTime: afterSlash * 60 * 60 * 1000,
        expired: false,
        timerId: null
      };

      reminders.push(reminder);

      // Clear the input field
      input.value = "";

      // Display the reminder list
      displayReminders();
    }
  } else if (reminderText !== "") {
    let reminder = {
      text: reminderText,
      time: new Date(),
      remainingTime: 25 * 60 * 60 * 1000,
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

    // Create the reminder text (without anything after the slash)
    let reminderText = document.createElement("span");
    let textBeforeSlash = reminder.text.split("/")[0].trim();
    reminderText.textContent = textBeforeSlash;
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
        let remainingTime = reminder.remainingTime - timeDiff;

        let hours = Math.floor(remainingTime / (60 * 60 * 1000));
        let minutes = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000));
        let secs = Math.floor((remainingTime % (60 * 1000)) / 1000);

        if (remainingTime <= 0) {
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
