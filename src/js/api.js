import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
// const KEY = 'key=33648762-c4caeb57f8348b72b000e69b2';

export default class ApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  fetchImages() {
    return axios.get(BASE_URL, {
      params: {
        key: '33648762-c4caeb57f8348b72b000e69b2',
        q: `${this.searchQuery}`,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
      },
    }).then(({ data }) => {
      this.incrementPage();
      console.log(data);
      return data;
    });
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


// fetchImages() {
  //   console.log(this);
  //   const URL = `${BASE_URL}?${KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=5`;

  //   return axios.get(URL).then(({ data }) => {
  //     this.incrementPage();
  //     return data;
  //   });
//------------------------------------------------------
// return axios.get(BASE_URL, {
//   headers: {
//     // 'X-Requested-With': 'XMLHttpRequest',
//     // 'key': '33648762-c4caeb57f8348b72b000e69b2',
//     // q: 'cat',
//     // image_type: 'photo',
//     // orientation: 'horizontal',
//     // safesearch: true,
//   },
//   params: {
//     key: '33648762-c4caeb57f8348b72b000e69b2',
//     q: `${this.query}`,
//     image_type: 'photo',
//     orientation: 'horizontal',
//     safesearch: true,
//   },
// }).then(({ data }) => {
//   this.incrementPage();
//   console.log(data);
//   return data;
// });
// }