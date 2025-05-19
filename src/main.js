import { fetchImages } from './js/pixabay-api';
import { renderGalleryMarkup, clearGallery } from './js/render-functions';
import Notiflix from 'notiflix';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let page = 1;
let searchQuery = '';
const perPage = 40;
let totalHits = 0;

form.addEventListener('submit', handleSearch);
loadMoreBtn.addEventListener('click', handleLoadMore);

async function handleSearch(e) {
  e.preventDefault();
  searchQuery = e.target.elements.searchQuery.value.trim();
  page = 1;
  clearGallery();
  loadMoreBtn.classList.add('is-hidden');

  if (searchQuery === '') {
    Notiflix.Notify.info('Будь ласка, введіть пошуковий запит.');
    return;
  }

  try {
    const data = await fetchImages(searchQuery, page, perPage);
    totalHits = data.totalHits;

    if (data.hits.length === 0) {
      Notiflix.Notify.failure('На жаль, нічого не знайдено. Спробуйте інший запит.');
      return;
    }

    renderGalleryMarkup(data.hits);
    Notiflix.Notify.success(`Знайдено ${totalHits} зображень.`);

    if (totalHits > perPage) {
      loadMoreBtn.classList.remove('is-hidden');
    }

  } catch (error) {
    Notiflix.Notify.failure('Сталася помилка при завантаженні зображень.');
    console.error(error);
  }
}

async function handleLoadMore() {
  page += 1;

  try {
    const data = await fetchImages(searchQuery, page, perPage);
    renderGalleryMarkup(data.hits);
    smoothScroll();

    const totalPages = Math.ceil(totalHits / perPage);
    if (page >= totalPages) {
      loadMoreBtn.classList.add('is-hidden');
      Notiflix.Notify.info("Це були всі результати пошуку.");
    }

  } catch (error) {
    Notiflix.Notify.failure('Не вдалося завантажити більше зображень.');
    console.error(error);
  }
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


// import './css/styles.css';
// import { getImagesByQuery } from './js/pixabay-api';
// import {
//   createGallery,
//   clearGallery,
//   showLoader,
//   hideLoader,
// } from './js/render-functions';
// import iziToast from 'izitoast';
// import 'izitoast/dist/css/iziToast.min.css';

// const form = document.querySelector('.form');

// form.addEventListener('submit', async e => {
//   e.preventDefault();
//   const query = e.currentTarget.elements['search-text'].value.trim();

//   if (!query) {
//     iziToast.warning({ message: 'Please enter a search term.' });
//     return;
//   }

//   clearGallery();
//   showLoader();

//   try {
//     const data = await getImagesByQuery(query);
//     if (data.hits.length === 0) {
//       iziToast.error({
//         message:
//           'Sorry, there are no images matching your search query. Please try again!',
//       });
//     } else {
//       createGallery(data.hits);
//     }
//   } catch (err) {
//     iziToast.error({ message: 'Something went wrong. Try again later.' });
//   } finally {
//     hideLoader();
//     form.reset();
//   }
// });


