import './css/styles.css';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { PixabayApi } from './pixabay-api';

const searchFormEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');

const pixabayApi = new PixabayApi;

const onSearchFormSubmit = event => {
  event.preventDefault();
  pixabayApi.searchQuery = event.target.elements.searchQuery.value.trim();

  pixabayApi
    .fetchPhotos()
    .then(data => {
      if (data.hits.length === 0) {
        galleryEl.innerHTML = '';
        Notify.failure("Sorry, there are no images matching your search query. Please try again.");
      }
      renderMarkup(data);
    })
    .catch(err => {
      galleryEl.innerHTML = '';
      Notify.failure('Error');
      return;
    });
}

function renderMarkup(promiseArray, position = 'beforeend') {
  const markup = promiseArray.hits.map(({ webformatURL, tags, likes, views, comments, downloads }) => {
    return `<div class="photo-card">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        <div class="info">
          <p class="info-item">
            <b>Likes</b><span>${likes}</span>
          </p>
          <p class="info-item">
            <b>Views</b><span>${views}</span>
          </p>
          <p class="info-item">
            <b>Comments</b><span>${comments}</span>
          </p>
          <p class="info-item">
            <b>Downloads</b><span>${downloads}</span>
          </p>
        </div>
      </div>`
  }).join('');
  galleryEl.insertAdjacentHTML(position, markup);
}

searchFormEl.addEventListener('submit', onSearchFormSubmit);