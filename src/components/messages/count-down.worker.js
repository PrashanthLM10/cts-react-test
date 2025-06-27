let interval = null;
let timeLeft = 300;
onmessage = (e) => {
  switch (e.data.type) {
    case "start":
      startTimer(e.data.value);
      break;
    case "stop":
    default:
      clearInterval(interval);
  }
};

const startTimer = (lastActiveTime) => {
  if (interval) clearInterval(interval);
  // Start the countdown timer
  interval = setInterval(() => {
    const elapsedTime = Date.now() - lastActiveTime;
    postMessage(elapsedTime);
  }, 1000);
};
