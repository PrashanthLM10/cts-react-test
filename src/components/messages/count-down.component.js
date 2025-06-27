import { forwardRef, useEffect, useState, useImperativeHandle, useCallback } from "react";
import { debounce } from "../../utils/debounce";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import { Button } from "@mui/material";
import "./count-down.component.css";

/** Worker Code - For reference */
//let intervalWorker = null;

const inactiveTime_backup = 300;
let interval = null;
let lastActiveTime = Date.now();
export const CountDown = forwardRef(
  ({ inactiveTime, inactivityHandler }, ref) => {
    const [timeLeft, setTimeLeft] = useState(inactiveTime);
    inactiveTime = inactiveTime || inactiveTime_backup;

    useEffect(() => {
      if(timeLeft <= 0) {
        inactivityHandler();
        if(interval) clearInterval(interval);
      }
    }, [timeLeft]);

    /** Worker Code - For reference */
    /* const workerMessageHandler = useCallback((e) => {
        const elapsedTime = e.data;
        const timeLeft = Math.floor((inactiveTime*1000 - elapsedTime)/1000);
        setTimeLeft(timeLeft);
    }); */

    const intervalHandler = useCallback(() => {
        const elapsedTime = Date.now() - lastActiveTime;
        const timeLeft = Math.floor((inactiveTime*1000 - elapsedTime)/1000);
        console.log(timeLeft);
        setTimeLeft(timeLeft);
    });

    const runInterval = () => {
      // Start Interval to calculate elapsed Time
      if(interval) clearInterval(interval);
      lastActiveTime = Date.now();
      interval = setInterval(intervalHandler, 1000);
      console.log('run',interval);
    }

    const startTimer = (messageContainerRef = false) => {
      // If addListeners is true, add event listeners to reset the timer
      if (messageContainerRef) addListenersToResetTimer(messageContainerRef);
      runInterval();
      
      /** Worker Code - For reference */
      // Start the countdown timer through worker
      /* if (intervalWorker) {
        intervalWorker.terminate();
      }
      intervalWorker = new Worker(
        new URL("./count-down.worker.js", import.meta.url)
      );
      intervalWorker.onmessage = workerMessageHandler;
      intervalWorker.postMessage({ type: "start", value: timeNow }); */

      
    };

    const resetTimer = () => {
      /** Worker Code - For reference */
      //if(intervalWorker) intervalWorker.postMessage({ type: "start", value: Date.now() });

      runInterval();
    };

    const stopTimer = () => {
      if(timeLeft > 0 ) setTimeLeft(0);

      
      /** Worker Code - For reference */
      /* if (intervalWorker) {
        intervalWorker.postMessage("stop");
        intervalWorker.terminate();
      } */ 
    };

    const addListenersToResetTimer = (messageContainerRef) => {
      const debouncedResetTimer = debounce(resetTimer, process.env?.REACT_APP_INACTIVE_DEBOUUNCE_TIME || 10_000);

      messageContainerRef.ontouchstart = debouncedResetTimer;
      messageContainerRef.onclick = debouncedResetTimer;
      messageContainerRef.onkeydown = debouncedResetTimer;
    };

    useImperativeHandle(ref, () => {
      return { resetTimer, startTimer, stopTimer };
    });

    const naviagteBackToMask = (e) => {
      e.stopPropagation();      
      if(interval) clearInterval(interval);
      interval = null;
      stopTimer();
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
          // click capture event will be called during capture phase, so we can cancel all events called in bubble phase
          // we need this because we have registerd click handler on the entire messages element 
          // and we don't need that to be called when this button is clicked, becuase this button will navigate back to mask
          onClickCapture={e => naviagteBackToMask(e)}
          size="small"
        >
          <SkipPreviousIcon fontSize="medium" />
        </Button>
      </div>
    );
  }
);
