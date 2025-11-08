const COMMENTS_PER_PORTION = 5;

let currentComments = [];
let shownCommentsCount = 0;

const commentsList = document.querySelector('.social__comments');
const commentCountBlock = document.querySelector('.social__comment-count');
const commentsLoader = document.querySelector('.comments-loader');

const createComment = ({ avatar, name, message }) => {
  const li = document.createElement('li');
  li.classList.add('social__comment');

  const img = document.createElement('img');
  img.classList.add('social__picture');
  img.src = avatar;
  img.alt = name;
  img.width = 35;
  img.height = 35;

  const text = document.createElement('p');
  text.classList.add('social__text');
  text.textContent = message;

  li.append(img, text);
  return li;
};

const renderComments = (comments) => {
  commentsList.innerHTML = '';
  currentComments = comments;
  shownCommentsCount = 0;
  loadMoreComments();
  commentsLoader.classList.remove('hidden');
};

function loadMoreComments() {
  const nextComments = currentComments.slice(shownCommentsCount, shownCommentsCount + COMMENTS_PER_PORTION);
  const fragment = document.createDocumentFragment();
  nextComments.forEach((comment) => fragment.appendChild(createComment(comment)));
  commentsList.append(fragment);

  shownCommentsCount += nextComments.length;

  // Обновляем счётчик
  commentCountBlock.textContent = `${shownCommentsCount} из ${currentComments.length} комментариев`;

  // Если комментарии закончились — скрываем кнопку
  if (shownCommentsCount >= currentComments.length) {
    commentsLoader.classList.add('hidden');
  }
}

// Обработчик на кнопку
commentsLoader.addEventListener('click', loadMoreComments);

export { renderComments };
