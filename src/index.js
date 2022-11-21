import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { PixabayApi } from './pixabay-api';

const searchFormEl = document.querySelector('#search-form');

const pixabayApi = new PixabayApi;

const onSearchFormSubmit = event => {
    event.preventDefault();

    pixabayApi.searchQuery = event.target.elements.searchQuery.value;
    pixabayApi
        .fetchPhotos()
        .then(data => { console.log(data); })
        .catch(err => { console.log(err); });
}

searchFormEl.addEventListener('submit', onSearchFormSubmit);