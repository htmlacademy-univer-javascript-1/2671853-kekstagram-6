import { initImageEditor, resetImageEditor } from './image-editor.js';
const MAX_HASHTAG_COUNT = 5;
const MAX_HASHTAG_LENGTH = 20;
const MAX_COMMENT_LENGTH = 140;
const HASHTAG_REGEX = /^#[a-zа-яё0-9]{1,19}$/i;

const form = document.querySelector('.img-upload__form');
const fileInput = document.querySelector('.img-upload__input');
const overlay = document.querySelector('.img-upload__overlay');
const cancelButton = document.querySelector('.img-upload__cancel');
const body = document.body;
const hashtagInput = form.querySelector('.text__hashtags');
const commentInput = form.querySelector('.text__description');

const pristine = new Pristine(form, {
  classTo: 'img-upload__field-wrapper',
  errorClass: 'img-upload__field-wrapper--invalid',
  successClass: 'img-upload__field-wrapper--valid',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextTag: 'div',
  errorTextClass: 'img-upload__error'
});

const validateHashtags = (value) => {
  const inputText = value.trim();

  if (!inputText) {
    return true;
  }

  const hashtags = inputText.split(/\s+/).filter((tag)=> tag !== '');

  if (hashtags.length > MAX_HASHTAG_COUNT) {
    return false;
  }

  const seenHashtags = new Set();

  for (const hashtag of hashtags) {
    const lowerCaseHashtag = hashtag.toLowerCase();

    if (hashtag === '#') {
      return false;
    }

    if (!hashtag.startsWith('#')) {
      return false;
    }

    if (hashtag.length > MAX_HASHTAG_LENGTH) {
      return false;
    }

    if (!HASHTAG_REGEX.test(hashtag)) {
      return false;
    }

    if (seenHashtags.has(lowerCaseHashtag)) {
      return false;
    }
    seenHashtags.add(lowerCaseHashtag);
  }

  return true;
};

const getHashtagErrorMessage = (value) => {
  const inputText = value.trim();

  if (!inputText) {
    return '';
  }

  const hashtags = inputText.split(/\s+/).filter((tag)=> tag !== '');

  if (hashtags.length > MAX_HASHTAG_COUNT) {
    return `Нельзя указать больше ${MAX_HASHTAG_COUNT} хэш-тегов. У вас: ${hashtags.length}`;
  }

  const seenHashtags = new Set();

  for (const hashtag of hashtags) {
    const lowerCaseHashtag = hashtag.toLowerCase();

    if (hashtag === '#') {
      return 'Хэш-тег не может состоять только из символа #';
    }

    if (!hashtag.startsWith('#')) {
      return 'Хэш-тег должен начинаться с символа #';
    }

    if (hashtag.length > MAX_HASHTAG_LENGTH) {
      return `Хэш-тег слишком длинный. Максимум ${MAX_HASHTAG_LENGTH} символов`;
    }

    if (!HASHTAG_REGEX.test(hashtag)) {
      const invalidChars = hashtag.slice(1).replace(/[a-zа-яё0-9]/gi, '');
      return `Хэш-тег содержит недопустимые символы: ${invalidChars || 'спецсимволы'}`;
    }

    if (seenHashtags.has(lowerCaseHashtag)) {
      return 'Хэш-тег повторяется';
    }
    seenHashtags.add(lowerCaseHashtag);
  }

  return '';
};

const validateComment = (value) => value.length <= MAX_COMMENT_LENGTH;
const getCommentErrorMessage = (value) => {
  if (value.length > MAX_COMMENT_LENGTH) {
    return `Комментарий слишком длинный. ${value.length}/${MAX_COMMENT_LENGTH} символов`;
  }
  return '';
};

pristine.addValidator(
  hashtagInput,
  validateHashtags,
  getHashtagErrorMessage
);

pristine.addValidator(
  commentInput,
  validateComment,
  getCommentErrorMessage
);
const onDocumentKeydown = (evt) => {
  if (evt.key === 'Escape') {
    if (document.activeElement === hashtagInput || document.activeElement === commentInput) {
      return;
    }
    evt.preventDefault();
    closeForm();
  }
};

const openForm = () => {
  overlay.classList.remove('hidden');
  body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);
  initImageEditor();
};

const closeForm = () => {
  overlay.classList.add('hidden');
  body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);

  form.reset();
  fileInput.value = '';
  pristine.reset();
  resetImageEditor();
};

fileInput.addEventListener('change', () => {
  openForm();
});

cancelButton.addEventListener('click', () => {
  closeForm();
});

hashtagInput.addEventListener('keydown', (evt) => {
  evt.stopPropagation();
});

commentInput.addEventListener('keydown', (evt) => {
  evt.stopPropagation();
});

hashtagInput.addEventListener('input', () => {
  pristine.validate(hashtagInput);
});

commentInput.addEventListener('input', () => {
  pristine.validate(commentInput);
});

form.addEventListener('submit', (evt) => {
  const isValid = pristine.validate();

  if (!isValid) {
    evt.preventDefault();

    pristine.validate(hashtagInput);
    pristine.validate(commentInput);
  } else {
    console.log('Форма валидна, можно отправлять');
  }
});

export { openForm, closeForm };
