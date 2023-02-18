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
    apiService.query = e.currentTarget.elements.searchQuery.value.trim();

    if (!apiService.query) throw new Error();

    apiService.resetPage();
    apiService.resetQuantityImages();
    apiService._perPage = 120;
    btnRef.disabled = false;

    const {hits, totalHits} = await apiService.fetchImages(); //data
    // console.log(hits);
    if (!hits.length) throw new Error();

    formBtnRef.disabled = true;

    clearContainer();
    Notify.info(`Hooray! We found ${totalHits} images.`);
    makeMarkup(hits);
    btnRef.classList.remove('is-hidden');
  } catch (error) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

async function loadMore() {
  const {hits, totalHits} = await apiService.fetchImages(); //data

  makeMarkup(hits);

  // if(apiService.totalImages === 480) {
  //   apiService.perPage = 20;
  // }

  if(apiService.totalImages >= totalHits - apiService.perPage) {
    apiService.perPage = totalHits - apiService.totalImages;
  }

  if(apiService.totalImages >= totalHits) {
    btnRef.disabled = true;
    Notify.failure("We're sorry, but you've reached the end of search results.")
  }
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

    // smoothScroll()
  });
}

function clearContainer() {
  divRef.innerHTML = '';
}

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

    console.log(cardHeight)

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
