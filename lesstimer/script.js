// request permission on page load
document.addEventListener('DOMContentLoaded', function () {
  if (!Notification) {
    alert('Desktop notifications not available in your browser. Try Firefox.');
    return;
  }

  if (Notification.permission !== 'granted')
    Notification.requestPermission();
});

var countdown = document.getElementById("countdown")
var button = document.getElementById("button");
var sound = document.getElementById("sound");

function startTimer() {
  var minutes = parseFloat(document.getElementById("set_minutes").value);
  var notice = document.getElementById("set_notice").value;

  var seconds = parseInt(60 * minutes);
  button.disabled = true;
  countdown.innerHTML = `${minutes} minutes`;

  displayCountdown(seconds, notice);

  setTimeout(function () {
    notifyMe({
      title: "Time's up!", content: notice, tag: "LessTimer", icon_url: "timer.svg",
      click_handler: notification_click_handler,
      actions: [{ action: "snooze", title: "Snooze", icon: "timer.svg" }]
    })
  }, seconds * 1000);
}


function notification_click_handler(event) {
  event.notification.close();
  if (event.action === 'snooze') {
    event.waitUntil(
      alert("snooze")
      // self.registration.showNotification("Snoozed", {
      //   body: "Snoozed for 5 minutes",
      //   icon: "timer.svg",
      //   tag: "LessTimer",
      //   actions: [{ action: "dismiss", title: "Dismiss", icon: "timer.svg" }]
      // })
    )
  }


}


function displayCountdown(seconds, notice) {

  var interval = setInterval(function () {
    seconds--;
    if (seconds < 0) {
      // time's up
      clearInterval(interval);
      countdown.innerHTML = notice;
      button.disabled = false;
      return;
    }
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = seconds % 60;
    countdown.innerHTML = minutes + ":" + remainingSeconds;
  }, 1000, notice);
}

function notifyMe({ title, content, tag, icon_url, click_handler, actions }) {
  if (Notification.permission !== 'granted') {
    Notification.requestPermission();
    return
  }


  playAudio();

  var notification = new Notification(title, {
    icon: icon_url,
    tag: tag,
    body: content,
    actions: actions
  })

  if (click_handler) {
    notification.onclick = function (event) {
      return click_handler(event)
    }
  }

}




function playAudio() {
  if (sound.paused) { sound.play(); }
  else { sound.pause(); }
}