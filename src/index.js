import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './sass/index.scss';
import ApiService from './js/api.js';

const formRef = document.querySelector('.search-form');
const divRef = document.querySelector('.gallery');
const btnRef = document.querySelector('.load-more');

const formBtnRef = formRef.elements[1]; //button
const inputRef = formRef.elements.searchQuery; //input

const apiService = new ApiService();
const lightbox = new SimpleLightbox('.gallery a');

formRef.addEventListener('submit', onSearch);
btnRef.addEventListener('click', loadMore);
inputRef.addEventListener('input', () => {
  formBtnRef.disabled = false
})

btnRef.classList.add('is-hidden');

async function onSearch(e) {
  e.preventDefault();
  try {
    // e.preventDefault();
    apiService.query = e.currentTarget.elements.searchQuery.value;

    if (!apiService.query) throw new Error();

    apiService.resetPage();

    const data = await apiService.fetchImages();
    console.log(data);
    if (!data.hits.length) throw new Error();

    formBtnRef.disabled = true;

    clearContainer();
    Notify.info(`Hooray! We found ${data.totalHits} images.`);
    makeMarkup(data.hits);
    // smoothScroll();
    btnRef.classList.remove('is-hidden');
  } catch (error) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

async function loadMore() {
  const data = await apiService.fetchImages()

  makeMarkup(data.hits);
  Notify.info(`Hooray! We found ${data.totalHits} images.`);
  // apiService.fetchImages().then(data => {
  //   makeMarkup(data.hits);
  //   // smoothScroll();
  // });
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

    // const { height: cardHeight } = document
    // .querySelector('.gallery')
    // .firstElementChild.getBoundingClientRect();

    // window.scrollBy({
    //   top: cardHeight * 2,
    //   behavior: 'smooth',
    // });
  });
}

function clearContainer() {
  divRef.innerHTML = '';
}

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
