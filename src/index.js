import { Notify } from 'notiflix/build/notiflix-notify-aio';

import './sass/index.scss';
import ApiService from './js/api.js';
// key (required)	str	Your API key: 33648762-c4caeb57f8348b72b000e69b2

// const URL = "https://pixabay.com/api/?key=33648762-c4caeb57f8348b72b000e69b2&q=dog&image_type=photo&orientation=horizontal&safesearch=true";

const formRef = document.querySelector('.search-form');

const divRef = document.querySelector('.gallery');

const btnRef = document.querySelector('.load-more');

const apiService = new ApiService();

formRef.addEventListener('submit', onSearch);
btnRef.addEventListener('click', loadMore);

btnRef.classList.add('is-hidden')

function onSearch(e) {
  e.preventDefault();
  apiService.query = e.currentTarget.elements.searchQuery.value;

  apiService.resetPage();
  apiService.fetchImages().then(data => {
    clearContainer()
    Notify.info(`Hooray! We found ${data.totalHits} images.`)
    // console.log(data.hits)
    makeMarkup(data.hits);
    btnRef.classList.remove('is-hidden');
  });
}

function loadMore() {
  apiService.fetchImages().then(data => {
    makeMarkup(data.hits);
  })
}

function makeMarkup(hits) {
  hits.forEach(el => {
    const {webformatURL, tags, likes, views, comments, downloads} = el;
    const markup = `
      <div class="photo-card">
      <img src="${webformatURL}" alt="${tags}" loading="lazy" />
      <div class="info">
        <p class="info-item">
          <b>Likes: ${likes}</b>
        </p>
        <p class="info-item">
          <b>Views: ${views}</b>
        </p>
        <p class="info-item">
          <b>Comments: ${comments}</b>
        </p>
        <p class="info-item">
          <b>Downloads: ${downloads}</b>
        </p>
      </div>
    </div>
    `;
    
    divRef.insertAdjacentHTML('beforeend', markup);
  })
}

function clearContainer() {
  divRef.innerHTML = '';
}

