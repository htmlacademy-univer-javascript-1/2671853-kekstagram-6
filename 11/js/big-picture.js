const COMMENTS_STEP = 5;
let currentComments = [];
let shownCount = 0;

const bigPicture = document.querySelector('.big-picture');
const closeBtn = document.querySelector('#picture-cancel');
const body = document.body;
const commentsLoader = document.querySelector('.comments-loader');
const commentsList = document.querySelector('.social__comments');
const commentCountBlock = document.querySelector('.social__comment-count');

function createCommentElement(comment) {
  const li = document.createElement('li');
  li.classList.add('social__comment');

  const img = document.createElement('img');
  img.classList.add('social__picture');
  img.src = comment.avatar;
  img.alt = comment.name;
  img.width = 35;
  img.height = 35;

  const p = document.createElement('p');
  p.classList.add('social__text');
  p.textContent = comment.message;

  li.append(img, p);
  return li;
}

function renderNextComments() {
  if (!commentsList || !commentCountBlock || !commentsLoader) {
    return;
  }

  const nextComments = currentComments.slice(shownCount, shownCount + COMMENTS_STEP);
  nextComments.forEach((c) => commentsList.append(createCommentElement(c)));
  shownCount += nextComments.length;

  commentCountBlock.textContent = `${shownCount} из ${currentComments.length} комментариев`;

  if (shownCount >= currentComments.length) {
    commentsLoader.classList.add('hidden');
  }
}

function resetComments(comments) {
  if (!commentsList || !commentCountBlock || !commentsLoader) {
    return;
  }

  currentComments = comments;
  shownCount = 0;
  commentsList.innerHTML = '';
  commentCountBlock.classList.remove('hidden');
  commentsLoader.classList.remove('hidden');

  renderNextComments();
}

function openBigPicture(photo) {
  if (!bigPicture) {
    return;
  }

  bigPicture.classList.remove('hidden');
  body.classList.add('modal-open');

  const imgElement = bigPicture.querySelector('.big-picture__img img');
  const likesCountElement = bigPicture.querySelector('.likes-count');
  const commentsCountElement = bigPicture.querySelector('.comments-count');
  const captionElement = bigPicture.querySelector('.social__caption');

  if (imgElement) {
    imgElement.src = photo.url;
  }
  if (likesCountElement) {
    likesCountElement.textContent = photo.likes;
  }
  if (commentsCountElement) {
    commentsCountElement.textContent = photo.comments.length;
  }
  if (captionElement) {
    captionElement.textContent = photo.description;
  }

  resetComments(photo.comments);
}

function closeBigPicture() {
  if (!bigPicture) {
    return;
  }

  bigPicture.classList.add('hidden');
  body.classList.remove('modal-open');
  if (commentsLoader) {
    commentsLoader.classList.add('hidden');
  }
}

if (closeBtn) {
  closeBtn.addEventListener('click', closeBigPicture);
}

document.addEventListener('keydown', (evt) => {
  if (evt.key === 'Escape') {
    closeBigPicture();
  }
});

if (commentsLoader) {
  commentsLoader.addEventListener('click', renderNextComments);
}

export { openBigPicture };
