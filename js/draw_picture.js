import { openBigPicture } from './big-picture.js';

const picturesContainer = document.querySelector('.pictures');
const pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');

function renderPictures(data) {
  const existingPictures = picturesContainer.querySelectorAll('.picture');
  existingPictures.forEach(picture => picture.remove());

  const fragment = document.createDocumentFragment();

  data.forEach((photo) => {
    const element = pictureTemplate.cloneNode(true);
    element.querySelector('.picture__img').src = photo.url;
    element.querySelector('.picture__img').alt = photo.description || 'Фотография пользователя';
    element.querySelector('.picture__likes').textContent = photo.likes;
    element.querySelector('.picture__comments').textContent = photo.comments.length;

    element.addEventListener('click', (evt) => {
      evt.preventDefault();
      openBigPicture(photo);
    });

    fragment.appendChild(element);
  });

  picturesContainer.appendChild(fragment);
}

export { renderPictures };
