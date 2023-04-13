import { useEffect, useState } from 'react';
import { Button, TextField}  from '@mui/material';
import { getMessage, saveMessage} from './services/message.service';
import './App.css';

function debounce(func, timeout = 500){
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}


function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    getMessage().then(res => {
      setMessage(res.data.message);
    })
  }, [])

  const save = e => {
    saveMessage(message).then(res => {
      console.log(res);
    })
  }

  const clear= () => {
    setMessage('');
  }

  const messageChanged = e => {
    setMessage(e.target.value);
  }


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
   </section>
  )
}

export default App;
