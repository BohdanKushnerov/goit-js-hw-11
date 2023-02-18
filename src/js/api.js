import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
// const KEY = 'key=33648762-c4caeb57f8348b72b000e69b2';

export default class ApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this._perPage = 40;
    this.totalImages = 0;
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
        per_page: `${this._perPage}`,
      },
    });
    this.incrementPage();
    this.incrementQuantityImages();
    console.log(this)
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

  incrementQuantityImages() {
    this.totalImages += this._perPage;
  }

  resetQuantityImages() {
    this.totalImages = 0;
  }

  get perPage() {
    return this._perPage;
  }

  set perPage(newValue) {
    this._perPage = newValue;
  }
}