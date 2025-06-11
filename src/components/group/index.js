import "./group.css";
import { useState, useEffect, createContext } from "react";
import { TextField, Button } from '@mui/material';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import {
  setID,
  sendMessage as sendMessageToSocket,
  getID,
  constructMessageObject,
  clearStorage,
} from "./websocket-utils";
import { MessagesPane } from "./messages-pane/MessagesPane";

let socket = null;
export const MessagesContext = createContext([]);

function Group(props) {
  const socketRetryInterval = 5000;
  const [isClosed, setIsClosed] = useState(true);
  const [messages, setMessages] = useState([]);
  const [inputText, setIpText] = useState("");
  const [connectionEstablished, setConnectionEstablished] = useState(false);

  const retry = (fn, time) => {};

  const sendMessage = () => { 
    if (socket) {
      const message = inputText;
      sendMessageToSocket(socket, message);
      setMessages((msgs) => [
        ...msgs,
        { ...constructMessageObject(message), type: "message" },
      ]);
      setIpText("");
    }
  };
  const establishSocketConnection = () => {
    if (!socket || socket.readyState === WebSocket.CLOSED) {
      const socketObj = new WebSocket("wss://cts-node-test.onrender.com");
      socket = socketObj;

      // socket opened
      socket.addEventListener("open", (e) => {
        setIsClosed(false);
      });

      // message received
      socket.addEventListener("message", (e) => {
        const data = JSON.parse(e.data);
        switch (data.type) {
          //if setSocketID is true, it is to set the client id to this client in sessionStorage
          case "setSocketID":
            setID(data.socketID);
            setConnectionEstablished(true);
            break;

          // if new user joined, show a pill
          case "newClient":
            setMessages((msgs) => [...msgs, data]);
            break;

          // if the data received is a message, update state which in-turn updates context
          case "message":
          default:
            if (data.socketID !== getID()) {
              setMessages((msgs) => [...msgs, data]);
            }
            break;
        }
      });

      // socket error

      socket.addEventListener("error", (e) => {
        console.log("error", e, socket);

        setTimeout(establishSocketConnection, socketRetryInterval);
      });

      // socket closed

      socket.addEventListener("close", (e) => {
        console.log("close", e.reason);

        socket = null;

        clearStorage();

        setConnectionEstablished(false);
        setID('');
        setTimeout(establishSocketConnection, socketRetryInterval);
      });
    }
  };

  useEffect(() => {
    isClosed && establishSocketConnection();

    // close the connection unmount
    return () => {
      socket?.close();
    };
  }, []);

  const inputChange = (e) => {
    const value = e.target.value;
    if(value) {
      setIpText(value);
    }
  };

  const onKeyDown = e => {
    if (e.code === "Enter" && inputText) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="group-ctr">
      <header className="group-header">Chat</header>

      <section className="group-content">  
        <section className="messages-pane"> 
          <MessagesContext.Provider value={messages}>
            <MessagesPane />
          </MessagesContext.Provider>
        </section>   

        <section className='text-box'>
        <TextField
            className='message-text-area'
            id="outlined-textarea"
            placeholder={ connectionEstablished ? "Enter text here" : "Please wait for connection..."}
            multiline
            fullWidth
            rows={1}
            value={inputText}
            disabled={!connectionEstablished}
            onChange={ (e) => inputChange(e)}
            InputProps={{
              onKeyDown: (e) => {onKeyDown(e)},
            }}
            sx={{borderRadius: 4}}
          />
          <Button className='send-button' variant='contained' onClick={sendMessage}>
            <SendOutlinedIcon />
          </Button>
        </section>
      </section>
    </div>
  );
}

export default Group;
