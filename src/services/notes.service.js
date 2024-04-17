import axios from "axios";

const currentEnv = process.env.NODE_ENV !== 'development' ? process.env.REACT_APP_API_URL : process.env.REACT_APP_LOCAL_API_URL;

export const getAllNotes = () => {
  try {
    return axios.get(`${currentEnv}notes/getAllNotes`);
  } catch (error) {
    console.error(error);
  }
};

export const getCurrentNote = (_id) => {
  try {
    return axios.post(`${currentEnv}notes/getNote`, {_id});
  } catch (error) {
    console.error(error);
  }
};

export const saveNoteContent = ({_id, content}) => {
  try {
    return axios.post(`${currentEnv}notes/updateNoteContent`, {_id, content});
  } catch (error) {
    console.error(error);
  }
};

export const addNewNote = (title) => {
  try {
    return axios.post(`${currentEnv}notes/addNote`, {title});
  } catch (error) {
    console.error(error);
  }
}