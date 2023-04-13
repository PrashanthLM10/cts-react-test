import { useEffect, useState } from 'react';
import { Button, TextField, Snackbar, Alert}  from '@mui/material';
import { getMessage, saveMessage} from './services/message.service';
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
function App() {
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getMessage().then(res => {
      setMessage(res.data.message);
    })
  }, [])

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
