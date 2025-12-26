import { initImageEditor, resetImageEditor } from './image-editor.js';
import { sendPhoto } from './api.js';
import { showSuccess, showError } from './messages.js';

const MAX_HASHTAG_COUNT = 5;
const MAX_HASHTAG_LENGTH = 20;
const MAX_COMMENT_LENGTH = 140;
const DEFAULT_IMAGE_SRC = 'img/upload-default-image.jpg';

const HASHTAG_REGEX = /^#[a-zа-яё0-9]{1,19}$/i;

const formElement = document.querySelector('.img-upload__form');
const fileInputElement = formElement.querySelector('.img-upload__input');
const overlayElement = document.querySelector('.img-upload__overlay');
const cancelButtonElement = overlayElement.querySelector('.img-upload__cancel');
const submitButtonElement = overlayElement.querySelector('.img-upload__submit');
const bodyElement = document.body;

const hashtagInputElement = formElement.querySelector('.text__hashtags');
const commentInputElement = formElement.querySelector('.text__description');
const imagePreviewElement = overlayElement.querySelector('.img-upload__preview img');
const effectsPreviewElements = overlayElement.querySelectorAll('.effects__preview');

const pristine = new Pristine(formElement, {
  classTo: 'img-upload__field-wrapper',
  errorClass: 'img-upload__field-wrapper--invalid',
  successClass: 'img-upload__field-wrapper--valid',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextTag: 'div',
  errorTextClass: 'img-upload__error',
});

const loadUserImage = (file) =>
  new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Файл должен быть изображением'));
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    imagePreviewElement.src = imageUrl;

    effectsPreviewElements.forEach((element) => {
      element.style.backgroundImage = `url(${imageUrl})`;
    });

    resolve();
  });

const validateHashtags = (value) => {
  const hashtags = value
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!hashtags.length) {
    return true;
  }

  if (hashtags.length > MAX_HASHTAG_COUNT) {
    return false;
  }

  const uniqueHashtags = new Set();

  for (const hashtag of hashtags) {
    const lowerCaseHashtag = hashtag.toLowerCase();

    if (
      hashtag === '#' ||
      !HASHTAG_REGEX.test(hashtag) ||
      hashtag.length > MAX_HASHTAG_LENGTH ||
      uniqueHashtags.has(lowerCaseHashtag)
    ) {
      return false;
    }

    uniqueHashtags.add(lowerCaseHashtag);
  }

  return true;
};

const getHashtagErrorMessage = (value) => {
  const hashtags = value
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (hashtags.length > MAX_HASHTAG_COUNT) {
    return `Нельзя указать больше ${MAX_HASHTAG_COUNT} хэш-тегов`;
  }

  const uniqueHashtags = new Set();

  for (const hashtag of hashtags) {
    const lowerCaseHashtag = hashtag.toLowerCase();

    if (hashtag === '#') {
      return 'Хэш-тег не может состоять только из #';
    }

    if (!hashtag.startsWith('#')) {
      return 'Хэш-тег должен начинаться с #';
    }

    if (hashtag.length > MAX_HASHTAG_LENGTH) {
      return `Максимальная длина хэш-тега — ${MAX_HASHTAG_LENGTH} символов`;
    }

    if (!HASHTAG_REGEX.test(hashtag)) {
      return 'Хэш-тег содержит недопустимые символы';
    }

    if (uniqueHashtags.has(lowerCaseHashtag)) {
      return 'Хэш-теги не должны повторяться';
    }

    uniqueHashtags.add(lowerCaseHashtag);
  }

  return '';
};

const validateComment = (value) => value.length <= MAX_COMMENT_LENGTH;

const getCommentErrorMessage = (value) =>
  value.length > MAX_COMMENT_LENGTH
    ? `Комментарий слишком длинный (${value.length}/${MAX_COMMENT_LENGTH})`
    : '';

pristine.addValidator(hashtagInputElement, validateHashtags, getHashtagErrorMessage);
pristine.addValidator(commentInputElement, validateComment, getCommentErrorMessage);

const blockSubmitButton = () => {
  submitButtonElement.disabled = true;
  submitButtonElement.textContent = 'Публикую...';
};

const unblockSubmitButton = () => {
  submitButtonElement.disabled = false;
  submitButtonElement.textContent = 'Опубликовать';
};

const closeForm = () => {
  overlayElement.classList.add('hidden');
  bodyElement.classList.remove('modal-open');

  document.removeEventListener('keydown', onDocumentKeydown);

  formElement.reset();
  fileInputElement.value = '';
  pristine.reset();
  resetImageEditor();

  imagePreviewElement.src = DEFAULT_IMAGE_SRC;
};

const openForm = () => {
  overlayElement.classList.remove('hidden');
  bodyElement.classList.add('modal-open');

  document.addEventListener('keydown', onDocumentKeydown);
  initImageEditor();
};

const onFileInputChange = async (evt) => {
  const file = evt.target.files[0];

  if (!file) {
    return;
  }

  try {
    openForm();
    await loadUserImage(file);
  } catch (error) {
    closeForm();
    showError(error.message, 'Выбрать другой файл', () => {
      fileInputElement.value = '';
      fileInputElement.click();
    });
  }
};

const onFormSubmit = async (evt) => {
  evt.preventDefault();

  if (!pristine.validate()) {
    return;
  }

  blockSubmitButton();

  try {
    await sendPhoto(new FormData(evt.target));
    showSuccess();
    closeForm();
  } catch (error) {
    showError(error.message, 'Попробовать ещё раз');
  } finally {
    unblockSubmitButton();
  }
};

const onDocumentKeydown = (evt) => {
  if (evt.key !== 'Escape') {
    return;
  }

  if (
    document.querySelector('.error') ||
    document.activeElement === hashtagInputElement ||
    document.activeElement === commentInputElement
  ) {
    return;
  }

  evt.preventDefault();
  closeForm();
};

const stopPropagationHandler = (evt) => {
  evt.stopPropagation();
};

const onHashtagInput = () => {
  pristine.validate(hashtagInputElement);
};

const onCommentInput = () => {
  pristine.validate(commentInputElement);
};

const onHashtagKeydown = (evt) => {
  evt.stopPropagation();
};

const onCommentKeydown = (evt) => {
  evt.stopPropagation();
};

const initForm = () => {
  fileInputElement.addEventListener('change', onFileInputChange);
  cancelButtonElement.addEventListener('click', closeForm);
  formElement.addEventListener('submit', onFormSubmit);

  hashtagInputElement.addEventListener('keydown', onHashtagKeydown);
  commentInputElement.addEventListener('keydown', onCommentKeydown);

  hashtagInputElement.addEventListener('input', onHashtagInput);
  commentInputElement.addEventListener('input', onCommentInput);
};

export { initForm, closeForm };
