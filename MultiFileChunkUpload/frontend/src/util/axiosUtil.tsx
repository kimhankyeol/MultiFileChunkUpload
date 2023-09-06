import axios from "axios";

const asyncFunc = {
  get: async (url: string) => {
    try {
      const response = await axios.get(url);
      return response.status === 200 ? response.data : "error";
    } catch (error) {
      return error;
    }
  },
  post: async (url: string, params: object) => {
    try {
      const response = await axios.post(url, params);
      return response.status === 200 ? response.data : "error";
    } catch (error) {
      return error;
    }
  },
};
export default asyncFunc;
