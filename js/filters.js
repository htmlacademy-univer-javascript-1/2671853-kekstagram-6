import { renderPictures } from './draw_picture.js';
import { debounce } from './utils.js';

const RANDOM_PHOTOS_COUNT = 10;
const FILTER_DEFAULT = 'filter-default';
const FILTER_RANDOM = 'filter-random';
const FILTER_DISCUSSED = 'filter-discussed';

let photos = [];
let currentFilter = FILTER_DEFAULT;

const filtersContainer = document.querySelector('.img-filters');
const filtersForm = document.querySelector('.img-filters__form');
const filterButtons = filtersForm.querySelectorAll('.img-filters__button');

function showFilters() {
  filtersContainer.classList.remove('img-filters--inactive');
}

function getRandomPhotos() {
  const shuffled = [...photos].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, RANDOM_PHOTOS_COUNT);
}

function getDiscussedPhotos() {
  return [...photos].sort((a, b) => b.comments.length - a.comments.length);
}

function getFilteredPhotos() {
  switch (currentFilter) {
    case FILTER_RANDOM:
      return getRandomPhotos();
    case FILTER_DISCUSSED:
      return getDiscussedPhotos();
    default: // FILTER_DEFAULT
      return photos;
  }
}

function clearPictures() {
  const pictures = document.querySelectorAll('.picture');
  pictures.forEach((picture) => picture.remove());
}

function updateActiveButton(activeButtonId) {
  filterButtons.forEach((button) => {
    button.classList.toggle('img-filters__button--active', button.id === activeButtonId);
  });
}

function applyFilter() {
  clearPictures();
  const filteredPhotos = getFilteredPhotos();
  renderPictures(filteredPhotos);
}

const debouncedApplyFilter = debounce(applyFilter);

function onFilterChange(evt) {
  if (!evt.target.matches('.img-filters__button')) {
    return;
  }

  const clickedButton = evt.target;
  if (clickedButton.id === currentFilter) {
    return;
  }

  currentFilter = clickedButton.id;
  updateActiveButton(currentFilter);
  debouncedApplyFilter();
}

function initFilters(loadedPhotos) {
  photos = loadedPhotos;
  showFilters();

  filtersForm.addEventListener('click', onFilterChange);
}

export { initFilters };
