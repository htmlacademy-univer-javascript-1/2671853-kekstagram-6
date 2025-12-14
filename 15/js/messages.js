const successTemplate = document.querySelector('#success');
const errorTemplate = document.querySelector('#error');
const messageTemplate = document.querySelector('#messages');

const createMessage = (template, className) =>
  template.content.cloneNode(true).querySelector(`.${className}`);

const showSuccess = () => {
  const onDocumentKeydown = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      evt.stopPropagation();
      closeSuccess();
    }
  };

  const onDocumentClick = (evt) => {
    const successBlock = successElement.querySelector('.success__inner');
    if (successBlock && !successBlock.contains(evt.target)) {
      closeSuccess();
    }
  };

  const closeSuccess = () => {
    successElement.remove();
    document.removeEventListener('keydown', onDocumentKeydown);
    document.removeEventListener('click', onDocumentClick);
  };

  const successElement = createMessage(successTemplate, 'success');
  document.body.append(successElement);

  const closeButton = successElement.querySelector('.success__button');

  closeButton.addEventListener('click', closeSuccess);
  document.addEventListener('keydown', onDocumentKeydown);

  setTimeout(() => {
    document.addEventListener('click', onDocumentClick);
  }, 0);
};

const showError = (message, buttonText = 'Загрузить другой файл', onRetry = null) => {
  const onDocumentKeydown = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      evt.stopPropagation();
      closeError();
    }
  };

  const onDocumentClick = (evt) => {
    const errorBlock = errorElement.querySelector('.error__inner');
    if (errorBlock && !errorBlock.contains(evt.target)) {
      closeError();
    }
  };

  const closeError = () => {
    errorElement.remove();
    document.removeEventListener('keydown', onDocumentKeydown);
    document.removeEventListener('click', onDocumentClick);

    if (onRetry) {
      onRetry();
    }
  };

  const errorElement = createMessage(errorTemplate, 'error');

  const titleElement = errorElement.querySelector('.error__title');
  const buttonElement = errorElement.querySelector('.error__button');

  if (titleElement && message) {
    titleElement.textContent = message;
    titleElement.style.whiteSpace = 'pre-line';
    titleElement.style.wordBreak = 'break-word';
    titleElement.style.overflowWrap = 'break-word';
    titleElement.style.lineHeight = '1.5';
  }

  if (buttonElement && buttonText) {
    buttonElement.textContent = buttonText;
  }

  errorElement.style.position = 'fixed';
  errorElement.style.top = '0';
  errorElement.style.left = '0';
  errorElement.style.width = '100%';
  errorElement.style.height = '100%';
  errorElement.style.zIndex = '1000';

  const computedStyle = window.getComputedStyle(errorElement);
  if (!computedStyle.backgroundColor || computedStyle.backgroundColor === 'rgba(0, 0, 0, 0)') {
    errorElement.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  }

  document.body.append(errorElement);

  buttonElement.addEventListener('click', closeError);
  document.addEventListener('keydown', onDocumentKeydown);

  setTimeout(() => {
    document.addEventListener('click', onDocumentClick);
  }, 0);
};

const showLoading = () => {
  const loadingElement = createMessage(messageTemplate, 'img-upload__message');
  loadingElement.classList.add('img-upload__message--loading');
  document.body.appendChild(loadingElement);
  return loadingElement;
};

const hideLoading = (loadingElement) => {
  if (loadingElement && loadingElement.parentNode) {
    loadingElement.remove();
  }
};

export { showSuccess, showError, showLoading, hideLoading };
