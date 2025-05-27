import { getImagesByQuery } from './js/pixabay-api.js';
import {
  renderGalleryMarkup,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
  refreshLightbox,
} from './js/render-functions.js';
import Notiflix from 'notiflix';

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let currentPage = 1;
let currentQuery = '';
let totalHits = 0;

form.addEventListener('submit', handleSearch);
loadMoreBtn.addEventListener('click', handleLoadMore);

async function handleSearch(event) {
  event.preventDefault();
  const query = event.currentTarget.elements.searchQuery.value.trim();

  if (!query) {
    if (document.body) {
      Notiflix.Notify.failure('Please enter a search term.');
    }
    return;
  }

  currentQuery = query;
  currentPage = 1;
  clearGallery();
  hideLoadMoreButton();
  showLoader();

  try {
    const { hits, totalHits: total } = await getImagesByQuery(query, currentPage);
    totalHits = total;

    if (hits.length === 0) {
      if (document.body) {
        Notiflix.Notify.failure(
          'Sorry, no images match your search query. Please try again.'
        );
      }
      return;
    }

    renderGalleryMarkup(hits);
    refreshLightbox();

    if (document.body) {
      Notiflix.Notify.success(`Hooray! We found ${total} images.`);
    }

    if (hits.length < 15 || hits.length >= total) {
      hideLoadMoreButton();
      if (document.body) {
        Notiflix.Notify.info('Вибачте, але ви досягли кінця результатів пошуку.');
      }
    } else {
      showLoadMoreButton();
    }
  } catch (error) {
    if (document.body) {
      Notiflix.Notify.failure('Something went wrong. Please try again later.');
    }
    console.error(error);
  } finally {
    hideLoader();
  }
}

async function handleLoadMore() {
  currentPage += 1;
  showLoader();

  try {
    const { hits } = await getImagesByQuery(currentQuery, currentPage);
    renderGalleryMarkup(hits);
    refreshLightbox();
    smoothScroll();

    const alreadyLoaded = currentPage * 15;
    if (alreadyLoaded >= totalHits) {
      hideLoadMoreButton();
      if (document.body) {
        Notiflix.Notify.info('Вибачте, але ви досягли кінця результатів пошуку.');
      }
    }
  } catch (error) {
    if (document.body) {
      Notiflix.Notify.failure('Failed to load more images.');
    }
    console.error(error);
  } finally {
    hideLoader();
  }
}

function smoothScroll() {
  const { height: cardHeight } =
    document.querySelector('.gallery-item')?.getBoundingClientRect() || {
      height: 0,
    };

  if (cardHeight) {
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }
}
