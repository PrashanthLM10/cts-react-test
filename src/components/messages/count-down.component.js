import { forwardRef, useEffect, useState, useImperativeHandle } from "react";
import { debounce } from "../../utils/debounce";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import { Button } from "@mui/material";
import "./count-down.component.css";

let interval = null;
export const CountDown = forwardRef(
  ({ inactiveTime, inactivityHandler }, ref) => {
    const [timeLeft, setTimeLeft] = useState(inactiveTime);

    const startTimer = (messageContainerRef = false) => {
      // If addListeners is true, add event listeners to reset the timer
      if (messageContainerRef) addListenersToResetTimer(messageContainerRef);
      if (interval) clearInterval(interval);
      setTimeLeft(inactiveTime);
      // Start the countdown timer
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(interval);
            inactivityHandler();
            return 0;
          }

          prevTime -= 1;
          return prevTime;
        });
      }, 1000);
    };

    const resetTimer = () => {
      startTimer();
    };

    const addListenersToResetTimer = (messageContainerRef) => {
      const debouncedResetTimer = debounce(resetTimer, 20_000);

      messageContainerRef.ontouchstart = debouncedResetTimer;
      messageContainerRef.onclick = debouncedResetTimer;
      messageContainerRef.onkeydown = debouncedResetTimer;
    };

    /* useEffect(() => {
      startTimer();
      return () => {
        clearInterval(interval);
      };
    }, []); */

    useImperativeHandle(ref, () => {
      return { resetTimer, startTimer };
    });

    const naviagteBackToMask = () => {
      clearInterval(interval);
      inactivityHandler();
    };

    const showInMinutes = (seconds) => {
      if (seconds < 0) return "0:00"; // If time is negative, return 0:00
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${
        remainingSeconds < 10 ? "0" : ""
      }${remainingSeconds}`;
    };

    return (
      <div className="countdown">
        <p>{showInMinutes(timeLeft)}</p>
        <Button
          variant="contained"
          className="back-button"
          color="primary"
          onClick={naviagteBackToMask}
          size="small"
        >
          <SkipPreviousIcon fontSize="medium" />
        </Button>
      </div>
    );
  }
);
