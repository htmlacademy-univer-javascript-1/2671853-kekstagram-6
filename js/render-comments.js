export const renderComments = (comments) => {
  const commentList = document.querySelector('.social__comments');
  commentList.innerHTML = '';

  const commentFragment = document.createDocumentFragment();

  comments.forEach(({ avatar, name, message }) => {
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
    commentFragment.append(li);
  });

  commentList.append(commentFragment);
};
