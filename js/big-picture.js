const COMMENTS_STEP = 5;
const ESCAPE_KEY = 'Escape';

let currentComments = [];
let shownCommentsCount = 0;

const bigPictureElement = document.querySelector('.big-picture');
const closeButtonElement = document.querySelector('#picture-cancel');
const bodyElement = document.body;
const commentsLoaderElement = document.querySelector('.comments-loader');
const commentsListElement = document.querySelector('.social__comments');
const commentCountElement = document.querySelector('.social__comment-count');

const createCommentElement = (comment) => {
  const commentElement = document.createElement('li');
  commentElement.classList.add('social__comment');

  const avatarElement = document.createElement('img');
  avatarElement.classList.add('social__picture');
  avatarElement.src = comment.avatar;
  avatarElement.alt = comment.name;
  avatarElement.width = 35;
  avatarElement.height = 35;

  const textElement = document.createElement('p');
  textElement.classList.add('social__text');
  textElement.textContent = comment.message;

  commentElement.append(avatarElement, textElement);

  return commentElement;
};

const renderNextComments = () => {
  const commentsSlice = currentComments.slice(
    shownCommentsCount,
    shownCommentsCount + COMMENTS_STEP
  );

  commentsSlice.forEach((comment) => {
    commentsListElement.append(createCommentElement(comment));
  });

  shownCommentsCount += commentsSlice.length;
  commentCountElement.textContent = `${shownCommentsCount} из ${currentComments.length} комментариев`;

  if (shownCommentsCount >= currentComments.length) {
    commentsLoaderElement.classList.add('hidden');
  }
};

const resetComments = (comments) => {
  currentComments = comments;
  shownCommentsCount = 0;

  commentsListElement.innerHTML = '';
  commentCountElement.classList.remove('hidden');
  commentsLoaderElement.classList.remove('hidden');

  renderNextComments();
};

const openBigPicture = (photo) => {
  bigPictureElement.classList.remove('hidden');
  bodyElement.classList.add('modal-open');

  bigPictureElement.querySelector('.big-picture__img img').src = photo.url;
  bigPictureElement.querySelector('.likes-count').textContent = photo.likes;
  bigPictureElement.querySelector('.comments-count').textContent = photo.comments.length;
  bigPictureElement.querySelector('.social__caption').textContent = photo.description;

  resetComments(photo.comments);
};

const closeBigPicture = () => {
  bigPictureElement.classList.add('hidden');
  bodyElement.classList.remove('modal-open');
  commentsLoaderElement.classList.add('hidden');
};

const onCloseButtonClick = () => {
  closeBigPicture();
};

const onDocumentKeydown = (evt) => {
  if (evt.key === ESCAPE_KEY) {
    closeBigPicture();
  }
};

const onCommentsLoaderClick = () => {
  renderNextComments();
};

closeButtonElement.addEventListener('click', onCloseButtonClick);
document.addEventListener('keydown', onDocumentKeydown);
commentsLoaderElement.addEventListener('click', onCommentsLoaderClick);

export { openBigPicture };
