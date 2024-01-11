import axios from 'axios';

export const getMessage = () => {
   return axios.get('https://cts-node-test.onrender.com/message/getMessage');
   // return axios.get('http://localhost:3001/message/getMessage');
}

export const  saveMessage = msg => {
    const postData = {message: msg};
    return axios.get('https://cts-node-test.onrender.com/message/setMessage', postData);
    // return axios.post('http://localhost:3001/message/setMessage', postData);
}

export const checkServerStatus = () => {
    return axios.get('https://cts-node-test.onrender.com/');
    // return axios.get('http://localhost:3001/');
}
