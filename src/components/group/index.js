import "./group.css";
import { useState, useEffect, createContext } from "react";
import { TextField, Button } from '@mui/material';
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

        setTimeout(establishSocketConnection, socketRetryInterval);
      });
    }
  };

  useEffect(() => {
    isClosed && establishSocketConnection();

    // close the connection unmount
    return () => {
      socket.close();
    };
  }, []);

  const inputChange = (e) => {
    if (e.code === "Enter") {
      sendMessage();

      return;
    }

    setIpText(e.target.value);
  };

  return (
    <div className="group-ctr">
      <header className="group-header">Chat</header>

      <MessagesContext.Provider value={messages}>
        <MessagesPane />
      </MessagesContext.Provider>

      <section className='text-box'>
      <TextField
          className='message-text-area'
          id="outlined-textarea"
          placeholder="Enter text here"
          multiline
          fullWidth
          rows={1}
          value={inputText}
          onChange={e => inputChange(e)}
          sx={{borderRadius: 4}}
        />
        <Button className='send-button' variant='contained' onClick={sendMessage}>
          <SendOutlinedIcon />
        </Button>
      </section>
    </div>
  );
}

export default Group;
