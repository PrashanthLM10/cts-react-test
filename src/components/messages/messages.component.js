import { useEffect, useState, useRef } from "react";
import {
  Button,
  TextField,
  Snackbar,
  Alert,
  Tooltip,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import CachedRoundedIcon from "@mui/icons-material/CachedRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import UploadOutlinedIcon from "@mui/icons-material/UploadOutlined";
import CryptoJS from "crypto-js";
import {
  getMessage,
  saveMessage,
  checkServerStatus,
  updateLatestMessage,
} from "../../services/message.service";
import { useNavigate } from "react-router-dom";
import "./messages.component.css";
import { CountDown } from "./count-down.component";

let toastMessage = "";
let severity = "success";
//let alertProps = {message: '', severity: 'success'};
let clearPollTimer;
const alertSuccessMessage = "Server running...";
const alertErrorMessage = `Server down. When accessed for the first time after being inactive for more than 15 minutes, it takes mostly 15s to start up. Polling every 5secs to check status. 
Please wait and DONT reload unless the server is not up for more than 5 minutes...`;

const encryptMessage = (msg) => {
  return CryptoJS.AES.encrypt(msg, process.env.REACT_APP_PASSCODE).toString();
};

const decryptMessage = (msg) => {
  return CryptoJS.AES.decrypt(msg, process.env.REACT_APP_PASSCODE).toString(
    CryptoJS.enc.Utf8
  );
};

function Messages({ tabInactiveHandler }) {
  const [currentDeviceInfo, setCurrentDeviceInfo] = useState({
    hostname: "",
    machine: "",
    platform: "",
  });
  const [message, setMessage] = useState("");
  const [messageTime, setMessageTime] = useState("");
  const [prevMessageObj, setPrevMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  //const [showAlert, setShowAlert] = useState(false);
  const [serverUp, setServerUp] = useState(false);
  const countDownRef = useRef(null);
  const messagecontainerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (serverUp) {
      getLatestMessage();
      countDownRef.current &&
        countDownRef.current.startTimer(messagecontainerRef.current);

      if (clearPollTimer) {
        clearInterval(clearPollTimer);
      }
    }
  }, [serverUp]);

  useEffect(() => {
    if (serverUp) {
      if (clearPollTimer) {
        clearInterval(clearPollTimer);
      }
    } else {
      checkServer();
      clearPollTimer = setInterval(checkServer, 5000);
    }

    return () => {
      clearInterval(clearPollTimer);
      resetInactivityTimer();
    };
  }, []);

  const checkServer = () => {
    !showLoader && setShowLoader(true);
    checkServerStatus()
      .then((res) => {
        if (res.status === 200) {
          if (!serverUp) setServerUp(true);
          setCurrentDeviceInfo({
            ...res.data,
            platform: navigator.userAgentData.platform,
            mobile: navigator.userAgentData.platform,
            brands: navigator.userAgentData.brands.reduce(
              (a, c, idx) => a + `${idx === 0 ? " " : ", "}` + c.brand,
              ""
            ),
          });
        }
      })
      .catch((e) => {
        if (serverUp) setServerUp(false);
      });
  };

  const getLatestMessage = () => {
    !showLoader && setShowLoader(true);
    getMessage()
      .then((res) => {
        setMessage(decryptMessage(res.data.message));
        setMessageTime(res.data.time);
        setPrevMessage({
          message: decryptMessage(res.data.previousMessage),
          time: res.data.previousMessageTime,
        });
        setCurrentDeviceInfo({
          ...currentDeviceInfo,
          userAgent: res.data.userAgent,
        });
        if (clearPollTimer) clearInterval(clearPollTimer);
        setShowLoader(false);
      })
      .catch((e) => {
        setShowLoader(false);
        toastMessage = e.message || "Failed to fetch messages.";
        severity = "error";
        openToast();
      });
  };

  const save = (e) => {
    const encrytpedMessage = encryptMessage(message);
    saveMessage(encrytpedMessage)
      .then((res) => {
        if (res.status === 200) {
          toastMessage = "Save successful";
          severity = "success";
        } else {
          toastMessage = "Couldn't save";
          severity = "error";
        }
        openToast();
        getLatestMessage();
      })
      .catch((e) => {
        toastMessage = e.message;
        severity = "error";
        openToast();
      });
  };

  const update = (e) => {
    const encrytpedMessage = encryptMessage(message);
    updateLatestMessage(encrytpedMessage)
      .then((res) => {
        if (res.status === 200) {
          toastMessage = "Update successful";
          severity = "success";
        } else {
          toastMessage = "Couldn't update";
          severity = "error";
        }
        openToast();
        getLatestMessage();
      })
      .catch((e) => {
        toastMessage = e.message;
        severity = "error";
        openToast();
      });
  };

  const clear = () => {
    setMessage("");
    //save();
  };

  const messageChanged = (e) => {
    setMessage(e.target.value);
  };

  const openToast = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const getTime = (time) => {
    return new Date(time).toLocaleString();
  };

  const navigateToNotes = () => {
    navigate("/notes");
  };

  const resetInactivityTimer = () => {
    if (countDownRef && countDownRef.current) {
      countDownRef.current.stopTimer();
    }
  };

  const Loader = (
    <Backdrop
      sx={{ color: "#fff", zIndex: 999 }}
      open={showLoader}
      className="backdrop-ctr"
    >
      <CircularProgress color="inherit" size={80} />
      <span className="loader-text"> Fetching Messages...</span>
    </Backdrop>
  );

  return (
    <section className="app-ctr" ref={messagecontainerRef}>
      {showLoader && Loader}
      <CountDown
        ref={countDownRef}
        inactiveTime={Number(process.env.REACT_APP_INACTIVE_TIME_LIMIT)}
        inactivityHandler={tabInactiveHandler}
      />
      <section className="top-bar">
        {serverUp !== "" && (
          <Alert sx={{ width: "55%" }} severity={serverUp ? "success" : "info"}>
            {serverUp ? alertSuccessMessage : alertErrorMessage}
          </Alert>
        )}
      </section>
      <section className="previous-message-ctr">
        <section className="previous-message-header-ctr">
          <p className="previous-message-label">Previous Message:</p>
          <span style={{ display: "flex" }}>
            <Tooltip title="8500879785" placement="left" arrow>
              <InfoOutlinedIcon />
            </Tooltip>
            {prevMessageObj.time && (
              <span class="message-time-ctr">
                {getTime(prevMessageObj.time)}
              </span>
            )}
          </span>
        </section>
        <section className="previous-message-content-ctr">
          {prevMessageObj.message && <span>{prevMessageObj.message}</span>}
          {!prevMessageObj.message && (
            <span className="previous-message-placeholder">
              Previous Message appears here.
            </span>
          )}
        </section>
      </section>
      <section className="message-ctr">
        <section className="manifest-message">
          {process.env.REACT_APP_MANIFESTATION}
        </section>
        <section className="message-field-ctr">
          {messageTime && (
            <span class="message-time-ctr">{getTime(messageTime)}</span>
          )}
          <TextField
            multiline
            rows={10}
            fullWidth
            label="Message"
            placeholder="Tell me anything here"
            value={message}
            onChange={messageChanged}
          />
        </section>
        <section className="message-btn-ctr">
          <section className="left-aligned-btn-ctr">
            <Button
              variant="outlined"
              className="notes-btn footer-btn left-aligned-btn"
              onClick={navigateToNotes}
            >
              <ContentCopyRoundedIcon />
              <span>Notes</span>
            </Button>
          </section>
          <section className="right-aligned-btn-ctr">
            <Button
              variant="outlined"
              className="refresh-btn footer-btn right-aligned-btn"
              onClick={getLatestMessage}
            >
              <CachedRoundedIcon />
              <span>Refresh</span>
            </Button>
            <Button
              variant="outlined"
              className="clear-btn footer-btn right-aligned-btn"
              onClick={clear}
            >
              <ClearRoundedIcon />
              <span>Clear</span>
            </Button>
            <Button
              variant="outlined"
              className="update-btn footer-btn right-aligned-btn"
              onClick={update}
            >
              <UploadOutlinedIcon />
              <span>Update</span>
            </Button>
            <Button
              variant="contained"
              className="save-btn footer-btn right-aligned-btn"
              onClick={save}
            >
              <DoneRoundedIcon />
              <span>Save</span>
            </Button>
          </section>
          <section className="center-aligned-btn-ctr">
            <Button
              variant="outlined"
              className="notes-btn footer-btn center-aligned-btn"
              onClick={navigateToNotes}
            >
              <ContentCopyRoundedIcon />
              <span>Notes</span>
            </Button>
          </section>
        </section>
      </section>
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </section>
  );
}

export default Messages;
