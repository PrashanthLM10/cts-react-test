import axios from "axios";

let currentEnv = process.env.REACT_APP_API_URL;
//currentEnv = process.env.NODE_ENV !== 'development' ? process.env.REACT_APP_API_URL : process.env.REACT_APP_LOCAL_API_URL;

export const getMessage = () => {
  return axios.get(`${currentEnv}message/getMessage`);
  //return axios.get('http://localhost:3001/message/getMessage');
};

export const saveMessage = (msg) => {
  const postData = { message: msg };
  return axios.post(`${currentEnv}message/setMessage`, postData);
};

export const updateLatestMessage = (msg) => {
  const postData = { message: msg };
  return axios.post(`${currentEnv}message/updateLatestMessage`, postData);
};

export const checkServerStatus = () => {
  return axios.get(`${currentEnv}`);
};
