import axios from 'axios';
const baseUrl = 'api/notes'; //process.env.REACT_APP_BASEURL;

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const create = async (newObject) => {
  const response = await axios.post(baseUrl, newObject);
  return response.data;
};

const update = async (id, newObject) => {
  const response = await axios.put(`${baseUrl}/${id}`, newObject);
  return response.data;
};

const notesService = {
  getAll,
  create,
  update,
};

export default notesService;
