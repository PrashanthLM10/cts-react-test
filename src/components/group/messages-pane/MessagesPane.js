import { MessagesContext } from "../index";

import { useContext, useState } from "react";

import { Message } from "../message/Message";

import "./MessagesPane.css";

export const MessagesPane = (props) => {
  const messages = useContext(MessagesContext);

  return (
    <section className="messages-pane-ctr">
      {messages.map((message) => (
        <Message {...message} key={message.time} />
      ))}
    </section>
  );
};
