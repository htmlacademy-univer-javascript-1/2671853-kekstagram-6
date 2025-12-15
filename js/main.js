import { getPhotos } from './api.js';
import { renderPictures } from './draw_picture.js';
import { initForm } from './form.js';
import { showError } from './messages.js';
import { initFilters } from './filters.js';

const loadAndRenderPhotos = async () => {
  try {
    const photos = await getPhotos();
    renderPictures(photos);
    initFilters(photos);
  } catch (error) {
    showError(error.message, 'Загрузить ещё раз', () => {
      loadAndRenderPhotos();
    });
  }
};

const initApp = () => {
  initForm();
  loadAndRenderPhotos();
};

document.addEventListener('DOMContentLoaded', initApp);
