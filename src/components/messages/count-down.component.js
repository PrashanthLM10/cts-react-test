import { forwardRef, useEffect, useState, useImperativeHandle, useCallback } from "react";
import { debounce } from "../../utils/debounce";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import { Button } from "@mui/material";
import "./count-down.component.css";

let intervalWorker = null;
export const CountDown = forwardRef(
  ({ inactiveTime, inactivityHandler }, ref) => {
    const [timeLeft, setTimeLeft] = useState(inactiveTime);
    const workerMessageHandler = useCallback((e) => {
        if (e.data <= 0) {
          stopTimer();
          inactivityHandler();
        }
        setTimeLeft(() => {
          console.log(e.data);
          return e.data;
        });
      })

    const startTimer = (messageContainerRef = false) => {
      // If addListeners is true, add event listeners to reset the timer
      if (messageContainerRef) addListenersToResetTimer(messageContainerRef);
      setTimeLeft(inactiveTime);

      // Start the countdown timer through worker
      if (intervalWorker) {
        intervalWorker.terminate();
      }
      intervalWorker = new Worker(
        new URL("./count-down.worker.js", import.meta.url)
      );
      intervalWorker.onmessage = workerMessageHandler;
      intervalWorker.postMessage({ type: "start", value: inactiveTime });
    };

    const resetTimer = () => {
      if(intervalWorker) intervalWorker.postMessage({ type: "start", value: inactiveTime });
    };

    const stopTimer = () => {
      setTimeLeft(0);
      if (intervalWorker) {
        intervalWorker.postMessage("stop");
        intervalWorker.terminate();
      } 
    };

    const addListenersToResetTimer = (messageContainerRef) => {
      const debouncedResetTimer = debounce(resetTimer, process.env?.REACT_APP_INACTIVE_DEBOUUNCE_TIME || 10_000);

      messageContainerRef.ontouchstart = debouncedResetTimer;
      messageContainerRef.onclick = debouncedResetTimer;
      messageContainerRef.onkeydown = debouncedResetTimer;
    };

    useEffect(() => {
      return () => {
        stopTimer();
        if (intervalWorker) intervalWorker.terminate();
      };
    }, []);

    useImperativeHandle(ref, () => {
      return { resetTimer, startTimer, stopTimer };
    });

    const naviagteBackToMask = () => {
      stopTimer();
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
