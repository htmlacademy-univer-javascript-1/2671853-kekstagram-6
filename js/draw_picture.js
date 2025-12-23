import { openBigPicture } from './big-picture.js';

const picturesContainerElement = document.querySelector('.pictures');
const pictureTemplateElement =
  document.querySelector('#picture').content.querySelector('.picture');

const renderPictures = (photos) => {
  picturesContainerElement
    .querySelectorAll('.picture')
    .forEach((picture) => picture.remove());

  const fragment = document.createDocumentFragment();

  photos.forEach((photo) => {
    const pictureElement = pictureTemplateElement.cloneNode(true);

    pictureElement.querySelector('.picture__img').src = photo.url;
    pictureElement.querySelector('.picture__img').alt = photo.description;
    pictureElement.querySelector('.picture__likes').textContent = photo.likes;
    pictureElement.querySelector('.picture__comments').textContent =
      photo.comments.length;

    pictureElement.addEventListener('click', () => {
      openBigPicture(photo);
    });

    fragment.appendChild(pictureElement);
  });

  picturesContainerElement.appendChild(fragment);
};

export { renderPictures };
