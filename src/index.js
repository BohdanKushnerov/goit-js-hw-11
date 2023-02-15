import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './sass/index.scss';
import ApiService from './js/api.js';

const formRef = document.querySelector('.search-form');
const divRef = document.querySelector('.gallery');
const btnRef = document.querySelector('.load-more');

const apiService = new ApiService();
const lightbox = new SimpleLightbox('.gallery a');

formRef.addEventListener('submit', onSearch);
btnRef.addEventListener('click', loadMore);

btnRef.classList.add('is-hidden');

function onSearch(e) {
  e.preventDefault();
  apiService.query = e.currentTarget.elements.searchQuery.value;

  apiService.resetPage();
  apiService.fetchImages().then(data => {
    clearContainer();
    Notify.info(`Hooray! We found ${data.totalHits} images.`);
    makeMarkup(data.hits);
    btnRef.classList.remove('is-hidden');
  });
}



function loadMore() {
  apiService.fetchImages().then(data => {
    makeMarkup(data.hits);
  });
}

function makeMarkup(hits) {
  hits.forEach(el => {
    const {
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    } = el;
    const markup = `
    <div class="photo-card">
      <a class="gallery__link" href="${largeImageURL}">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
      </a>
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

    lightbox.refresh();
  });
}

function clearContainer() {
  divRef.innerHTML = '';
}

