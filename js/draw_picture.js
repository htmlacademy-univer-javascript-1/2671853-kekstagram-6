import { openBigPicture } from './big-picture.js';
const drawPicture = (photos) => {

  const pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');

  const picturesContainer = document.querySelector('.pictures');

  const fragment = document.createDocumentFragment();

  photos.forEach(({ url, likes, comments, description }) => {
    const pictureElement = pictureTemplate.cloneNode(true);

    const imgElement = pictureElement.querySelector('.picture__img');
    imgElement.src = url;
    imgElement.alt = description;

    pictureElement.querySelector('.picture__likes').textContent = likes;
    pictureElement.querySelector('.picture__comments').textContent = comments.length;

    imgElement.addEventListener('click', () => {
      openBigPicture({ url, likes, comments, description }); // вызываем полноразмерный просмотр
    });

    fragment.appendChild(pictureElement);
  });

  picturesContainer.appendChild(fragment);
};

export { drawPicture };
