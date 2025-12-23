import { renderPictures } from './draw_picture.js';
import { debounce } from './utils.js';

const RANDOM_PHOTOS_COUNT = 10;

const FilterType = {
  DEFAULT: 'filter-default',
  RANDOM: 'filter-random',
  DISCUSSED: 'filter-discussed',
};

let photos = [];
let currentFilter = FilterType.DEFAULT;

const filtersContainerElement = document.querySelector('.img-filters');
const filtersFormElement = document.querySelector('.img-filters__form');
const filterButtons = filtersFormElement.querySelectorAll('.img-filters__button');

const showFilters = () => {
  filtersContainerElement.classList.remove('img-filters--inactive');
};

const getRandomPhotos = () => {
  const shuffledPhotos = [...photos]
    .map((photo) => ({ photo, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ photo }) => photo);

  return shuffledPhotos.slice(0, RANDOM_PHOTOS_COUNT);
};

const getDiscussedPhotos = () =>
  [...photos].sort((a, b) => b.comments.length - a.comments.length);

const getFilteredPhotos = () => {
  switch (currentFilter) {
    case FilterType.RANDOM:
      return getRandomPhotos();
    case FilterType.DISCUSSED:
      return getDiscussedPhotos();
    default:
      return photos;
  }
};

const updateActiveButton = (activeButtonId) => {
  filterButtons.forEach((button) => {
    button.classList.toggle(
      'img-filters__button--active',
      button.id === activeButtonId
    );
  });
};

const applyFilter = () => {
  renderPictures(getFilteredPhotos());
};

const debouncedApplyFilter = debounce(applyFilter);

const onFilterChange = (evt) => {
  if (!evt.target.matches('.img-filters__button')) {
    return;
  }

  if (evt.target.id === currentFilter) {
    return;
  }

  currentFilter = evt.target.id;
  updateActiveButton(currentFilter);
  debouncedApplyFilter();
};

const initFilters = (loadedPhotos) => {
  photos = loadedPhotos;
  showFilters();
  filtersFormElement.addEventListener('click', onFilterChange);
};

export { initFilters };
