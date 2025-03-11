// get current client id from sessionStorage

export const getID = () => {
  return sessionStorage.getItem("socketID");
};

//set current client id to sessionStorage

export const setID = (id) => {
  if (!getID()) sessionStorage.setItem("socketID", id);
};

//clear SessionStorage

export const clearStorage = () => {
  sessionStorage.clear();
};

// construct message object to send to other clients and update context

// message object schema - {socketID: '', text: '', time: ''}

export const constructMessageObject = (text) => {
  return { socketID: getID(), text, time: Date.now() };
};

// send the message to other client connected to the socket

export const sendMessage = (socket, text) => {
  const message = JSON.stringify(constructMessageObject(text));

  socket.send(message);
};
