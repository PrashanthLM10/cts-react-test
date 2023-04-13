import axios from 'axios';

export const getMessage = () => {
    return axios.get('https://cts-node-test.onrender.com/message/getMessage/234');
}

export const  saveMessage = msg => {
    const postData = {message: msg};
    return axios.post('https://cts-node-test.onrender.com/message/setMessage', postData);
}
