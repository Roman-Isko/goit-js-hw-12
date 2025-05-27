import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '50364756-88b1a7bffdb2f2af78bd92cba'; 
const PER_PAGE = 15;

export async function getImagesByQuery(query, page = 1) {
  const params = {
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page,
    per_page: PER_PAGE,
  };

  try {
    const response = await axios.get(BASE_URL, { params });
    return response.data; 
  } catch (error) {
    console.error('❌ Error fetching images:', error);
    throw error;
  }
}
