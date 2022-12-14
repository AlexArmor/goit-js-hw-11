import './css/styles.css';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { PixabayApi } from './pixabay-api';
import createGallery from './templates/markup.hbs';

const lightbox = new SimpleLightbox('.photo-card a', { captionsData: 'alt', captionDelay: 250 });
const searchFormEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
// *** button load more ***
// const btnLoadMore = document.querySelector('.load-more');
const targetElement = document.querySelector('.js-target-element');

let searchCompare;

const pixabayApi = new PixabayApi;

const observer = new IntersectionObserver(async (entries, observer) => {
  if (entries[0].isIntersecting) {
    try {
      const { data } = await pixabayApi.fetchPhotos();
      renderMarkup(data);

      const { height: cardHeight } = document.querySelector(".gallery").firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
      });

      lightbox.refresh();
      if (Math.ceil(data.totalHits / 40) === pixabayApi.page) {
        observer.unobserve(targetElement);
        Notify.info("We're sorry, but you've reached the end of search results.")
      }
    } catch (err) {
      console.log(err);
    } finally {
      pixabayApi.page += 1;
    };
  }
}, {
  root: null,
  rootMargin: '0px 0px 400px 0px',
  threshold: 1,
});

const onSearchFormSubmit = async event => {
  event.preventDefault();
  pixabayApi.searchQuery = event.target.elements.searchQuery.value.trim();
  if (pixabayApi.searchQuery === searchCompare) {
    return;
  }
  // btnLoadMore.classList.add('is-hidden'); // *** button load more ***
  pixabayApi.page = 1;
  searchCompare = event.target.elements.searchQuery.value.trim();
  galleryEl.innerHTML = '';

  try {
    const { data } = await pixabayApi.fetchPhotos();
    if (data.hits.length === 0) {
      galleryEl.innerHTML = '';
      Notify.failure("Sorry, there are no images matching your search query. Please try again.");
      return;
    }

    Notify.success(`Hooray! We found ${data.totalHits} images.`);
    renderMarkup(data);
    lightbox.refresh();
    if (data.totalHits / 40 > pixabayApi.page) {
      // btnLoadMore.classList.remove('is-hidden'); // *** button load more ***
      observer.observe(targetElement);
      pixabayApi.page += 1;
    }
  } catch (err) {
    galleryEl.innerHTML = '';
    console.log(err);
    Notify.failure('Error');
    return;
  };
}

function renderMarkup(promiseArray, position = 'beforeend') {
  const markup = createGallery(promiseArray.hits);

  // const markup = promiseArray.hits.map(({ largeImageURL, webformatURL, tags, likes, views, comments, downloads }) => {
  //   return `<div class="photo-card">
  //   <a href=${largeImageURL}><img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
  //       <div class="info">
  //         <p class="info-item">
  //           <b>Likes</b><span>${likes}</span>
  //         </p>
  //         <p class="info-item">
  //           <b>Views</b><span>${views}</span>
  //         </p>
  //         <p class="info-item">
  //           <b>Comments</b><span>${comments}</span>
  //         </p>
  //         <p class="info-item">
  //           <b>Downloads</b><span>${downloads}</span>
  //         </p>
  //       </div>
  //     </div>`
  // }).join('');

  galleryEl.insertAdjacentHTML(position, markup);
}

// *** button load more handled ***
// async function onBtnLoadMoreClick() {
//   try {
//     const { data } = await pixabayApi.fetchPhotos();
//     renderMarkup(data);

//     const { height: cardHeight } = document.querySelector(".gallery").firstElementChild.getBoundingClientRect();

//     window.scrollBy({
//       top: cardHeight * 2,
//       behavior: "smooth",
//     });

//     lightbox.refresh();
//     if (Math.ceil(data.totalHits / 40) < pixabayApi.page) {
//       btnLoadMore.classList.add('is-hidden');
//       Notify.info("We're sorry, but you've reached the end of search results.")
//     }
//   } catch (err) {
//     console.log(err);
//   } finally {
//     btnLoadMore.disabled = false;
//     pixabayApi.page += 1;
//   };
// }

searchFormEl.addEventListener('submit', onSearchFormSubmit);
// btnLoadMore.addEventListener('click', onBtnLoadMoreClick); *** button load more listener ***