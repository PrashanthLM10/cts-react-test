import { MessagesContext } from "../index";
import { useContext, useRef } from "react";
import { Message } from "../message/Message";

import "./MessagesPane.css";

let scrolledToBottom = false;
let messagesLength = 0;
export const MessagesPane = (props) => {
  const messages = useContext(MessagesContext);
  const messagesPaneRef = useRef(null);

  const scrollToBottom = () => {
    const pane = messagesPaneRef.current;
    if (!pane) return;
    // wait for a moment to ensure the DOM is updated ( all messages are rendered) before scrolling
    // This is necessary because the messages might not be rendered yet when this function is called
    setTimeout(() => {
      if (pane.scrollHeight > pane.clientHeight && messagesPaneRef.current) {
        messagesPaneRef.current.scrollTop =
          messagesPaneRef.current.scrollHeight;
        scrolledToBottom = true;
      }
    }, 10);
  };

  /**
   *  Behaviour to scroll to the bottom of the mesages pane when vertical scroll bar is present. Only happens for the first time the scroll bar appears.
   *  If the user has scrolled up, it will not scroll to the bottom automatically. This is to prevent the user from losing their place in the chat history.
   *  Scrolling to the bottom for the first time programmatically because the anchor element in the HTML to which overflow-anchor : auto is added ,
   * needs to be scrolled to first and thn browser keeps the scroll position at the anchor element from then on.
   * Read about overflow-anchor here: https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-anchor, you will get it.
   *
   * If the user scrolls up, the browser will not keep the scroll bar at the anchor's position, and will not scroll to the bottom automatically.
   * If the user scrolls down again , the browser will keep the scroll bar at the anchor's position again.
   */

  if (messages.length > messagesLength && !scrolledToBottom) {
    messagesLength = messages.length;
    scrollToBottom();
  }

  return (
    <section className="messages-pane-ctr" ref={messagesPaneRef}>
      {messages.map((message) => (
        <Message {...message} key={message.time} />
      ))}
      <p className="anchor-element"></p>
    </section>
  );
};
