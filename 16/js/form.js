import { initImageEditor, resetImageEditor } from './image-editor.js';
import { sendPhoto } from './api.js';
import { showSuccess, showError } from './messages.js';

const MAX_HASHTAG_COUNT = 5;
const MAX_HASHTAG_LENGTH = 20;
const MAX_COMMENT_LENGTH = 140;
const HASHTAG_REGEX = /^#[a-zа-яё0-9]{1,19}$/i;

const form = document.querySelector('.img-upload__form');
const fileInput = document.querySelector('.img-upload__input');
const overlay = document.querySelector('.img-upload__overlay');
const cancelButton = document.querySelector('.img-upload__cancel');
const submitButton = document.querySelector('.img-upload__submit');
const body = document.body;
const hashtagInput = form.querySelector('.text__hashtags');
const commentInput = form.querySelector('.text__description');
const imagePreview = document.querySelector('.img-upload__preview img');
const DEFAULT_IMAGE_SRC = 'img/upload-default-image.jpg';

const pristine = new Pristine(form, {
  classTo: 'img-upload__field-wrapper',
  errorClass: 'img-upload__field-wrapper--invalid',
  successClass: 'img-upload__field-wrapper--valid',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextTag: 'div',
  errorTextClass: 'img-upload__error'
});

function loadUserImage(file) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Файл должен быть изображением (JPEG, PNG, GIF и т.д.)'));
      return;
    }

    const reader = new FileReader();

    reader.addEventListener('load', () => {
      imagePreview.src = reader.result;
      resolve();
    });

    reader.addEventListener('error', () => {
      reject(new Error('Не удалось прочитать файл'));
    });

    reader.readAsDataURL(file);
  });
}

const onFileInputChange = async (evt) => {
  const file = evt.target.files[0];

  if (!file) {
    return;
  }

  try {
    submitButton.disabled = true;
    submitButton.textContent = 'Загружаем...';

    await loadUserImage(file);
    openForm();
  } catch (error) {
    showError(error.message, 'Выбрать другой файл', () => {
      fileInput.value = '';
      fileInput.click();
    });
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Опубликовать';
  }
};

const validateHashtags = (value) => {
  const inputText = value.trim();

  if (!inputText) {
    return true;
  }

  const hashtags = inputText.split(/\s+/).filter((tag) => tag !== '');

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

  const hashtags = inputText.split(/\s+/).filter((tag) => tag !== '');

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

const blockSubmitButton = () => {
  submitButton.disabled = true;
  submitButton.textContent = 'Публикую...';
};

const unblockSubmitButton = () => {
  submitButton.disabled = false;
  submitButton.textContent = 'Опубликовать';
};

const onFormSubmit = async (evt) => {
  evt.preventDefault();

  const isValid = pristine.validate();

  if (!isValid) {
    pristine.validate(hashtagInput);
    pristine.validate(commentInput);
    return;
  }

  blockSubmitButton();

  const formData = new FormData(evt.target);

  try {
    await sendPhoto(formData);
    showSuccess();
    closeForm();
  } catch (error) {
    showError(error.message, 'Попробовать ещё раз');
  } finally {
    unblockSubmitButton();
  }
};

const onDocumentKeydown = (evt) => {
  if (evt.key === 'Escape') {
    const errorMessage = document.querySelector('.error');
    if (errorMessage) {
      return;
    }

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

  // Сбрасываем изображение на дефолтное
  imagePreview.src = DEFAULT_IMAGE_SRC;
};

const initForm = () => {
  // Заменяем обработчик на новую функцию
  fileInput.addEventListener('change', onFileInputChange);

  cancelButton.addEventListener('click', closeForm);
  form.addEventListener('submit', onFormSubmit);

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
};

export { initForm, closeForm };
