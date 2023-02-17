import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
// const KEY = 'key=33648762-c4caeb57f8348b72b000e69b2';

export default class ApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchImages() {
    const res = await axios.get(BASE_URL, {
      params: {
        key: '33648762-c4caeb57f8348b72b000e69b2',
        q: `${this.searchQuery}`,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: `${this.page}`,
        per_page: 40,
      },
    });
    this.incrementPage();
    return res.data
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}