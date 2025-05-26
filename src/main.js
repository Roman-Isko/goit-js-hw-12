import { fetchImages } from './js/pixabay-api.js';
import { renderGalleryMarkup, clearGallery, refreshLightbox } from './js/render-functions.js';
import Notiflix from 'notiflix';

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const loader = document.querySelector('.loader');

let currentPage = 1;
let currentQuery = '';
let totalHits = 0;

form.addEventListener('submit', handleSearch);
loadMoreBtn.addEventListener('click', handleLoadMore);

async function handleSearch(event) {
  event.preventDefault();
  const query = event.currentTarget.elements.searchQuery.value.trim();

  if (!query) {
    Notiflix.Notify.failure('Please enter a search term.');
    return;
  }

  currentQuery = query;
  currentPage = 1;
  clearGallery(gallery);
  toggleLoader(true);
  hideLoadMore();

  try {
    const { hits, totalHits: total } = await fetchImages(query, currentPage);
    totalHits = total;

    if (hits.length === 0) {
      Notiflix.Notify.failure('Sorry, no images match your search query. Please try again.');
      return;
    }

    renderGalleryMarkup(hits, gallery);
    Notiflix.Notify.success(`Hooray! We found ${total} images.`);
    refreshLightbox();

    if (hits.length < 40 || hits.length >= total) {
      hideLoadMore();
    } else {
      showLoadMore();
    }
  } catch (error) {
    Notiflix.Notify.failure('Something went wrong. Please try again later.');
    console.error(error);
  } finally {
    toggleLoader(false);
  }
}

async function handleLoadMore() {
  currentPage += 1;
  toggleLoader(true);

  try {
    const { hits } = await fetchImages(currentQuery, currentPage);

    renderGalleryMarkup(hits, gallery);
    refreshLightbox();

    if ((currentPage - 1) * 40 + hits.length >= totalHits) {
      hideLoadMore();
      Notiflix.Notify.info("You've reached the end of search results.");
    }
  } catch (error) {
    Notiflix.Notify.failure('Failed to load more images.');
    console.error(error);
  } finally {
    toggleLoader(false);
  }
}

function showLoadMore() {
  loadMoreBtn.classList.remove('is-hidden');
}

function hideLoadMore() {
  loadMoreBtn.classList.add('is-hidden');
}

function toggleLoader(show) {
  loader.classList.toggle('is-hidden', !show);
}
