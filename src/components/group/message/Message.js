import { getID } from "../websocket-utils";

import "./Message.css";

const MessageElement = ({ currentClient, time, text }) => {
  return (
    <section className={`message-ctr ${currentClient ? "own" : "other"}`}>
      <section className="message-content">
        <span className="message-time">{new Date(time).toLocaleTimeString()}</span>

        <span className="message-text">{text}</span>
      </section>
    </section>
  );
};

const NewClientPill = ({ socketID }) => {
  return (
    <section className="new-client-pill">
      <span className="pill-content">{socketID} joined</span>
    </section>
  );
};

export const Message = ({ socketID, text, time, type }) => {
  const currentClientID = getID();
  const currentClient = socketID === currentClientID;

  return (
    currentClientID &&
    (type === "message" ? (
      <MessageElement {...{ currentClient, text, time }} />
    ) : (
      <NewClientPill socketID={socketID} />
    ))
  );
};
