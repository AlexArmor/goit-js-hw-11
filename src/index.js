import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { PixabayApi } from './pixabay-api';

const searchFormEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');

const pixabayApi = new PixabayApi;

const onSearchFormSubmit = event => {
    event.preventDefault();

    pixabayApi.searchQuery = event.target.elements.searchQuery.value;
    pixabayApi
        .fetchPhotos()
        .then(renderMarkup)
        .catch(err => { console.log(err); });
}

function renderMarkup(promiseArray, position = 'beforeend') {
    const markup = promiseArray.map(({webformatURL, tags, likes, views, comments, downloads}) => {
        return `<div class="photo-card">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        <div class="info">
          <p class="info-item">
            <b>Likes${likes}</b>
          </p>
          <p class="info-item">
            <b>Views${views}</b>
          </p>
          <p class="info-item">
            <b>Comments${comments}</b>
          </p>
          <p class="info-item">
            <b>Downloads${downloads}</b>
          </p>
        </div>
      </div>`
    }).join('');
        galleryEl.insertAdjacentHTML(position, markup);
}

searchFormEl.addEventListener('submit', onSearchFormSubmit);