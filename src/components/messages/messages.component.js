import { useEffect, useState } from 'react';
import { Button, TextField, Snackbar, Alert, Tooltip, CircularProgress, Backdrop } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import CachedRoundedIcon from '@mui/icons-material/CachedRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import CryptoJS from 'crypto-js';
import { getMessage, saveMessage, checkServerStatus } from '../../services/message.service';
import { useNavigate } from "react-router-dom";
import './messages.component.css';

let toastMessage = '';
let severity = 'success';
//let alertProps = {message: '', severity: 'success'};
let clearPollTimer;
const alertSuccessMessage = 'Server running...';
const alertErrorMessage = `Server down. When accessed for the first time after being inactive for more than 15 minutes, it takes mostly 15s to start up. Polling every 5secs to check status. 
Please wait and DONT reload unless the server is not up for more than 5 minutes...`;

const encryptMessage = (msg) => {
  return CryptoJS.AES.encrypt(msg, process.env.REACT_APP_PASSCODE).toString();
}

const decryptMessage = (msg) => {
  return CryptoJS.AES.decrypt(msg, process.env.REACT_APP_PASSCODE).toString(CryptoJS.enc.Utf8);
}

function Messages() {
  const [currentDeviceInfo, setCurrentDeviceInfo] = useState({hostname: '', machine:'', platform: ''});
  const [message, setMessage] = useState('');
  const [messageTime, setMessageTime] = useState('');
  const [prevMessageObj, setPrevMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  //const [showAlert, setShowAlert] = useState(false);
  const [serverUp, setServerUp] = useState(false);
  const navigate = useNavigate();
  console.log(navigator.userAgentData);
  useEffect(() => {
    if (serverUp) {
      getLatestMessage();

      if (clearPollTimer) {
        clearInterval(clearPollTimer);
      }
    }
  }, [serverUp])


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
    }
  }, [])

  const checkServer = () => {
    !showLoader && setShowLoader(true);
    checkServerStatus().then(res => {
      if (res.status === 200) {
        if (!serverUp) setServerUp(true);
        setCurrentDeviceInfo({...res.data, platform: navigator.userAgentData.platform, mobile: navigator.userAgentData.platform, brands: navigator.userAgentData.brands.reduce((a, c, idx) => a + `${idx === 0 ? ' ' : ', '}` + c.brand, '') });
      }
    }).catch(e => {
      if (serverUp) setServerUp(false);
    })
  }

  const getLatestMessage = () => {
    !showLoader && setShowLoader(true);
    getMessage().then(res => {
      setMessage(decryptMessage(res.data.message));
      setMessageTime(res.data.time);
      setPrevMessage({ message: decryptMessage(res.data.previousMessage), time: res.data.previousMessageTime });
      setCurrentDeviceInfo({...currentDeviceInfo, userAgent: res.data.userAgent});
      if (clearPollTimer) clearInterval(clearPollTimer);
      setShowLoader(false);
    }).catch(e => {
      setShowLoader(false);
      toastMessage = e.message || 'Failed to fetch messages.';
      severity = "error";
      openToast();
    })
  }

  const save = e => {
    const encrytpedMessage = encryptMessage(message);
    saveMessage(encrytpedMessage).then(res => {
      if (res.status === 200) {
        toastMessage = 'Save successful';
        severity = 'success';
      } else {
        toastMessage = "Couldn't save";
        severity = 'error';
      }
      openToast();
      getLatestMessage();
    }).catch(e => {
      toastMessage = e.message;
      severity = "error";
      openToast();
    })
  }

  const clear = () => {
    setMessage('');
    //save();
  }

  const messageChanged = e => {
    setMessage(e.target.value);
  }

  const openToast = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const getTime = time => {
    return new Date(time).toLocaleString();
  }

  const navigateToNotes = () => {
    navigate('/notes');
  }

  const Loader = (
    <Backdrop
      sx={{ color: '#fff', zIndex: 999 }}
      open={showLoader}
      className='backdrop-ctr'
    >
      <CircularProgress color='inherit' size={80} />
      <span className='loader-text'> Fetching Messages...</span>
    </Backdrop>
  );

  return (
    <section className='app-ctr'>
      {showLoader && Loader}
      <section className='top-bar'>
        {serverUp !== '' && <Alert sx={{ width: '55%' }} severity={serverUp ? 'success' : 'info'}>{serverUp ? alertSuccessMessage : alertErrorMessage}</Alert>}
      </section>
      <section className='previous-message-ctr'>
        <section className='previous-message-header-ctr'>
          {prevMessageObj.message && <p className='previous-message-label'>Previous Message:</p>}
          <span style={{ display: 'flex' }}>
            <Tooltip title="8919368035" placement="left" arrow>
              <InfoOutlinedIcon />
            </Tooltip>
            {prevMessageObj.time && <span class="message-time-ctr">{getTime(prevMessageObj.time)}</span>}
          </span>
        </section>
        {prevMessageObj.message && <section className='previous-message-content-ctr'>{prevMessageObj.message}</section>}
      </section>
      <section className='message-ctr'>
        {currentDeviceInfo.hostname && <p className='device-info'>
            <span class="device-info-label">Host Name:</span>
            <span class="device-info-value">{currentDeviceInfo.hostname} &nbsp;&nbsp;|</span>
            <span class="device-info-label">Machine:</span>
            <span class="device-info-value">{currentDeviceInfo.machine} &nbsp;&nbsp;|</span>
            <span class="device-info-label">Platform:</span>
            <span class="device-info-value">{currentDeviceInfo.platform} &nbsp;&nbsp;|</span>
            <span class="device-info-label">Mobile:</span>
            <span class="device-info-value">{currentDeviceInfo.mobile} &nbsp;&nbsp;|</span>
            <span class="device-info-label">Brands:</span>
            <span class="device-info-value">{currentDeviceInfo.brands}</span>
             <span class="device-info-label">UserAgent:</span>
            <span class="device-info-value">{currentDeviceInfo.userAgent || ''}</span>
          </p>}
        <section className='message-field-ctr'>
          {messageTime && <span class="message-time-ctr">{getTime(messageTime)}</span>}
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
        <section className='message-btn-ctr'>
          <section className='left-aligned-btn-ctr'>
            <Button variant='outlined' className='notes-btn footer-btn left-aligned-btn' onClick={navigateToNotes}>
              <ContentCopyRoundedIcon />
              <span>Notes</span>
            </Button>
          </section>
          <section className='right-aligned-btn-ctr'>
            <Button variant='outlined' className='refresh-btn footer-btn right-aligned-btn' onClick={getLatestMessage}>
              <CachedRoundedIcon />
              <span>Refresh</span>
            </Button>
            <Button variant='outlined' className='clear-btn footer-btn right-aligned-btn' onClick={clear}>
              <ClearRoundedIcon />
              <span>Clear</span>
            </Button>
            <Button variant='contained' className='save-btn footer-btn right-aligned-btn' onClick={save}>
              <DoneRoundedIcon />
              <span>Save</span>
            </Button>
          </section>
          <section className='center-aligned-btn-ctr'>
            <Button variant='outlined' className='notes-btn footer-btn center-aligned-btn' onClick={navigateToNotes}>
              <ContentCopyRoundedIcon />
              <span>Notes</span>
            </Button>
          </section>
        </section>
      </section>
      <Snackbar open={open} autoHideDuration={5000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </section>
  )
}

export default Messages;
