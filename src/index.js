import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './sass/index.scss';
import ApiService from './js/api.js';

const formRef = document.querySelector('.search-form');
const divRef = document.querySelector('.gallery');
const markToScrollRef = document.querySelector('.markToScroll');

const formBtnRef = formRef.elements[1]; //button
const inputRef = formRef.elements.searchQuery; //input

const apiService = new ApiService();
const lightbox = new SimpleLightbox('.gallery a');

formRef.addEventListener('submit', onSearch);
inputRef.addEventListener('input', () => {
  formBtnRef.disabled = false;
});

async function onSearch(e) {
  e.preventDefault();
  try {
    apiService.query = e.currentTarget.elements.searchQuery.value.trim();

    if (!apiService.query) throw new Error();

    apiService.resetPage();
    apiService.resetQuantityImages();
    apiService._perPage = 40;

    const { hits, totalHits } = await apiService.fetchImages(); //data

    if (!hits.length) throw new Error();

    formBtnRef.disabled = true;

    clearContainer();
    Notify.info(`Hooray! We found ${totalHits} images.`);
    makeMarkup(hits);
  } catch (error) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

async function makeMarkup(hits) {
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

const onEntry = entries => {
  entries.forEach(entry => {
    if (apiService.perPage <= 0) {
      Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
      return;
    }
    //--------------------------------------------------------
    if (entry.isIntersecting && apiService.query !== '') {
      apiService.fetchImages().then(({ hits, totalHits }) => {
        makeMarkup(hits);
        //--------------------------------------------------------
        if (apiService.totalImages >= totalHits - apiService.perPage) {
          apiService.perPage = totalHits - apiService.totalImages;
        }
      });
    }
  });
};

const observer = new IntersectionObserver(onEntry, {
  rootMargin: '75px',
});

observer.observe(markToScrollRef);

// if (apiService.totalImages >= totalHits) {
//   Notify.failure(
//     "We're sorry, but you've reached the end of search results."
//   );
//   return
// }
