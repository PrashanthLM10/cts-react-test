let interval = null;
let timeLeft = 300;
onmessage = (e) => {
  switch (e.data.type) {
    case "start":
      timeLeft = e.data.value;
      startTimer();
      break;
    case "stop":
    default:
      clearInterval(interval);
  }
};

const startTimer = () => {
  if (interval) clearInterval(interval);
  // Start the countdown timer
  interval = setInterval(() => {
    if (timeLeft <= 0) {
        clearInterval(interval);
        timeLeft =  0;
    } else {
        timeLeft -= 1
    }
    postMessage(timeLeft);
  }, 1000);
};



/* (prevTime) => {
          
          console.log('---', prevTime);
          return prevTime;
        } */