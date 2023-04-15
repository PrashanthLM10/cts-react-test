import { useEffect, useState } from 'react';
import { Button, TextField, Snackbar, Alert}  from '@mui/material';
import { getMessage, saveMessage, checkServerStatus} from './services/message.service';
import './App.css';

function debounce(func, timeout = 500){
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}

let toastMessage = '';
let severity='success';
//let alertProps = {message: '', severity: 'success'};
let clearPollTimer;
const alertSuccessMessage = 'Server running...';
const alertErrorMessage = `Server down. When accessed for the first time after being inactive for more than 15 minutes, it takes mostly 15s to start up. Polling every 5secs to check status. 
Please wait and DONT reload if the server is not up for more than 5 minutes...`;
function App() {
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  //const [showAlert, setShowAlert] = useState(false);
  const [serverUp, setServerUp] = useState('');

  useEffect(() => {
    if(serverUp) {
      getMessage().then(res => {
         setMessage(res.data.message);
      })
    }
  }, [serverUp])


  useEffect(() => {
    if(serverUp) {
      if(clearPollTimer) {
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
    checkServerStatus().then(res => {
      if(res.status === 200 && res.data === 'working') {
        if(!serverUp) setServerUp(true);
      }
    }).catch(e => {
     if(serverUp) setServerUp(false);
    })
  }

  const save = e => {
    saveMessage(message).then(res => {
      if(res.status === 200) {
        toastMessage = 'Save successful';
        severity='success';
      } else {
        toastMessage="Couldn't save";
        severity='error';
      }
      openToast();
    }).catch(e => {
      toastMessage=e.message;
      severity="error";
      openToast();
    })
  }

  const clear= () => {
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



  return (
   <section className='app-ctr'>
    <section className='top-bar'>
      {serverUp !== '' && <Alert sx={{width: '55%'}} severity={serverUp ? 'success' : 'error'}>{serverUp ? alertSuccessMessage :  alertErrorMessage}</Alert>}
    </section>
      <section className='message-ctr'>
          <section className='message-field-ctr'>
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
                <Button variant='outlined' className='clear-btn' onClick={clear}>Clear</Button>
                <Button variant='contained' className='save-btn' onClick={save}>Save</Button>
          </section>
      </section>
      <Snackbar open={open} autoHideDuration={5000} onClose={handleClose} anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
         {toastMessage}
        </Alert>
      </Snackbar>
   </section>
  )
}

export default App;
