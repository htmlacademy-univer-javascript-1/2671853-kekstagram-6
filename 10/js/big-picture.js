import { renderComments } from './render-comments.js';

const bigPicture = document.querySelector('.big-picture');
const body = document.body;
const closeButton = bigPicture.querySelector('.big-picture__cancel');

export const openBigPicture = (photo) => {
  bigPicture.classList.remove('hidden');
  body.classList.add('modal-open');

  bigPicture.querySelector('.big-picture__img img').src = photo.url;
  bigPicture.querySelector('.likes-count').textContent = photo.likes;
  bigPicture.querySelector('.comments-count').textContent = photo.comments.length;
  bigPicture.querySelector('.social__caption').textContent = photo.description;

  renderComments(photo.comments);
};

export const closeBigPicture = () => {
  bigPicture.classList.add('hidden');
  body.classList.remove('modal-open');
};

closeButton.addEventListener('click', closeBigPicture);

document.addEventListener('keydown', (evt) => {
  if (evt.key === 'Escape') {
    closeBigPicture();
  }
});
