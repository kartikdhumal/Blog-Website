import axios from 'axios';

export const fetchUserDetail = async (userId: string) => {
  try {
    const response = await axios.get(`/api/blogs/${userId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
